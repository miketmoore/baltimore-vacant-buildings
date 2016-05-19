var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var YearSelect = require('./YearSelect');
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
            totalEntries: 0
        };
    },
    yearChange () {
        console.log('PageMap.yearChange() ', this, arguments);
    },
    changeHandler (year) {
        this.setState({ currentYear: year });
    },
    componentWillReceiveProps (props) {
        var byYear = props.model.index.get('yyyy');
        var years = Array.from(byYear.keys()).sort();
        var currentYear = years[years.length-1];
        var totalEntries = byYear.get(currentYear).size;
        this.setState({
            years: years,
            currentYear: currentYear,
            totalEntries: totalEntries
        });
    },
    gridRowGetter (i) {
        var row = this.props.model.rows[i];
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
                    <div className="col-md-8">
                        <h4>Vacancies by Year</h4>
                        <MapView width="700px" year={this.state.currentYear} model={this.props.model} />
                    </div>
                    <div className="col-md-4">
                        <h4>Current Year</h4>
                        <YearSelect currentYear={this.state.currentYear} changeHandler={this.changeHandler} years={this.state.years} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h4>List <small>{this.state.totalEntries}</small></h4>
                        <ReactDataGrid
                            columns={this.props.gridColumns}
                            rowGetter={this.gridRowGetter}
                            rowsCount={this.props.model.rows.length}
                            minHeight={500} />
                    </div>
                </div>
            </Layout>
        )
    }
})
