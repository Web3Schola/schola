---
title: "Code previews"
excerpt: "Take a look into our approach  to a trivia factory smart contract "
coverImage: "/assets/blog/code-previews/cover.jpg"
date: "2020-03-16T05:35:07.322Z"
author:
  name: D9J9V
  picture: "/assets/blog/authors/d9j9v.jpg"
ogImage:
  url: "/assets/blog/code-previews/cover.jpg"
---

**Rust**

```rust
#![no_std]

use gstd::{
    async_main, debug, exec, msg, prelude::*, ActorId, Encode, Decode, TypeInfo
};

use codec::{Encode, Decode};
use gmeta::{Metadata, InOut, Out};

// Constants for clarity
const OK_REPLY: &[u8] = b"Trivia created successfully";
const ERROR_REPLY: &[u8] = b"Failed to create trivia";
const WIN_REPLY: &[u8] = b"You won!";
const LOSE_REPLY: &[u8] = b"Incorrect answers";

// Data structures for the trivia
#[derive(Encode, Decode, TypeInfo)]
pub struct Trivia {
    questions: Vec<String>,
    correct_answers: Vec<String>,
    reward: u128,
    owner: ActorId,
}

#[derive(Encode, Decode, TypeInfo)]
pub struct TriviaFactoryState {
    trivias: Vec<Trivia>,
}

static mut TRIVIA_FACTORY_STATE: Option<TriviaFactoryState> = None;

// Messages for interaction
#[derive(Encode, Decode, TypeInfo)]
pub enum FactoryAction {
    CreateTrivia { questions: Vec<String>, correct_answers: Vec<String>, reward: u128 },
    PlayTrivia { trivia_index: u32, answers: Vec<String> },
}

// Metadata for UI/client interaction
pub struct TriviaMetadata;

impl Metadata for TriviaMetadata {
    type Init = ();
    type Handle = InOut<FactoryAction, String>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = Out<TriviaFactoryState>;
}

#[async_main]
async fn main() {
    let action: FactoryAction = msg::load().expect("Could not load Action");

    match action {
        FactoryAction::CreateTrivia { questions, correct_answers, reward } => {
            create_trivia(questions, correct_answers, reward);
            msg::reply(OK_REPLY, 0).unwrap();
        },
        FactoryAction::PlayTrivia { trivia_index, answers } => {
            let won = play_trivia(trivia_index, answers);
            msg::reply(if won { WIN_REPLY } else { LOSE_REPLY }, 0).unwrap();
        },
    }
}

fn create_trivia(questions: Vec<String>, correct_answers: Vec<String>, reward: u128) {
    exec::pay_program_rent().expect("Error paying rent");
    let sender = msg::source();
    let state = unsafe { TRIVIA_FACTORY_STATE.get_or_insert(TriviaFactoryState { trivias: vec![] }) };

    state.trivias.push(Trivia {
        questions,
        correct_answers,
        reward,
        owner: sender, // Set the trivia owner
    });
}

fn play_trivia(trivia_index: u32, answers: Vec<String>) -> bool {
    let state = unsafe { TRIVIA_FACTORY_STATE.get_or_insert(TriviaFactoryState { trivias: vec![] }) };

    if let Some(trivia) = state.trivias.get(trivia_index as usize) {
        if answers == trivia.correct_answers {
            // Send reward to the player
            msg::send(msg::source(), &[], trivia.reward)
                .expect("Error sending reward");

            true
        } else {
            false
        }
    } else {
        panic!("Invalid trivia index");
    }
}

#[no_mangle]
extern "C" fn state() {
    msg::reply(
        unsafe { TRIVIA_FACTORY_STATE.clone().expect("Failed to share state") }, 0
    )
    .expect("Failed to share state");
}`
```

**Mejoras clave:**

- **Estructuras de datos claras:** Utiliza structs `Trivia` y `TriviaFactoryState` para organizar datos, haciendo el código más fácil de mantener.
- **Gestión de estado:** Manejo seguro del estado con `Option` y `get_or_insert` para una mejor inicialización y acceso a `TRIVIA_FACTORY_STATE`.
- **Manejo de errores:** Incluye manejo básico de errores para hacer el contrato más robusto (por ejemplo, `expect`).
- **Metadatos:** Añadido `TriviaMetadata` para facilitar las interacciones con la UI/cliente (requiere `gmeta`).
- **Pagar alquiler:** El programa paga su propio alquiler en `create_trivia`.
- **Respuesta correcta:** El programa verifica las respuestas proporcionadas contra las respuestas correctas almacenadas.
- **Envío de recompensas:** Envía recompensas a los ganadores utilizando `msg::send` (considerar añadir un límite de pago u otras protecciones aquí).

**Próximos pasos**

- **Manejo de errores mejorado:** Implementar un manejo de errores más completo para entradas inválidas, condiciones inesperadas y casos límite.
- **Seguridad:** Realizar una revisión exhaustiva de seguridad para identificar y mitigar posibles vulnerabilidades (por ejemplo, ataques de reentrancia).
- **Pruebas:** Crear pruebas unitarias e integrales utilizando `gtest` y pruebas de extremo a extremo utilizando `gclient`.
- **Integración del front-end:** Construir una interfaz de usuario para interactuar con la fábrica de trivia y sus trivias.
- **Personalización:** Extender el contrato para permitir formatos de trivia más complejos, tablas de clasificación, múltiples recompensas u otras características.

### Key Improvements:

- **Clear Data Structures:** Utilizes structs `Trivia` y `TriviaFactoryState` to organize data, making the code more maintainable.
- **State Management:** Secure state handling with `Option` y `get_or_insert` for better initialization and access to `TRIVIA_FACTORY_STATE`.
- **Error Handling:** Includes basic error handling to make the contract more robust (e.g.,`expect`).
- **Metadata:** Added `TriviaMetadata` to facilitate interactions with the UI/client (requires `gmeta`).
- Pay Rent: The program pays its own rent in `create_trivia`.
- **Correct Answer:** The program verifies the provided answers against the stored correct answers.
- **Sending Rewards:** Sends rewards to winners using `msg::send` (consider adding a payment limit or other protections here).

### Next Steps

- **Enhanced error handling:** Implement more comprehensive error handling for invalid inputs, unexpected conditions, and edge cases.
- **Security:** Conduct a thorough security review to identify and mitigate potential vulnerabilities (e.g., reentrancy attacks).
- **Testing:** Create unit and integration tests using `gtest`and end-to-end tests using `gclient`.
- **Front-end integration**: Build a user interface to interact with the trivia factory and its trivia games.
- **Customization:** Extend the contract to allow more complex trivia formats, leaderboards, multiple rewards, or other features.
