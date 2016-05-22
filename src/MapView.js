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
            centerCoords: [39.290, -76.6122],
            width: '400px',
            height: '400px',
            entries: []
        };
    },
    _buildMarkers () {
        var markersByDate = new Map();
        var obj, marker, lat, lng, year, month, key;
        var values = this.props.entries;
        for ( var i = 0; i < values.length; i++ ) {
            obj = values[i];
            lat = parseFloat(obj.location[1]);
            lng = parseFloat(obj.location[2]);
            year = obj.year;
            month = obj.month;
            key = year + '-' + month;
            marker = {
                position: {
                    lat: lat,
                    lng: lng
                },
                key: obj[':id'],
                defaultAnimation: 2
            };
            if (!markersByDate.has(key)) markersByDate.set(key, new Set());
            markersByDate.get(key).add(marker);
        }

        key = this.props.year + '-' + this.props.month;
        if (markersByDate.has(key)) {
            return Array.from(markersByDate.get(key).values())
        }
        return [];
    },
    render () {
        if (!this.props.centerCoords.length) return null;
        var props = {
            markers: this._buildMarkers(),
            onMapClick: function () {
                //console.log('onMapClick(): ', arguments);
            },
            onMarkerRightclick: function (index) {
                //console.log('onMarkerRightclick() index: ', index);
            }
        };
        return (

            <div className="row" style={{height: "100%"}}>
                <div className="col-md-6">
                    <GoogleMapLoader
                        containerElement={
                            <div
                                style={{
                                    display: 'block',
                                    width: this.props.width,
                                    height: this.props.height
                                }}
                            />
                        }
                        googleMapElement={
                            <GoogleMap
                                defaultZoom={10}
                                defaultCenter={{ lat: this.props.centerCoords[0], lng: this.props.centerCoords[1] }}
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
