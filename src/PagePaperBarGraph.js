var React = require('react');
var Layout = require('./Layout');
var BarGraphMain = require('./BarGraph/Main');

module.exports = React.createClass({
    render () {
        return (
            <Layout>
                <BarGraphMain model={this.props.model} />
            </Layout>
        );
    }
})
