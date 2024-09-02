"use client";

import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";
import { TriviaFactory, TriviaFactoryService } from "../../../contracts/lib";

type TriviaData = {
  questions: string[];
  reward: string | number | bigint;
  completed: boolean;
};

export default function PlayTrivia() {
  const [triviaId, setTriviaId] = useState("");
  const [trivia, setTrivia] = useState<TriviaData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const handleTriviaIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTriviaId(event.target.value);
  };

  const loadTrivia = async () => {
    try {
      const api = await GearApi.create();
      const triviaFactory = new TriviaFactory(api);
      const loadedTrivia = await triviaFactory.triviaFactory.getTrivia(
        Number(triviaId),
      );
      if ("ok" in loadedTrivia) {
        const [questions, reward, completed] = loadedTrivia.ok;
        setTrivia({ questions, reward, completed });
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setShowResult(false);
      } else {
        console.error("Error loading trivia:", loadedTrivia.err);
      }
    } catch (error) {
      console.error("Error loading trivia:", error);
    }
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!trivia) return;

    if (currentQuestion === trivia.questions.length - 1) {
      try {
        const api = await GearApi.create();
        const triviaFactory = new TriviaFactory(api);
        const playResult = await triviaFactory.triviaFactory
          .playTrivia(Number(triviaId), [selectedAnswer])
          .signAndSend();
        if (
          playResult &&
          typeof playResult === "object" &&
          "ok" in playResult
        ) {
          setResult(String(playResult.ok));
        } else if (
          playResult &&
          typeof playResult === "object" &&
          "err" in playResult
        ) {
          setResult(`Error: ${String(playResult.err)}`);
        } else {
          setResult("Unexpected result structure");
        }
        setShowResult(true);
      } catch (error) {
        console.error("Error playing trivia:", error);
        setResult("Error playing trivia. Please try again.");
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full md:w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-6">Play Trivia</h1>

        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Enter Trivia ID"
            value={triviaId}
            onChange={handleTriviaIdChange}
          />
          <button className="btn mt-2" onClick={loadTrivia}>
            Load Trivia
          </button>
        </div>

        {trivia && !showResult && (
          <>
            <h2 className="text-xl mb-4">
              {trivia.questions[currentQuestion]}
            </h2>
            <ul>
              {trivia.questions.map((option, index) => (
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
                {currentQuestion === trivia.questions.length - 1
                  ? "Submit Answers"
                  : "Next Question"}
              </button>
            )}
          </>
        )}

        {showResult && (
          <div>
            <h2 className="text-2xl">Trivia Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
