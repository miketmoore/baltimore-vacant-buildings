var React = require('react');
var Layout = require('./Layout');
var CustomMap = require('./CustomMap');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            papers: [new paper.PaperScope()]
        };
    },
    _getMapData (entries) {
        var data = [];
        var entries = this.props.model.rows;
        var entry;
        for ( var i = 0; i < entries.length; i++ ) {
            entry = entries[i];
            data.push({
                key: entry[':id'],
                address: entry.buildingaddress,
                latitude: parseFloat(entry.location[1]),
                longitude: parseFloat(entry.location[2])
            });
        }
        return data;
    },
    render () {
        var data = this._getMapData();
        return (
            <Layout>
                <CustomMap data={data} paper={this.props.papers[0]} />
            </Layout>
        );
    }
});
