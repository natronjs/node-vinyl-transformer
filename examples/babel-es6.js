/*
 * vinyl-transformer
 * example babel-es6
 */
import {src, dest} from "vinyl-fs";
import {transform} from "babel-core";
import {Transformer} from "../";
import {filelist} from "./filelist";

class BabelTransformer extends Transformer {

  transform(file: File): File {
    let babelOptions = Object.assign({}, this.options, {
      filename: file.path,
      filenameRelative: file.relative,
    });
    let {code} = transform(String(file.contents), babelOptions);
    file.contents = new Buffer(code);
    return file;
  }
}

src("src/**/*.js")
  .pipe(new BabelTransformer())
  .pipe(filelist())
  .pipe(dest("dist"));
