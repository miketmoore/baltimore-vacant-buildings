var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var expect = require('chai').expect;

var Top = require('../Top');
var Model = require('../Model');
var ServerConnect = require('../ServerConnect');

describe('Top ', function() {
    var model;
    var XMLHttpRequest;
    var paper;
    var PaperScope;
    var server;
    beforeEach(function () {
        model = new Model();

        server = sinon.fakeServer.create();

        PaperScope = function () {};
        PaperScope.prototype.setup = function () {};
        paper = {
            PaperScope : PaperScope
        };

    });
    it('should render', function () {
        sinon.stub(ServerConnect, 'connect', function () {
            this.props.model.setRaw(validData);
            this.setState({
                columns: this.props.model.columns
            });
        });
        var component = TestUtils.renderIntoDocument(
            <Top 
                model={model} 
                XMLHttpRequest={XMLHttpRequest}
                paper={paper}
            />
        );
    });
});
