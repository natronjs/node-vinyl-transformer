/**
 * @module vinyl-transformer
 */
import {Transform} from "readable-stream";
import File from "vinyl";

export class Transformer extends Transform {

  constructor(options?: Object) {
    super({objectMode: true});
  }

  _transform(file: File, encoding: string, cb: Function): void {
    if (!File.isVinyl(file)) {
      cb(new Error(`${file} is not a vinyl file`));
    }
    try {
      (Promise.resolve(this.transform(file))
        .then((res) => {
          if (res === undefined) {
            return cb(null, file);
          }
          return cb(null, res || null);
        })
        .catch((err) => cb(err))
      );
    } catch (err) {
      return cb(err);
    }
  }

  transform(file: File): Promise<File>|File|void {
    throw new Error("Not implemented");
  }

  _flush(cb: Function): void {
    try {
      (Promise.resolve(this.flush())
        .then((res) => cb(null))
        .catch((err) => cb(err))
      );
    } catch (err) {
      return cb(err);
    }
  }

  flush(): void {
    return;
  }
}

export class TransformerError extends Error {

  file: File;
  previous: Error;

  constructor(message: string, file?: File, previous?: Error) {
    super(message);
    this.file = file;
    this.previous = previous;
  }
}

export function createTransformer(thing: Function|Object): typeof Transformer {
  let transform, initialize, flush;
  if (thing && thing.transform) {
    ({transform, initialize, flush} = thing);
  } else {
    transform = thing;
  }
  if (!(transform instanceof Function)) {
    throw new Error(`${transform} is not a function`);
  }

  let T = class extends Transformer {
    constructor(...args: any) {
      super();
      initialize && initialize.call(this, ...args);
    }
    transform(file: File): Promise<File>|File|void {
      return transform.call(this, file);
    }
    flush(): void {
      flush && flush.call(this);
    }
  };
  return T;
}

export function createTransformerFn(thing: Function|Object): Function {
  let T = createTransformer(thing);
  return function (...args: any) {
    return new T(...args);
  };
}

export function transformer(thing: Function|Object): Transformer {
  return new (createTransformer(thing))();
}
