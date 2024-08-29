import { ActorId, TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';

export type TriviaError = "invalidTriviaIndex" | "incorrectAnswersCount" | "rewardTransferFailed" | "unauthorized" | "questionAnswerMismatch" | "notificationFailed";

export interface Trivia {
  questions: Array<string>;
  correct_answers: Array<string>;
  reward: number | string | bigint;
  owner: ActorId;
}

export class TriviaFactory {
  public readonly registry: TypeRegistry;
  public readonly trivia: Trivia;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      TriviaError: {"_enum":["InvalidTriviaIndex","IncorrectAnswersCount","RewardTransferFailed","Unauthorized","QuestionAnswerMismatch","NotificationFailed"]},
      Trivia: {"questions":"Vec<String>","correct_answers":"Vec<String>","reward":"u128","owner":"[u8;32]"},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.trivia = new Trivia(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class Trivia {
  constructor(private _program: TriviaFactory) {}

  public createTrivia(questions: Array<string>, correct_answers: Array<string>, reward: number | string | bigint): TransactionBuilder<{ ok: null } | { err: TriviaError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: null } | { err: TriviaError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Trivia', 'CreateTrivia', questions, correct_answers, reward],
      '(String, String, Vec<String>, Vec<String>, u128)',
      'Result<Null, TriviaError>',
      this._program.programId
    );
  }

  public deleteTrivia(index: number): TransactionBuilder<{ ok: null } | { err: TriviaError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: null } | { err: TriviaError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Trivia', 'DeleteTrivia', index],
      '(String, String, u32)',
      'Result<Null, TriviaError>',
      this._program.programId
    );
  }

  public playTrivia(trivia_index: number, answers: Array<string>): TransactionBuilder<{ ok: string } | { err: TriviaError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: string } | { err: TriviaError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Trivia', 'PlayTrivia', trivia_index, answers],
      '(String, String, u32, Vec<String>)',
      'Result<String, TriviaError>',
      this._program.programId
    );
  }

  public updateTrivia(index: number, questions: Array<string>, correct_answers: Array<string>, reward: number | string | bigint): TransactionBuilder<{ ok: null } | { err: TriviaError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: null } | { err: TriviaError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Trivia', 'UpdateTrivia', index, questions, correct_answers, reward],
      '(String, String, u32, Vec<String>, Vec<String>, u128)',
      'Result<Null, TriviaError>',
      this._program.programId
    );
  }

  public async getTrivia(index: number, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<{ ok: Trivia } | { err: TriviaError }> {
    const payload = this._program.registry.createType('(String, String, u32)', ['Trivia', 'GetTrivia', index]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Result<Trivia, TriviaError>)', reply.payload);
    return result[2].toJSON() as unknown as { ok: Trivia } | { err: TriviaError };
  }

  public async getTriviaCount(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<number> {
    const payload = this._program.registry.createType('(String, String)', ['Trivia', 'GetTriviaCount']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, u32)', reply.payload);
    return result[2].toNumber() as unknown as number;
  }

  public async getTrivias(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<Trivia>> {
    const payload = this._program.registry.createType('(String, String)', ['Trivia', 'GetTrivias']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<Trivia>)', reply.payload);
    return result[2].toJSON() as unknown as Array<Trivia>;
  }

  public subscribeToTriviaCreatedEvent(callback: (data: { index: number }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Trivia' && getFnNamePrefix(payload) === 'TriviaCreated') {
        callback(this._program.registry.createType('(String, String, {"index":"u32"})', message.payload)[2].toJSON() as unknown as { index: number });
      }
    });
  }

  public subscribeToTriviaPlayedEvent(callback: (data: { index: number; result: string }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Trivia' && getFnNamePrefix(payload) === 'TriviaPlayed') {
        callback(this._program.registry.createType('(String, String, {"index":"u32","result":"String"})', message.payload)[2].toJSON() as unknown as { index: number; result: string });
      }
    });
  }

  public subscribeToRewardPaidEvent(callback: (data: { index: number; amount: number | string | bigint }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Trivia' && getFnNamePrefix(payload) === 'RewardPaid') {
        callback(this._program.registry.createType('(String, String, {"index":"u32","amount":"u128"})', message.payload)[2].toJSON() as unknown as { index: number; amount: number | string | bigint });
      }
    });
  }

  public subscribeToTriviaUpdatedEvent(callback: (data: { index: number }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Trivia' && getFnNamePrefix(payload) === 'TriviaUpdated') {
        callback(this._program.registry.createType('(String, String, {"index":"u32"})', message.payload)[2].toJSON() as unknown as { index: number });
      }
    });
  }

  public subscribeToTriviaDeletedEvent(callback: (data: { index: number }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Trivia' && getFnNamePrefix(payload) === 'TriviaDeleted') {
        callback(this._program.registry.createType('(String, String, {"index":"u32"})', message.payload)[2].toJSON() as unknown as { index: number });
      }
    });
  }
}