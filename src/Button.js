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
        if (this.props.visible) {
            return (
                <button
                    onClick={this._clickHandler}
                    className="btn btn-default btn-xs">
                    {this.props.label}
                </button>
            )
        } else {
            return null;
        }
    }
})
