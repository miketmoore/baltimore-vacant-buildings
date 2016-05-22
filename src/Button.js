var React = require('react');
var classNames = require('classnames');

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
        var btnClass = classNames({
            'btn': true,
            'btn-default': true,
            'btn-xs': (this.props.size == 'xs')
        });
        return (
            <button
                disabled={this.props.disabled}
                onClick={this._clickHandler}
                className={btnClass}
            >
                {this.props.label}
            </button>
        );
    }
});