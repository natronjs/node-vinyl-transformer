# vinyl-transformer

**Create Transformers for Vinyl File Streams**

[![Version][npm-img]][npm-url]
[![Downloads][dlm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![ReadMe][readme-img]][readme-url]

[npm-img]: https://img.shields.io/npm/v/vinyl-transformer.svg
[npm-url]: https://npmjs.org/package/vinyl-transformer
[dlm-img]: https://img.shields.io/npm/dm/vinyl-transformer.svg
[travis-img]: https://travis-ci.org/natronjs/vinyl-transformer.svg
[travis-url]: https://travis-ci.org/natronjs/vinyl-transformer
[readme-img]: https://img.shields.io/badge/read-me-orange.svg
[readme-url]: https://natron.readme.io/docs/module-vinyl-transformer

## Documentation

See the [documentation for `vinyl-transformer`][readme-url]

## Usage

### Vinyl FS

```js
import {src, dest} from "vinyl-fs";
import {createTransformerFn} from "vinyl-transformer";

let compile = createTransformerFn((file) => {
  file.contents = /* ... */;
});

let stream = (src("src/**/*.js")
  .pipe(compile())
  .pipe(dest("dist"))
);
```

### Gulp

```js
import gulp from "gulp";
import {createTransformerFn} from "vinyl-transformer";

let compile = createTransformerFn((file) => {
  file.contents = /* ... */;
});

gulp.task("compile", () => {
  return (gulp.src("src/**/*.js")
    .pipe(compile())
    .pipe(gulp.dest("dist"))
  );
});
```
