var React = require('react');
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
var Modal = require('react-modal');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            center: [39.290, -76.6122],
            width: '400px',
            height: '400px',
            data: []
        };
    },
    getInitialState () {
        return {
            marker: {},
            modalIsOpen: false
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
                defaultAnimation: 0,
                address: obj.address
            });
        }
        return markers;
    },
    _closeModal () {
        this.setState({modalIsOpen:false});
    },
    _markerOnClick (marker) {
        console.log('_markerOnClick ', arguments);
        this.setState({
            modalIsOpen: true,
            marker: marker
        });
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
        var customStyles = {
            content : {
                position                   : 'absolute',
                top                        : '40px',
                left                       : '40px',
                right                      : '40px',
                bottom                     : '40px',
                border                     : '1px solid #ccc',
                background                 : '#fff',
                overflow                   : 'auto',
                WebkitOverflowScrolling    : 'touch',
                borderRadius               : '4px',
                outline                    : 'none',
                padding                    : '20px'

            }
        };
        return (

            <div className="row" style={{height: "100%"}}>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this._closeModal}
                    style={customStyles}
                    >
                    <div className="row">
                        <div className="col-md-8">
                            <p>{this.state.marker ? this.state.marker.address : null}</p>
                        </div>
                    </div>
                </Modal>
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
                                        <Marker {...marker} key={index} onClick={() => this._markerOnClick(marker, index)} onRightclick={() => props.onMarkerRightclick(index)} />
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
