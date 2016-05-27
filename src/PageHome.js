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
                {'key':'year','stateKey':'years'},
                {'key':'month','stateKey':'months'},
                {'key':'day','stateKey':'days'},
                {'key':'councildistrict','stateKey':'councilDistricts'},
                {'key':'policedistrict','stateKey':'policeDistricts'},
                {'key':'block','stateKey':'blocks'},
                {'key':'lot','stateKey':'lots'},
                {'key':'neighborhood','stateKey':'neighborhoods'}
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
            barGraphProps: {
                bgroundcolor: '#4EC0CC',
                barcolor: "#33627A",
                barcolorhover: "#719BB0",
                barcolorselected: "#BEE7FA",
                bordercolor: '#7790D9',
                fontcolora: "#FFFFFF",
                fontcolorb: "#33627A",
                displayLabels: false,
                hoverLabelColor: '#33627A',
                viewHeight: 70,
                barMax: 50,
                barMargin: 3
            }
        };
    },
    getInitialState() {
        return {
            years: new Set(),
            months: new Set(),
            days: new Set(),
            councilDistricts: new Set(),
            policeDistricts: new Set(),
            blocks: new Set(),
            lots: new Set(),
            neighborhoods: new Set()
        };
    },
    _changeHandler (key, val) {
        var a = this.state[key];
        if (!val.length) {
            this._clear(key);
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
        var years = new Set([allYears[allYears.length-1]]);
        var months = new Set([Array.from(model.index.get('months'))[0]]);

        var filters = {};
        if (this.state.years.size) filters.year = Array.from(this.state.years.values());
        if (this.state.months.size) filters.month = Array.from(this.state.months.values());
        if (this.state.days.size) filters.day = Array.from(this.state.days.values());
        var entries = this.props.model.filter(filters);

        this.setState({
            years: years,
            months: months
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
            { key: 'years', label: 'Years', onDelete: () => this._clear('years') },
            { key: 'months', label: 'Months', onDelete: () => this._clear('months') },
            { key: 'days', label: 'Days', onDelete: () => this._clear('days') },
            { key: 'councilDistricts', label: 'Council Districts', onDelete: () => this._clear('councilDistricts') },
            { key: 'policeDistricts', label: 'Police Districts', onDelete: () => this._clear('policeDistricts') },
            { key: 'neighborhoods', label: 'Neighborhoods', onDelete: () => this._clear('neighborhoods') },
            { key: 'blocks', label: 'Blocks', onDelete: () => this._clear('blocks') },
            { key: 'lots', label: 'Lots', onDelete: () => this._clear('lots') }
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
                                            onChange={(val) => this._changeHandler('years', val)}
                                            value={Array.from(this.state.years.values())}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Months</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('months')}
                                            onChange={(val) => this._changeHandler('months', val)}
                                            value={Array.from(this.state.months.values())}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <h5>Days</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('days')}
                                            onChange={(val) => { this._changeHandler('days', val) }}
                                            value={Array.from(this.state.days.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Neighborhoods</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('sortedNeighborhoods')}
                                            onChange={(val) => this._changeHandler('neighborhoods', val)}
                                            value={Array.from(this.state.neighborhoods.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <h5>Blocks</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('sortedBlocks')}
                                            onChange={(val) => this._changeHandler('blocks', val)}
                                            value={Array.from(this.state.blocks.values())}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <h5>Lots</h5>
                                        <Multiselect
                                            placeholder="Search..."
                                            data={this.props.model.index.get('sortedLots')}
                                            onChange={(val) => this._changeHandler('lots', val)}
                                            value={Array.from(this.state.lots.values())}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="col-md-6">
                                            <h5>Council Districts</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('councildistrict')}
                                                selectedLabels={this.state.councilDistricts}
                                                clickHandler={(data) => { this._graphClickHandler('councilDistricts', data.label) }}
                                                clickHandlerB={(data) => { this._clear('councilDistricts', data) }}
                                                bgroundClickHandler={(data) => { this._clear('councilDistricts', data) }}
                                                paper={this.props.papers[0]}
                                                sort={this._sortBarGraphData('councildistrict')}
                                                {...this.props.barGraphProps}
                                            />
                                            <h5>Police Districts</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('policedistrict')}
                                                selectedLabels={this.state.policeDistricts}
                                                clickHandler={(data) => { this._graphClickHandler('policeDistricts', data.label) }}
                                                clickHandlerB={(data) => { this._clear('policeDistricts', data) }}
                                                bgroundClickHandler={(data) => { this._clear('policeDistricts', data) }}
                                                paper={this.props.papers[1]}
                                                sort={this._sortBarGraphData('policedistrict')}
                                                {...this.props.barGraphProps}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Years</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('year')}
                                                selectedLabels={this.state.years}
                                                clickHandler={(data) => { this._graphClickHandler('years', data.label) }}
                                                clickHandlerB={(data) => { this._clear('years', data) }}
                                                bgroundClickHandler={(data) => { this._clear('years', data) }}
                                                paper={this.props.papers[2]}
                                                sort={this._sortBarGraphData('year')}
                                                {...this.props.barGraphProps}
                                            />
                                            <h5>Months</h5>
                                            <BarGraphSmall
                                                data={this._getBarGraphData('month')}
                                                selectedLabels={this.state.months}
                                                clickHandler={(data) => { this._graphClickHandler('months', data.label) }}
                                                clickHandlerB={(data) => { this._clear('months', data) }}
                                                bgroundClickHandler={(data) => { this._clear('months', data) }}
                                                paper={this.props.papers[3]}
                                                sort={this._sortBarGraphData('month')}
                                                {...this.props.barGraphProps}
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
