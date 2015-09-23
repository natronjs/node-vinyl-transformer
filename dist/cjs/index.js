/*
 * vinyl-transformer
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.transformer = transformer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _readableStream = require("readable-stream");

var AbstractTransformer = (function (_Transform) {
  _inherits(AbstractTransformer, _Transform);

  function AbstractTransformer() {
    _classCallCheck(this, AbstractTransformer);

    _get(Object.getPrototypeOf(AbstractTransformer.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(AbstractTransformer, [{
    key: "_transform",
    value: function _transform(chunk, encoding, cb) {
      if (chunk && chunk.isNull && chunk.isBuffer && chunk.isStream) {
        var _file = chunk;
        _file.encoding = encoding;
        if (_file.isNull()) {
          return cb(null, _file);
        }
        try {
          Promise.resolve(this.transform(_file)).then(function (file) {
            return cb(null, file);
          })["catch"](function (err) {
            return cb(err);
          });
        } catch (err) {
          cb(err);
        }
      } else {
        cb(new Error("Unsupported chunk " + chunk));
      }
    }
  }, {
    key: "_flush",
    value: function _flush(cb) {
      try {
        Promise.resolve(this.flush()).then(function (file) {
          return cb(null, file);
        })["catch"](function (err) {
          return cb(err);
        });
      } catch (err) {
        cb(err);
      }
    }
  }, {
    key: "transform",
    value: function transform(file) {
      throw new Error("Not implemented");
    }
  }, {
    key: "flush",
    value: function flush() {
      return;
    }
  }]);

  return AbstractTransformer;
})(_readableStream.Transform);

exports.AbstractTransformer = AbstractTransformer;

var Transformer = (function (_AbstractTransformer) {
  _inherits(Transformer, _AbstractTransformer);

  function Transformer(options) {
    _classCallCheck(this, Transformer);

    _get(Object.getPrototypeOf(Transformer.prototype), "constructor", this).call(this, { objectMode: true });
    this.options = {};
    this.options = (0, _objectAssign2["default"])(this.options, options);
  }

  return Transformer;
})(AbstractTransformer);

exports.Transformer = Transformer;

var TransformerError = (function (_Error) {
  _inherits(TransformerError, _Error);

  function TransformerError(message, file, previous) {
    _classCallCheck(this, TransformerError);

    _get(Object.getPrototypeOf(TransformerError.prototype), "constructor", this).call(this, message);
    this.file = file;
    this.previous = previous;
  }

  return TransformerError;
})(Error);

exports.TransformerError = TransformerError;

var T__META__ = Symbol("__meta__");

function transformer(thing) {
  var transform = undefined,
      initialize = undefined,
      flush = undefined;
  if (thing && thing.transform) {
    transform = thing.transform;
    initialize = thing.initialize;
    flush = thing.flush;
  } else {
    transform = thing;
  }
  if (!(transform instanceof Function)) {
    throw new Error(transform + " is not a function");
  }
  var T = (function (_Transformer) {
    _inherits(T, _Transformer);

    function T(options) {
      _classCallCheck(this, T);

      _get(Object.getPrototypeOf(T.prototype), "constructor", this).call(this, options);
      this[T__META__] = {
        self: this,
        options: this.options
      };
      initialize && initialize(this[T__META__]);
    }

    _createClass(T, [{
      key: "transform",
      value: (function (_transform2) {
        function transform(_x) {
          return _transform2.apply(this, arguments);
        }

        transform.toString = function () {
          return _transform2.toString();
        };

        return transform;
      })(function (file) {
        return transform(file, this[T__META__]);
      })
    }, {
      key: "flush",
      value: (function (_flush2) {
        function flush() {
          return _flush2.apply(this, arguments);
        }

        flush.toString = function () {
          return _flush2.toString();
        };

        return flush;
      })(function () {
        return flush && flush(this[T__META__]);
      })
    }], [{
      key: "create",
      value: function create(options) {
        return new T(options);
      }
    }]);

    return T;
  })(Transformer);
  return T;
}