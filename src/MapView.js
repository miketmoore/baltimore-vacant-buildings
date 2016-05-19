var React = require('react');
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

module.exports = React.createClass({
    getInitialState () {
        return {
            centerCoords: [],
            markers: []
        };
    },
    getDefaultProps () {
        return {

        };
    },
    componentWillReceiveProps (props) {
        console.log('MapView.componentWillReceiveProps() props: ', props);
        // extract centerCoords
        var obj = props.model.index.get(':id').values().next().value;
        var loc = obj.location;
        var centerCoords = [parseFloat(loc[1]), parseFloat(loc[2])];
        console.log('sample obj and centerCoords ', obj, centerCoords);

        var markersByYear = new Map();
        var marker, lat, lng, year;
        for ( var obj of props.model.index.get(':id').values() ) {
            lat = parseFloat(obj.location[1]);
            lng = parseFloat(obj.location[2]);
            year = obj.year;
            marker = {
                position: {
                    lat: lat,
                    lng: lng
                },
                key: obj[':id'],
                defaultAnimation: 2
            };
            if (!markersByYear.has(year)) markersByYear.set(year, new Set());
            markersByYear.get(year).add(marker);
        }

        var stateObj = {
            sampleObj: obj,
            centerCoords: centerCoords,
            markers: []
        };
        if (markersByYear.has(props.year)) {
            stateObj.markers = Array.from(markersByYear.get(props.year).values())
        }
        this.setState(stateObj);

    },
    render () {
        console.log('Map.render()');
        if (!this.state.centerCoords.length) return null;
        var props = {
            markers: this.state.markers,
            onMapClick: function () {
                console.log('onMapClick(): ', arguments);
            },
            onMarkerRightclick: function (index) {
                console.log('onMarkerRightclick() index: ', index);
            }
        };
        console.log('MapView.render() currentYear: ', this.props.currentYear);
        return (

            <div className="row" style={{height: "100%"}}>
                <div className="col-md-6">
                    <GoogleMapLoader
                        containerElement={
                            <div
                                style={{
                                    display: 'block',
                                    width: this.props.width,
                                    height: '500px'
                                }}
                            />
                        }
                        googleMapElement={
                            <GoogleMap
                                ref={(map) => console.log('GoogleMap component ref map: ', map)}
                                defaultZoom={12}
                                defaultCenter={{ lat: this.state.centerCoords[0], lng: this.state.centerCoords[1] }}
                                onClick={props.onMapClick}
                            >
                                {props.markers.map((marker, index) => {
                                    return (
                                        <Marker {...marker} key={index} onRightclick={() => props.onMarkerRightclick(index)} />
                                    );
                                })}
                            </GoogleMap>
                        }
                    />
                </div>
            </div>
        );
    }
});
