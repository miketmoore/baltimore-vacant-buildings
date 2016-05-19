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
            entries: []
        };
    },
    _init (props) {
        if (!props) props = this.props;
        // extract centerCoords
        var centerCoords = [39.290, -76.6122];
        console.log('centerCoords: ', centerCoords);
        var markersByDate = new Map();
        var obj, marker, lat, lng, year, month, key;
        var values = props.entries;
        console.log('MapView._init values.length: ', values.length);
        for ( var i = 0; i < values.length; i++ ) {
            obj = values[i];
            lat = parseFloat(obj.location[1]);
            lng = parseFloat(obj.location[2]);f
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
            console.log('marker: ', marker);
            if (!markersByDate.has(key)) markersByDate.set(key, new Set());
            markersByDate.get(key).add(marker);
        }

        var stateObj = {
            sampleObj: obj,
            centerCoords: centerCoords,
            markers: []
        };
        if (markersByDate.has(props.year + '-' + props.month)) {
            stateObj.markers = Array.from(markersByDate.get(props.year + '-' + props.month).values())
        }
        this.setState(stateObj);
    },
    componentWillReceiveProps (props) {
        this._init(props);

    },
    componentWillMount () {
        if (this.props.entries.length) this._init();
    },
    render () {
        if (!this.state.centerCoords.length) return null;
        var props = {
            markers: this.state.markers,
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
