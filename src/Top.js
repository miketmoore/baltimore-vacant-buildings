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
            columns: []
        }
    },
    componentDidMount () {
        var that = this;
        var model = this.props.model;
        var xhr = new this.props.XMLHttpRequest();
        xhr.open('GET', encodeURI(this.props.source));
        xhr.onload = function () {
            if (this.status === 200) {
                var data = JSON.parse(this.responseText);
                model.setRaw(data);
                that.setState({
                    columns: model.columns
                });
            }
            else {
                throw new Error('Server request for data failed. Status: ' + this.status);
            }
        };
        xhr.send();
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
