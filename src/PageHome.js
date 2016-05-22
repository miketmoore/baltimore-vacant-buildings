var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var Select = require('./Select');
var Button = require('./Button');
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
            currentMonth: '01',
            currentCouncilDistrict: '',
            currentEntries: []
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
        var entriesPerCouncilDistrict = this._getEntriesPerCouncilDistrict(entries);
        if (this.state.currentCouncilDistrict != '') {
            // Limit current entries by councildistrict
            entries = this.props.model.filter({
                councildistrict: this.state.currentCouncilDistrict
            }, entries);
        }
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
        var entriesPerCouncilDistrict = this._getEntriesPerCouncilDistrict(entries);
        if (this.state.currentCouncilDistrict != '') {
            // Limit current entries by councildistrict
            entries = this.props.model.filter({
                councildistrict: this.state.currentCouncilDistrict
            }, entries);
        }
        this.setState({
            entriesPerCouncilDistrict: this._getEntriesPerCouncilDistrict(entries),
            currentMonth: newCurrentMonth,
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
    // Update state with actual data
    _init () {
        var byYear = this.props.model.index.get('yyyy');
        var years = Array.from(byYear.keys()).sort();
        var currentYear = years[years.length-1];

        var entries = this.props.model.filter({
            year: currentYear,
            month: this.state.currentMonth
        });

        this.setState({
            entriesPerCouncilDistrict: this._getEntriesPerCouncilDistrict(entries),
            years: years,
            currentYear: currentYear,
            currentEntries: entries
        });
    },
    // Update entries in state by year, month, and councildistrict
    _councilGraphClickHandler (data) {
        var entries = this.props.model.filter({
            year: this.state.currentYear,
            month: this.state.currentMonth,
            councildistrict: data.label
        });
        this.setState({
            currentEntries: entries,
            currentCouncilDistrict: data.label
        });
    },
    _clearCouncilHandler () {
        console.log('PageHome._clearCouncilHandler');
        var entries = this.props.model.filter({
            year: this.state.currentYear,
            month: this.state.currentMonth
        });
        this.setState({
            currentEntries: entries,
            currentCouncilDistrict: ''
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
                    <div className="col-md-4">
                        <MapView
                            width="350px"
                            height="350px"
                            year={this.state.currentYear}
                            month={this.state.currentMonth}
                            entries={this.state.currentEntries} />
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-2">
                                <h4>Year</h4>
                                <Select
                                    currentVal={this.state.currentYear}
                                    changeHandler={this.yearSelectChangeHandler}
                                    values={this.state.years}
                                    liveSearch={true}
                                />
                            </div>
                            <div className="col-md-2">
                                <h4>Month</h4>
                                <Select
                                    currentVal={this.state.currentMonth}
                                    changeHandler={this.monthSelectChangeHandler}
                                    values={this.state.months}
                                />
                            </div>
                            <div className="col-md-2">
                                <h4>Total</h4>
                                <p>{this.state.currentEntries.length}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <h4>Per Council District</h4>
                                <p><small>Click a bar to filter data.</small> <Button
                                    visible={this.state.currentCouncilDistrict != ''}
                                    clickHandler={this._clearCouncilHandler}
                                    label="Clear Filter"
                                /></p>

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
