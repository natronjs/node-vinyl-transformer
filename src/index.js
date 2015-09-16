/*
 * vinyl-transformer
 */
import assign from "object-assign";
import {Transform} from "readable-stream";

export class Transformer extends Transform {

  options: object;

  constructor(options?: object) {
    super({objectMode: true});
    this.options = assign(this.options || {}, options);
  }

  _transform(chunk: any, encoding: string, cb: Function): void {
    if (chunk && chunk.isNull && chunk.isBuffer && chunk.isStream) {
      let file = chunk;
      file.encoding = encoding;
      if (file.isNull()) {
        return cb(null, file);
      }
      Promise.resolve(this.transform(file)).then((file) => {
        file && this.push(file);
        cb();
      }, (err) => cb(err));
    } else {
      cb(new Error(`Chunk ${chunk} not supported`));
    }
  }

  _flush(cb: Function): void {
    if (this.flush instanceof Function) {
      Promise.resolve(this.flush()).then((file) => {
        file && this.push(file);
        cb();
      }, (err) => cb(err));
    } else {
      cb();
    }
  }

  transform(file: File): Promise|File|void {
    throw new Error("Not implemented");
  }
}
