var React = require('react');
var Nav = require('./Nav');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            title: "Baltimore Vacant Buildings"
        };
    },
    render () {
        return (
            <div>
                <Nav title={this.props.title} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
