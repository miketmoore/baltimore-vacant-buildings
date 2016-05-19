var React = require('react');

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
        var year = event.target.value;
        if (this.props.changeHandler) this.props.changeHandler(year);
        this.setState({ currentYear: year });
    },
    componentWillReceiveProps (props) {
        this.setState({
            years: props.years,
            currentYear: props.currentYear
        });
    },
    render () {
        return (
           <select value={this.state.currentYear} onChange={this.change}>
               {this._getYearOptions()}
           </select>
        )
    }
})
