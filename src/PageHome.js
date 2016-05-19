var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var Select = require('./Select');
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
            months: ['01','02','03','04','05','06','07','08','09','10','11','12'],
            currentMonth: '',
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
    _getNewIds (y, m) {
        var byDate = this.props.model.index.get('yyyy-mm');
        var key = y + '-' + m;
        console.log('PageHome._getNewIds() key: ', key);
        if (!byDate.has(key)) return [];
        var idSet = byDate.get(key);
        return Array.from(idSet.values());
    },
    yearSelectChangeHandler (newCurrentYear) {
        var ids = this._getNewIds(newCurrentYear, this.state.currentMonth);
        var entries = this._getCurrentEntriesFromIds(ids);
        this.setState({
            currentYear: newCurrentYear,
            currentEntries: entries
        });
    },
    monthSelectChangeHandler (newCurrentMonth) {
        console.log('PageHome.monthSelectChangeHandler()', newCurrentMonth);
        var ids = this._getNewIds(this.state.currentYear, newCurrentMonth);
        var entries = this._getCurrentEntriesFromIds(ids);
        this.setState({
            currentMonth: newCurrentMonth,
            currentEntries: entries
        })
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
        return timelineData;
    },
    _init () {
        var byYear = this.props.model.index.get('yyyy');
        var years = Array.from(byYear.keys()).sort();
        var currentYear = years[0];
        var currentMonth = '01';

        var ids = this._getNewIds(currentYear, currentMonth);
        var entries = this._getCurrentEntriesFromIds(ids);
        var timelineData = this._buildYearTimelineData(years);
        this.setState({
            years: years,
            currentYear: currentYear,
            currentMonth: currentMonth,
            currentEntries: entries,
            timelineData: timelineData
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    componentWillMount () {
        var map = this.props.model.index.get('yyyy');
        if (map.size) {
            this._init();
        }

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
                        <MapView
                            width="700px"
                            year={this.state.currentYear}
                            month={this.state.currentMonth}
                            entries={this.state.currentEntries} />
                    </div>
                    <div className="col-md-4">
                        <h4>Current Year</h4>
                        <Select
                            currentVal={this.state.currentYear}
                            changeHandler={this.yearSelectChangeHandler}
                            values={this.state.years} />
                        <h4>Current Month</h4>
                        <Select
                            currentVal={this.state.currentMonth}
                            changeHandler={this.monthSelectChangeHandler}
                            values={this.state.months} />
                        <h4>Total Entries</h4>
                        <p>{this.state.currentEntries.length}</p>
                    </div>
                </div>
                {/*
                    <div className="row">
                        <div className="col-md-12">
                            <h4>Years Available <small>Click to change dataset</small></h4>
                            <Timeline cb={this.yearSelectChangeHandler} data={this.state.timelineData} />
                        </div>
                    </div>
                */}
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
