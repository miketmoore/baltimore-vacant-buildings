var React = require('react');
//var TestUtils = require('react/lib/ReactTestUtils');
//var expect = require('expect');
//var should = require('should');
//import {expect} from 'chai';
var expect = require('chai').expect;

var Model = require('../Model');

describe('Model ', function() {
    var model;
    beforeEach(function() {
        model = new Model();
    });
    it('should be instantiated', function() {
        model.should.be.instanceof(Model);
    });
    it('should have expected public api', function() {
        model.should.have.property('setRaw');
    });
    describe('setRaw rejections', function() {
        it('should reject w/out required args', function(done) {
            model.setRaw().catch(e => done());
        });
        it('should reject w/invalid raw data', function(done) {
            var rejections = 0;
            var total = 4;
            var isDone = function(e) {
                rejections++;
                if (rejections == total) done();
            };
            model.setRaw({}).catch(isDone);
            model.setRaw({
                meta: {}
            }).catch(isDone);
            model.setRaw({
                meta: {
                    view: {}
                }
            }).catch(isDone);
            model.setRaw({
                meta: {
                    view: {
                        columns: []
                    }
                }
            }).catch(isDone);
        });
    });
    describe('setRaw resolves', function() {
        it('should resolve w/valid raw data', function(done) {
            try {
                model.setRaw(validData).then(done);
            } catch (e) {
                done(e);
            }
        });
        it('should map data', function(done) {
            model.setRaw(validData).then(function() {
                try {
                    model.rows.should.eql(expectedData);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should index data', function(done) {
            model.setRaw(validData).then(function() {
                try {
                    model.should.have.property('index');
                    var index = model.index;
                    index.should.be.instanceof(Map);
                    done();
                } catch (e) {
                    done(e)
                }
            });
        });
    });
    describe('debug mode', function(done) {
        var stub = sinon.stub(console, 'log');
        model = new Model(true);
        model.setRaw(validData).then(function() {
            console.log.callCount.should.equal(3);
            sinon.restore();
            done();
        });
    });
    describe('filtering', function (filters) {
        it('should filter by year', function (done) {
            model.setRaw(validData).then(function() {
                try {
                    var filtered = model.filter({
                        year: '2016'
                    });
                    filtered.should.eql([
                        expectedData[0],
                        expectedData[1]
                    ]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should filter by year and month', function (done) {
            model.setRaw(validData).then(function() {
                try {
                    var filtered = model.filter({
                        year: '2016',
                        month: '02'
                    });
                    filtered.should.eql([expectedData[1]]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should filter by councildistrict', function (done) {
            model.setRaw(validData).then(function() {
                try {
                    var filtered = model.filter({
                        councildistrict: '9'
                    });
                    filtered.should.eql([expectedData[0],expectedData[2]]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should filter by year, month, and councildistrict', function (done) {
            model.setRaw(validData).then(function() {
                try {
                    var filtered = model.filter({
                        year: '2016',
                        month: '02',
                        councildistrict: '7'
                    });
                    filtered.should.eql([expectedData[1]]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should filter by passed entries', function (done) {
            model.setRaw(validData).then(function() {
                var entries = [
                    {
                        'year': '2014',
                        'month': '05',
                        'councildistrict': '1'
                    },
                    {
                        'year': '1999',
                        'month': '01',
                        'councildistrict': '2'
                    },
                    {
                        'year': '1993',
                        'month': '05',
                        'councildistrict': '1'
                    }
                ]
                try {
                    model.filter({ year: '2014' }, entries).should.eql([entries[0]]);
                    model.filter({ year: '1999' }, entries).should.eql([entries[1]]);
                    model.filter({ year: '1993' }, entries).should.eql([entries[2]]);
                    model.filter({ councildistrict: '1' }, entries).should.eql([entries[0],entries[2]]);
                    model.filter({}, entries).should.eql(entries);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should filter multiple values for one filter', function (done) {
            model.setRaw(validData).then(function() {
                var entries = [
                    {
                        'year': '2014',
                        'month': '05',
                        'councildistrict': '1'
                    },
                    {
                        'year': '1999',
                        'month': '01',
                        'councildistrict': '2'
                    },
                    {
                        'year': '1993',
                        'month': '05',
                        'councildistrict': '1'
                    }
                ];
                try {
                    model.filter({ year: ['2014','1993'] }, entries).should.eql([entries[0],entries[2]]);
                    model.filter({ year: ['1999'] }, entries).should.eql([entries[1]]);
                    model.filter({
                        year: ['2014','1993'],
                        month: '01'
                    },entries).should.eql([]);
                    model.filter({
                        year: ['2014','1993'],
                        month: '05'
                    },entries).should.eql([entries[0],entries[2]]);
                    model.filter({
                        month: ['05','01'],
                        councildistrict: '1'
                    },entries).should.eql([entries[0],entries[2]]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
