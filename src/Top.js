var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Model = require('./Model');
var PageHome = require('./PageHome');
var PageAbout = require('./PageAbout');
var ServerConnect = require('./ServerConnect');

module.exports = React.createClass({
    getInitialState () {
        return {
            title: 'Baltimore Vacant Buildings',
            columns: []
        }
    },
    componentDidMount () {
        ServerConnect.connect.call(this, {
            model: this.props.model,
            source: this.props.source,
            XMLHttpRequest: this.props.XMLHttpRequest,
            onload: function (xhr) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    params.model.setRaw(data);
                    this.setState({
                        columns: params.model.columns
                    });
                }
                else {
                    throw new Error('Server request for data failed. Status: ' + xhr.status);
                }
            }
        });
    },
    render () {
        return (
            <Locations hash childProps={{model: this.props.model, paper: this.props.paper}}>
              <Location path="/" handler={PageHome} />
              <Location path="/about" handler={PageAbout} />
            </Locations>
        )
    }
})
