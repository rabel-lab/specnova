export interface ErrorCaster<In extends Error, Out extends Error> {
  cast(error: In): Out;
  isCastable(error: unknown): error is In;
}

export type ErrorCasters = ReadonlyArray<ErrorCaster<any, any>>;
