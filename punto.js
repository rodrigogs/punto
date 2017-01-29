/**
 * @module punto
 */
(function () {
  'use strict';

  var punto = {};

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self || // jshint ignore:line
    typeof global === 'object' && global.global === global && global || // jshint ignore:line
    this;

  function isObject(value) {
    return (!!value) && (value.constructor === Object);
  }

  punto.get = function (object, property) {
    if (!object) {
      return null;
    }
    if (typeof property !== 'string') {
      return object[property];
    }
    if (object.hasOwnProperty(property)) {
      return object[property];
    }

    var propChain = property.split('.');
    var currentObjProp = object;
    var last = false;
    var result;

    for (var i = 0, len = propChain.length; i < len; i++) {
      last = (i + 1) === len;
      var prop = propChain[i];
      if (!currentObjProp.hasOwnProperty(prop)) {
        result = null;
        break;
      }
      if (last) {
        result = currentObjProp[prop];
      } else {
        currentObjProp = currentObjProp[prop];
      }
    }

    return result;
  };

  punto.set = function (object, property, value) {
    if (!object) {
      return;
    }

    var propChain = (property || '').split('.');
    var currentObjProp = object;
    var last = false;

    for (var i = 0, len = propChain.length; i < len; i++) {
      last = (i + 1) === len;
      var prop = propChain[i];
      if (!currentObjProp.hasOwnProperty(prop)) {
        if (last) {
          currentObjProp[prop] = value;
        } else {
          currentObjProp[prop] = {};
          currentObjProp = currentObjProp[prop];
        }
      } else {
        if (last) {
          currentObjProp[prop] = value;
        } else {
          if (!isObject(currentObjProp[prop])) {
            currentObjProp[prop] = {};
          }
          currentObjProp = currentObjProp[prop];
        }
      }
    }
  };

  punto.normalize = function (object) {
    var props = Object.getOwnPropertyNames(object);
    for (var i = 0, len = props.length; i < len; i++) {
      var prop = props[i];
      var value = object[prop];
      if (prop.indexOf('.') === -1) {
        continue;
      }
      delete object[prop];
      punto.set(object, prop, value);
    }
  };

  // Node.js
  if (typeof module === 'object' && module.exports) {
    module.exports = punto;
  }
  // AMD / RequireJS
  else if (typeof define === 'function' && define.amd) { // jshint ignore:line
    define([], function () { // jshint ignore:line
      return punto;
    });
  }
  // included directly via <script> tag
  else {
    root.punto = punto;
  }
}());
