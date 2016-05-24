var React = require('react');
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

module.exports = React.createClass({
    getDefaultProps () {
        return {
            center: [39.290, -76.6122],
            width: '400px',
            height: '400px',
            data: []
        };
    },
    _buildMarkers () {
        var markers = [];
        var obj, marker, lat, lng, year, month, key;
        var data = this.props.data;
        for ( var i = 0; i < data.length; i++ ) {
            obj = data[i];
            markers.push({
                position: {
                    lat: parseFloat(obj.latitude),
                    lng: parseFloat(obj.longitude)
                },
                key: obj.key,
                defaultAnimation: 0
            });
        }
        return markers;
    },
    render () {
        if (!this.props.center.length) return null;
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
                                defaultCenter={{ lat: this.props.center[0], lng: this.props.center[1] }}
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
