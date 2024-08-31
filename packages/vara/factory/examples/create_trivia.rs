use trivia_factory_client::traits::*;
use sails_rs::calls::*;

#[tokio::main]
async fn main() {
    // Configuración del cliente
    let remoting = // ... configurar remoting para conectarse a la red Gear
    let program_id = // ... obtener el ID del programa desplegado

    let mut service_client = trivia_factory_client::TriviaService::new(remoting.clone());

    // Crear una trivia
    let result = service_client
        .create_trivia(
            vec!["What is the capital of France?".to_string()],
            vec!["Paris".to_string()],
            1000000000, // 1 VARA
        )
        .send_recv(program_id)
        .await
        .unwrap();

    println!("Trivia created: {:?}", result);
}
