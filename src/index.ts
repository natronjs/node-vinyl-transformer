import * as File from "vinyl";

import {
  ITransformerType,
  ITransformFunction,
  Transformer,
  TransformerError,
  TTransformerLike,
  TTransformResult,
} from "./transformer";

export { ITransformerType, ITransformFunction, Transformer, TransformerError, TTransformerLike, TTransformResult };

export function createTransformerClass(thing: TTransformerLike): ITransformerType {

  let transform: ITransformFunction;
  let initialize: Function;
  let flush: Function;

  if (thing && (<any>thing).transform instanceof Function) {
    ({ transform, initialize, flush } = <Transformer>thing);
  } else {
    transform = <ITransformFunction>thing;
  }

  if (!(transform instanceof Function)) {
    throw new TransformerError(`${transform} is not a function`);
  }

  return class extends Transformer {
    public transform(file: File): File | Promise<File> {
      return transform.call(this, file);
    }
    public initialize(...args: any[]): void | Promise<void> {
      if (initialize) {
        return initialize.call(this, ...args);
      }
    }
    public flush(): void | Promise<void> {
      if (flush) {
        return flush.call(this);
      }
    }
  };
}

export function transformer(tLike: TTransformerLike): Transformer {
  return new (createTransformerClass(tLike))();
}

export function createTransformFunction(tLike: TTransformerLike):
  (...args: any[]) => Transformer {
  const t = transformer(tLike);
  return function (...args: any[]) {
    t.initialize(...args);
    return t;
  };
}
