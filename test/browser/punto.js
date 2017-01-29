'use strict';

// Pre assign variables for further usage
var assert = assert;
var punto = punto;

// Require modules when running with Node.js
if (typeof require !== 'undefined') {
  assert = require('assert');
  punto = require('../../build/punto');
}

describe('punto', function () {

  // Setup =====================================================================

  var object;

  var loadDefaults = function () {
    object = {
      'first.second': 'dotnotatedvalue',
      normal: {
        property: 'normalvalue'
      }
    };
  };

  // Tests =====================================================================

  beforeEach(function (done) {
    loadDefaults();
    done();
  });

  it('should get a value from an object using a dot notated string', function (done) {
    var v1 = punto.get(object, 'first.second');
    var v2 = punto.get(object, 'normal.property');

    assert.equal(v1, 'dotnotatedvalue');
    assert.equal(v2, 'normalvalue');

    done();
  });
});
