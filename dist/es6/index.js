/*
 * vinyl-transformer
 */
"use strict";

export { transformer };
import assign from "object-assign";
import { Transform } from "readable-stream";

class AbstractTransformer extends Transform {

  _transform(chunk, encoding, cb) {
    if (chunk && chunk.isNull && chunk.isBuffer && chunk.isStream) {
      let file = chunk;
      file.encoding = encoding;
      if (file.isNull()) {
        return cb(null, file);
      }
      try {
        Promise.resolve(this.transform(file)).then(file => cb(null, file))["catch"](err => cb(err));
      } catch (err) {
        cb(err);
      }
    } else {
      cb(new Error(`Unsupported chunk ${ chunk }`));
    }
  }

  _flush(cb) {
    try {
      Promise.resolve(this.flush()).then(file => cb(null, file))["catch"](err => cb(err));
    } catch (err) {
      cb(err);
    }
  }

  transform(file) {
    throw new Error("Not implemented");
  }

  flush() {
    return;
  }
}

export { AbstractTransformer };

class Transformer extends AbstractTransformer {

  constructor(options) {
    super({ objectMode: true });
    this.options = assign(this.options, options);
  }
}

export { Transformer };

class TransformerError extends Error {

  constructor(message, file, previous) {
    super(message);
    this.file = file;
    this.previous = previous;
  }
}

export { TransformerError };

const T__META__ = Symbol("__meta__");

function transformer(thing) {
  let transform, initialize, flush;
  if (thing && thing.transform) {
    ({ transform, initialize, flush } = thing);
  } else {
    transform = thing;
  }
  if (!(transform instanceof Function)) {
    throw new Error(`${ transform } is not a function`);
  }
  let T = class extends Transformer {
    constructor(options) {
      super(options);
      this[T__META__] = {
        self: this,
        options: this.options
      };
      initialize && initialize(this[T__META__]);
    }
    transform(file) {
      return transform(file, this[T__META__]);
    }
    flush() {
      return flush && flush(this[T__META__]);
    }
    static create(options) {
      return new T(options);
    }
  };
  return T;
}