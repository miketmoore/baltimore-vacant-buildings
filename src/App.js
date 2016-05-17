import React from 'react';
import {render} from 'react-dom';
import ReactDataGrid from 'react-data-grid/addons';
require("react-data-grid/themes/react-data-grid.css");
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Model = require('./Model');
var Nav = require('./Nav');
var BasicInfo = require('./BasicInfo');
var PaperBarGraph = require('./Paper/BarGraph');

var dataSource = "data/baltimore-vacant-buildings.json";

var Main = React.createClass ({
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
        console.log('componentDidMount this.props.source: ', this.props.source);
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
            <Layout>
                <ReactDataGrid
                    columns={this.state.manualColumns}
                    rowGetter={rowGetter.bind(this)}
                    rowsCount={this.state.rows.length}
                    minHeight={500} />
            </Layout>
        );
    }
});

var App = React.createClass({
    render () {
        return (
            <Main source={dataSource}/>
        );
    }
});

var Layout = React.createClass({
    getDefaultProps () {
        return {
            title: "Baltimore Vacant Buildings"
        };
    },
    render () {
        return (
            <div>
                <Nav title={this.props.title} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var Foo = React.createClass({
    render () {
        return (
            <Layout>
                Foo
            </Layout>
        );
    }
})

{/* render(<App source={dataSource} />, document.getElementById('app')); */}
render(
    <Locations hash childProps={{foo: 'bar'}}>
      <Location path="/" handler={App} />
      <Location path="/foo" handler={Foo} />
      <Location path="/basic-info" handler={BasicInfo} />
      <Location path="/bar-graph" handler={PaperBarGraph} />
    </Locations>,
    document.getElementById('app')
);
