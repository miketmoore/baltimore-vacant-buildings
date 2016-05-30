var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('chai').expect;

var Top = require('../Top');

describe('Top ', function() {
    var Model;
    var model;
    var XMLHttpRequest;
    var paper;
    beforeEach(function () {
        Model = function () {
            this.index = new Map();
            this.filter = function () {};
            this.rows = [];
        };
        model = new Model();

        XMLHttpRequest = function () {};
        XMLHttpRequest.prototype.open = function () {};
        XMLHttpRequest.prototype.onload = function () {};
        XMLHttpRequest.prototype.send = function () {};

        paper = function () {};
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
