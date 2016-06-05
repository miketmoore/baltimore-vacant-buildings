var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('chai').expect;

var Top = require('../Top');
var Model = require('../Model');

describe('Top ', function() {
    var model;
    var XMLHttpRequest;
    var paper;
    var PaperScope;
    var XMLHttpRequest;
    var server;
    var requests = [];
    beforeEach(function () {
        model = new Model();

        PaperScope = function () {};
        PaperScope.prototype.setup = function () {};
        paper = {
            PaperScope : PaperScope
        };
   
        server = sinon.fakeServer.create();
        XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });
    it('should render', function () {
        var src = '/public/data/baltimore-vacant-buildings.json';
        var fakeBodyStr = JSON.stringify({
            "meta": {
                "view": {
                    "columns": []
                }
            },
            "data": []
        });
        server.respondWith('GET', src, [200, { "Content-Type": "application/json" }, fakeBodyStr]);
        var component = TestUtils.renderIntoDocument(
            <Top 
                model={model} 
                XMLHttpRequest={XMLHttpRequest}
                paper={paper}
            />
        );
        expect(requests.length).to.equal(1);
        var req = requests[0];
        console.error(Object.keys(req));
        console.error(req.status);
        // expect(server.requests.length).to.equal(1);
        // expect(requests[0].onload).not.toHaveBeenCalled();
        // server.respond();
        // expect(requests[0].onload).toHaveBeenCalled();
    });
});
