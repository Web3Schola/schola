"use client";

import { useState } from "react";

export default function CrearPregunta() {
  const [preguntas, setPreguntas] = useState([
    { pregunta: "", respuestaCorrecta: "" }, // Initial question
  ]);

  const handlePreguntaChange = (index: number, event: any) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].pregunta = event.target.value;
    setPreguntas(nuevasPreguntas);
  };

  const handleRespuestaCorrectaChange = (index: number, event: any) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].respuestaCorrecta = event.target.value;
    setPreguntas(nuevasPreguntas);
  };

  const handleAddQuestion = () => {
    setPreguntas([...preguntas, { pregunta: "", respuestaCorrecta: "" }]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para guardar todas las preguntas y las respuestas
    console.log("Preguntas:", preguntas);
  };

  return (
    <div className="container mx-auto p-8 ">
      <div className="container mx-auto p-8 ">
        <div className="grid grid-cols-2">
          <h1 className="text-3xl font-bold mb-6">Create new question</h1>
          <button className="btn ustify-self-end">Fund a trivia game</button>
        </div>
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
                {" "}
                  Question {index + 1}:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`pregunta-${index}`}
                type="text"
                placeholder="Escribe tu pregunta aquí"
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
                placeholder="Escribe la respuesta correcta"
                value={preguntaObj.respuestaCorrecta}
                onChange={(event) =>
                  handleRespuestaCorrectaChange(index, event)
                }
                required
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <div>
            <button
              type="button" // Important: prevent form submission
              className="btn btn-lg mt-10 btn-glass mb-5"
              onClick={handleAddQuestion}
            >
              Next
            </button>
          </div>
          <button
            className="btn  btn-lg mt-10 btn-glass mb-5"
            onClick={() => {
              const modalElement = document.getElementById(
                "my_modal_1"
              ) as HTMLDialogElement;
              if (modalElement) {
                modalElement.showModal();
              } else {
                console.error("Modal element not found!");
              }
            }}
          >
            Create
          </button>

          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">Trivia ID</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </form>
    </div>
  );
}
