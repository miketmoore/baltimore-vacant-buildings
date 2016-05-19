var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Model = require('./Model');
var PageHome = require('./PageHome');
var PagePaperBarGraph = require('./PagePaperBarGraph');
var PageMap = require('./PageMap');

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
        this.serverRequest = $.get(this.props.source, function (result) {
            this.state.model.setRaw(result);
            this.setState({
                columns: this.state.model.columns
            });
        }.bind(this));
    },
    componentWillUnmount () {
        this.serverRequest.abort();
    },
    render () {
        return (
            <Locations hash childProps={{model: this.state.model}}>
              <Location path="/" handler={PageMap} />
              <Location path="/bar-graph" handler={PagePaperBarGraph} />
            </Locations>
        )
    }
})
