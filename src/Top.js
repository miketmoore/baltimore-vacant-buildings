var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var ModelVacancies = require('./ModelVacancies');
var ModelCrime = require('./ModelCrime');
var PageHome = require('./PageHome');
var PageBasicInfo = require('./PageBasicInfo');
var PageDataGrid = require('./PageDataGrid');
var PagePaperBarGraph = require('./PagePaperBarGraph');

module.exports = React.createClass({
    getInitialState () {
        return {
            title: 'Baltimore Vacant Buildings',
            modelVacancies: new ModelVacancies(),
            modelCrime: new ModelCrime(),
            columns: []
        }
    },
    componentWillMount () {
        console.log('Top.componentWillMount()');
    },
    componentDidMount () {
        console.log('Top.componentDidMount() this.props.dataSources: ', this.props.dataSources);
        var all = [];
        for ( var entry of this.props.dataSources.entries()) {
            all.push(new Promise(function (resolve, reject) {
                $.get(this.url)
                    .done(resolve)
                    .fail(reject);
            }.bind({
                url: entry[1]
            })));
        }
        this.serverRequest = Promise.all(all).then(function (data) {
            console.log('All server responses: ', data);
            this.state.modelVacancies.setRaw(data[0]);
            this.state.modelCrime.setRaw(data[1]);
            this.setState({
                columns: this.state.modelVacancies.columns
            })
        }.bind(this));
    },
    componentWillUnmount () {
        console.log('Top.componentWillUnmount()');
        this.serverRequest.abort();
    },
    render () {
        console.log('Top.render()');
        return (
            <Locations hash childProps={{modelCrime: this.state.modelCrime, modelVacancies: this.state.modelVacancies}}>
              <Location path="/" handler={PageHome} />
              <Location path="/data-grid" handler={PageDataGrid} />
              <Location path="/basic-info" handler={PageBasicInfo} />
              <Location path="/paper-bar-graph" handler={PagePaperBarGraph} />
            </Locations>
        )
    }
})
