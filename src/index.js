/*
 * vinyl-transformer
 */
import assign from "object-assign";
import {Transform} from "readable-stream";

export class AbstractTransformer extends Transform {

  _transform(chunk: any, encoding: string, cb: Function): void {
    if (chunk && chunk.isNull && chunk.isBuffer && chunk.isStream) {
      let file = chunk;
      file.encoding = encoding;
      if (file.isNull()) {
        return cb(null, file);
      }
      try {
        Promise.resolve(this.transform(file))
          .then((file) => cb(null, file))
          .catch((err) => cb(err));
      } catch (err) {
        cb(err);
      }
    } else {
      cb(new Error(`Unsupported chunk ${chunk}`));
    }
  }

  _flush(cb: Function): void {
    try {
      Promise.resolve(this.flush())
        .then((file) => cb(null, file))
        .catch((err) => cb(err));
    } catch (err) {
      cb(err);
    }
  }

  transform(file: File): Promise<File>|File|void {
    throw new Error("Not implemented");
  }

  flush(): Promise<File>|File|void {
    return;
  }
}

export class Transformer extends AbstractTransformer {

  options = {};

  constructor(options?: object) {
    super({objectMode: true});
    this.options = assign(this.options, options);
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

interface TransformerLike {
  transform: Function;
  initialize?: Function;
  flush?: Function;
}

const T__META__ = Symbol("__meta__");

export function transformer(thing: Function|TransformerLike): Class<Transformer> {
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
    constructor(options?: object) {
      super(options);
      this[T__META__] = {
        self: this,
        options: this.options,
      };
      initialize && initialize(this[T__META__]);
    }
    transform(file: File): Promise<File>|File|void {
      return transform(file, this[T__META__]);
    }
    flush(): Promise<File>|File|void {
      return flush && flush(this[T__META__]);
    }
    static create(options?: object): Transformer {
      return new T(options);
    }
  };
  return T;
}
