use trivia_factory_client::traits::*;
use sails_rs::calls::*;

#[tokio::main]
async fn main() {
    // Configuración del cliente
    let remoting = // ... configurar remoting para conectarse a la red Gear
    let program_id = // ... obtener el ID del programa desplegado

    let mut service_client = trivia_factory_client::TriviaService::new(remoting.clone());

    // Jugar una trivia
    let result = service_client
        .play_trivia(
            0, // índice de la trivia
            vec!["Paris".to_string()],
        )
        .send_recv(program_id)
        .await
        .unwrap();

    println!("Trivia played: {:?}", result);
}
