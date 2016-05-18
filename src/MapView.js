var React = require('react');
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

module.exports = React.createClass({
    getInitialState () {
        return {
            coords: []
        };
    },
    getDefaultProps () {
        return {

        };
    },
    componentWillReceiveProps (props) {
        console.log('MapView.componentWillReceiveProps() props: ', props);
        // extract coords
        var obj = props.model.index.get(':id').values().next().value;
        var loc = obj.location;
        var coords = [parseFloat(loc[1]), parseFloat(loc[2])];
        console.log('>>> ', obj, coords);
        this.setState({
            coords: coords
        });

    },
    render () {
        console.log('Map.render()');
        var props = {
            markers: {
                map: function () {

                }
            },
            onMapClick: function () {

            },
            onMarkerRightclick: function () {

            }
        };
        if (!this.state.coords.length) return null;
        return (

            <div className="row" style={{height: "100%"}}>
                <div className="col-md-6">
                    <GoogleMapLoader
                        containerElement={
                    <div
                        style={{
                            display: 'block',
                            height: '400px',
                            width: '400px'
                        }}
                    />
                }
                        googleMapElement={
                    <GoogleMap
                        ref={(map) => console.log('map: ', map)}
                        defaultZoom={3}
                        defaultCenter={{ lat: this.state.coords[0], lng: this.state.coords[1] }}
                        onClick={props.onMapClick}
                    >
                        {props.markers.map((marker, index) => {
                            return (
                                <Marker
                                    onRightclick={() => props.onMarkerRightclick(index)} />
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
