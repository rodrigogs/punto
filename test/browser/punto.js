'use strict';

// Pre assign variables for further usage
var assert = assert;
var Punto = Punto;

// Require modules when running with Node.js
if (typeof require !== 'undefined') {
  assert = require('assert');
  Punto = require('../../build/punto');
}

describe('Punto', function () {

  // Setup =====================================================================

  var object;

  var loadDefaults = function () {
    object = {
      'first.second': 'dotnotatedvalue',
      'a.b': 'c',
      'x,y': 'z',
      normal: {
        property: 'normalvalue'
      }
    };

    Punto.setSymbol('.');
  };

  // Tests =====================================================================

  beforeEach(function (done) {
    loadDefaults();
    done();
  });

  it('should get a value from an object using a dot notated string', function (done) {
    var v1 = Punto.get(object, 'first.second');
    var v2 = Punto.get(object, 'normal.property');
    var v3 = Punto.get(object, 'x,y', ',');

    assert.equal(v1, 'dotnotatedvalue');
    assert.equal(v2, 'normalvalue');
    assert.equal(v3, 'z');

    done();
  });

  it('should set an object property value from a dot notated string', function (done) {
    Punto.set(object, 'first.second', 'myvalue');
    Punto.set(object, 'x,y', 'myvalue', ',');

    assert.equal(object.first.second, 'myvalue');
    assert.equal(object.x.y, 'myvalue');

    done();
  });

  it('should normalize all dot notades properties in an object', function (done) {
    Punto.normalize(object);
    Punto.normalize(object, ',');

    assert.equal(object.first.second, 'dotnotatedvalue');
    assert.equal(object.a.b, 'c');
    assert.equal(object.x.y, 'z');
    assert.equal(object['first.second'], undefined);

    done();
  });

  it('should set default notation symbol', function (done) {
    Punto.setSymbol(',');

    assert.equal(Punto.getSymbol(), ',');

    done();
  });

  it('should get default notation symbol', function (done) {
    var symbol = Punto.getSymbol();

    assert.equal(symbol, '.');

    done();
  });

  it('should create a new Punto instance from the static method', function (done) {
    var instance = Punto.from(object);
    var instance2 = Punto.from(object, ',');

    assert.ok(instance instanceof Punto);
    assert.equal(instance2.getSymbol(), ',');

    done();
  });

  it('should create a new Punto instance', function (done) {
    var instance = new Punto(object);
    var instance2 = new Punto(object, ',');

    assert.ok(instance instanceof Punto);
    assert.equal(instance2.getSymbol(), ',');

    done();
  });

  it('should get instance object', function (done) {
    var instance = new Punto(object);

    assert.equal(instance.getObject(), object);

    done();
  });

  it('should get instance symbol', function (done) {
    var instance = new Punto(object, ',');

    assert.equal(instance.getSymbol(), ',');

    done();
  });

  it('should set instance symbol', function (done) {
    var instance = new Punto(object);
    instance.setSymbol(',');

    assert.equal(instance.getSymbol(), ',');

    done();
  });

  it('should get a property from the instantiated object', function (done) {
    var instance = new Punto(object);

    assert.equal(instance.get('normal.property'), 'normalvalue');

    done();
  });

  it('should set a property from the instantiated object', function (done) {
    var instance = new Punto(object);
    instance.set('normal.property', 'test');

    assert.equal(instance.get('normal.property'), 'test');

    done();
  });

  it('should normalize the instantiated object', function (done) {
    var instance = new Punto(object);
    instance.normalize();

    assert.equal(instance.get('normal.property'), 'normalvalue');

    done();
  });

});
