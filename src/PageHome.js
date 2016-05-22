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
            currentYear: '',
            months: ['01','02','03','04','05','06','07','08','09','10','11','12'],
            currentMonth: '01',
            currentEntries: []
        };
    },
    _yearSelectChangeHandler (newCurrentYear) {
        // get all entries filtered by date
        var entries = this.props.model.filter({
            year: newCurrentYear,
            month: this.state.currentMonth
        });
        this.setState({
            currentYear: newCurrentYear,
            currentEntries: entries
        });
    },
    _monthSelectChangeHandler (newCurrentMonth) {
        var entries = this.props.model.filter({
            year: this.state.currentYear,
            month: newCurrentMonth
        });
        this.setState({
            currentMonth: newCurrentMonth,
            currentEntries: entries
        });
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
            years: years,
            currentYear: currentYear,
            currentEntries: entries
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
    _gridRowGetter (i) {
        var row = this.state.currentEntries[i];
        return {
            "buildingaddress":row['buildingaddress'],
            "noticedate":row['noticedate'],
            "neighborhood":row["neighborhood"],
            'policedistrict':row['policedistrict'],
            'councildistrict':row['councildistrict']
        };
    },
    _getBarGraphData (key) {
        var model = this.props.model;
        if (!model.rows.length) return [];
        // get entries filtered by current year and month (these are always set)
        var entriesByDate = model.filter({
            year: this.state.currentYear,
            month: this.state.currentMonth
        });
        // Get full, distinct list of council districts
        var distinct = Array.from(model.index.get('councildistrict').keys());
        // Map distinct council districts to total entries in that district
        var map = new Map();
        distinct.forEach(k => map.set(k, 0));
        entriesByDate.forEach(function (entry) {
            map.set(entry[key], map.get(entry[key]) + 1);
        });
        var data = [];
        map.forEach((count, key) => data.push({ size: count, label: key }));
        return data;
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
                                    changeHandler={this._yearSelectChangeHandler}
                                    values={this.state.years}
                                    liveSearch={true}
                                />
                            </div>
                            <div className="col-md-2">
                                <h4>Month</h4>
                                <Select
                                    currentVal={this.state.currentMonth}
                                    changeHandler={this._monthSelectChangeHandler}
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
                                    data={this._getBarGraphData('councildistrict')}
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
                            rowGetter={this._gridRowGetter}
                            rowsCount={this.state.currentEntries.length}
                            minHeight={500} />
                    </div>
                </div>
            </Layout>
        )
    }
})
