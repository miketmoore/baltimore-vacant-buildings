var React = require('react');
var ReactDOM = require('react-dom');
var geolib = require('geolib');

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

        var ranges = this._determineRange();
        console.log('ranges: ', ranges);
        console.log(ranges.latRange);
        console.log(ranges.lngRange);
        //console.log(ranges.latRange[0] * 10);
        this._drawDots(pscope);

        pscope.view.update();
    },
    _determineRange () {
        var data = this.props.data.slice(0,5);
        var entry;
        var lat, lng, latMin, latMax, lngMin, lngMax;
        for ( var i = 0, len = data.length; i < len; i++ ) {
            entry = data[i];
            lat = entry.latitude;
            lng = entry.longitude;
            console.log(lat,lng);
            if (typeof latMin === 'undefined') latMin = lat;
            if (typeof latMax === 'undefined') latMax = lat;
            if (typeof lngMin === 'undefined') lngMin = lng;
            if (typeof lngMax === 'undefined') lngMax = lng;
            if (lat < latMin) latMin = lat;
            if (lat > latMax) latMax = lat;
            if (lng < lngMin) lngMin = lng;
            if (lng > lngMax) lngMax = lng;
        }
        return {
            latRange: [latMin,latMax],
            lngRange: [lngMin,lngMax]
        };
    },
    _drawDots (pscope) {
        var data = this.props.data.slice(0,10);
        var obj;
        var point;
        var lat;
        var lng;
        var latC;
        var lngC;
        for ( var i = 0, len = data.length; i < len; i++ ) {
            obj = data[i];
            lat = obj.latitude;
            lng = obj.longitude;
            console.log(lat, lng);
            //point = new pscope.Point(Math.ceil(obj.latitude)*.10,-Math.ceil(obj.longitude)*.10);
            //console.log(lat, lng);
            point = new pscope.Point({
                x: lat,
                y: lng
            });
            new pscope.Path.Rectangle({
                point: point,
                size: new pscope.Size(4,4),
                fillColor: 'black',
                selected: true
            });
        }
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
