var React = require('react');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            label: 'Button',
            disabled: false
        };
    },
    _clickHandler (event) {
        if (this.props.clickHandler) this.props.clickHandler();
    },
    render () {
        return (
           <button disabled={this.props.disabled} onClick={this._clickHandler} className="btn btn-default">{this.props.label}</button>
        )
    }
})
