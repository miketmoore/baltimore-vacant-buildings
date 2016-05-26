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
            gridColumns: [
                {"key":"buildingaddress","name":"Address","resizable":true},
                {"key":"noticedate","name":"Notice Date","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"policedistrict","name":"Police District","resizable":true},
                {"key":"councildistrict","name":"Council District","resizable":true}
            ],
            barGraphColors: {
                bgroundcolor: '#4EC0CC',
                barcolor: "#33627A",
                barcolorhover: "#719BB0",
                barcolorselected: "#BEE7FA",
                bordercolor: '#7790D9',
                fontcolora: "#FFFFFF",
                fontcolorb: "#33627A"
            }
        };
    },
    getInitialState() {
        return {
            allYears: [],
            selectedYears: new Set(),
            selectedMonths: new Set(),
            selectedDays: new Set(),
            selectedCouncilDistricts: new Set(),
            selectedPoliceDistricts: new Set(),
            neighborhoods: [],
            selectedNeighborhoods: new Set()
        };
    },
    _yearSelectChangeHandler (val) {
        var a = this.state.selectedYears;
        if (!val.length) {
            this._clearYearHandler();
        } else {
            this.setState({
                selectedYears: new Set(val)
            });
        }
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
    _daySelectChangeHandler (val) {
        var a = this.state.selectedDays;
        if (!val.length) {
            this._clearDayHandler();
        } else {
            this.setState({
                selectedDays: new Set(val)
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
    _clearYearHandler () {
        this.setState({
            selectedYears: new Set()
        });
    },
    _clearDayHandler () {
        this.setState({
            selectedDays: new Set()
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
        var byYear = model.index.get('year');
        var allYears = Array.from(byYear.keys()).sort();
        var selectedYears = new Set([allYears[allYears.length-1]]);
        var selectedMonths = new Set([Array.from(model.index.get('months'))[0]]);

        var filters = {};
        if (this.state.selectedYears.size) filters.year = Array.from(this.state.selectedYears.values());
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        if (this.state.selectedDays.size) filters.day = Array.from(this.state.selectedDays.values());
        var entries = this.props.model.filter(filters);

        this.setState({
            allYears: allYears,
            selectedYears: selectedYears,
            selectedMonths: selectedMonths,
            neighborhoods: Array.from(model.index.get('neighborhood').keys()).sort()
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    componentWillMount () {
        if (this.props.model.index.get('year').size) this._init();
    },
    _getBarGraphData (key) {
        var model = this.props.model;
        if (!model.rows.length) return [];

        // Build filters
        var filters = {};
        if (this.state.selectedYears.size) filters.year = Array.from(this.state.selectedYears.values());
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        if (this.state.selectedDays.size) filters.day = Array.from(this.state.selectedDays.values());
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
        var filters = {};
        if (this.state.selectedYears.size) filters.year = Array.from(this.state.selectedYears.values());
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        if (this.state.selectedDays.size) filters.day = Array.from(this.state.selectedDays.values());
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
            { key: 'selectedYears', label: 'Years', onDelete: this._clearYearHandler, isSet: true },
            { key: 'selectedMonths', label: 'Months', onDelete: this._clearMonthHandler, isSet: true },
            { key: 'selectedDays', label: 'Days', onDelete: this._clearDayHandler, isSet: true },
            { key: 'selectedCouncilDistricts', label: 'Council Districts', onDelete: this._clearCouncilHandler, isSet: true },
            { key: 'selectedPoliceDistricts', label: 'Police Districts', onDelete: this._clearPoliceHandler, isSet: true },
            { key: 'selectedNeighborhoods', label: 'Neighborhoods', onDelete: this._clearNeighborhoodHandler, isSet: true }
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

        var barSharedProps = this.props.barGraphColors;
        barSharedProps.displayLabels = false;
        barSharedProps.hoverLabelColor = '#33627A';
        var mapData = this._getMapData(entries);
        var tagsData = this._getTagsData();

        return (
            <Layout>
                <div className="row">
                    <div className="col-md-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">Displaying {entries.length.toLocaleString()}/{this.props.model.rows.length.toLocaleString()} Vacancies</div>
                            <div className="panel-body">
                                <MapView
                                    width="100%"
                                    height="350px"
                                    data={mapData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="panel panel-default">
                            <div className="panel-heading">Filters</div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Tags data={tagsData} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <h5>Years</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.state.allYears}
                                            onChange={this._yearSelectChangeHandler}
                                            value={Array.from(this.state.selectedYears.values())}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Months</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('months')}
                                            onChange={this._monthSelectChangeHandler}
                                            value={Array.from(this.state.selectedMonths.values())}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Days</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('days')}
                                            onChange={this._daySelectChangeHandler}
                                            value={Array.from(this.state.selectedDays.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Neighborhoods</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.state.neighborhoods}
                                            onChange={this._neighborhoodChangeHandler}
                                            value={Array.from(this.state.selectedNeighborhoods.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Council Districts</h5>
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
                                    <div className="col-md-6">
                                        <h5>Police Districts</h5>
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
