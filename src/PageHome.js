var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var Button = require('./Button');
var Tags = require('./Tags');
var BarGraphSmall = require('./BarGraphSmall');
import ReactDataGrid from 'react-data-grid/addons';
import 'react-widgets/lib/less/react-widgets.less';
var DropdownList = require('react-widgets').DropdownList;
var Multiselect = require('react-widgets').Multiselect;

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
            selectedMonths: new Set(['01']),
            selectedCouncilDistricts: new Set(),
            selectedPoliceDistricts: new Set(),
            neighborhoods: [],
            selectedNeighborhoods: new Set()
        };
    },
    _yearSelectChangeHandler (val) {
        this.setState({
            year: val
        });
    },
    _monthSelectChangeHandler (val) {
        var a = this.state.selectedMonths;
        if (!val.length) {
            this._clearMonthHandler();
        } else {
            this.setState({
                selectedMonths: new Set(val)
            });
        }
    },
    _graphClickHandler (key, val) {
        var a = this.state[key];
        if (!a.has(val)) a.add(val);
        else a.delete(val);
        var stateObj = {};
        stateObj[key] = a;
        this.setState(stateObj);
    },
    _neighborhoodChangeHandler (val) {
        var a = this.state.selectedNeighborhoods;
        if (!val.length) {
            this._clearNeighborhoodHandler();
        } else {
            this.setState({
                selectedNeighborhoods: new Set(val)
            });
        }
    },
    _policeGraphClickHandler (data) {
        this._graphClickHandler('selectedPoliceDistricts', data.label);
    },
    _councilGraphClickHandler (data) {
        this._graphClickHandler('selectedCouncilDistricts', data.label);
    },
    _clearMonthHandler () {
        this.setState({
            selectedMonths: new Set()
        });
    },
    _clearNeighborhoodHandler () {
        this.setState({
            selectedNeighborhoods: new Set()
        });
    },
    _clear (key, data) {
        var a = this.state[key];
        data ? a.delete(data.label) : a.clear();
        var stateObj = {};
        stateObj[key] = a;
        this.setState(stateObj);
    },
    _clearPoliceHandler (data) {
        this._clear('selectedPoliceDistricts', data);
    },
    _clearCouncilHandler (data) {
        this._clear('selectedCouncilDistricts', data);
    },
    // Update state with actual data
    _init () {
        var model = this.props.model;
        var byYear = model.index.get('yyyy');
        var allYears = Array.from(byYear.keys()).sort();
        var year = allYears[allYears.length-1];

        var filters = { year: year };
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        var entries = this.props.model.filter(filters);

        this.setState({
            allYears: allYears,
            year: year,
            neighborhoods: Array.from(model.index.get('neighborhood').keys()).sort()
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    componentWillMount () {
        if (this.props.model.index.get('yyyy').size) this._init();
    },
    _getBarGraphData (key) {
        var model = this.props.model;
        if (!model.rows.length) return [];

        // Build filters
        var filters = {
            year: this.state.year
        };
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        var entriesByDate = model.filter(filters);

        // Get full, distinct list
        var distinct = Array.from(model.index.get(key).keys());

        // Map distinct item to total entries associated to it
        var map = new Map();
        distinct.forEach(k => map.set(k, 0));
        entriesByDate.forEach((entry) => map.set(entry[key], map.get(entry[key]) + 1));

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
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        if (this.state.selectedCouncilDistricts.size) filters.councildistrict = Array.from(this.state.selectedCouncilDistricts.values());
        if (this.state.selectedPoliceDistricts.size) filters.policedistrict = Array.from(this.state.selectedPoliceDistricts.values());
        if (this.state.selectedNeighborhoods.size) filters.neighborhood = Array.from(this.state.selectedNeighborhoods);
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
            { key: 'selectedMonths', label: 'Month', onDelete: function () {
                // to avoid passing event, which triggers a false positive
                this._clearMonthHandler();
            }.bind(this), isSet: true },
            { key: 'selectedCouncilDistricts', label: 'Council District', onDelete: function () {
                // to avoid passing event, which triggers a false positive
                this._clearCouncilHandler();
            }.bind(this), isSet: true },
            { key: 'selectedPoliceDistricts', label: 'Police District', onDelete: function () {
                // to avoid passing event, which triggers a false positive
                this._clearPoliceHandler();
            }.bind(this), isSet: true },
            { key: 'selectedNeighborhoods', label: 'Neighborhood', onDelete: function () {
                // to avoid passing event, which triggers a false positive
                this._clearNeighborhoodHandler();
            }.bind(this), isSet: true },
        ];
        config.forEach((c) => {
            if ((c.isSet && this.state[c.key].size) || (!c.isSet && this.state[c.key])) data.push(c);
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
                            <div className="col-md-4">
                                <h4>Year</h4>
                                <DropdownList
                                    value={this.state.year}
                                    onChange={this._yearSelectChangeHandler}
                                    data={this.state.allYears}
                                    liveSearch={true}
                                />
                            </div>
                            <div className="col-md-4">
                                <h4>Month</h4>
                                <Multiselect
                                    placeholder="Search..."
                                    data={this.props.months}
                                    onChange={this._monthSelectChangeHandler}
                                    value={Array.from(this.state.selectedMonths.values())}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8">
                                <h4>Neighborhoods</h4>
                                <Multiselect
                                    placeholder="Search..."
                                    data={this.state.neighborhoods}
                                    onChange={this._neighborhoodChangeHandler}
                                    value={Array.from(this.state.selectedNeighborhoods.values())}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <h4>By Council District</h4>
                                <BarGraphSmall
                                    data={this._getBarGraphData('councildistrict')}
                                    selectedLabels={this.state.selectedCouncilDistricts}
                                    clickHandler={this._councilGraphClickHandler}
                                    clickHandlerB={this._clearCouncilHandler}
                                    bgroundClickHandler={this._clearCouncilHandler}
                                    paper={this.props.papers[0]}
                                    sort={this._sortBarGraphData('councildistrict')}
                                    {...barSharedProps}
                                />
                            </div>
                            <div className="col-md-4">
                                <h4>By Police District</h4>
                                <BarGraphSmall
                                    data={this._getBarGraphData('policedistrict')}
                                    selectedLabels={this.state.selectedPoliceDistricts}
                                    clickHandler={this._policeGraphClickHandler}
                                    clickHandlerB={this._clearPoliceHandler}
                                    bgroundClickHandler={this._clearPoliceHandler}
                                    paper={this.props.papers[1]}
                                    sort={this._sortBarGraphData('policedistrict')}
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
