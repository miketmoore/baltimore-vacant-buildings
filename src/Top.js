var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Model = require('./Model');
var PageHome = require('./PageHome');
var PageBasicInfo = require('./PageBasicInfo');
var PageDataGrid = require('./PageDataGrid');

module.exports = React.createClass({
    getInitialState () {
        return {
            title: 'Baltimore Vacant Buildings',
            model: new Model(),
            columns: []
        }
    },
    componentWillMount () {
        console.log('Top.componentWillMount()');
    },
    componentDidMount () {
        console.log('Top.componentDidMount() this.props.source: ', this.props.source);
        this.serverRequest = $.get(this.props.source, function (result) {
            console.log('loaded data source: ', result);
            this.state.model.setRaw(result);
            this.setState({
                columns: this.state.model.columns
            });
        }.bind(this));
    },
    componentWillUnmount () {
        console.log('Top.componentWillUnmount()');
        this.serverRequest.abort();
    },
    render () {
        console.log('Top.render()');
        return (
            <Locations hash childProps={{model: this.state.model}}>
              <Location path="/" handler={PageHome} />
              <Location path="/data-grid" handler={PageDataGrid} />
              <Location path="/basic-info" handler={PageBasicInfo} />
            </Locations>
        )
    }
})
