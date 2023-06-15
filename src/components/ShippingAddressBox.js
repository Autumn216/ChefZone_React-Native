import React, { Component } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    Text, 
    TouchableOpacity 
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { generatedMapStyle, GOOGLE_API_KEY } from '../constants.js'
import Fonts from '../theme/Fonts'
import Images from '../theme/Images'
import Colors from '../theme/Colors'

export default  class ShippingAddressBox extends Component {
    render() {
        const { data, isShowEdit, onEdit } = this.props;
        const address = (data && data.address) ? data.address : null;
        var subText = '';
        const apt = (data && data.apt) ? data.apt : '';
        const zipcode = (data && data.zipcode) ? data.zipcode : '';
        const lat = (data && data.lat) ? data.lat : 0;
        const lng = (data && data.lng) ? data.lng : 0;
        if (apt && apt.length > 0) {
            subText = apt + ", ";
        }

        if (zipcode && zipcode.length > 0) {
        subText += zipcode;
        }

        return (
            <View style={styles.sectionBox}>
            <View style={styles.shippingInfo}>
                <Text style={styles.labelText}>Shipping Address</Text>
                {
                    address 
                    ? <Text style={styles.valueText}>{address}</Text>
                    : null
                }
                {
                    subText 
                    ? <Text style={styles.subText}>{subText}</Text>
                    : null
                }
                {
                    isShowEdit &&
                    <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(data)}>
                        <Image source={Images.icon_edit} style={styles.editIcon}/>
                    </TouchableOpacity>
                }                
            </View>
            {
                (data)
                ? <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapView}
                    ref={ref => (this.mapView = ref)}
                    region={{
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                    }}
                    customMapStyle = { generatedMapStyle }
                >
                    <Marker
                        coordinate={{
                        latitude: lat,
                        longitude: lng,
                        }}
                    /> 
                </MapView>
                : <Text style={styles.placeholderText}>No shipping address yet.</Text>
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionBox: {
        padding: 5,
        marginHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: Colors.borderColor,
        paddingBottom: 20,
    },
    
    shippingInfo: {
        paddingTop: 10,
        paddingBottom: 10,
    },

    labelText: {
        fontFamily: Fonts.avenirBlack,
        fontSize: 16,
        color: 'gray',
    },

    valueText: {
        fontFamily: Fonts.avenirRoman,
        fontSize: 16,
        marginTop: 8,
    },

    subText: {
        fontFamily: Fonts.avenirRoman,
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 14,
        marginTop: 5,
    },

    editBtn: {
        position: 'absolute',
        right: 0,
        top: 8,
    },

    editIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },

    mapView: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },

    placeholderText: {
        fontFamily: Fonts.avenirBook,
        color: 'gray',
    },
});