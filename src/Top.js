var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Model = require('./Model');
var PageHome = require('./PageHome');
var PageAbout = require('./PageAbout');

module.exports = React.createClass({
    getInitialState () {
        return {
            title: 'Baltimore Vacant Buildings',
            model: new Model(),
            columns: []
        }
    },
    componentDidMount () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI(this.props.source));
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                this.state.model.setRaw(data);
                this.setState({
                    columns: this.state.model.columns
                });
            }
            else {
                throw new Error('Server request for data failed. Status: ' + xhr.status);
            }
        }.bind(this);
        xhr.send();
    },
    render () {
        return (
            <Locations hash childProps={{model: this.state.model}}>
              <Location path="/" handler={PageHome} />
              <Location path="/about" handler={PageAbout} />
            </Locations>
        )
    }
})
