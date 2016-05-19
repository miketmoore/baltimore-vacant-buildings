var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var YearSelect = require('./YearSelect');
var Timeline = require('./Timeline');
import ReactDataGrid from 'react-data-grid/addons';

module.exports = React.createClass({
    getDefaultProps () {
        return {
            gridColumns: [
                {"key":"buildingaddress","name":"Address","resizable":true},
                {"key":"noticedate","name":"Notice Date","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"policedistrict","name":"Police District","resizable":true},
                {"key":"councildistrict","name":"Council District","resizable":true}
            ]
        };
    },
    getInitialState() {
        return {
            years: [],
            currentYear: '',
            currentEntries: [],
            timelineData: []
        };
    },
    _getCurrentEntriesFromIds (entryIds) {
        var entries = [];
        var id;
        var entry;
        var map = this.props.model.index.get(':id');
        for ( var i = 0; i < entryIds.length; i++ ) {
            id = entryIds[i];
            entry = map.get(id);
            entries.push(entry);
        }
        return entries;
    },
    changeHandler (newCurrentYear) {
        var byYear = this.props.model.index.get('yyyy');
        var ids = Array.from(byYear.get(newCurrentYear).values());
        var entries = this._getCurrentEntriesFromIds(ids);
        this.setState({
            currentYear: newCurrentYear,
            currentEntries: entries
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
    _buildYearTimelineData (years) {
        var year;
        var timelineData = [];
        var range;
        var convertedObj;
        var startingTime;
        var endingTime;
        for ( var i = 0; i < years.length; i++ ) {
            year = years[i];
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
        console.log('_buildYearTimelineData() ', timelineData);
        return timelineData;
    },
    componentWillReceiveProps (props) {
        var byYear = props.model.index.get('yyyy');
        var years = Array.from(byYear.keys()).sort();
        var currentYear = years[years.length-1];
        var ids = Array.from(byYear.get(currentYear).values());
        var entries = this._getCurrentEntriesFromIds(ids);
        var timelineData = this._buildYearTimelineData(years);
        this.setState({
            years: years,
            currentYear: currentYear,
            currentEntries: entries,
            timelineData: timelineData
        });
    },
    gridRowGetter (i) {
        var row = this.state.currentEntries[i];
        return {
            "buildingaddress":row['buildingaddress'],
            "noticedate":row['noticedate'],
            "neighborhood":row["neighborhood"],
            'policedistrict':row['policedistrict'],
            'councildistrict':row['councildistrict']
        };
    },
    render () {
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-8">
                        <MapView width="700px" year={this.state.currentYear} model={this.props.model} />
                    </div>
                    <div className="col-md-4">
                        <h4>Current Year</h4>
                        <YearSelect currentYear={this.state.currentYear} changeHandler={this.changeHandler} years={this.state.years} />
                        <h4>Total Entries</h4>
                        <p>{this.state.currentEntries.length}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Years Available <small>Click to change dataset</small></h4>
                        <Timeline cb={this.changeHandler} data={this.state.timelineData} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ReactDataGrid
                            columns={this.props.gridColumns}
                            rowGetter={this.gridRowGetter}
                            rowsCount={this.state.currentEntries.length}
                            minHeight={500} />
                    </div>
                </div>
            </Layout>
        )
    }
})
