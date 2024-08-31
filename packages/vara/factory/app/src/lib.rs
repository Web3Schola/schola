#![no_std]

use codec::{Decode, Encode};
use core::fmt;
use gstd::{errors::Result, exec, msg, prelude::*, ActorId};
use sails_rs::prelude::*;
use scale_info::TypeInfo;

#[derive(Encode, Decode, TypeInfo, Clone, Default)]
pub struct Trivia {
    questions: Vec<String>,
    correct_answers: Vec<String>,
    reward: u128,
    owner: ActorId,
}

#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum TriviaError {
    InvalidTriviaIndex,
    IncorrectAnswersCount,
    RewardTransferFailed,
    Unauthorized,
    QuestionAnswerMismatch,
    NotificationFailed,
}

impl fmt::Display for TriviaError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl From<sails_rs::errors::Error> for TriviaError {
    fn from(_: sails_rs::errors::Error) -> Self {
        TriviaError::NotificationFailed
    }
}

#[derive(Encode, Decode, TypeInfo, Default)]
pub struct TriviaFactoryState {
    trivias: Vec<Trivia>,
    owner: ActorId,
}

struct TriviaService {
    state: TriviaFactoryState,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum TriviaEvent {
    TriviaCreated { index: u32 },
    TriviaPlayed { index: u32, result: String },
    RewardPaid { index: u32, amount: u128 },
    TriviaUpdated { index: u32 },
    TriviaDeleted { index: u32 },
}

#[service(events = TriviaEvent)]
impl TriviaService {
    pub fn new() -> Self {
        Self {
            state: TriviaFactoryState {
                trivias: Vec::new(),
                owner: msg::source(),
            },
        }
    }

    pub fn create_trivia(
        &mut self,
        questions: Vec<String>,
        correct_answers: Vec<String>,
        reward: u128,
    ) -> Result<(), TriviaError> {
        if questions.len() != correct_answers.len() {
            return Err(TriviaError::QuestionAnswerMismatch);
        }

        msg::send(exec::program_id(), Vec::<u8>::new(), reward)
            .map_err(|_| TriviaError::RewardTransferFailed)?;

        let index = self.state.trivias.len() as u32;
        self.state.trivias.push(Trivia {
            questions,
            correct_answers,
            reward,
            owner: msg::source(),
        });

        self.notify_on(TriviaEvent::TriviaCreated { index })?;
        Ok(())
    }

    pub fn play_trivia(
        &mut self,
        trivia_index: u32,
        answers: Vec<String>,
    ) -> Result<String, TriviaError> {
        let trivia = self
            .state
            .trivias
            .get(trivia_index as usize)
            .ok_or(TriviaError::InvalidTriviaIndex)?;

        if answers.len() != trivia.correct_answers.len() {
            return Err(TriviaError::IncorrectAnswersCount);
        }

        let result = if answers == trivia.correct_answers {
            msg::send::<Vec<u8>>(msg::source(), vec![], trivia.reward)
                .map_err(|_| TriviaError::RewardTransferFailed)?;
            self.notify_on(TriviaEvent::RewardPaid {
                index: trivia_index,
                amount: trivia.reward,
            })?;
            "You won!".to_string()
        } else {
            "Incorrect answers".to_string()
        };

        self.notify_on(TriviaEvent::TriviaPlayed {
            index: trivia_index,
            result: result.clone(),
        })?;
        Ok(result)
    }

    pub fn get_trivias(&self) -> Vec<Trivia> {
        self.state.trivias.clone()
    }

    pub fn get_trivia(&self, index: u32) -> Result<Trivia, TriviaError> {
        self.state
            .trivias
            .get(index as usize)
            .cloned()
            .ok_or(TriviaError::InvalidTriviaIndex)
    }

    pub fn get_trivia_count(&self) -> u32 {
        self.state.trivias.len() as u32
    }

    pub fn update_trivia(
        &mut self,
        index: u32,
        questions: Vec<String>,
        correct_answers: Vec<String>,
        reward: u128,
    ) -> Result<(), TriviaError> {
        if msg::source() != self.state.owner {
            return Err(TriviaError::Unauthorized);
        }

        let trivia = self
            .state
            .trivias
            .get_mut(index as usize)
            .ok_or(TriviaError::InvalidTriviaIndex)?;

        if questions.len() != correct_answers.len() {
            return Err(TriviaError::QuestionAnswerMismatch);
        }

        trivia.questions = questions;
        trivia.correct_answers = correct_answers;
        trivia.reward = reward;

        self.notify_on(TriviaEvent::TriviaUpdated { index })?;
        Ok(())
    }

    pub fn delete_trivia(&mut self, index: u32) -> Result<(), TriviaError> {
        if msg::source() != self.state.owner {
            return Err(TriviaError::Unauthorized);
        }

        if index as usize >= self.state.trivias.len() {
            return Err(TriviaError::InvalidTriviaIndex);
        }

        self.state.trivias.remove(index as usize);
        self.notify_on(TriviaEvent::TriviaDeleted { index })?;
        Ok(())
    }
}

pub struct TriviaProgram;

#[program]
impl TriviaProgram {
    pub fn new() -> Self {
        Self
    }

    #[route("trivia")]
    pub fn trivia_service(&self) -> TriviaService {
        TriviaService::new()
    }
}