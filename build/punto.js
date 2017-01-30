/**
 * punto.js - Bidirectional dot notation conversion.
 * @author  <>
 * @version v1.1.0
 * @link https://github.com/punto
 * @license BSD-2-Clause
 */
/**
 * @module Punto
 */
(function () {
  'use strict';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self || // jshint ignore:line
    typeof global === 'object' && global.global === global && global || // jshint ignore:line
    this;

  function isObject(value) {
    var type = typeof value;
    return value !== null && type === 'object';
  }

  /**
   * Creates a new Punto instance.
   *
   * @memberof module:Punto
   * @param {Object} [object] Object that will be set in the instance. All operations will occur against it.
   * @param {String} [symbol] Overrides the default notation symbol.
   * @constructor
   */
  var Punto = function (object, symbol) {
    this.object = object || this.object;
    this.symbol = symbol || this.symbol;
  };

  /**
   * Default notation symbol.
   *
   * @memberof module:Punto
   * @type {String}
   */
  Punto.symbol = '.';

  /**
   * Sets Punto's default notation symbol.
   *
   * @memberof module:Punto
   * @param {String} symbol Overrides the default notation symbol.
   */
  Punto.setSymbol = function (symbol) {
    Punto.symbol = symbol;
  };

  /**
   * Gets Punto's default notation symbol.
   *
   * @memberof module:Punto
   * @return {String} Notation symbol.
   */
  Punto.getSymbol = function () {
    return Punto.symbol;
  };

  /**
   * Creates a new Punto instance.
   *
   * @memberof module:Punto
   * @param {Object} object Object that will be set in the instance. All operations will occur against it.
   * @param {String} [symbol] Overrides the default notation symbol.
   * @return {Punto} Punto instance
   */
  Punto.from = function (object, symbol) {
    return new Punto(object, symbol);
  };

  /**
   * Gets an object property value from a dot notated property path.
   *
   * @memberof module:Punto
   * @param {Object} object Object to get a property.
   * @param {String} property Property dot notated path. It may include nested objects in the path.
   * @param {String} [symbol] Overrides the default notation symbol.
   * @return {*} Object property value.
   */
  Punto.get = function (object, property, symbol) {
    symbol = symbol || Punto.symbol;
    if (!object) {
      return null;
    }
    if (typeof property !== 'string') {
      return object[property];
    }
    if (object.hasOwnProperty(property)) {
      return object[property];
    }

    var propChain = property.split(symbol);
    var currentObjProp = object;
    var result;

    var last = false;
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

  /**
   * Sets an object property value from a dot notated property path.
   *
   * @memberof module:Punto
   * @param {Object} object Object to have a property set.
   * @param {String} property Property dot notated path. It may include nested objects in the path.
   * @param {String} [symbol] Overrides the default notation symbol.
   * @param {*} value Value to be set in the property.
   */
  Punto.set = function (object, property, value, symbol) {
    symbol = symbol || Punto.symbol;
    if (!object) {
      return;
    }

    var propChain = (property || '').split(symbol);
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

  /**
   * Normalizes any dot notated property in the object.
   * The dot notated property will be removed and replaced by its conversion.
   *
   * @memberof module:Punto
   * @param {Object} object Object to be normalized.
   * @param {String} [symbol] Overrides the default notation symbol.
   */
  Punto.normalize = function (object, symbol) {
    symbol = symbol || Punto.symbol;
    var props = Object.getOwnPropertyNames(object);
    for (var i = 0, len = props.length; i < len; i++) {
      var prop = props[i];
      var value = object[prop];
      if (prop.indexOf(symbol) === -1) {
        continue;
      }
      delete object[prop];
      Punto.set(object, prop, value, symbol);
    }
  };

  /**
   * @type {String}
   * @default .
   * @protected
   */
  Punto.prototype.symbol = '.';

  /**
   * @type {Object}
   * @default null
   * @protected
   */
  Punto.prototype.object = null;

  /**
   * Gets instance object.
   *
   * @return {Object} Instance object.
   */
  Punto.prototype.getObject = function () {
    return this.object;
  };

  /**
   * Sets instance notation symbol.
   *
   * @param {String} symbol Overrides instance default notation symbol.
   */
  Punto.prototype.setSymbol = function (symbol) {
    this.symbol = symbol;
  };

  /**
   * Gets instance notation symbol.
   *
   * @return {String} Notation symbol.
   */
  Punto.prototype.getSymbol = function () {
    return this.symbol;
  };

  /**
   * Gets an object property value from a dot notated property path.
   *
   * @param {String} property Property dot notated path. It may include nested objects in the path.
   * @return {*} Object property value.
   */
  Punto.prototype.get = function (property) {
    return Punto.get(this.object, property, this.symbol);
  };

  /**
   * Sets an object property value from a dot notated property path.
   *
   * @param {String} property Property dot notated path. It may include nested objects in the path.
   * @param {*} value Value to be set in the property.
   */
  Punto.prototype.set = function (property, value) {
    Punto.set(this.object, property, value, this.symbol);
  };

  /**
   * Normalizes any dot notated property in the object.
   * The dot notated property will be removed and replaced by its conversion.
   *
   */
  Punto.prototype.normalize = function () {
    Punto.normalize(this.object, this.symbol);
  };

  // Node.js
  if (typeof module === 'object' && module.exports) {
    module.exports = Punto;
  }
  // AMD / RequireJS
  else if (typeof define === 'function' && define.amd) { // jshint ignore:line
    define([], function () { // jshint ignore:line
      return Punto;
    });
  }
  // included directly via <script> tag
  else {
    root.Punto = Punto;
  }
}());
