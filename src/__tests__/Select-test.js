var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils'); //I like using the Test Utils, but you can just use the DOM API instead.
var expect = require('expect');

var Select = require('../Select');


//var Root = require('../root'); //my root-test lives in components/__tests__/, so this is how I require in my components.

describe('Select', function () {
  it('renders without problems', function () {
    var a = TestUtils.renderIntoDocument(<Select/>);
    expect(a).toExist();
  });
});
