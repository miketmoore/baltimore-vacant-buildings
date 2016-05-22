var React = require('react');
var Layout = require('./Layout');
var CustomMap = require('./CustomMap');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            papers: [new paper.PaperScope()]
        };
    },
    render () {
        return (
            <Layout>
                <CustomMap paper={this.props.papers[0]} />
            </Layout>
        );
    }
});
