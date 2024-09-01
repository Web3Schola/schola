import { GearApi, decodeAddress } from "@gear-js/api";
import { TypeRegistry } from "@polkadot/types";
import {
  TransactionBuilder,
  getServiceNamePrefix,
  getFnNamePrefix,
  ZERO_ADDRESS,
  ActorId,
} from "sails-js";

export class TriviaFactory {
  public readonly registry: TypeRegistry;
  public readonly triviaFactory: TriviaFactoryService;

  constructor(
    public api: GearApi,
    public programId?: `0x${string}`,
  ) {
    const types: Record<string, any> = {};

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.triviaFactory = new TriviaFactoryService(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "upload_program",
      "New",
      "String",
      "String",
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      "create_program",
      "New",
      "String",
      "String",
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class TriviaFactoryService {
  constructor(private _program: TriviaFactory) {}

  public createTrivia(
    questions: Array<string>,
    correct_answers: Array<string>,
    reward: number | string | bigint,
  ): TransactionBuilder<{ ok: number } | { err: string }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: number } | { err: string }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["TriviaFactory", "CreateTrivia", questions, correct_answers, reward],
      "(String, String, Vec<String>, Vec<String>, u128)",
      "Result<u32, String>",
      this._program.programId,
    );
  }

  public playTrivia(
    trivia_id: number,
    answers: Array<string>,
  ): TransactionBuilder<{ ok: string } | { err: string }> {
    if (!this._program.programId) throw new Error("Program ID is not set");
    return new TransactionBuilder<{ ok: string } | { err: string }>(
      this._program.api,
      this._program.registry,
      "send_message",
      ["TriviaFactory", "PlayTrivia", trivia_id, answers],
      "(String, String, u32, Vec<String>)",
      "Result<String, String>",
      this._program.programId,
    );
  }

  public async getTrivia(
    trivia_id: number,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<
    { ok: [Array<string>, number | string | bigint, boolean] } | { err: string }
  > {
    const payload = this._program.registry
      .createType("(String, String, u32)", [
        "TriviaFactory",
        "GetTrivia",
        trivia_id,
      ])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId || "",
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || undefined,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString(),
      );
    const result = this._program.registry.createType(
      "(String, String, Result<(Vec<String>, u128, bool), String>)",
      reply.payload,
    );
    return result[2].toJSON() as unknown as
      | { ok: [Array<string>, number | string | bigint, boolean] }
      | { err: string };
  }

  public async getTriviaCount(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<number> {
    const payload = this._program.registry
      .createType("(String, String)", ["TriviaFactory", "GetTriviaCount"])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId || "",
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || undefined,
    });
    if (!reply.code.isSuccess)
      throw new Error(
        this._program.registry.createType("String", reply.payload).toString(),
      );
    const result = this._program.registry.createType(
      "(String, String, u32)",
      reply.payload,
    );
    return result[2].toNumber() as unknown as number;
  }

  public subscribeToTriviaCreatedEvent(
    callback: (data: { id: number; creator: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "TriviaFactory" &&
          getFnNamePrefix(payload) === "TriviaCreated"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"id":"u32","creator":"[u8;32]"})',
                message.payload,
              )[2]
              .toJSON() as unknown as { id: number; creator: ActorId },
          );
        }
      },
    );
  }

  public subscribeToTriviaCompletedEvent(
    callback: (data: { id: number; winner: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent(
      "UserMessageSent",
      ({ data: { message } }) => {
        if (
          !message.source.eq(this._program.programId) ||
          !message.destination.eq(ZERO_ADDRESS)
        ) {
          return;
        }

        const payload = message.payload.toHex();
        if (
          getServiceNamePrefix(payload) === "TriviaFactory" &&
          getFnNamePrefix(payload) === "TriviaCompleted"
        ) {
          callback(
            this._program.registry
              .createType(
                '(String, String, {"id":"u32","winner":"[u8;32]"})',
                message.payload,
              )[2]
              .toJSON() as unknown as { id: number; winner: ActorId },
          );
        }
      },
    );
  }
}
