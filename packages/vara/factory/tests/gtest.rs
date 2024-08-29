use sails_rs::{calls::*, gtest::calls::*};
use trivia_factory_client::traits::*;

const ACTOR_ID: u64 = 42;

#[tokio::test]
async fn create_trivia_works() {
    let remoting = GTestRemoting::new(ACTOR_ID.into());
    remoting.system().init_logger();

    let program_code_id = remoting.system().submit_code(trivia_factory::WASM_BINARY);

    let program_factory = trivia_factory_client::TriviaFactoryFactory::new(remoting.clone());

    let program_id = program_factory
        .new()
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = trivia_factory_client::TriviaService::new(remoting.clone());

    let result = service_client
        .create_trivia(
            vec!["What is 2+2?".to_string()],
            vec!["4".to_string()],
            100,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    assert!(result.is_ok());
}

#[tokio::test]
async fn play_trivia_works() {
    let remoting = GTestRemoting::new(ACTOR_ID.into());
    remoting.system().init_logger();

    let program_code_id = remoting.system().submit_code(trivia_factory::WASM_BINARY);

    let program_factory = trivia_factory_client::TriviaFactoryFactory::new(remoting.clone());

    let program_id = program_factory
        .new()
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = trivia_factory_client::TriviaService::new(remoting.clone());

    // Crear una trivia
    service_client
        .create_trivia(
            vec!["What is 2+2?".to_string()],
            vec!["4".to_string()],
            100,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    // Jugar la trivia
    let result = service_client
        .play_trivia(0, vec!["4".to_string()])
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(result, Ok("You won!".to_string()));
}

#[tokio::test]
async fn update_trivia_works() {
    let remoting = GTestRemoting::new(ACTOR_ID.into());
    remoting.system().init_logger();

    let program_code_id = remoting.system().submit_code(trivia_factory::WASM_BINARY);

    let program_factory = trivia_factory_client::TriviaFactoryFactory::new(remoting.clone());

    let program_id = program_factory
        .new()
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = trivia_factory_client::TriviaService::new(remoting.clone());

    // Crear una trivia
    service_client
        .create_trivia(
            vec!["Old question".to_string()],
            vec!["Old answer".to_string()],
            100,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    // Actualizar la trivia
    let result = service_client
        .update_trivia(
            0,
            vec!["New question".to_string()],
            vec!["New answer".to_string()],
            200,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    assert!(result.is_ok());

    // Verificar que la trivia se actualizó
    let updated_trivia = service_client
        .get_trivia(0)
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(updated_trivia.questions, vec!["New question".to_string()]);
    assert_eq!(updated_trivia.correct_answers, vec!["New answer".to_string()]);
    assert_eq!(updated_trivia.reward, 200);
}

#[tokio::test]
async fn delete_trivia_works() {
    let remoting = GTestRemoting::new(ACTOR_ID.into());
    remoting.system().init_logger();

    let program_code_id = remoting.system().submit_code(trivia_factory::WASM_BINARY);

    let program_factory = trivia_factory_client::TriviaFactoryFactory::new(remoting.clone());

    let program_id = program_factory
        .new()
        .send_recv(program_code_id, b"salt")
        .await
        .unwrap();

    let mut service_client = trivia_factory_client::TriviaService::new(remoting.clone());

    // Crear una trivia
    service_client
        .create_trivia(
            vec!["Question".to_string()],
            vec!["Answer".to_string()],
            100,
        )
        .send_recv(program_id)
        .await
        .unwrap();

    // Eliminar la trivia
    let result = service_client
        .delete_trivia(0)
        .send_recv(program_id)
        .await
        .unwrap();

    assert!(result.is_ok());

    // Verificar que la trivia se eliminó
    let trivia_count = service_client
        .get_trivia_count()
        .send_recv(program_id)
        .await
        .unwrap();

    assert_eq!(trivia_count, 0);
}
