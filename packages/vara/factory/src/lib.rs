#![no_std]

use gstd::{async_main, exec, msg, prelude::*, ActorId, TypeInfo};
use gstd::errors::Result;
use codec::{Encode, Decode};
use gmeta::{Metadata, InOut, Out};

// Constants remain unchanged
const OK_REPLY: &[u8] = b"Trivia created successfully";
const ERROR_REPLY: &[u8] = b"Failed to create trivia";
const WIN_REPLY: &[u8] = b"You won!";
const LOSE_REPLY: &[u8] = b"Incorrect answers";

// Data Structures remain unchanged
#[derive(Encode, Decode, TypeInfo, Clone, Default)]
pub struct Trivia {
    questions: Vec<String>,
    correct_answers: Vec<String>,
    reward: u128,
    owner: ActorId,
}

// State structure now aligns with the working example
#[derive(Encode, Decode, TypeInfo, Default)]
pub struct TriviaFactoryState {
    trivias: Vec<Trivia>,
}

// Static state variables
static mut TRIVIA_FACTORY_STATE: Option<TriviaFactoryState> = None;

// Messages remain unchanged
#[derive(Encode, Decode, TypeInfo)]
pub enum FactoryAction {
    CreateTrivia { questions: Vec<String>, correct_answers: Vec<String>, reward: u128 },
    PlayTrivia { trivia_index: u32, answers: Vec<String> },
}

// Metadata remains unchanged
pub struct TriviaMetadata;

impl Metadata for TriviaMetadata {
    type Init = ();
    type Handle = InOut<FactoryAction, String>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = Out<TriviaFactoryState>;
}

// Program Entry Points
#[async_main]
async fn main() {
    // Error handling remains the same
    if let Err(_err) = _main().await {
        msg::reply(ERROR_REPLY, 0).expect("Failed to reply");
    }
}

// _main logic remains mostly the same
async fn _main() -> Result<()> {
    let action: FactoryAction = msg::load()?;
    match action {
        FactoryAction::CreateTrivia { questions, correct_answers, reward } => {
            create_trivia(questions, correct_answers, reward)?;
            msg::reply(OK_REPLY, 0)?;
        }
        FactoryAction::PlayTrivia { trivia_index, answers } => {
            let won = play_trivia(trivia_index, answers)?;
            msg::reply(if won { WIN_REPLY } else { LOSE_REPLY }, 0)?;
        }
    }
    Ok(())
}

// State mutability function, similar to the working example
fn state_mut() -> &'static mut TriviaFactoryState {
    let state = unsafe { TRIVIA_FACTORY_STATE.as_mut() };
    unsafe { state.unwrap_unchecked() }
}

// create_trivia logic remains mostly the same, using state_mut()
fn create_trivia(questions: Vec<String>, correct_answers: Vec<String>, reward: u128) -> Result<()> {
    msg::send(exec::program_id(), Vec::<u8>::new(), reward)?;

    let sender = msg::source();
    let state = state_mut(); // Use the mutability function
    state.trivias.push(Trivia {
        questions,
        correct_answers,
        reward,
        owner: sender,
    });
    Ok(())
}

// play_trivia logic remains the same, using state_mut()
fn play_trivia(trivia_index: u32, answers: Vec<String>) -> Result<bool> {
    let state = state_mut(); // Use the mutability function

    if let Some(trivia) = state.trivias.get(trivia_index as usize) {
        if answers == trivia.correct_answers {
            msg::send(msg::source(), &[], trivia.reward)?;
            Ok(true)
        } else {
            Ok(false)
        }
    } else {
        Err(gstd::errors::Error::from("Invalid trivia index"))
    }
}

// state() function, similar to the working example
#[no_mangle]
extern "C" fn state() {
    let state = unsafe { TRIVIA_FACTORY_STATE.take().expect("Unexpected error in taking state") };
    msg::reply(state, 0).expect("Failed to share state");
}

// init() function, adapted from the working example
#[no_mangle]
extern "C" fn init() {
    // You might need to add initialization logic here if required
    let state = TriviaFactoryState {
        ..Default::default()
    };
    unsafe { TRIVIA_FACTORY_STATE = Some(state) };
}
