import React from 'react';
import {render} from 'react-dom';
import ReactDataGrid from 'react-data-grid/addons';
require("react-data-grid/themes/react-data-grid.css");
var Model = require('./Model');
var Nav = require('./Nav');
var BasicInfo = require('./BasicInfo');
var PaperBarGraph = require('./Paper/BarGraph');

var dataSource = "data/baltimore-vacant-buildings.json";

var App = React.createClass ({
    getInitialState () {
        return {
            title: 'Baltimore Vacant Buildings',
            model: new Model(),
            columns: [],
            manualColumns: [
                {"key":":id","name":"ID","resizable":true},
                {"key":"buildingaddress","name":"Address","resizable":true},
                {"key":"noticedate","name":"Notice Date","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"policedistrict","name":"Police District","resizable":true},
                {"key":"councildistrict","name":"Council District","resizable":true},
                {"key":"location","name":"Location","resizable":true}
            ],
            rows: []
        }
    },
    componentWillMount () {
    },
    componentDidMount () {
        this.serverRequest = $.get(this.props.source, function (result) {
            console.log('loaded data source: ', result);
            this.state.model.setRaw(result);
            this.setState({
                columns: this.state.model.columns,
                rows: this.state.model.rows
            });
        }.bind(this));
    },
    componentWillUnmount () {
        this.serverRequest.abort();
    },
    render () {
        function rowGetter (i) {
            var row = this.state.rows[i];
            return {
                ":id":row[':id'],
                "buildingaddress":row['buildingaddress'],
                "noticedate":row['noticedate'],
                "neighborhood":row["neighborhood"],
                'policedistrict':row['policedistrict'],
                'councildistrict':row['councildistrict'],
                'location':row['location']
            };
        }
        return (
            <div>
                <Nav title={this.state.title} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <ul id="tabs" className="nav nav-tabs" role="tablist">
                                <li role="presentation" className="active">
                                    <a href="#datagrid" aria-controls="datagrid" role="tab" data-toggle="tab">Data Grid</a>
                                </li>
                                <li role="presentation">
                                    <a href="#fields" aria-controls="fields" role="tab" data-toggle="tab">Fields</a>
                                </li>
                                <li role="presentation">
                                    <a href="#bargraph" aria-controls="bargraph" role="tab" data-toggle="tab">Bar Graph</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane active" id="datagrid">
                                    <ReactDataGrid
                                        columns={this.state.manualColumns}
                                        rowGetter={rowGetter.bind(this)}
                                        rowsCount={this.state.rows.length}
                                        minHeight={500} />
                                </div>
                                <div role="tabpanel" className="tab-pane" id="fields">
                                    <BasicInfo model={this.state.model} />
                                </div>
                                <div role="tabpanel" className="tab-pane" id="bargraph">
                                    <PaperBarGraph model={this.state.model} />
                                </div>
                              </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})

render(<App source={dataSource} />, document.getElementById('app'));
