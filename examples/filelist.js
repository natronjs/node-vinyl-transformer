/*
 * vinyl-transformer
 * example filelist
 */
import {src, dest} from "vinyl-fs";
import {transformer} from "../src";

export function filelist(): Transformer {
  return transformer({
    initialize: ({self}) => {
      self.count = 0;
    },
    transform: (file, {self}) => {
      console.log("File", file.path);
      self.count++;
      return file;
    },
    flush: ({self}) => {
      console.log("---- Files:", self.count);
    },
  }).create();
}
