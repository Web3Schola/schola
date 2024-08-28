#![no_std]

use gstd::{async_main, exec, msg, prelude::*, ActorId, TypeInfo};
use codec::{Encode, Decode};
use gmeta::{Metadata, InOut, Out};

const OK_REPLY: &str = "Trivia created successfully";
const WIN_REPLY: &str = "You won!";
const LOSE_REPLY: &str = "Incorrect answers";

#[derive(Encode, Decode, TypeInfo, Clone, Default)]
pub struct Trivia {
    questions: Vec<String>,
    correct_answers: Vec<String>,
    reward: u128,
    owner: ActorId,
}

#[derive(Encode, Decode, TypeInfo, Default)]
pub struct TriviaFactoryState {
    trivias: Vec<Trivia>,
}

static mut TRIVIA_FACTORY_STATE: Option<TriviaFactoryState> = None;

#[derive(Encode, Decode, TypeInfo)]
pub enum FactoryAction {
    CreateTrivia { questions: Vec<String>, correct_answers: Vec<String>, reward: u128 },
    PlayTrivia { trivia_index: u32, answers: Vec<String> },
}

pub struct TriviaMetadata;

impl Metadata for TriviaMetadata {
    type Init = ();
    type Handle = InOut<FactoryAction, String>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = Out<TriviaFactoryState>;
}

#[no_mangle]
extern "C" fn init() {
    let state = TriviaFactoryState::default();
    unsafe { TRIVIA_FACTORY_STATE = Some(state) };
}

#[async_main]
async fn main() {
    let action: FactoryAction = msg::load().expect("Failed to decode FactoryAction");
    let result = match action {
        FactoryAction::CreateTrivia { questions, correct_answers, reward } => {
            create_trivia(questions, correct_answers, reward)
        }
        FactoryAction::PlayTrivia { trivia_index, answers } => {
            play_trivia(trivia_index, answers)
        }
    };

    match result {
        Ok(reply) => msg::reply(reply, 0),
        Err(e) => msg::reply(format!("Error: {}", e), 0),
    }.expect("Failed to reply");
}

fn state_mut() -> &'static mut TriviaFactoryState {
    unsafe { TRIVIA_FACTORY_STATE.as_mut().expect("State is not initialized") }
}

fn create_trivia(questions: Vec<String>, correct_answers: Vec<String>, reward: u128) -> Result<String, String> {
    if questions.len() != correct_answers.len() {
        return Err("Questions and answers count mismatch".into());
    }

    msg::send(exec::program_id(), Vec::<u8>::new(), reward).map_err(|e| e.to_string())?;

    let sender = msg::source();
    let state = state_mut();
    state.trivias.push(Trivia {
        questions,
        correct_answers,
        reward,
        owner: sender,
    });
    
    Ok(OK_REPLY.to_string())
}

fn play_trivia(trivia_index: u32, answers: Vec<String>) -> Result<String, String> {
    let state = state_mut();

    let trivia = state.trivias.get(trivia_index as usize)
        .ok_or_else(|| "Invalid trivia index".to_string())?;

    if answers.len() != trivia.correct_answers.len() {
        return Err("Incorrect number of answers".into());
    }

    if answers == trivia.correct_answers {
        msg::send::<Vec<u8>>(msg::source(), vec![], trivia.reward).map_err(|e| e.to_string())?;
        Ok(WIN_REPLY.to_string())
    } else {
        Ok(LOSE_REPLY.to_string())
    }
}

#[no_mangle]
extern "C" fn state() {
    let state = unsafe { TRIVIA_FACTORY_STATE.take().expect("State is not initialized") };
    msg::reply(state, 0).expect("Failed to share state");
}
