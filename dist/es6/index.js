/*
 * vinyl-transformer
 */
"use strict";

import assign from "object-assign";
import { Transform } from "readable-stream";

class Transformer extends Transform {

  constructor(options) {
    super({ objectMode: true });
    this.options = assign(this.options || {}, options);
  }

  _transform(chunk, encoding, cb) {
    if (chunk && chunk.isNull && chunk.isBuffer && chunk.isStream) {
      let file = chunk;
      file.encoding = encoding;
      if (file.isNull()) {
        return cb(null, file);
      }
      Promise.resolve(this.transform(file)).then(file => {
        file && this.push(file);
        cb();
      }, err => cb(err));
    } else {
      cb(new Error(`Chunk ${ chunk } not supported`));
    }
  }

  _flush(cb) {
    if (this.flush instanceof Function) {
      Promise.resolve(this.flush()).then(file => {
        file && this.push(file);
        cb();
      }, err => cb(err));
    } else {
      cb();
    }
  }

  transform(file) {
    throw new Error("Not implemented");
  }
}

export { Transformer };