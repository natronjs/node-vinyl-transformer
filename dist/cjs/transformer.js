"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformerError = exports.Transformer = undefined;
exports.createTransformer = createTransformer;
exports.createTransformerFn = createTransformerFn;
exports.transformer = transformer;

var _readableStream = require("readable-stream");

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module vinyl-transformer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Transformer = exports.Transformer = (function (_Transform) {
  _inherits(Transformer, _Transform);

  function Transformer(options) {
    _classCallCheck(this, Transformer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Transformer).call(this, { objectMode: true }));
  }

  _createClass(Transformer, [{
    key: "_transform",
    value: function _transform(file, encoding, cb) {
      if (!_vinyl2.default.isVinyl(file)) {
        cb(new Error(file + " is not a vinyl file"));
      }
      try {
        Promise.resolve(this.transform(file)).then(function (res) {
          if (res === undefined) {
            return cb(null, file);
          }
          return cb(null, res || null);
        }).catch(function (err) {
          return cb(err);
        });
      } catch (err) {
        return cb(err);
      }
    }
  }, {
    key: "transform",
    value: function transform(file) {
      throw new Error("Not implemented");
    }
  }, {
    key: "_flush",
    value: function _flush(cb) {
      try {
        Promise.resolve(this.flush()).then(function (res) {
          return cb(null);
        }).catch(function (err) {
          return cb(err);
        });
      } catch (err) {
        return cb(err);
      }
    }
  }, {
    key: "flush",
    value: function flush() {
      return;
    }
  }]);

  return Transformer;
})(_readableStream.Transform);

var TransformerError = exports.TransformerError = (function (_Error) {
  _inherits(TransformerError, _Error);

  function TransformerError(message, file, previous) {
    _classCallCheck(this, TransformerError);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TransformerError).call(this, message));

    _this2.file = file;
    _this2.previous = previous;
    return _this2;
  }

  return TransformerError;
})(Error);

function createTransformer(thing) {
  var _transform2 = undefined,
      initialize = undefined,
      _flush2 = undefined;
  if (thing && thing.transform) {
    _transform2 = thing.transform;
    initialize = thing.initialize;
    _flush2 = thing.flush;
  } else {
    _transform2 = thing;
  }
  if (!(_transform2 instanceof Function)) {
    throw new Error(_transform2 + " is not a function");
  }

  var T = (function (_Transformer) {
    _inherits(T, _Transformer);

    function T() {
      var _initialize;

      _classCallCheck(this, T);

      var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(T).call(this));

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      initialize && (_initialize = initialize).call.apply(_initialize, [_this3].concat(_toConsumableArray(args)));
      return _this3;
    }

    _createClass(T, [{
      key: "transform",
      value: function transform(file) {
        return _transform2.call(this, file);
      }
    }, {
      key: "flush",
      value: function flush() {
        _flush2 && _flush2.call(this);
      }
    }]);

    return T;
  })(Transformer);
  return T;
}

function createTransformerFn(thing) {
  var T = createTransformer(thing);
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new (Function.prototype.bind.apply(T, [null].concat(_toConsumableArray(args))))();
  };
}

function transformer(thing) {
  return new (createTransformer(thing))();
}