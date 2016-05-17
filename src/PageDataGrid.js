var React = require('react');
var Layout = require('./Layout');
import ReactDataGrid from 'react-data-grid/addons';

module.exports = React.createClass({
    getDefaultProps () {
        return {
            manualColumns: [
                {"key":":id","name":"ID","resizable":true},
                {"key":"buildingaddress","name":"Address","resizable":true},
                {"key":"noticedate","name":"Notice Date","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"policedistrict","name":"Police District","resizable":true},
                {"key":"councildistrict","name":"Council District","resizable":true},
                {"key":"location","name":"Location","resizable":true}
            ]
        };
    },
    rowGetter (i) {
        var row = this.props.model.rows[i];
        return {
            ":id":row[':id'],
            "buildingaddress":row['buildingaddress'],
            "noticedate":row['noticedate'],
            "neighborhood":row["neighborhood"],
            'policedistrict':row['policedistrict'],
            'councildistrict':row['councildistrict'],
            'location':row['location']
        };
    },
    render () {
        return (
            <Layout>
                <ReactDataGrid
                    columns={this.props.manualColumns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.props.model.rows.length}
                    minHeight={500} />
            </Layout>
        );
    }
})
