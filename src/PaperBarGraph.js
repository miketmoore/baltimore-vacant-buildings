var React = require('react');
var ReactDOM = require('react-dom');

var Drawing = React.createClass({
    getInitialState () {
        return {

            viewWidth: 800,
            viewHeight: 500,

            // width of bar when vertical, height when horizontal
            barWidth: 125,

            barMin: 90,
            barMax: 400,

            // Margin after each bar
            barMargin: 5,

            limit: 5,

            page: 0
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
        var x = 0;
        var y = 40;
        var rect;
        var text;
        var data = this._getPage();
        for ( var i = 0; i < data.length; i++ ) {

            obj = data[i];
            barHeight = Math.ceil(obj.normalized);
            //console.log('Paper/BarGraph._drawBars() i, x, obj.normalized: ', i, x, barHeight);
            rect = new paper.Path.Rectangle({
                point: new paper.Point(x,y),
                size: new paper.Size(barWidth, barHeight),
                style: {
                    fillColor: '#F29F05'
                }
            });
            text = new paper.PointText({
                point: new paper.Point(x, y + 20),
                content: obj.year + '\n' + obj.size + '',
                justification: 'left',
                fontSize: 24,
                fontFamily: 'sans-serif',
                fillColor: '#731007'
            });
            x += barWidth + this.state.barMargin;
        }
    },
    _drawBarsOld () {
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
        this._drawBorder();
    },
    init (setup) {
        if (setup) {
            this.state.canvas = ReactDOM.findDOMNode(this);
        }
        paper.setup(this.state.canvas);
        this.map();
        this.draw();
        paper.view.draw();
    },
    componentDidMount () {
        this.init(true);
    },
    componentWillReceiveProps: function(props) {
      this.setState({
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
      <button disabled={this.props.disabled} className="btn btn-default" type="submit" onClick={this.handleClick}>
        {this.props.text}
      </button>
    );
  }
});

module.exports = React.createClass ({
    getInitialState () {
        return {
            page: 0,
            limit: 5,
            totalPages: 0
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
    render () {
        this._determineTotalPages();
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <Button disabled={this.isBackDisabled()} callback={this.back} text="Back"/>
                        <p>Page: {this.state.page + 1}/{this.state.totalPages}</p>
                        <Button disabled={this.isForwardDisabled()} callback={this.forward} text="Forward"/>
                    </div>
                    <div className="row">
                        <Drawing limit={this.state.limit} page={this.state.page} model={this.props.model} />
                    </div>
                </div>
            </div>
        );
    }
});
