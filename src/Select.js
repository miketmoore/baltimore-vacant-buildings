var React = require('react');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            values: [],
            currentVal: ''
        };
    },
    _getOptions () {
        return this.props.values.map((val) => {
            return (
                <option value={val}  key={val}>{val}</option>
            );
        });
    },
    changeHandler (event) {
        var val = event.target.value;
        if (this.props.changeHandler) this.props.changeHandler(val);
        this.setState({ currentVal: val });
    },
    componentWillReceiveProps (props) {
        this.setState({
            values: props.values,
            currentVal: props.currentVal
        });
    },
    render () {
        return (
           <select value={this.props.currentVal} onChange={this.changeHandler}>
               {this._getOptions()}
           </select>
        )
    }
})
