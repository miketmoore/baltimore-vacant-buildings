var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');

module.exports = React.createClass({
    getInitialState () {
        return {
            years: [],
            currentYear: ''
        };
    },
    _getYearOptions () {
        return this.state.years.map((year) => {
            return (
                <option value={year}  key={year}>{year}</option>
            );
        });
    },
    change (event) {
        console.log(event.target.value);
        this.setState({ currentYear: event.target.value });
    },
    componentWillReceiveProps (props) {
        console.log('PageMap.componentWillReceiveProps() props: ', props);
        var years = props.model.getDistinct('yyyy');
        this.setState({
            years: years,
            currentYear: years[years.length-1]
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
                        <h4>Current Year</h4>
                        <select value={this.state.currentYear} onChange={this.change}>
                            {this._getYearOptions()}
                        </select>
                    </div>
                </div>
            </Layout>
        )
    }
})
