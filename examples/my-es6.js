/*
 * vinyl-transformer
 * example babel-es6
 */
import {src, dest} from "vinyl-fs";
import {Transformer} from "../";
import {filelist} from "./filelist";

let headerTpl = "/*\n * %s\n */\n";

class MyTransformer extends Transformer {

  constructor(options?: object) {
    super(options);
    let header;
    if (this.options.header) {
      header = headerTpl.replace("%s", this.options.header);
    }
    this.header = header && new Buffer(header);
  }

  transform(file: File): File {
    if (this.header) {
      file.contents = Buffer.concat([this.header, file.contents]);
    }
    return file;
  }
}

src("src/**/*.js")
  .pipe(new MyTransformer({
    header: "MyTransformer Example ES6",
  }))
  .pipe(filelist())
  .pipe(dest("dist"));
