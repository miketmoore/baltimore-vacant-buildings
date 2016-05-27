var React = require('react');
//var TestUtils = require('react/lib/ReactTestUtils');
//var expect = require('expect');
//var should = require('should');
//import {expect} from 'chai';
var expect = require('chai').expect;

var Model = require('../Model');

var sampleDataColDefs = [
    null, {
        fieldName: ':id'
    },
    null,
    null,
    null,
    null,
    null,
    null,
    null,{
        fieldName: 'block'
    },{
        fieldName: 'lot'
    }, {
        fieldName: 'buildingaddress'
    }, {
        fieldName: 'noticedate'
    }, {
        fieldName: 'neighborhood'
    }, {
        fieldName: 'policedistrict'
    }, {
        fieldName: 'councildistrict'
    }, {
        fieldName: 'location'
    }
];

var sampleData = [
    [
        2954,
        "29040AAA-3EE2-4068-8FB6-BB2A913921F7",
        2954,
        1457621734,
        "697390",
        1457949655,
        "697390",
        null,
        "0209 003 012916",
        "0209",
        "003",
        "1707 W BALTIMORE ST",
        "2016-01-29T00:00:00",
        "FRANKLIN SQUARE",
        "WESTERN",
        "9",
        [null, "39.28809997", "-76.64432508", null, false]
    ],
    [
        11737,
        "20DF27E8-7666-457E-A573-B62090C05E6B",
        11737,
        1457621953,
        "697390",
        1457949781,
        "697390",
        null,
        "3205 046 020316",
        "3205",
        "046",
        "2110 HERBERT ST",
        "2016-02-03T00:00:00",
        "MONDAWMIN",
        "WESTERN",
        "7",
        [null, "39.31033313", "-76.65199363", null, false]
    ],
    [
        3070,
        "9FEFF7FE-D255-4683-9714-0783AC07F70E",
        3070,
        1457621737,
        "697390",
        1457949654,
        "697390",
        null,
        "0223 019 052093",
        "0223",
        "019",
        "2037 HOLLINS ST",
        "1993-05-20T00:00:00",
        "BOYD-BOOTH",
        "SOUTHWESTERN",
        "9", [null, "39.2868309", "-76.64959404", null, false]
    ]
];

var validData = {
    meta: {
        view: {
            columns: sampleDataColDefs
        }
    },
    data: sampleData
};

var expectedData = [{
        ':id': "29040AAA-3EE2-4068-8FB6-BB2A913921F7",
        'buildingaddress':"1707 W BALTIMORE ST",
        'noticedate':"2016-01-29", // time trimmed off
        'neighborhood':"FRANKLIN SQUARE",
        'policedistrict':"WESTERN",
        'councildistrict':"9",
        'location':[null, "39.28809997", "-76.64432508", null, false],
        'year':'2016',
        'month':'01',
        'day':'29',
        'block': '0209',
        'lot': '003'
}, {
        ':id':"20DF27E8-7666-457E-A573-B62090C05E6B",
        'buildingaddress':"2110 HERBERT ST",
        'noticedate':"2016-02-03",
        'neighborhood':"MONDAWMIN",
        'policedistrict':"WESTERN",
        'councildistrict':"7",
        'location':[null, "39.31033313", "-76.65199363", null, false],
        'year':'2016',
        'month':'02',
        'day':'03',
        'block': '3205',
        'lot': '046'
}, {
        ':id':"9FEFF7FE-D255-4683-9714-0783AC07F70E",
        'buildingaddress':"2037 HOLLINS ST",
        'noticedate':"1993-05-20",
        'neighborhood':"BOYD-BOOTH",
        'policedistrict':"SOUTHWESTERN",
        'councildistrict':"9",
        'location':[null, "39.2868309", "-76.64959404", null, false],
        'year':'1993',
        'month':'05',
        'day':'20',
        'block': '0223',
        'lot': '019'
}];

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
