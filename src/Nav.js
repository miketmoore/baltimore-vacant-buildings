var React = require('react');

module.exports = React.createClass ({
    getDefaultProps () {
        return {
            title: ''
        };
    },
    render () {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">{this.props.title}</a>
                </div>
            </nav>
        )
    }
});
