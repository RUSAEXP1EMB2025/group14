export class Result<T, E = Error> {
  private constructor(
    private readonly _success: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static failure<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  isSuccess(): boolean {
    return this._success;
  }

  get data(): T | undefined {
    return this._value;
  }

  get error(): E | undefined {
    return this._error;
  }

  isFailure(): boolean {
    return !this._success;
  }

  getValue(): T {
    if (!this._success) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  getError(): E {
    if (this._success) {
      throw new Error('Cannot get error from successful result');
    }
    return this._error!;
  }

  getValueOrDefault(defaultValue: T): T {
    return this._success ? this._value! : defaultValue;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._success) {
      try {
        return Result.success<U, E>(fn(this._value!));
      } catch (error) {
        return Result.failure<U, E>(error as E);
      }
    }
    return Result.failure<U, E>(this._error!);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._success) {
      return fn(this._value!);
    }
    return Result.failure<U, E>(this._error!);
  }
}
