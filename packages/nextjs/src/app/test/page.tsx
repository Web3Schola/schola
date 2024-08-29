"use client";

import { useState, useEffect } from "react";
import { GearApi, GearKeyring } from "@gear-js/api";
import { ProgramMetadata } from "@gear-js/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";

// Definir tipos
type TriviaAction = "create" | "play";

interface TriviaFormData {
  questions: string[];
  answers: string[];
  reward?: string;
  triviaIndex?: number;
}

export default function Home() {
  const [api, setApi] = useState<GearApi | null>(null);
  const [keyring, setKeyring] = useState<KeyringPair | null>(null);
  const [programId, setProgramId] = useState<HexString>("0x");
  const [action, setAction] = useState<TriviaAction>("create");
  const [formData, setFormData] = useState<TriviaFormData>({
    questions: [""],
    answers: [""],
    reward: "",
    triviaIndex: 0,
  });

  useEffect(() => {
    const initApi = async () => {
      const gearApi = await GearApi.create({
        providerAddress: "wss://vara-testnet.gear-tech.io",
      });
      setApi(gearApi);

      const gearKeyring = await GearKeyring.fromSuri("//Alice");
      setKeyring(gearKeyring);
    };

    initApi();

    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, [api]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "questions" | "answers",
  ) => {
    const newData = { ...formData };
    newData[field][index] = event.target.value;
    setFormData(newData);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!api || !keyring) return;

    // Asume que tienes el metadata del programa. Deberías obtenerlo del backend o almacenarlo en el frontend.
    const metadata = ProgramMetadata.from("0x..."); // Reemplaza con el metadata real

    let payload;
    if (action === "create") {
      payload = {
        CreateTrivia: {
          questions: formData.questions,
          correct_answers: formData.answers,
          reward: formData.reward,
        },
      };
    } else {
      payload = {
        PlayTrivia: {
          trivia_index: formData.triviaIndex,
          answers: formData.answers,
        },
      };
    }

    try {
      const gas = await api.program.calculateGas.handle(
        keyring.address as HexString,
        programId,
        payload,
        0,
        true,
        metadata,
      );

      const message = {
        destination: programId,
        payload,
        gasLimit: gas.min_limit,
        value: 0,
      };

      const extrinsic = api.message.send(message as any, metadata);
      await extrinsic.signAndSend(keyring, (event: any) => {
        if (event.status.isInBlock) {
          console.log(
            `${action === "create" ? "Trivia created" : "Trivia played"} successfully`,
          );
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!api) return <div>Loading...</div>;

  return (
    <div>
      <h1>Trivia Contract Interaction</h1>
      <input
        type="text"
        value={programId}
        onChange={(e) => setProgramId(e.target.value as HexString)}
        placeholder="Enter Program ID"
      />
      <select
        value={action}
        onChange={(e) => setAction(e.target.value as TriviaAction)}
      >
        <option value="create">Create Trivia</option>
        <option value="play">Play Trivia</option>
      </select>
      <form onSubmit={handleSubmit}>
        {action === "create" ? (
          <>
            {formData.questions.map((q, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => handleInputChange(e, index, "questions")}
                  placeholder={`Question ${index + 1}`}
                />
                <input
                  type="text"
                  value={formData.answers[index]}
                  onChange={(e) => handleInputChange(e, index, "answers")}
                  placeholder={`Answer ${index + 1}`}
                />
              </div>
            ))}
            <input
              type="text"
              value={formData.reward}
              onChange={(e) =>
                setFormData({ ...formData, reward: e.target.value })
              }
              placeholder="Reward"
            />
          </>
        ) : (
          <>
            <input
              type="number"
              value={formData.triviaIndex}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  triviaIndex: Number(e.target.value),
                })
              }
              placeholder="Trivia Index"
            />
            <input
              type="text"
              value={formData.answers[0]}
              onChange={(e) => handleInputChange(e, 0, "answers")}
              placeholder="Your Answer"
            />
          </>
        )}
        <button type="submit">
          {action === "create" ? "Create Trivia" : "Play Trivia"}
        </button>
      </form>
    </div>
  );
}
