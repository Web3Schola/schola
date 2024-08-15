// pages/crear-pregunta.tsx
"use client";

import { useState } from "react";

export default function CrearPregunta() {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", "", "", ""]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<string>("");

  const handlePreguntaChange = (event: any) => {
    setPregunta(event.target.value);
  };

  const handleOpcionChange = (index: number, event: any) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = event.target.value;
    setOpciones(nuevasOpciones);
  };

  const handleRespuestaCorrectaChange = (event: any) => {
    setRespuestaCorrecta(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para guardar la pregunta y las respuestas
    console.log("Pregunta:", pregunta);
    console.log("Opciones:", opciones);
    console.log("Respuesta correcta:", respuestaCorrecta);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nueva Pregunta</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pregunta"
          >
            Pregunta:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="pregunta"
            type="text"
            placeholder="Escribe tu pregunta aquí"
            value={pregunta}
            onChange={handlePreguntaChange}
            required
          />
        </div>

        {opciones.map((opcion, index) => (
          <div key={index} className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={`opcion-${index}`}
            >
              Opción {index + 1}:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`opcion-${index}`}
              type="text"
              placeholder={`Escribe la opción ${index + 1}`}
              value={opcion}
              onChange={(event) => handleOpcionChange(index, event)}
              required
            />
          </div>
        ))}

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="respuestaCorrecta"
          >
            Respuesta Correcta:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="respuestaCorrecta"
            value={respuestaCorrecta}
            onChange={handleRespuestaCorrectaChange}
            required
          >
            <option value="">Selecciona la respuesta correcta</option>
            {opciones.map((opcion, index) => (
              <option key={index} value={opcion}>
                Opción {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Crear Pregunta
          </button>
        </div>
      </form>
    </div>
  );
}
