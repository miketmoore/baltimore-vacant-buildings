var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass ({
    getInitialState () {
        return {

            viewWidth: 800,
            viewHeight: 500,

            // width of bar when vertical, height when horizontal
            barWidth: 50,

            barMin: 90,
            barMax: 400,

            // Margin after each bar
            barMargin: 5
        };
    },
    map () {
        var data = [];
        var map = this.props.model.index.get('yyyy');
        var size;
        var min = 0;
        var max = 0;
        for ( var [year,idSet] of map ) {
            size = idSet.size;
            if (size > max) max = size;
            if (size < min) min = size;
            data.push({year:year,size:size});
        }

        // sort array of objects by obj.size
        data = data.sort(function (a,b) {
            a = a.size;
            b = b.size;
            if (a < b) return -1;
            else if (a > b) return 1;
            return 0;
        });


        // Normalize range
        // Convert range A-B to scale of C-D
        // y = 1 + (x-A)*(10-1)/(B-A)

        if (data.length) {
            var A = data[0].size;
            var B = data[data.length-1].size;
            var C = this.state.barMin;
            var D = this.state.barMax;
            var x;
            var y;
            for ( var i = 0; i < data.length; i++ ) {
                x = data[i].size;
                y = C + (x-A)*(D-C)/(B-A);
                data[i].normalized = y;
            }
        }

        this.state.data = data;
    },
    _drawRect (obj, w, h, x, y) {
        return new paper.Path.Rectangle({
            point: new paper.Point(x,y),
            size: new paper.Size(w,h),
            style: {
                fillColor: 'blue'
            }
        });
    },
    _drawLabel (obj, x, y) {
        return new paper.PointText({
            point: new paper.Point(x, y),
            content: obj.year + ' (' + obj.size + ')',
            justification: 'left',
            fontFamily: 'sans-serif',
            fillColor: 'white'
        });
    },
    _drawBars () {
        var data = this.state.data;
        var obj;
        var h = this.state.barWidth;
        var x = 0;
        var y = 0;
        var rect;
        var text;
        for ( var i = 0; i < data.length; i++ ) {
            obj = data[i];
            rect = this._drawRect(obj, obj.normalized, h, x, y);
            text = this._drawLabel(obj, x, y);
            text.bounds.point = rect.bounds.topLeft;
            y += h + this.state.barMargin;
        }
    },
    // Draw a border around the canvas
    _drawBorder (w, h) {
        var path = new paper.Path.Rectangle({
            point: [0,0],
            size: [w,h],
            style: {
                strokeWidth: 1,
                strokeColor: 'black'
            }
        });
    },
    draw () {
        this._drawBars();
        var viewHeight = (this.state.barWidth + this.state.barMargin) * this.state.data.length;
        paper.project.view.viewSize = new paper.Size({
            width: this.state.viewWidth,
            height: viewHeight
        });
        this._drawBorder(this.state.viewWidth, viewHeight);
    },
    componentDidMount () {
        var canvas = ReactDOM.findDOMNode(this);
        paper.setup(canvas);
        this.map();
        this.draw();
        paper.view.draw();
    },
    render () {
        return (
            <canvas id="canvas" resize></canvas>
        );
    }
});
