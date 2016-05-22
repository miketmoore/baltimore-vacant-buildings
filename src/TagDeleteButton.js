var React = require('react');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            clickHandler: function () {
                console.log('TagDeleteButton.clickHandler');
            }
        };
    },
    render () {
        return (
            <span
                className="glyphicon glyphicon-remove pointer"
                onClick={this.props.clickHandler}
                aria-hidden="true"></span>
        );
    }
});
