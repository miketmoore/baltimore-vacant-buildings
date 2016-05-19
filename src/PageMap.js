var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');
var YearSelect = require('./YearSelect');

module.exports = React.createClass({
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
    render () {
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-6">
                        <h4>Vacancies by Year</h4>
                        <MapView year={this.state.currentYear} model={this.props.model} />
                    </div>
                    <div className="col-md-6">
                        <h4>Current Year <YearSelect currentYear={this.state.currentYear} changeHandler={this.changeHandler} years={this.state.years} /></h4>

                        <h4>Total Entries: <small>{this.state.totalEntries}</small></h4>
                    </div>
                </div>
            </Layout>
        )
    }
})
