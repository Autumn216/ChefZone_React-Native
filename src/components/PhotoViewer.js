import React, { Component } from 'react';
import Dots from 'react-native-dots-pagination';
import FastImage from 'react-native-fast-image';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Fonts from '../theme/Fonts';

const win = Dimensions.get('window');

export default class PhotoViewer extends Component {
    constructor() {
        super();
        this.state = {
          active: 0
        }
    }

    onScrollEnd=(e)=> {
        const { photos } = this.props; 

        let viewSize = e.nativeEvent.layoutMeasurement;
        let pageNum = Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / viewSize.width), 0), photos.length);
        this.setState({active: pageNum});
    }

    render() {
        const { active } = this.state;
        const { photos } = this.props;
        return (
            <View style={[this.props.style]}>
                <ScrollView 
                    style={styles.photoContainer} 
                    horizontal={true} 
                    pagingEnabled={true} 
                    onMomentumScrollEnd={this.onScrollEnd} 
                >
                    <View style={{flexDirection: 'row'}} onStartShouldSetResponder={() => true}>
                        {
                            photos.map((photo, i) =>
                               <FastImage source={{uri: photo}} style={styles.photoImage} key={i.toString()}/>
                            )
                        }
                    </View>                            
                </ScrollView>
                {
                    (photos && photos.length > 1) &&
                    <View style={{marginTop: -50}}>
                        <Dots 
                            length={photos.length} 
                            active={active} 
                            activeDotWidth={13}
                            activeDotHeight={13}
                            passiveDotWidth={10}
                            passiveDotHeight={10}
                            activeColor={Colors.appColor}
                            passiveColor={"rgba(255, 255, 255, 0.5)"}
                        />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    photoContainer: {

    },
    photoImage: {
        width: win.width,
        height: 270,
        backgroundColor: 'lightgray',
    },
});