var React = require('react');
var ReactDOM = require('react-dom');

var Drawing = React.createClass({
    getInitialState () {
        return {
            data: [],

            min: 0,
            max: 0,

            minY: 0,
            maxY: 0,

            viewWidth: 600,
            viewHeight: 400,

            // width of bar when vertical, height when horizontal
            barWidth: 90,

            barMin: 40,
            barMax: 350,

            // Margin after each bar
            barMargin: 5,

            limit: 5,

            page: 0
        };
    },
    _getPage () {
        var data = this.state.data;
        var a = this.state.page * this.state.limit;
        var b = a + this.state.limit;
        return data.slice(a, b);
    },
    _drawBars () {
        var obj;
        var barWidth = this.state.barWidth;
        var barHeight; // diff per bar
        var x = (this.state.viewWidth - ((this.state.barWidth + this.state.barMargin) * this.state.limit)) / 2;
        var y = 0;
        var rect;
        var rectB;
        var text;
        var data = this._getPage();
        var thisY;
        for ( var i = 0; i < data.length; i++ ) {

            obj = data[i];
            barHeight = Math.ceil(obj.normalized);
            thisY = this.state.viewHeight - barHeight;
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
                    y: thisY - (this.state.viewHeight - rect.bounds.height)
                }),
                size: new paper.Size(barWidth, this.state.viewHeight - rect.bounds.height),
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
            x += barWidth + this.state.barMargin;
        }
    },
    _drawMinMaxLine (y, content) {
        var path = new paper.Path.Line({
            from: [0,y],
            to: [this.state.viewWidth, y],
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
                width: this.state.viewWidth,
                height: this.state.viewHeight
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
            size: [this.state.viewWidth, this.state.viewHeight],
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
            width: this.state.viewWidth,
            height: this.state.viewHeight
        });
        this._drawMinMaxLine(this.state.minY, this.state.max);
        this._drawMinMaxLine(this.state.maxY, this.state.min);
        this._drawBorder();
    },
    init (setup) {
        if (setup) {
            this.state.canvas = ReactDOM.findDOMNode(this);
        }
        paper.setup(this.state.canvas);
        this.draw();
        paper.view.draw();
    },
    componentDidMount () {
        this.init(true);
    },
    componentWillReceiveProps: function(props) {
        this.setState({
            limit: props.limit,
            page: props.page,
            min: props.min,
            max: props.max,
            minY: props.minY,
            maxY: props.maxY,
            viewWidth: props.viewWidth,
            viewHeight: props.viewHeight,
            barMin: props.barMin,
            barMax: props.barMax,
            data: props.data,
            page: props.page,
            limit: props.limit
        });
    },
    render () {
        this.init();
        return (
            <canvas id="canvas" resize></canvas>
        );
    }
});

var Button = React.createClass({
  handleClick: function(event) {
      if (this.props.callback) this.props.callback();
  },
  render: function() {
    return (
      <button disabled={this.props.disabled} className="btn btn-default" type="button" onClick={this.handleClick}>
        {this.props.text}
      </button>
    );
  }
});

module.exports = React.createClass ({
    getInitialState () {
        return {
            data: [],
            min: 0,
            max: 0,
            minY: 0,
            maxY: 0,
            viewWidth: 600,
            viewHeight: 400,
            barMin: 40,
            barMax: 350,
            page: 0,
            limit: 5,
            totalPages: 0,
            distinctAddresses: false
        };
    },
    back () {
        if (this.state.page > 0)
            this.setState({ page: this.state.page - 1 });
    },
    forward () {
        this.setState({ page: this.state.page + 1 });
    },
    isBackDisabled () {
        return this.state.page == 0;
    },
    isForwardDisabled () {
        var total = this.props.model.index.get('yyyy').size;
        var limit = this.state.limit;
        var page = this.state.page;
        var offset = (limit * page) + limit;
        return total == offset;
    },
    _determineTotalPages () {
        var total = this.props.model.index.get('yyyy').size;
        var limit = this.state.limit;
        var totalPages = Math.ceil(total/limit);
        this.state.totalPages = totalPages;
    },
    distinctAddressesChange () {
        this.setState({
            distinctAddresses: !this.state.distinctAddresses
        });
    },
    /**
     * @description Converts YYYY string to a Array(startDate, endDate)
     * @param year
     * @returns {Array}
     * @private
     */
    _convertYear (year) {
        var a = '01/01/' + year;
        var start = new Date(a);
        var end = new Date(new Date(a).setYear(new Date(a).getFullYear() + 1));
        return [start, end];
    },
    _buildYearTimelineData (model) {
        var index = model.index;
        var years = index.get('yyyy').keys();
        var year;
        var timelineData = [];
        var range;
        var convertedObj;
        var startingTime;
        var endingTime;
        while ( year = years.next().value ) {
            range = this._convertYear(year);
            convertedObj = {
                "label": year,
                "times": [
                    {
                        "starting_time": range[0].getTime(),
                        "ending_time": range[1].getTime()
                    }
                ]
            };
            timelineData.push(convertedObj);
        }
        return timelineData;
    },
    _renderYearTimeline (timelineData) {
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
        var svg = d3.select("#timeline")
            .append("svg")
            .attr("width", 800)
            .datum(timelineData)
            .call(chart);
    },
    componentWillReceiveProps (props) {
        this.map();
        var timelineData = this._buildYearTimelineData(props.model);
        this._renderYearTimeline(timelineData);
    },
    map () {
        var data = [];
        var map = this.props.model.index.get('yyyy');
        var size;
        var min;
        var max;
        for ( var [year,idSet] of map ) {
            size = idSet.size;
            if (typeof min === 'undefined') min = size;
            if (typeof max === 'undefined') max = size;
            if (size > max) max = size;
            if (size < min) min = size;
            data.push({year:year,size:size});
        }
        this.state.min = min;
        this.state.max = max;

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

        var minNormal;
        var maxNormal;
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
                if (typeof minNormal === 'undefined') minNormal = y;
                if (typeof maxNormal === 'undefined') maxNormal = y;
                if (y > maxNormal) maxNormal = y;
                else if (y < minNormal) minNormal = y;
            }
        }

        this.state.minY = this.state.viewHeight - Math.ceil(maxNormal);
        this.state.maxY = this.state.viewHeight - Math.ceil(minNormal);

        // Sort by year
        data = data.sort(function (a,b) {
            a = a.year;
            b = b.year;
            if (a < b) return -1;
            if (a > b ) return 1;
            return 0;
        });

        this.state.data = data;
    },
    render () {
        this._determineTotalPages();
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-8">
                                    <h4>Total vacant buildings per year</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="btn-group" role="group">
                                        <Button disabled={this.isBackDisabled()} callback={this.back} text="Back"/>
                                        <Button disabled={this.isForwardDisabled()} callback={this.forward} text="Forward"/>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <p>Page: {this.state.page + 1}/{this.state.totalPages}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <Drawing
                                        data={this.state.data}
                                        limit={this.state.limit}
                                        page={this.state.page}
                                        min={this.state.min}
                                        max={this.state.max}
                                        minY={this.state.minY}
                                        maxY={this.state.maxY}
                                        viewWidth={this.state.viewWidth}
                                        viewHeight={this.state.viewHeight}
                                        barMin={this.state.barMin}
                                        barMax={this.state.barMax}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h4>Distinct Addresses</h4>
                                    <input
                                        onChange={this.distinctAddressesChange}
                                        type="checkbox"
                                        name="distinct-addresses"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h4>Years Available</h4>
                            <div id="timeline"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
