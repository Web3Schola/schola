#![no_std]
use sails_rs::{collections::HashMap, gstd::msg, prelude::*};

// Estructura para una trivia individual
#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct Trivia {
    questions: Vec<String>,
    correct_answers: Vec<String>,
    reward: u128,
    creator: ActorId,
    is_completed: bool,
}

// Estado global del contrato
pub struct State {
    trivias: HashMap<u32, Trivia>,
    trivia_count: u32,
}

static mut STATE: Option<State> = None;

impl State {
    pub fn get() -> &'static Self {
        unsafe { STATE.as_ref().expect("State is not initialized") }
    }

    pub fn get_mut() -> &'static mut Self {
        unsafe { STATE.as_mut().expect("State is not initialized") }
    }
}

#[derive(Default)]
pub struct TriviaFactory;

#[derive(Encode, Decode, TypeInfo)]
pub enum TriviaEvent {
    TriviaCreated { id: u32, creator: ActorId },
    TriviaCompleted { id: u32, winner: ActorId },
}

#[service(events = TriviaEvent)]
impl TriviaFactory {
    pub fn init() {
        unsafe {
            STATE = Some(State {
                trivias: HashMap::new(),
                trivia_count: 0,
            });
        }
    }

    pub fn create_trivia(
        &mut self,
        questions: Vec<String>,
        correct_answers: Vec<String>,
        reward: u128,
    ) -> Result<u32, String> {
        if questions.len() != correct_answers.len() {
            return Err("Questions and answers count mismatch".into());
        }

        let state = State::get_mut();
        let trivia_id = state.trivia_count;

        state.trivias.insert(
            trivia_id,
            Trivia {
                questions,
                correct_answers,
                reward,
                creator: msg::source(),
                is_completed: false,
            },
        );

        state.trivia_count += 1;

        let _ = self.notify_on(TriviaEvent::TriviaCreated {
            id: trivia_id,
            creator: msg::source(),
        });

        Ok(trivia_id)
    }

    pub fn play_trivia(&mut self, trivia_id: u32, answers: Vec<String>) -> Result<String, String> {
        let state = State::get_mut();
        let trivia = state
            .trivias
            .get_mut(&trivia_id)
            .ok_or("Trivia not found")?;

        if trivia.is_completed {
            return Err("This trivia has already been completed".into());
        }

        if answers.len() != trivia.correct_answers.len() {
            return Err("Incorrect number of answers provided".into());
        }

        if answers == trivia.correct_answers {
            trivia.is_completed = true;
            let _ = msg::send(msg::source(), Vec::<u8>::new(), trivia.reward);
            let _ = self.notify_on(TriviaEvent::TriviaCompleted {
                id: trivia_id,
                winner: msg::source(),
            });
            Ok("Congratulations! You won the reward!".into())
        } else {
            Ok("Sorry, your answers are incorrect.".into())
        }
    }

    pub fn get_trivia(&self, trivia_id: u32) -> Result<(Vec<String>, u128, bool), String> {
        let state = State::get();
        let trivia = state.trivias.get(&trivia_id).ok_or("Trivia not found")?;

        Ok((trivia.questions.clone(), trivia.reward, trivia.is_completed))
    }

    pub fn get_trivia_count(&self) -> u32 {
        State::get().trivia_count
    }
}

pub struct TriviaProgram;

#[program]
impl TriviaProgram {
    pub fn new() -> Self {
        TriviaFactory::init();
        Self
    }

    pub fn trivia_factory(&self) -> TriviaFactory {
        TriviaFactory::default()
    }
}
