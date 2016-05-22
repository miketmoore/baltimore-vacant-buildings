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
            months: ['01','02','03','04','05','06','07','08','09','10','11','12'],
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
            year: '',
            month: '01',
            councildistrict: ''
        };
    },
    _yearSelectChangeHandler (val) {
        this.setState({
            year: val
        });
    },
    _monthSelectChangeHandler (val) {
        this.setState({
            month: val
        });
    },
    _councilGraphClickHandler (data) {
        this.setState({
            councildistrict: data.label
        });
    },
    _clearCouncilHandler () {
        this.setState({
            councildistrict: ''
        });
    },
    // Update state with actual data
    _init () {
        var byYear = this.props.model.index.get('yyyy');
        var years = Array.from(byYear.keys()).sort();
        var year = years[years.length-1];

        var entries = this.props.model.filter({
            year: year,
            month: this.state.month
        });

        this.setState({
            years: years,
            year: year
        });
    },
    componentWillReceiveProps (props) {
        console.log('PageHome.componentWillReceiveProps ');
        this._init();
    },
    // called before render
    // setting state here will not trigger re-rendering
    componentWillMount () {
        console.log('PageHome.componentWillMount');
        var map = this.props.model.index.get('yyyy');
        if (map.size) {
            this._init();
        }
    },
    componentWillUpdate (np, ns) {
        console.log('PageHome.componentWillUpdate', np, ns);
    },
    _getBarGraphData (key) {
        var model = this.props.model;
        if (!model.rows.length) return [];
        // get entries filtered by current year and month (these are always set)
        var entriesByDate = model.filter({
            year: this.state.year,
            month: this.state.month
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
    _getEntries () {
        var filters = {
            year: this.state.year,
            month: this.state.month
        };
        if (this.state.councildistrict) {
            filters.councildistrict = this.state.councildistrict;
        }
        return this.props.model.filter(filters) || [];
    },
    render () {
        console.log('PageHome.render()');
        var entries = this._getEntries.call(this);
        function gridRowGetter (i) {
            var row = entries[i];
            return {
                "buildingaddress":row['buildingaddress'],
                "noticedate":row['noticedate'],
                "neighborhood":row["neighborhood"],
                'policedistrict':row['policedistrict'],
                'councildistrict':row['councildistrict']
            };
        };
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-4">
                        <MapView
                            width="350px"
                            height="350px"
                            year={this.state.year}
                            month={this.state.month}
                            entries={entries} />
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-2">
                                <h4>Year</h4>
                                <Select
                                    currentVal={this.state.year}
                                    changeHandler={this._yearSelectChangeHandler}
                                    values={this.state.years}
                                    liveSearch={true}
                                />
                            </div>
                            <div className="col-md-2">
                                <h4>Month</h4>
                                <Select
                                    currentVal={this.state.month}
                                    changeHandler={this._monthSelectChangeHandler}
                                    values={this.props.months}
                                />
                            </div>
                            <div className="col-md-2">
                                <h4>Total</h4>
                                <p>{entries.length}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <h4>Per Council District</h4>
                                <p><small>Click a bar to filter data.</small> <Button
                                    visible={this.state.councildistrict != ''}
                                    clickHandler={this._clearCouncilHandler}
                                    label="Clear Filter"
                                /></p>

                                <BarGraphSmall
                                    data={this._getBarGraphData('councildistrict')}
                                    selectedLabel={this.state.councildistrict}
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
                            rowGetter={gridRowGetter}
                            rowsCount={entries.length}
                            minHeight={500} />
                    </div>
                </div>
            </Layout>
        )
    }
})
