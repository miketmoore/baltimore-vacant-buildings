var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('chai').expect;

var Model = require('../Model');
var ServerConnect = require('../ServerConnect');

describe('Top ', function() {
    var model;
    var XMLHttpRequest;
    var xhr;
    var requests;
    beforeEach(function () {
        model = new Model();

        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];

        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };

    });
    it('should render', function () {
        ServerConnect.connect({
            model: model,
            XMLHttpRequest: xhr
        });
        expect(requests.length).to.equal(1);
    });
});
