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

        var markers = new Set();
        var count = 0;
        for ( var obj of props.model.index.get(':id').values() ) {
            if (count == 50) break;
            var lat = parseFloat(obj.location[1]);
            var lng = parseFloat(obj.location[2]);
            markers.add({
                position: {
                    lat: lat,
                    lng: lng
                },
                key: obj[':id'],
                defaultAnimation: 2
            });
            count++;
        }

        this.setState({
            sampleObj: obj,
            centerCoords: centerCoords,
            markers: Array.from(markers.values())
        });

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
        return (

            <div className="row" style={{height: "100%"}}>
                <div className="col-md-6">
                    <GoogleMapLoader
                        containerElement={
                            <div
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    height: '500px'
                                }}
                            />
                        }
                        googleMapElement={
                            <GoogleMap
                                ref={(map) => console.log('GoogleMap component ref map: ', map)}
                                defaultZoom={20}
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
