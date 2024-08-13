"use client";

import { SetStateAction, useState } from "react";

const questions = [
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["Londres", "París", "Madrid", "Berlín"],
    answer: "París",
  },
  // ... más preguntas aquí
];

export default function Trivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (answer: string | SetStateAction<null>) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      // Aquí puedes manejar la lógica de puntos o recompensas
      console.log("¡Respuesta correcta!");
    } else {
      console.log("Respuesta incorrecta");
    }

    setSelectedAnswer(null);
    setCurrentQuestion(currentQuestion + 1);

    if (currentQuestion === questions.length - 1) {
      setShowResult(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full md:w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-6">Trivia</h1>

        {!showResult && (
          <>
            <h2 className="text-xl mb-4">
              {questions[currentQuestion].question}
            </h2>
            <ul>
              {questions[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className={`p-3 border rounded mb-2 cursor-pointer ${
                    selectedAnswer === option ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>

            {selectedAnswer && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleNextQuestion}
              >
                {currentQuestion === questions.length - 1
                  ? "Ver resultado"
                  : "Siguiente pregunta"}
              </button>
            )}
          </>
        )}

        {showResult && (
          <div>
            {/* Aquí puedes mostrar el resultado final de la trivia */}
            <h2 className="text-2xl">¡Trivia terminada!</h2>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 p-8">
        {/* Aquí puedes colocar imágenes, anuncios u otro contenido relacionado */}
      </div>
    </div>
  );
}
