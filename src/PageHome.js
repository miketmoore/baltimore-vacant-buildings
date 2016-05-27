var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var Tags = require('./Tags');
var BarGraphSmall = require('./BarGraphSmall');
import ReactDataGrid from 'react-data-grid/addons';
import 'react-widgets/lib/less/react-widgets.less';
var DropdownList = require('react-widgets').DropdownList;
var Multiselect = require('react-widgets').Multiselect;

module.exports = React.createClass({
    getDefaultProps () {
        return {
            filterConfigs: [
                {'key':'year','stateKey':'selectedYears'},
                {'key':'month','stateKey':'selectedMonths'},
                {'key':'day','stateKey':'selectedDays'},
                {'key':'councildistrict','stateKey':'selectedCouncilDistricts'},
                {'key':'policedistrict','stateKey':'selectedPoliceDistricts'},
                {'key':'block','stateKey':'selectedBlocks'},
                {'key':'lot','stateKey':'selectedLots'},
                {'key':'neighborhood','stateKey':'selectedNeighborhoods'}
            ],
            papers: [
                new paper.PaperScope(),
                new paper.PaperScope(),
                new paper.PaperScope(),
                new paper.PaperScope(),
                new paper.PaperScope()
            ],
            gridColumns: [
                {"key":"buildingaddress","name":"Address","resizable":true},
                {"key":"noticedate","name":"Notice Date","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"policedistrict","name":"Police District","resizable":true},
                {"key":"councildistrict","name":"Council District","resizable":true},
                {"key":"block","name":"Block","resizable":true},
                {"key":"lot","name":"Lot","resizable":true}
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
            selectedYears: new Set(),
            selectedMonths: new Set(),
            selectedDays: new Set(),
            selectedCouncilDistricts: new Set(),
            selectedPoliceDistricts: new Set(),
            selectedBlocks: new Set(),
            selectedLots: new Set(),
            selectedNeighborhoods: new Set()
        };
    },
    _dateSelectChangeHandler (key, clearer, val) {
        var a = this.state[key];
        if (!val.length) {
            clearer();
        } else {
            var stateObj = {};
            stateObj[key] = new Set(val);
            this.setState(stateObj);
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
    _blockChangeHandler (val) {
        var key = 'selectedBlocks';
        var a = this.state[key];
        if (!val.length) {
            this._clear(key);
        } else {
            var a = {};
            a[key] = new Set(val);
            this.setState(a);
        }
    },
    _lotChangeHandler (val) {
        var key = 'selectedLots';
        var a = this.state[key];
        if (!val.length) {
            this._clear(key);
        } else {
            var a = {};
            a[key] = new Set(val);
            this.setState(a);
        }
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
    // Update state with actual data
    _init () {
        var model = this.props.model;
        var byYear = model.index.get('year');

        var allYears = model.index.get('sortedYears');
        var selectedYears = new Set([allYears[allYears.length-1]]);
        var selectedMonths = new Set([Array.from(model.index.get('months'))[0]]);

        var filters = {};
        if (this.state.selectedYears.size) filters.year = Array.from(this.state.selectedYears.values());
        if (this.state.selectedMonths.size) filters.month = Array.from(this.state.selectedMonths.values());
        if (this.state.selectedDays.size) filters.day = Array.from(this.state.selectedDays.values());
        var entries = this.props.model.filter(filters);

        this.setState({
            selectedYears: selectedYears,
            selectedMonths: selectedMonths
        });
    },
    componentWillReceiveProps (props) {
        this._init();
    },
    _getBarGraphData (key) {
        var model = this.props.model;
        if (!model.rows.length) return [];

        // Get full, distinct list
        var distinct = Array.from(model.index.get(key).keys());

        // Map distinct item to total entries associated to it
        var map = new Map();
        distinct.forEach(k => map.set(k, 0));
        var entries = model.rows;
        var entry;
        for ( var i = 0, len = entries.length; i < len; i++ ) {
            entry = entries[i];
            map.set(entry[key], map.get(entry[key]) + 1);
        }

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
        var filterConfigs = this.props.filterConfigs;
        var config;
        var key;
        var stateKey;
        for ( var i = 0, len = filterConfigs.length; i < len; i++ ) {
            config = filterConfigs[i];
            key = config.key;
            stateKey = config.stateKey;
            if (this.state[stateKey].size) {
                filters[key] = Array.from(this.state[stateKey].values());
            }
        }
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
            { key: 'selectedYears', label: 'Years', onDelete: () => this._clear('selectedYears') },
            { key: 'selectedMonths', label: 'Months', onDelete: () => this._clear('selectedMonths') },
            { key: 'selectedDays', label: 'Days', onDelete: () => this._clear('selectedDays') },
            { key: 'selectedCouncilDistricts', label: 'Council Districts', onDelete: () => this._clear('selectedCouncilDistricts') },
            { key: 'selectedPoliceDistricts', label: 'Police Districts', onDelete: () => this._clear('selectedPoliceDistricts') },
            { key: 'selectedNeighborhoods', label: 'Neighborhoods', onDelete: this._clearNeighborhoodHandler },
            { key: 'selectedBlocks', label: 'Blocks', onDelete: () => this._clear('selectedBlocks') },
            { key: 'selectedLots', label: 'Lots', onDelete: () => this._clear('selectedLots') }
        ];
        config.forEach((c) => {
            if (this.state[c.key].size) data.push(c);
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
                'councildistrict':row['councildistrict'],
                'block':row['block'],
                'lot':row['lot']
            };
        };

        var barSharedProps = this.props.barGraphColors;
        barSharedProps.displayLabels = false;
        barSharedProps.hoverLabelColor = '#33627A';
        barSharedProps.viewHeight = 70;
        barSharedProps.barMax = 50;
        barSharedProps.barMargin = 3;

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
                                            data={this.props.model.index.get('sortedYears')}
                                            onChange={(val) => this._dateSelectChangeHandler('selectedYears', () => this._clear('selectedYears'), val)}
                                            value={Array.from(this.state.selectedYears.values())}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Months</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('months')}
                                            onChange={(val) => this._dateSelectChangeHandler('selectedMonths', () => this._clear('selectedMonths'), val)}
                                            value={Array.from(this.state.selectedMonths.values())}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Days</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('days')}
                                            onChange={(val) => { this._dateSelectChangeHandler('selectedDays', () => this._clear('selectedDays'), val) }}
                                            value={Array.from(this.state.selectedDays.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Neighborhoods</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('sortedNeighborhoods')}
                                            onChange={this._neighborhoodChangeHandler}
                                            value={Array.from(this.state.selectedNeighborhoods.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <h5>Blocks</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('sortedBlocks')}
                                            onChange={this._blockChangeHandler}
                                            value={Array.from(this.state.selectedBlocks.values())}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <h5>Lots</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('sortedLots')}
                                            onChange={this._lotChangeHandler}
                                            value={Array.from(this.state.selectedLots.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="col-md-6">
                                            <h5>Council Districts</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('councildistrict')}
                                                selectedLabels={this.state.selectedCouncilDistricts}
                                                clickHandler={(data) => { this._graphClickHandler('selectedCouncilDistricts', data.label) }}
                                                clickHandlerB={(data) => { this._clear('selectedCouncilDistricts', data) }}
                                                bgroundClickHandler={(data) => { this._clear('selectedCouncilDistricts', data) }}
                                                paper={this.props.papers[0]}
                                                sort={this._sortBarGraphData('councildistrict')}
                                                {...barSharedProps}
                                            />
                                            <h5>Police Districts</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('policedistrict')}
                                                selectedLabels={this.state.selectedPoliceDistricts}
                                                clickHandler={(data) => { this._graphClickHandler('selectedPoliceDistricts', data.label) }}
                                                clickHandlerB={(data) => { this._clear('selectedPoliceDistricts', data) }}
                                                bgroundClickHandler={(data) => { this._clear('selectedPoliceDistricts', data) }}
                                                paper={this.props.papers[1]}
                                                sort={this._sortBarGraphData('policedistrict')}
                                                {...barSharedProps}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Years</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('year')}
                                                selectedLabels={this.state.selectedYears}
                                                clickHandler={(data) => { this._graphClickHandler('selectedYears', data.label) }}
                                                clickHandlerB={(data) => { this._clear('selectedYears', data) }}
                                                bgroundClickHandler={(data) => { this._clear('selectedYears', data) }}
                                                paper={this.props.papers[2]}
                                                sort={this._sortBarGraphData('year')}
                                                {...barSharedProps}
                                            />
                                            <h5>Months</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('month')}
                                                selectedLabels={this.state.selectedMonths}
                                                clickHandler={(data) => { this._graphClickHandler('selectedMonths', data.label) }}
                                                clickHandlerB={(data) => { this._clear('selectedMonths', data) }}
                                                bgroundClickHandler={(data) => { this._clear('selectedMonths', data) }}
                                                paper={this.props.papers[3]}
                                                sort={this._sortBarGraphData('month')}
                                                {...barSharedProps}
                                            />
                                        </div>
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
