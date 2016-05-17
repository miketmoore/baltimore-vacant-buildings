var React = require('react');

module.exports = React.createClass({
    render () {
        var key = this.props.itemKey;
        return (
            <li key={key}>{key}</li>
        )
    }
});
