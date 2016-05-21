var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect');
var should = require('should');

var Model = require('../Model');

describe('Model', function () {
    var model;
    beforeEach(function () {
        model = new Model();
    })
    it('should be instantiated', function () {
        model.should.be.instanceof(Model);
    });
    it('should have expected public api', function() {
        model.should.have.property('setRaw');
    });
    describe('setRaw', function () {
        it('should fail w/out required args', function (done) {
            model.setRaw().catch(function (err) {
                done();
            });
        });
        it('should fail w/invalid raw data', function (done) {
            var invalid = {};
            model.setRaw(invalid).catch(function (err) {
                done();
            });
        });
    })
  // it('should fail - no raw data passed', function (done) {
  //   var model = new Model();
  //   model.setRaw().catch(function (err) {
  //       err.should.equal('setRaw failed - no raw data passed');
  //       done();
  //   });
  // });
});
