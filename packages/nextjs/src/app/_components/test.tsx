"use client";

import { useState, useEffect } from "react";
import { TriviaFactory } from "../../../contracts/lib";
import { useApi, useAccount } from "@gear-js/react-hooks";

function TriviaComponent() {
  const { api } = useApi();
  const { account } = useAccount();

  const [client, setClient] = useState<TriviaFactory | null>(null);

  useEffect(() => {
    if (api && account) {
      const programId =
        "0x0369ec8a6b5b1a82db4fefae7ce3741375028f1e721dbf45f990d3a32d4e65b8";
      const client = new TriviaFactory(api, programId);
      setClient(client);
    }
  }, [api, account]);

  const createTrivia = async () => {
    if (client && account) {
      try {
        const txBuilder = client.trivia.createTrivia(
          ["Pregunta 1"],
          ["Respuesta 1"],
          1000000000n,
        );

        // Calcular el gas necesario
        await txBuilder.calculateGas();

        // Configurar la cuenta y el gas
        txBuilder.withAccount(account.decodedAddress);

        // Firmar y enviar la transacción
        const result = await txBuilder.signAndSend();

        console.log("Trivia creada, hash de transacción:", result.txHash);

        // Esperar a que la transacción se confirme
        const isFinalized = await result.isFinalized;
        console.log("Transacción finalizada:", isFinalized);

        // Obtener la respuesta del programa
        const response = await result.response();
        console.log("Respuesta del programa:", response);
      } catch (error) {
        console.error("Error al crear trivia:", error);
      }
    }
  };

  return (
    <div>
      <button onClick={createTrivia}>Crear Trivia</button>
    </div>
  );
}
