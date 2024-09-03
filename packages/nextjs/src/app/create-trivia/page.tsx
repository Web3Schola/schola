"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TriviaFactory } from "../../../contracts/lib"; // Asegúrate de que la ruta sea correcta
import { GearApi, GasInfo } from "@gear-js/api";
import { useAccount } from "@gear-js/react-hooks";

export default function CrearPregunta() {
  const [preguntas, setPreguntas] = useState([
    { pregunta: "", respuestaCorrecta: "" },
  ]);
  const [reward, setReward] = useState("");
  const [triviaId, setTriviaId] = useState<number | null>(null);
  const router = useRouter();
  const { account } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handlePreguntaChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].pregunta = event.target.value;
    setPreguntas(nuevasPreguntas);
  };

  const handleRespuestaCorrectaChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].respuestaCorrecta = event.target.value;
    setPreguntas(nuevasPreguntas);
  };

  const handleAddQuestion = () => {
    setPreguntas([...preguntas, { pregunta: "", respuestaCorrecta: "" }]);
  };

  const handleRewardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReward(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    setIsLoading(true);
    try {
      const api = await GearApi.create({
        providerAddress: "wss://testnet.vara.network",
      });

      const triviaFactory = new TriviaFactory(
        api,
        "0xf5691c64eed986728bc5a263851b78ba867522289078b07ade779ca25f711b8b",
      );

      const questions = preguntas.map((p) => p.pregunta);
      const answers = preguntas.map((p) => p.respuestaCorrecta);

      if (!triviaFactory.programId) {
        throw new Error("Program ID is not set");
      }

      const gasLimit = await api.program.calculateGas.initCreate(
        account.decodedAddress,
        triviaFactory.programId,
        "createTrivia",
        { questions, answers },
        0,
        true,
      );

      const { extrinsic } = await triviaFactory.triviaFactory.createTrivia(
        questions,
        answers,
      );

      const signedExtrinsic = await extrinsic.signAndSend(
        account.decodedAddress,
      );

      await new Promise<void>((resolve) => {
        signedExtrinsic.once("InBlock", () => {
          resolve();
        });
      });

      const triviaCreatedEvent = await new Promise<{ id: number }>(
        (resolve) => {
          triviaFactory.triviaFactory.subscribeToTriviaCreatedEvent((event) => {
            if ("id" in event) {
              resolve(event as { id: number });
            }
          });
        },
      );

      setTriviaId(triviaCreatedEvent.id);
      const modalElement = document.getElementById(
        "my_modal_1",
      ) as HTMLDialogElement;
      if (modalElement) {
        modalElement.showModal();
      }
    } catch (error) {
      console.error("Error creating trivia:", error);
      alert("Error creating trivia. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-2">
        <h1 className="text-3xl font-bold mb-6">Create new trivia</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {preguntas.map((preguntaObj, index) => (
          <div key={index}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`pregunta-${index}`}
              >
                Question {index + 1}:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`pregunta-${index}`}
                type="text"
                placeholder="Write your question here"
                value={preguntaObj.pregunta}
                onChange={(event) => handlePreguntaChange(index, event)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor={`respuestaCorrecta-${index}`}
              >
                Correct answer {index + 1}:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`respuestaCorrecta-${index}`}
                type="text"
                placeholder="Write the correct answer"
                value={preguntaObj.respuestaCorrecta}
                onChange={(event) =>
                  handleRespuestaCorrectaChange(index, event)
                }
                required
              />
            </div>
          </div>
        ))}

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reward"
          >
            Reward (in tokens):
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reward"
            type="number"
            placeholder="Enter reward amount"
            value={reward}
            onChange={handleRewardChange}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-lg mt-10 btn-glass mb-5"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
          <button
            type="submit"
            className="btn btn-lg mt-10 btn-glass mb-5"
            disabled={isLoading}
          >
            {isLoading ? "Creating Trivia..." : "Create Trivia"}
          </button>
        </div>
      </form>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Trivia Created!</h3>
          <p className="py-4">
            Your trivia has been created successfully. Trivia ID: {triviaId}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn"
                onClick={() => router.push("/play-trivia")}
              >
                Go to Play Trivia
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
