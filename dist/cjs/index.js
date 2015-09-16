/*
 * vinyl-transformer
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _readableStream = require("readable-stream");

var Transformer = (function (_Transform) {
  _inherits(Transformer, _Transform);

  function Transformer(options) {
    _classCallCheck(this, Transformer);

    _get(Object.getPrototypeOf(Transformer.prototype), "constructor", this).call(this, { objectMode: true });
    this.options = (0, _objectAssign2["default"])(this.options || {}, options);
  }

  _createClass(Transformer, [{
    key: "_transform",
    value: function _transform(chunk, encoding, cb) {
      var _this = this;

      if (chunk && chunk.isNull && chunk.isBuffer && chunk.isStream) {
        var file = chunk;
        file.encoding = encoding;
        if (file.isNull()) {
          return cb(null, file);
        }
        Promise.resolve(this.transform(file)).then(function (file) {
          file && _this.push(file);
          cb();
        }, function (err) {
          return cb(err);
        });
      } else {
        cb(new Error("Chunk " + chunk + " not supported"));
      }
    }
  }, {
    key: "_flush",
    value: function _flush(cb) {
      var _this2 = this;

      if (this.flush instanceof Function) {
        Promise.resolve(this.flush()).then(function (file) {
          file && _this2.push(file);
          cb();
        }, function (err) {
          return cb(err);
        });
      } else {
        cb();
      }
    }
  }, {
    key: "transform",
    value: function transform(file) {
      throw new Error("Not implemented");
    }
  }]);

  return Transformer;
})(_readableStream.Transform);

exports.Transformer = Transformer;