/*
 * vinyl-transformer
 * example babel-es5
 */
var inherits = require("util").inherits;
var vfs = require("vinyl-fs");
var Transformer = require("../").Transformer;
var filelist = require("./filelist").filelist;

var headerTpl = "/*\n * %s\n */\n";

function MyTransformer(options) {
  Transformer.call(this, options);
  var header;
  if (this.options.header) {
    header = headerTpl.replace("%s", this.options.header);
  }
  this.header = header && new Buffer(header);
}
inherits(MyTransformer, Transformer);

MyTransformer.prototype.transform = function (file) {
  if (this.header) {
    file.contents = Buffer.concat([this.header, file.contents]);
  }
  return file;
};

vfs.src("src/**/*.js")
  .pipe(new MyTransformer({
    header: "MyTransformer Example ES5",
  }))
  .pipe(filelist())
  .pipe(vfs.dest("dist"));
