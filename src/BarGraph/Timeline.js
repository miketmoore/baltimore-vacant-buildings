var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: []
        };
    },
    componentDidMount () {
        var el = $(ReactDOM.findDOMNode(this));
        var data = this.props.data;
        var colorScale = d3.scale.ordinal().range(['#F29F05']);
        var margin = 1;
        var chart = d3
            .timeline()
            .colors(colorScale)
            .showBorderLine()
            .showBorderFormat({marginTop: 1, marginBottom: 23, width: 1, color: '#ffffff'})
            .margin({left: margin, right: margin, top: margin, bottom: margin})
            .tickFormat({
                format: d3.time.format("%y"),
                tickTime: d3.time.years,
                tickInterval: 1,
                tickSize: 6
            });
        d3.select('#timeline').html('');
        var svg = d3.select("#timeline")
            .append("svg")
            .attr("width", 800)
            .datum(data)
            .call(chart);
    },
    render () {
        return (
            <div id="timeline"></div>
        );
    }
})