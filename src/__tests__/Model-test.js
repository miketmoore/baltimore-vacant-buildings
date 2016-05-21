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
        it('should reject w/out required args', function (done) {
            model.setRaw().catch(e => done());
        });
        it('should reject w/invalid raw data', function (done) {
            var rejections = 0;
            var total = 4;
            var isDone = function (e) {
                rejections++;
                if (rejections == total) done();
            };
            model.setRaw({}).catch(isDone);
            model.setRaw({ meta: {} }).catch(isDone);
            model.setRaw({ meta: { view: {} } }).catch(isDone);
            model.setRaw({ meta: { view: { columns: [] } } }).catch(isDone);
        });
        // it('should resolve w/valid raw data', function (done) {
        //     var valid = {
        //         meta: {
        //             view: {
        //                 columns: [{
        //                     fieldName: ':id'
        //                 }]
        //             }
        //         },
        //         data: [
        //
        //         ]
        //     };
        //     model.setRaw(valid).then(function () {
        //         done();
        //     });
        // });
    })
  // it('should reject - no raw data passed', function (done) {
  //   var model = new Model();
  //   model.setRaw().catch(function (err) {
  //       err.should.equal('setRaw failed - no raw data passed');
  //       done();
  //   });
  // });
});
