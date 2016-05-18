var React = require('react');

module.exports = React.createClass({
    handleClick: function(event) {
        if (this.props.callback) this.props.callback();
    },
    render: function() {
        return (
            <button disabled={this.props.disabled} className="btn btn-default" type="button" onClick={this.handleClick}>
                {this.props.text}
            </button>
        );
    }
});