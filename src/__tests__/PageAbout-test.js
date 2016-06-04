var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var PageAbout = require('../PageAbout');

describe('Top ', function() {
    it('should render', function () {
        var component = TestUtils.renderIntoDocument(
            <PageAbout />
        );
    });
});
