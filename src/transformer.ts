import { Transform } from "readable-stream";
import * as File from "vinyl";

export abstract class Transformer extends Transform {

  public constructor(options?: object) {
    super({ objectMode: true });
  }

  public initialize(...args: any[]): void | Promise<void> { }

  public abstract transform(file: File): TTransformResult;

  public _transform(file: any, encoding: string, cb: ITransformCallback): void {
    if (!File.isVinyl(file)) {
      cb(new TransformerError(`${file} is not a vinyl file`), null);
      return;
    }

    try {
      Promise.resolve(this.transform(file))
        .then(res => cb(undefined, res === undefined ? file : res))
        .catch(err => cb(err, null));
    } catch (err) {
      cb(err, null);
    }
  }

  public flush(): TTransformResult { }

  public _flush(cb: ITransformCallback): void {
    try {
      Promise.resolve(this.flush())
        .then(res => cb(undefined, res === undefined ? null : res))
        .catch(err => cb(err, null));
    } catch (err) {
      cb(err, null);
    }
  }
}

export class TransformerError extends Error {

  public readonly file: File | null;
  public readonly previous: Error | null;

  public constructor(message: string, file?: File, previous?: Error) {
    super(message);
    this.file = file || null;
    this.previous = previous || null;
  }
}

interface ITransformCallback { (error?: Error, file?: any): void; }

export type TTransformResult = void | File | Promise<void | File | null> | null;

export interface ITransformFunction { (file: File): TTransformResult; }

export type TTransformerLike = Transformer | ITransformFunction;

export interface ITransformerType { new(): Transformer; }
