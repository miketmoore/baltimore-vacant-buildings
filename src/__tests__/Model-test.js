var React = require('react');
//var TestUtils = require('react/lib/ReactTestUtils');
//var expect = require('expect');
var should = require('should');

var Model = require('../Model');

var sampleDataColDefs = [
    null,
    { fieldName: ':id' },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    { fieldName: 'buildingaddress'},
    {fieldName: 'noticedate'},
    {fieldName: 'neighborhood'},
    {fieldName: 'policedistrict'},
    {fieldName: 'councildistrict'},
    {fieldName: 'location'}
];

var sampleData = [
    [
        null,
        "67F0BF20-05D7-40D4-89AE-4D323757158D",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "2017 W NORTH AVE",
        '2016-01-14T00:00:00',
        "EASTERWOOD",
        "WESTERN",
        "7",
        [
            null,
            "39.30943944",
            "-76.65044524",
            null,
            false
        ]
    ],
    [
        null,
        "2F623C7A-85E2-42AC-A9CB-C6C241BAD890",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "1041 N FULTON AVE",
        "2016-01-08T00:00:00",
        "SANDTOWN-WINCHESTER",
        "WESTERN",
        "9",
        [
            null,
            "39.30077843",
            "-76.64556524",
            null,
            false
        ]
    ]
];

describe('Model ', function () {
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
    describe('setRaw rejections', function () {
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
    });
    describe('setRaw resolves', function () {
        var valid;
        beforeEach(() => valid = {
            meta: {
                view: {
                    columns: sampleDataColDefs
                }
            },
            data: sampleData
        })
        it('should resolve w/valid raw data', function (done) {
            model.setRaw(valid).then(function () {
                done();
            });
        });
        it('should have working getters', function () {
            model.setRaw(valid).then(function () {
                var rows = model.rows;
                rows.should.be('array');
                rows.length.should.equal(sampleData.length);
                done();
            });
        });
    });
});
