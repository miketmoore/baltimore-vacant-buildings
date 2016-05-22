var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: [],
            viewWidth: 800,
            viewHeight: 600,
            bgroundcolor: '#cccccc'
        };
    },
    _drawBackground (pscope) {
        new pscope.Path.Rectangle({
            point: [0,0],
            size: [this.props.viewWidth, this.props.viewHeight],
            style: {
                strokeWidth: 0,
                fillColor: this.props.bgroundcolor
            }
        });
    },
    _draw (canvas) {
        window.paper = this.props.paper;
        var pscope = this.props.paper;
        if (canvas) pscope.setup(canvas);
        this._drawBackground(pscope);
        pscope.view.update();
        var dims = {
            width: this.props.viewWidth,
            height: this.props.viewHeight
        };
        pscope.view.viewSize = new paper.Size(dims);

        // determine center point
        var center = new pscope.Point(dims.height/2, dims.width/2);

        // draw center latitude
        var equator = new pscope.Path.Line({
            from: new pscope.Point(dims.width/2,0),
            to: new pscope.Point(dims.width/2,dims.height),
            strokeWidth: 1,
            strokeColor: 'black'
        });

        // draw center longitude
        var primeMeridian = new pscope.Path.Line({
            from: new pscope.Point(0, dims.height/2),
            to: new pscope.Point(dims.width,dims.height/2),
            strokeWidth: 1,
            strokeColor: 'black'
        });

        pscope.view.update();
    },
    componentDidUpdate () {
        this._draw();
    },
    componentDidMount () {
        var canvas = this.refs.canvas;
        this._draw(canvas);
    },
    render () {
        return (
            <canvas ref="canvas" resize></canvas>
        );
    }
});
