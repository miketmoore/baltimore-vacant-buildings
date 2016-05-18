var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: [],
            viewWidth: 600,
            viewHeight: 400,
            barMargin: 5,
            barWidth: 90,
            barMin: 40,
            barMax: 350
        };
    },
    getInitialState () {
        return {
            preparedData: [],
            min: 0,
            max: 0,
            minY: 0,
            maxY: 0,
            limit: 5,
            page: 0,
            minNormal: 0,
            maxNormal: 0
        };
    },
    _map () {
        var data = this.props.data;

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
                y = C + (x-A)*(D-C)/(B-A);
                data[i].normalized = y;
                if (typeof minNormal === 'undefined') minNormal = y;
                if (typeof maxNormal === 'undefined') maxNormal = y;
                if (y > maxNormal) maxNormal = y;
                else if (y < minNormal) minNormal = y;
            }
        }

        // Sort by year
        data = data.sort(function (a,b) {
            a = a.year;
            b = b.year;
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
    _getPage () {
        var data = this.state.preparedData;
        var page = this.props.page;
        var limit = this.props.limit;
        var a = page * limit;
        var b = a + limit;
        return data.slice(a, b);
    },
    _drawBars () {
        var obj;
        var barWidth = this.props.barWidth;
        var barHeight; // diff per bar
        var x = (this.props.viewWidth - ((this.props.barWidth + this.props.barMargin) * this.state.limit)) / 2;
        var y = 0;
        var rect;
        var rectB;
        var text;
        var data = this._getPage();
        var thisY;
        for ( var i = 0; i < data.length; i++ ) {

            obj = data[i];
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
            rectB = new paper.Path.Rectangle({
                point: new paper.Point({
                    x: x,
                    y: thisY - (this.props.viewHeight - rect.bounds.height)
                }),
                size: new paper.Size(barWidth, this.props.viewHeight - rect.bounds.height),
                style: {
                    fillColor: '#F29F05'
                },
                blendMode: 'multiply'
            });
            text = new paper.PointText({
                point: new paper.Point({
                    x: rect.bounds.bottomCenter.x,
                    y: rect.bounds.bottomCenter.y
                }),
                content: obj.year,
                justification: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                fillColor: '#731007',
                blendMode: 'multiply'
            });
            text = new paper.PointText({
                point: new paper.Point({
                    x: rect.bounds.topCenter.x,
                    y: rect.bounds.topCenter.y
                }),
                content: parseInt(obj.size).toLocaleString(),
                justification: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                fillColor: '#F29F05'
            });
            x += barWidth + this.props.barMargin;
        }
    },
    _drawMinMaxLine (y, content) {
        var path = new paper.Path.Line({
            from: [0,y],
            to: [this.props.viewWidth, y],
            style: {
                strokeWidth: 1,
                strokeColor: '#F29F05'
            }
        });
        var text = new paper.PointText({
            point: new paper.Point({
                x: path.bounds.topLeft.x + 5,
                y: path.bounds.topLeft.y - 2
            }),
            content: parseInt(content).toLocaleString(),
            justification: 'left',
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fillColor: '#F29F05'
        });
    },
    // Draw a border around the canvas
    _drawBorder () {
        var path = new paper.Path.Rectangle({
            point: [0,0],
            size: new paper.Size({
                width: this.props.viewWidth,
                height: this.props.viewHeight
            }),
            style: {
                strokeWidth: 1,
                strokeColor: '#400101'
            }
        });
    },
    _drawBackground () {
        new paper.Path.Rectangle({
            point: [0,0],
            size: [this.props.viewWidth, this.props.viewHeight],
            style: {
                strokeWidth: 0,
                fillColor: '#BF6B04'
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
        this._drawMinMaxLine(this.state.minY, this.state.max);
        this._drawMinMaxLine(this.state.maxY, this.state.min);
        this._drawBorder();
    },
    _init () {
        this.draw();
        paper.view.draw();
    },
    // invoked when receiving new props, NOT on initial render
    componentWillReceiveProps: function(props) {
        this.setState({
            data: props.data,
            page: props.page,
            limit: props.limit
        });
        //this._map();
        this._init();
    },
    // Immediately before initial rendering
    // This is run before rendering when switching to the route
    componentWillMount () {
        this._map();
    },
    componentDidUpdate () {
        var canvas = document.getElementById('canvas');
        paper.setup(canvas);
        this._init();
    },
    // after initial rendering
    componentDidMount () {
        var canvas = document.getElementById('canvas');
        paper.setup(canvas);
        this._init();
    },
    render () {
        if (this.state.preparedData.length) {
            return (
                <canvas id="canvas" resize></canvas>
            );
        } else {
            return null;
        }

    }
});