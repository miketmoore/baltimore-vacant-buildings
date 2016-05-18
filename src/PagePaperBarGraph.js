var React = require('react');
var Layout = require('./Layout');
var PaperBarGraph = require('./PaperBarGraph');

module.exports = React.createClass({
    render () {
        return (
            <Layout>
                <PaperBarGraph modelVacancies={this.props.modelVacancies} />
            </Layout>
        );
    }
})
