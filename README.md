# vinyl-transformer
**A Stream Transformer for [Vinyl](https://www.npmjs.com/package/vinyl)**

[![npm version][npm-img]][npm-url] [![npm downloads][dlm-img]][npm-url] [![build status][tci-img]][tci-url]

## Usage
### Example `BabelTransformer`

```js
import {transform} from "babel-core";
import {Transformer} from "vinyl-transformer";

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
```

#### Vinyl FS

```js
import {src, dest} from "vinyl-fs";
import {BabelTransformer} from "./babel-transformer";

src("src/**/*.js")
  .pipe(new BabelTransformer())
  .pipe(dest("dist"));
```

#### Gulp

```js
import gulp from "gulp";
import {BabelTransformer} from "./babel-transformer";

gulp.task("babel", () => {
  return gulp.src("src/**/*.js")
    .pipe(new BabelTransformer())
    .pipe(gulp.dest("dist"));
});
```

## Examples
- [BabelTransformer with  ES6](https://github.com/stefanr/node-vinyl-transformer/tree/master/examples/babel-es6.js)
- [BabelTransformer with  ES5](https://github.com/stefanr/node-vinyl-transformer/tree/master/examples/babel-es5.js)

[npm-img]: https://img.shields.io/npm/v/vinyl-transformer.svg
[dlm-img]: https://img.shields.io/npm/dm/vinyl-transformer.svg
[tci-img]: https://travis-ci.org/stefanr/node-vinyl-transformer.svg
[npm-url]: https://npmjs.org/package/vinyl-transformer
[tci-url]: https://travis-ci.org/stefanr/node-vinyl-transformer
