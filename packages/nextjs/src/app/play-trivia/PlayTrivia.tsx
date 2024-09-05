"use client";

import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";
import { TriviaFactory } from "../../../contracts/lib";
import { useAccount } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type TriviaData = {
  questions: string[];
  reward: string | number | bigint;
  completed: boolean;
};

export default function PlayTrivia() {
  const [triviaId, setTriviaId] = useState("");
  const [trivia, setTrivia] = useState<TriviaData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useAccount();

  const handleTriviaIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTriviaId(event.target.value);
  };

  const loadTrivia = async () => {
    setIsLoading(true);
    try {
      const api = await GearApi.create({
        providerAddress: "wss://testnet.vara.network",
      });
      const triviaFactory = new TriviaFactory(
        api,
        "0xf5691c64eed986728bc5a263851b78ba867522289078b07ade779ca25f711b8b",
      );
      const loadedTrivia = await triviaFactory.triviaFactory.getTrivia(
        Number(triviaId),
      );
      if ("ok" in loadedTrivia) {
        const [questions, reward, completed] = loadedTrivia.ok;
        setTrivia({ questions, reward, completed });
        setCurrentQuestion(0);
        setAnswers(new Array(questions.length).fill(""));
        setShowResult(false);
      } else {
        console.error("Error loading trivia:", loadedTrivia.err);
        setResult(`Error: ${loadedTrivia.err}`);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error loading trivia:", error);
      setResult("Error loading trivia. Please try again.");
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    setIsLoading(true);
    try {
      const api = await GearApi.create({
        providerAddress: "wss://testnet.vara.network",
      });

      // Get the extension from the account's source
      const injector = await web3FromSource(
        (account as InjectedAccountWithMeta).meta.source,
      );

      // Set the signer for the api
      api.setSigner(injector.signer as any);

      const triviaFactory = new TriviaFactory(
        api,
        "0xf5691c64eed986728bc5a263851b78ba867522289078b07ade779ca25f711b8b",
      );

      const playTriviaMessage = triviaFactory.triviaFactory.playTrivia(
        Number(triviaId),
        answers,
      );

      // Set the account
      await playTriviaMessage.withAccount(account.address);

      // Calculate gas (optional, but recommended)
      await playTriviaMessage.calculateGas();

      // Sign and send the transaction
      const result = await playTriviaMessage.signAndSend();

      const isFinalized = await result.isFinalized;

      if (isFinalized) {
        const response = await result.response();
        if (response && typeof response === "object" && "ok" in response) {
          setResult(String(response.ok));
        } else if (
          response &&
          typeof response === "object" &&
          "err" in response
        ) {
          setResult(`Error: ${String(response.err)}`);
        } else {
          setResult("Unexpected result structure");
        }
        setShowResult(true);
      } else {
        setResult("Transaction was not finalized");
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error playing trivia:", error);
      setResult(`Error playing trivia: ${error}`);
      setShowResult(true);
    } finally {
      setIsLoading(false);
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
          <button
            className="btn mt-2"
            onClick={loadTrivia}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load Trivia"}
          </button>
        </div>

        {trivia && !showResult && (
          <>
            <h2 className="text-xl mb-4">
              Question {currentQuestion + 1}:{" "}
              {trivia.questions[currentQuestion]}
            </h2>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              type="text"
              placeholder="Your answer"
              value={answers[currentQuestion]}
              onChange={(e) =>
                handleAnswerChange(e.target.value, currentQuestion)
              }
            />

            <div className="flex justify-between">
              <button
                className="btn"
                onClick={() =>
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                }
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {currentQuestion < trivia.questions.length - 1 ? (
                <button
                  className="btn"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn bg-green-500 hover:bg-green-700 text-white font-bold"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Answers"}
                </button>
              )}
            </div>
          </>
        )}

        {showResult && (
          <div>
            <h2 className="text-2xl mb-4">Trivia Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
