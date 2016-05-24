var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var Select = require('./Select');
var Button = require('./Button');
var Tags = require('./Tags');
var BarGraphSmall = require('./BarGraphSmall');
import ReactDataGrid from 'react-data-grid/addons';

module.exports = React.createClass({
    getDefaultProps () {
        return {
            papers: [new paper.PaperScope(), new paper.PaperScope()],
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
            allYears: [],
            year: '',
            month: '01',
            selectedCouncilDistricts: new Set()
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
        var label = data.label;
        var a = this.state.selectedCouncilDistricts;
        if (!a.has(label)) a.add(label);
        else a.delete(label);
        this.setState({
            selectedCouncilDistricts: a
        });
    },
    _clearMonthHandler () {
        this.setState({
            month: ''
        });
    },
    _clearCouncilHandler () {
        var a = this.state.selectedCouncilDistricts;
        a.clear();
        this.setState({
            selectedCouncilDistricts: a
        });
    },
    // Update state with actual data
    _init () {
        var model = this.props.model;
        var byYear = model.index.get('yyyy');
        var allYears = Array.from(byYear.keys()).sort();
        var year = allYears[allYears.length-1];

        var filters = { year: year };
        if (this.state.month) filters.month = this.state.month;
        var entries = this.props.model.filter(filters);

        this.setState({
            allYears: allYears,
            year: year
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
    _getBarGraphData (key) {
        var model = this.props.model;
        if (!model.rows.length) return [];

        // Build filters
        var filters = {
            year: this.state.year
        };
        if (this.state.month) filters.month = this.state.month;
        var entriesByDate = model.filter(filters);
        // Get full, distinct list
        var distinct = Array.from(model.index.get(key).keys());
        // Map distinct item to total entries associated to it
        var map = new Map();
        distinct.forEach(k => map.set(k, 0));
        entriesByDate.forEach(function (entry) {
            map.set(entry[key], map.get(entry[key]) + 1);
        });
        var data = [];
        map.forEach(function (mapVal, mapKey) {
            var obj = {
                size: mapVal,
                label: mapKey
            };
            data.push(obj);
        }, this);
        return data;
    },
    _getEntries () {
        var filters = { year: this.state.year };
        if (this.state.month) filters.month = this.state.month;
        if (this.state.selectedCouncilDistricts.size) filters.councildistrict = Array.from(this.state.selectedCouncilDistricts.values());
        return this.props.model.filter(filters) || [];
    },
    _sortBarGraphData (key) {
        var sorters = {
            councildistrict: function (a,b) {
                a = parseInt(a.label);
                b = parseInt(b.label);
                if (a < b) return -1;
                if (a > b ) return 1;
                return 0;
            }
        };
        return sorters[key];
    },
    _getMapData (entries) {
        var data = [];
        var entry;
        for ( var i = 0; i < entries.length; i++ ) {
            entry = entries[i];
            data.push({
                key: entry[':id'],
                address: entry.buildingaddress,
                latitude: entry.location[1],
                longitude: entry.location[2]
            });
        }
        return data;
    },
    _getTagsData () {
        var data = [];
        var config = [
            { key: 'month', label: 'Month', onDelete: this._clearMonthHandler },
            { key: 'councildistrict', label: 'Council District', onDelete: this._clearCouncilHandler }
        ];
        config.forEach((c) => {
            if (this.state[c.key]) data.push(c);
        }, this);
        return data;
    },
    render () {
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

        var barColorSchemes = {
            night: {
                bgroundcolor: '#4EC0CC',
                barcolor: "#33627A",
                barcolorhover: "#719BB0",
                barcolorselected: "#BEE7FA",
                bordercolor: '#7790D9',
                fontcolora: "#FFFFFF",
                fontcolorb: "#33627A"
            },
            baltimoreAbandonedRowHouses: {
                bgroundcolor: '#c5b7a9', // suva gray
                barcolor: '#8c8886', // ash gray
                barcolorhover: '#af4e5b', // light steel blue
                barcolorselected: '#b2c8e3', // hippie pink brown
                fontcolora: '#433030',
                fontcolorb: '#433030'
            }
        };
        var barSharedProps = barColorSchemes.night;
        barSharedProps.displayLabels = false;
        barSharedProps.hoverLabelColor = '#33627A';
        var mapData = this._getMapData(entries);
        var tagsData = this._getTagsData();
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-4">
                        <p>Displaying {entries.length} Vacancies</p>
                        <MapView
                            width="350px"
                            height="350px"
                            data={mapData} />
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-8">
                                <h4>Filters</h4>
                                <Tags data={tagsData} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <h4>Year</h4>
                                <Select
                                    currentVal={this.state.year}
                                    changeHandler={this._yearSelectChangeHandler}
                                    values={this.state.allYears}
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
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <h4>By Council District</h4>
                                <p>Total selected: {this.state.selectedCouncilDistricts.size}</p>
                                <BarGraphSmall
                                    data={this._getBarGraphData('councildistrict')}
                                    selectedLabels={Array.from(this.state.selectedCouncilDistricts.values())}
                                    clickHandler={this._councilGraphClickHandler}
                                    clickHandlerB={this._clearCouncilHandler}
                                    bgroundClickHandler={this._clearCouncilHandler}
                                    paper={this.props.papers[0]}
                                    sort={this._sortBarGraphData('councildistrict')}
                                    {...barSharedProps}
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
