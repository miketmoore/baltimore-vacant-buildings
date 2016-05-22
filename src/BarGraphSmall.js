var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            data: [],
            bgroundcolor: '#000000',
            viewWidth: 230,
            viewHeight: 100,
            barMargin: 4,
            barWidth: 12,
            barMin: 18,
            barMax: 85,
            clickHandler: function () {}
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
        console.log('BarGraphSmall._map');
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

        data = this.props.sort ? data.sort(this.props.sort) : data.sort(this._defaultSort);

        return {
            preparedData: data,
            min: min,
            max: max,
            minNormal: minNormal,
            maxNormal: maxNormal,
            minY: this.props.viewHeight - Math.ceil(maxNormal),
            maxY: this.props.viewHeight - Math.ceil(minNormal)
        };
    },
    _defaultSort (a,b) {
        a = a.label;
        b = b.label;
        if (a < b) return -1;
        if (a > b ) return 1;
        return 0;
    },
    _drawBars (pscope, drawData) {
        console.log('BarGraphSmall._drawBars() ', drawData.preparedData);
        var obj;
        var barWidth = this.props.barWidth;
        var barHeight; // diff per bar
        //var x = (this.props.viewWidth - (this.props.barWidth + this.props.barMargin)) / 2;
        var x = this.props.barMargin;
        var y = 0;
        var rect;
        var text;
        var preparedData = drawData.preparedData;
        var thisY;
        var $canvas = $(this.state.canvas);

        function addMouseHandlers (path, data) {
            path.data = data;
            path.data.isSelected = this.props.selectedLabel == data.label;

            path.on('mousedown', function () {
                this.props.clickHandler(data);
            }.bind(this));

            path.on('mouseenter', function (e) {
                var item = e.target;
                $canvas.css('cursor', 'pointer');
                if (!item.data.isSelected) {
                    // not selected so show slightly darker hue
                    item.fillColor = '#BF6B04';
                }
            }.bind(this));

            path.on('mouseleave', function (e) {
                var item = e.target;
                $canvas.css('cursor', 'auto')
                if (!item.data.isSelected) {
                    // not selected so show default color
                    item.fillColor = '#F29F05';
                }
            }.bind(this));
        }
        for ( var i = 0; i < preparedData.length; i++ ) {

            obj = preparedData[i];
            barHeight = Math.ceil(obj.normalized);
            thisY = this.props.viewHeight - barHeight;
            rect = new pscope.Path.Rectangle({
                point: new pscope.Point({
                    x: x,
                    y: thisY
                }),
                size: new pscope.Size(barWidth, barHeight),
                style: {
                    fillColor: (obj.label == this.props.selectedLabel) ? 'yellow' : '#F29F05'
                }
            });
            addMouseHandlers.call(this, rect, obj);

            text = new pscope.PointText({
                point: new pscope.Point({
                    x: rect.bounds.bottomCenter.x,
                    y: rect.bounds.bottomCenter.y - 2
                }),
                content: obj.label,
                justification: 'center',
                fontSize: 12,
                fontFamily: 'sans-serif',
                fillColor: this.props.fontcolora,
                blendMode: 'multiply'
            });
            addMouseHandlers.call(this, text, obj);
            text = new pscope.PointText({
                point: new pscope.Point({
                    x: rect.bounds.topCenter.x,
                    y: rect.bounds.topCenter.y - 1
                }),
                content: parseInt(obj.size).toLocaleString(),
                justification: 'center',
                fontSize: 12,
                fontFamily: 'sans-serif',
                fillColor: this.props.fontcolorb,
                blendMode: 'multiply'
            });
            addMouseHandlers.call(this, text, obj);
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
    // invoked when receiving new props, NOT on initial render
    componentWillReceiveProps: function(props) {
        //this._map(props.data);
    },
    // Immediately before initial rendering
    // This is run before rendering when switching to the route
    componentWillMount () {
        //this._map(this.props.data);
    },
    _draw () {
        console.log('BarGraphSmall._draw');
        //this.draw();
        var dims = {
            width: this.props.viewWidth,
            height: this.props.viewHeight
        };
        if (this.props.title) {
            var text = new this.props.paper.PointText({
                point: [3,11],
                content: this.props.title,
                style: {
                    fillColor: this.props.titlecolor
                }
            });
            dims.height += 15;
        }
        this.props.paper.project.view.viewSize = new paper.Size(dims);
        console.log('BarGraphSmall_draw actually 2 ', text);
        this.props.paper.project.view.update();
    },
    componentDidUpdate () {
        console.log('BarGraphSmall.componentDidUpdate');
        window.paper = this.props.paper;
        var pscope = this.props.paper;
        // draw background
        new pscope.Path.Rectangle({
            point: [0,0],
            size: [this.props.viewWidth, this.props.viewHeight],
            style: {
                strokeWidth: 0,
                fillColor: this.props.bgroundcolor
            }
        });
        var resp = this._map(this.props.data);
        console.log('BarGraphSmall.componentDidUpdate ', resp);
        this._drawBars(pscope, resp);
        pscope.view.update();
        this._draw();
    },
    componentDidMount () {
        console.log('BarGraphSmall.componentDidMount this.props: ', this.props);
        var canvas = this.refs.canvas;
        this.props.paper.setup(canvas);
        //this._draw();
    },
    render () {
        console.log('BarGraphSmall.render');
        return (
            <canvas ref="canvas" resize></canvas>
        );
    }
});
