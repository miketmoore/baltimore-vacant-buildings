var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: []
        };
    },
    componentWillReceiveProps (props) {
        console.log('Timeline.componentWillReceiveProps() props: ', props);
    },
    _init () {
        var el = $(ReactDOM.findDOMNode(this));
        var data = this.props.data;
        var colorScale = d3.scale.ordinal().range(['#F29F05']);
        var margin = 10;
        var chart = d3
            .timeline()
            .colors(colorScale)
            .showBorderLine()
            .mouseover((d, i, datum) => {
                document.body.style.cursor = "pointer";
            })
            .mouseout(() => {
                document.body.style.cursor = "default";
            })
            .click(function (d, i, datum) {
                this.props.cb(datum.label);
                // d is the current rendering object
                // i is the index during d3 rendering
                // datum is the data object
            }.bind(this))
            .showBorderFormat({marginTop: 5, marginBottom: 20, width: 1, color: '#000'})
            .margin({left: margin, right: margin, top: margin, bottom: margin})
            .tickFormat({
                format: d3.time.format("%y"),
                tickTime: d3.time.years,
                tickInterval: 1,
                tickSize: 1
            });
        d3.select('#timeline').html('');
        var svg = d3.select("#timeline")
            .append("svg")
            .attr("width", 800)
            .datum(data)
            .call(chart);
    },
    componentDidUpdate () {
        console.log('Timeline.componentDidUpdate()');
        this._init();
    },
    componentDidMount () {
        console.log('Timeline.componentDidMount() this.props: ', this.props);
        this._init();
    },
    render () {
        return (
            <div id="timeline"></div>
        );
    }
})