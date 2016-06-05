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
    beforeEach(function () {
        model = new Model();

        PaperScope = function () {};
        PaperScope.prototype.setup = function () {};
        paper = {
            PaperScope : PaperScope
        };
    
        XMLHttpRequest = sinon.useFakeXMLHttpRequest();
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
