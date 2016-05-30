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
    beforeEach(function () {
        model = new Model();

        XMLHttpRequest = function () {};
        XMLHttpRequest.prototype.open = function () {};
        XMLHttpRequest.prototype.onload = function () {};
        XMLHttpRequest.prototype.send = function () {};

        PaperScope = function () {};
        PaperScope.prototype.setup = function () {};
        paper = {
            PaperScope : PaperScope
        };
    });
    it('should render', function () {
        var component = TestUtils.renderIntoDocument(
            <Top 
                model={model} 
                XMLHttpRequest={XMLHttpRequest}
                paper={paper}
            />
        );
    });
});
