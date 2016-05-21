var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var Select = require('./Select');
var Timeline = require('./Timeline');
var BarGraphSmall = require('./BarGraphSmall');
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
            entriesPerCouncilDistrict: [],
            currentYear: '',
            months: ['01','02','03','04','05','06','07','08','09','10','11','12'],
            currentMonth: '',
            currentCouncilDistrict: '',
            currentEntries: [],
            timelineData: []
        };
    },
    _getCurrentEntriesFromIds (entryIds) {
        var entries = [];
        for ( var i = 0; i < entryIds.length; i++ ) {
            entry = this.props.model.getById(entryIds[i]);
            entries.push(entry);
        }
        return entries;
    },
    yearSelectChangeHandler (newCurrentYear) {
        var entries = this.props.model.filter({
            year: newCurrentYear,
            month: this.state.currentMonth
        });
        this.setState({
            entriesPerCouncilDistrict: this._getEntriesPerCouncilDistrict(entries),
            currentYear: newCurrentYear,
            currentEntries: entries
        });
    },
    monthSelectChangeHandler (newCurrentMonth) {
        var entries = this.props.model.filter({
            year: this.state.currentYear,
            month: newCurrentMonth
        });
        this.setState({
            entriesPerCouncilDistrict: this._getEntriesPerCouncilDistrict(entries),
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
    _getFullCouncilDistrictList () {
        var model = this.props.model;
        var map = model.index.get('councildistrict');
        // sort strings numerically
        return Array.from(map.keys()).sort(function (a,b) {
            a = parseInt(a);
            b = parseInt(b);
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
    },
    _getEntriesPerCouncilDistrict (entries) {
        var fullCouncilDistrictList = this._getFullCouncilDistrictList();
        var fullCouncilDistrictMap = new Map();
        fullCouncilDistrictList.forEach(cd => fullCouncilDistrictMap.set(cd, new Set()));
        entries.forEach((entry) => {
            fullCouncilDistrictMap.get(entry.councildistrict).add(entry[':id']);
        });
        var entriesPerCouncilDistrict = [];

        fullCouncilDistrictMap.forEach((v, k) => {
            entriesPerCouncilDistrict.push({
                label: k,
                size: v.size
            });
        });
        return entriesPerCouncilDistrict;
    },
    _init () {
        var byYear = this.props.model.index.get('yyyy');
        var years = Array.from(byYear.keys()).sort();
        var currentYear = years[years.length-1];
        var currentMonth = '01';

        var entries = this.props.model.filter({
            year: currentYear,
            month: currentMonth
        });

        var timelineData = this._buildYearTimelineData(years);

        this.setState({
            entriesPerCouncilDistrict: this._getEntriesPerCouncilDistrict(entries),
            years: years,
            currentYear: currentYear,
            currentMonth: currentMonth,
            currentEntries: entries,
            timelineData: timelineData
        });
    },
    _filterEntries (entries, overrides) {
        console.log('_filterEntries 1 ', entries.length, arguments);
        var i, j, entry, config, key, val, matches;
        var final = [];
        var configs = [
            ['councildistrict', this.state.currentCouncilDistrict]
        ];
        for ( i = 0; i < entries.length; i++ ) {
            entry = entries[i];
            matches = 0;
            for ( j = 0; j < configs.length; j++ ) {
                config = configs[j];
                key = config[0];
                if (overrides && overrides[key]) console.log('_filterEntries overrides has key: ', overrides, key);
                val = (overrides && overrides[key]) ? overrides[key] : config[1];
                //val = config[1];
                if (entry[key] == val) matches++;
            }
            if (matches == configs.length) final.push(entry);
        }
        console.log('_filterEntries ', final.length);
        return final;
    },
    _councilGraphClickHandler (data) {
        var ids = this._getNewIds(this.state.currentYear, this.state.currentMonth);
        var entries = this._getCurrentEntriesFromIds(ids);
        entries = this._filterEntries(entries, {
            currentCouncilDistrict: data.label
        });

        this.setState({
            currentEntries: entries,
            currentCouncilDistrict: data.label
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    // called before render
    // setting state here will not trigger re-rendering
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
                    <div className="col-md-7">
                        <MapView
                            width="600px"
                            year={this.state.currentYear}
                            month={this.state.currentMonth}
                            entries={this.state.currentEntries} />
                    </div>
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-md-3">
                                <h4>Year</h4>
                                <Select
                                    currentVal={this.state.currentYear}
                                    changeHandler={this.yearSelectChangeHandler}
                                    values={this.state.years} />
                            </div>
                            <div className="col-md-2">
                                <h4>Month</h4>
                                <Select
                                    currentVal={this.state.currentMonth}
                                    changeHandler={this.monthSelectChangeHandler}
                                    values={this.state.months} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5">
                                <p>Total Entries: {this.state.currentEntries.length}</p>
                                <h5>Vacancies per Council District</h5>
                                <BarGraphSmall
                                    data={this.state.entriesPerCouncilDistrict}
                                    selectedLabel={this.state.currentCouncilDistrict}
                                    clickHandler={this._councilGraphClickHandler}
                                    bgroundcolor={'#A3BFD9'}
                                    bordercolor={'#7790D9'}
                                    fontcolora="#F24535"
                                    fontcolorb="#F2AF5C"
                                />
                            </div>
                        </div>
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
