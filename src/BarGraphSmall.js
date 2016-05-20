var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: [],
            bgroundcolor: '#000000',
            viewWidth: 300,
            viewHeight: 100,
            barMargin: 5,
            barWidth: 16,
            barMin: 18,
            barMax: 85
        };
    },
    getInitialState () {
        return {
            preparedData: [],
            min: 0,
            max: 0,
            minY: 0,
            maxY: 0,
            minNormal: 0,
            maxNormal: 0
        };
    },
    _map (data) {

        // sort array of objects by obj.size
        data = data.sort(function (a,b) {
            a = a.size;
            b = b.size;
            if (a < b) return -1;
            else if (a > b) return 1;
            return 0;
        });

        // determine min and max
        var obj, size, min, max;
        for ( var i = 0; i < data.length; i++ ) {
            obj = data[i];
            size = obj.size;
            if (typeof min === 'undefined') min = size;
            if (typeof max === 'undefined') max = size;
            if (size < min) min = size;
            if (size > max) max = size;
        }

        // Normalize range
        // Convert range A-B to scale of C-D
        // y = 1 + (x-A)*(10-1)/(B-A)

        var minNormal;
        var maxNormal;
        if (data.length) {

            var A = data[0].size;
            var B = data[data.length-1].size;
            var C = this.props.barMin;
            var D = this.props.barMax;
            var x;
            var y;
            for ( var i = 0; i < data.length; i++ ) {
                x = data[i].size;
                if (x == 0) {
                    data[i].normalized = C;
                } else {
                    y = C + (x-A)*(D-C)/(B-A);
                    data[i].normalized = y;
                    if (typeof minNormal === 'undefined') minNormal = y;
                    if (typeof maxNormal === 'undefined') maxNormal = y;
                    if (y > maxNormal) maxNormal = y;
                    else if (y < minNormal) minNormal = y;
                }

            }
        }

        // Sort by year
        data = data.sort(function (a,b) {
            a = parseInt(a.label);
            b = parseInt(b.label);
            if (a < b) return -1;
            if (a > b ) return 1;
            return 0;
        });

        this.setState({
            preparedData: data,
            min: min,
            max: max,
            minNormal: minNormal,
            maxNormal: maxNormal,
            minY: this.props.viewHeight - Math.ceil(maxNormal),
            maxY: this.props.viewHeight - Math.ceil(minNormal)
        });
    },
    _drawBars () {
        var obj;
        var barWidth = this.props.barWidth;
        var barHeight; // diff per bar
        //var x = (this.props.viewWidth - (this.props.barWidth + this.props.barMargin)) / 2;
        var x = this.props.barMargin;
        var y = 0;
        var rect;
        var text;
        var preparedData = this.state.preparedData;
        var thisY;
        for ( var i = 0; i < preparedData.length; i++ ) {

            obj = preparedData[i];
            barHeight = Math.ceil(obj.normalized);
            thisY = this.props.viewHeight - barHeight;
            rect = new paper.Path.Rectangle({
                point: new paper.Point({
                    x: x,
                    y: thisY
                }),
                size: new paper.Size(barWidth, barHeight),
                style: {
                    fillColor: '#F29F05'
                }
            });
            rect.on('mouseenter', function () {
                this.fillColor = '#F2AF5C';
            });
            rect.on('mouseleave', function () {
                this.fillColor = '#F29F05';
            });
            text = new paper.PointText({
                point: new paper.Point({
                    x: rect.bounds.bottomCenter.x,
                    y: rect.bounds.bottomCenter.y - 2
                }),
                content: obj.label,
                justification: 'center',
                fontSize: 14,
                fontFamily: 'sans-serif',
                fillColor: this.props.fontcolora,
                blendMode: 'multiply'
            });
            text = new paper.PointText({
                point: new paper.Point({
                    x: rect.bounds.topCenter.x,
                    y: rect.bounds.topCenter.y - 1
                }),
                content: parseInt(obj.size).toLocaleString(),
                justification: 'center',
                fontSize: 14,
                fontFamily: 'sans-serif',
                fillColor: this.props.fontcolorb,
                blendMode: 'multiply'
            });
            x += barWidth + this.props.barMargin;
        }
    },
    _drawBackground () {
        new paper.Path.Rectangle({
            point: [0,0],
            size: [this.props.viewWidth, this.props.viewHeight],
            style: {
                strokeWidth: 0,
                fillColor: this.props.bgroundcolor
            }
        });
    },
    draw () {
        this._drawBackground();
        this._drawBars();
        paper.project.view.viewSize = new paper.Size({
            width: this.props.viewWidth,
            height: this.props.viewHeight
        });
    },
    _init () {
        this.draw();
        paper.view.draw();
        paper.view.update();
    },
    // invoked when receiving new props, NOT on initial render
    componentWillReceiveProps: function(props) {
        this._map(props.data);
        this._init();
    },
    // Immediately before initial rendering
    // This is run before rendering when switching to the route
    componentWillMount () {
        this._map(this.props.data);
    },
    componentDidUpdate () {
        this._init();
    },
    componentDidMount () {
        var canvas = document.getElementById('canvas');
        paper.setup(canvas);
        this._init();
    },
    render () {
        return (
            <canvas id="canvas" resize></canvas>
        );
    }
});