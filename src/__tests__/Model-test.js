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

var expectedData = [
    {
        ':id': "67F0BF20-05D7-40D4-89AE-4D323757158D",
        'buildingaddress':"2017 W NORTH AVE",
        'noticedate':'2016-01-14T00:00:00',
        'neighborhood':'EASTERWOOD',
        'policedistrict':'WESTERN',
        'councildistrict':'7',
        'location':[
            null,
            "39.30943944",
            "-76.65044524",
            null,
            false
        ],
        'year': '2016',
        'month': '01',
        'yearMonth': '2016-01',
        'yearMonthDay': '2016-01-14'
    },
    {
        ':id':"2F623C7A-85E2-42AC-A9CB-C6C241BAD890",
        'buildingaddress':"1041 N FULTON AVE",
        'noticedate':"2016-01-08T00:00:00",
        'neighborhood':"SANDTOWN-WINCHESTER",
        'policedistrict':"WESTERN",
        'councildistrict':"9",
        'location':[
            null,
            "39.30077843",
            "-76.64556524",
            null,
            false
        ],
        'year':'2016',
        'month':'01',
        'yearMonth':'2016-01',
        'yearMonthDay':'2016-01-08'
    }
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
                model.rows.should.eql(expectedData);
                done();
            });
        });
    });
});
