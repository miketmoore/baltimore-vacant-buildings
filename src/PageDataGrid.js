var React = require('react');
var Layout = require('./Layout');
import ReactDataGrid from 'react-data-grid/addons';

module.exports = React.createClass({
    getDefaultProps () {
        return {
            vacanciesManualColumns: [
                {"key":":id","name":"ID","resizable":true},
                {"key":"buildingaddress","name":"Address","resizable":true},
                {"key":"noticedate","name":"Notice Date","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"policedistrict","name":"Police District","resizable":true},
                {"key":"councildistrict","name":"Council District","resizable":true},
                {"key":"location","name":"Location","resizable":true}
            ],
            crimeManualColumns: [
                {"key":"id","name":"ID","resizable":true},
                {"key":"crimedate","name":"Crime Date","resizable":true},
                {"key":"crimetime","name":"Crime Time","resizable":true},
                {"key":"location","name":"Location","resizable":true},
                {"key":"neighborhood","name":"Neighborhood","resizable":true},
                {"key":"total_incidents","name":"Total Incidents","resizable":true}
            ]
        };
    },
    rowGetterVacancies (i) {
        var row = this.props.modelVacancies.rows[i];
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
    rowGetterCrime (i) {
        return this.props.modelCrime.rows[i];
    },
    render () {
        return (
            <Layout>
                <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="active"><a href="#vacancies" aria-controls="vacancies" role="tab" data-toggle="tab">Vacancies</a></li>
                    <li role="presentation"><a href="#crime" aria-controls="crime" role="tab" data-toggle="tab">Crime</a></li>
                </ul>
                <div className="tab-content">
                    <div role="tabpanel" className="tab-pane active" id="vacancies">
                        <ReactDataGrid
                            columns={this.props.vacanciesManualColumns}
                            rowGetter={this.rowGetterVacancies}
                            rowsCount={this.props.modelVacancies.rows.length}
                            minHeight={500} />
                    </div>
                    <div role="tabpanel" className="tab-pane" id="crime">
                        <ReactDataGrid
                            columns={this.props.crimeManualColumns}
                            rowGetter={this.rowGetterCrime}
                            rowsCount={this.props.modelCrime.rows.length}
                            minHeight={500} />
                    </div>
                </div>

            </Layout>
        );
    }
})
