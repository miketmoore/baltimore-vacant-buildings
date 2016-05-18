var React = require('react');
var Layout = require('./Layout');
var MapView = require('./MapView');

module.exports = React.createClass({
    render () {
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Map View</h4>
                        <MapView model={this.props.model} />
                    </div>
                </div>
            </Layout>
        )
    }
})
