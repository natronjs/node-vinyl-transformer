const File = require("vinyl");
const {
  Transformer,
  TTransformResult
} = require("..");

class PrefixTransformer extends Transformer {

  constructor(prefix) {
    super();
    this.prefix = prefix;
  }

  transform(file) {
    file.contents = Buffer.from(
      String(this.prefix) + String(file.contents));
    return file;
  }
}

const file = new File({
  contents: Buffer.from("Test"),
});

const transformer = new PrefixTransformer("**PREFIX**");
const tFile = transformer.transform(file);

console.log(String(tFile.contents));
