# vinyl-transformer

**A Stream Transformer for [Vinyl][vinyl-url]**

[vinyl-url]: https://npmjs.org/package/vinyl

[![Version][npm-img]][npm-url]
[![Downloads][dlm-img]][npm-url]
[![Build Status][travis-img]][travis-url]

[npm-img]: https://img.shields.io/npm/v/vinyl-transformer.svg
[npm-url]: https://npmjs.org/package/vinyl-transformer
[dlm-img]: https://img.shields.io/npm/dm/vinyl-transformer.svg
[travis-img]: https://travis-ci.org/stefanr/node-vinyl-transformer.svg
[travis-url]: https://travis-ci.org/stefanr/node-vinyl-transformer

## Usage
### Example `MyTransformer`
#### `Transformer` Class

```js
import {Transformer} from "vinyl-transformer";

class MyTransformer extends Transformer {

  transform(file: File): File {
    file.contents = /* ... */;
    return file;
  }
}
```

#### `transformer` Function

```js
import {transformer} from "vinyl-transformer";

let MyTransformer = transformer((file: File) => {
  file.contents = /* ... */;
  return file;
});
```

#### Use with Vinyl FS

```js
import {src, dest} from "vinyl-fs";

src("src/example.js")
  .pipe(new MyTransformer())
  .pipe(dest("out"));
```

#### Use with Gulp

```js
import gulp from "gulp";

gulp.task("example", () => {
  return gulp.src("src/example.js")
    .pipe(new MyTransformer())
    .pipe(gulp.dest("out"));
});
```

## API

### Class: `Transformer`

##### `new Transformer(options?: object)`

#### Methods

##### `transform(file: File): Promise<File>|File|void`

##### `flush(): Promise<File>|File|void`

### Function: `transform()`

##### `transform(thing: TransformFn|TransformerLike): Class<Transformer>`

```js
interface TransformFn {
  (file: File, __meta__: object): Promise<File>|File|void;
}

interface TransformerLike {
  initialize(__meta__: object): void;
  transform(file: File, __meta__: object): Promise<File>|File|void;
  flush(__meta__: object): Promise<File>|File|void;
}
```

## Examples
- [`vinyl-tf-babel`](https://npmjs.com/package/vinyl-tf-babel) A Vinyl Transformer for Babel
