var React = require('react');
var Drawing = require('./Drawing');
var Button = require('./Button');
var Timeline = require('./Timeline');

module.exports = React.createClass ({
    getInitialState () {
        return {
            data: [],
            limit: 5,
            page: 0,
            
            totalPages: 0,
            distinctAddresses: false
        };
    },
    back () {
        if (this.state.page > 0) {
            this.setState({
                page: this.state.page - 1
            });
        }
    },
    forward () {
        this.setState({
            page: this.state.page + 1
        });
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
        return Math.ceil(total/limit);
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
    _init () {
        var data = [];
        var map = this.props.model.index.get('yyyy');
        var size;
        var year;
        var idSet;
        var entries = Array.from(map.entries());
        var entry;
        for ( var i = 0; i < entries.length; i++ ) {
            entry = entries[i];
            year = entry[0];
            idSet = entry[1];
            size = idSet.size;
            data.push({year:year,size:size});
        }
        var timelineData = this._buildYearTimelineData(this.props.model);
        this.setState({
            timelineData: timelineData,
            data: data,
            totalPages: this._determineTotalPages()
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    // Immediately before initial rendering
    // This is run before rendering when switching to the route
    componentWillMount () {
        this._init();
    },
    render () {
        if (!this.state.data.length) return null;
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
                                    <p>Page: {this.state.page+1}/{this.state.totalPages}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <Drawing
                                        data={this.state.data}
                                        limit={this.state.limit}
                                        page={this.state.page}
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
                            <Timeline data={this.state.timelineData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
