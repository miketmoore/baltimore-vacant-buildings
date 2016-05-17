var React = require('react');
var Layout = require('./Layout');
var PaperBarGraph = require('./Paper/BarGraph');

module.exports = React.createClass({
    render () {
        console.log('PageBarGraph.render() this.props.model: ', this.props.model);
        return (
            <Layout>
                <PaperBarGraph model={this.props.model} />
            </Layout>
        )
    }
});
