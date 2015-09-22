/*
 * vinyl-transformer
 * example babel-es5
 */
var inherits = require("util").inherits;
var assign = require("object-assign");
var vfs = require("vinyl-fs");
var transform = require("babel-core").transform;
var Transformer = require("../").Transformer;
var filelist = require("./filelist").filelist;

function BabelTransformer(options) {
  Transformer.call(this, options);
}
inherits(BabelTransformer, Transformer);

BabelTransformer.prototype.transform = function (file) {
  var babelOptions = assign({}, this.options, {
    filename: file.path,
    filenameRelative: file.relative,
  });
  var res = transform(String(file.contents), babelOptions);
  file.contents = new Buffer(res.code);
  return file;
};

vfs.src("src/**/*.js")
  .pipe(new BabelTransformer())
  .pipe(filelist())
  .pipe(vfs.dest("dist"));
