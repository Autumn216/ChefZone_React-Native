import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Avatar from './Avatar'
import RoundButton from './RoundButton'
import TopTabBar from './TopTabBar'
import Rate from './Rate'
import ReviewCell from './ReviewCell'
import SubServicesBox from './SubServicesBox'
import TextView from './TextView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { JOB_STATUS } from '../constants'
import Fonts from '../theme/Fonts';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Styles from '../theme/Styles';

class UserProfileCard extends Component {
    constructor() {
        super()
        this.state = {
          currentPage: 0,
          rate: 0,
          reviewText: '',
          errorMessage: null,
        }
    }

    onSelectPage(index) {
        this.setState({currentPage: index});
    }

    getReview(jobHistory) {
        var avgRate = 0; 
        var jobCount = 0;
        if (jobHistory && jobHistory.length > 0) {
            jobHistory.forEach(job => {
                if (job.review) {
                    avgRate += job.review.score;
                    jobCount ++;
                }                
            });
            avgRate = Math.round( avgRate / jobCount );
            return avgRate;      
        }
        return 0;
    }

    checkWriteReview(userType, status) {
        if (userType === "game_assigner" && (status === JOB_STATUS.COMPLETED || status === JOB_STATUS.CANCELLED)) {
            return true;    
        }
        return false;
    }

    onChangeRate(rate) {
        this.setState({ rate: rate, errorMessage: null });
    }

    writeReview() {
        const { rate, reviewText } = this.state;
        if (rate <= 0) {
            this.setState({errorMessage: "Please select a rating."});
            return;
        }
    

        if (reviewText === null || reviewText.trim().length === 0) {
            this.setState({errorMessage: "Please write a review."});
            return;
        }

        this.props.onWriteReview(rate, reviewText.trim());
    }

    renderWriteReview() {
        const { errorMessage } = this.state;
        const { job } = this.props;
        var rate = this.state.rate;
        var text = this.state.reviewText;
        var isEditable = true;

        if (job.review) {
            rate = job.review.score;
            text = job.review.text;
            isEditable = false;
        }
        return (
            <View style={styles.writeReviewBox}>
                { isEditable && <Text style={styles.reviewTipText}>Your review will be public. Thank you for always being courteous and respectful.</Text> }
                <Rate size="xlarge" rate={rate} touchable={isEditable} style={{marginBottom: 20}} onChangeRate={(rate) => this.onChangeRate(rate)}/>
                {
                    isEditable
                    ? <View style={{ width: '100%', paddingLeft: 25, paddingRight: 25, marginBottom: 20 }}>
                            <TextView 
                                value={text} 
                                isEditable={isEditable}
                                onChangeText={(text) => this.setState({reviewText: text, errorMessage: null})} 
                            />
                        </View>
                    : <Text style={styles.feedbackText}>{text}</Text>
                }
                { errorMessage && <Text style={Styles.errorText}>{errorMessage}</Text>}                
                {
                    isEditable && 
                    <RoundButton 
                        title="Write a Review" 
                        theme="blue" 
                        style={styles.blueButton} 
                        onPress={() => this.writeReview()} 
                    />
                }
            </View>
        )
    }

    _renderAbout() {
        const { profile } = this.props;
        var sport = (profile && profile.sport) ? profile.sport : "";
        const email = (profile && profile.email) ? profile.email : "";
        const phone = (profile && profile.phone) ? profile.phone : "";
        const gender = (profile && profile.gender) ? profile.gender : "";
        const location = (profile && profile.location) ? profile.location : "";
        const type = (profile && profile.type) ? profile.type : "";
        const experience = (profile && profile.experience) ? profile.experience : "";
        const other = (profile && profile.other) ? profile.other : "";
        
        if (sport.toLowerCase() == "both") {
            sport = "Baseball & Softball";
        }

        return(
            <View style={styles.slideView}>
                <View style={styles.rowView}>
                    <View style={styles.colView}>
                        <Image source={Images.ico_phone} style={styles.icoImage} />
                        <Text style={styles.locationText}>{phone}</Text>
                    </View>
                </View>     
                
                <View style={styles.rowView}>
                    <View style={styles.colView}>
                        <Image source={Images.icon_gender} style={styles.icoImage} />
                        <Text style={styles.locationText}>{gender.toUpperCase()}</Text>
                    </View>
                </View>
            </View>
        ) 
    }
    render() {
        const { currentPage } = this.state;
        const { profile, userType, jobHistory, status, isShowInviteButton, onInvite, onSendMessage } = this.props;
        const reviewCount = jobHistory ? jobHistory.length : 0;
        const review = jobHistory ? this.getReview(jobHistory) : 0;
        var reviewText = "";
        if (reviewCount > 1) {
            reviewText = reviewCount + " Reviews";
        } else {
            reviewText = reviewCount + " Review";
        }
        
        const isShowWriteReview = this.checkWriteReview(userType, status);
        const firstName = (profile && profile.firstName) ? profile.firstName : "";
        const lastName = (profile && profile.lastName) ? profile.lastName : "";
        const name = firstName + " " + lastName;
        const rate = profile.rate ? profile.rate : '';

        return (
            <KeyboardAwareScrollView style={this.props.style}>
                <View style={styles.container}>
                    <Avatar 
                        avatar={profile.avatar} 
                        style={{marginTop: 20}}
                    />
                    <Text style={styles.nameText}>{name}</Text>
                    {
                        !isShowWriteReview && 
                        <Rate rate={review} size="large" />
                    }
                    <RoundButton 
                        title="SEND MESSAGE" 
                        theme="blue" 
                        style={styles.chatButton} 
                        onPress={() => onSendMessage(profile)} 
                    />              
                    {
                        isShowWriteReview
                        ? this.renderWriteReview()
                        : <View style={styles.contentView}>
                            <TopTabBar 
                                titles={["ABOUT", "REVIEWS"]} 
                                currentPage={this.state.currentPage} 
                                onSelectPage={(index) => this.onSelectPage(index)} 
                                style={{backgroundColor: 'white'}}
                            />

                            {/* About Page */}
                            {currentPage == 0 && this._renderAbout()}

                            {/* Review Page */}
                            {
                                currentPage == 1 && 
                                <View style={{flex: 1}}>
                                    <View style={styles.reviewInfo}>
                                        <Text style={styles.reviewInfoText}>{reviewText}</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        </View>
                                    </View>
                                    {
                                        jobHistory.map((job, index) => {
                                            return <ReviewCell job={job} key={index} />
                                        })
                                    }
                                </View>
                            }

                            {
                                isShowInviteButton && 
                                <View style={styles.centerView}>
                                    <RoundButton 
                                        title="Invite" 
                                        theme="blue" 
                                        style={styles.blueButton} 
                                        onPress={onInvite} 
                                    />
                                </View>
                            }
                        </View>
                    }
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

export default UserProfileCard;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', 
        backgroundColor: 'white',
    },

    nameText: {
        fontFamily: Fonts.bold,
        fontSize: 26,
        marginTop: 7,
        color: Colors.textColor,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    icoImage: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
        marginRight: 7,
        marginTop: 5,
    },

    contentView: {
        backgroundColor: 'white',
        width: '100%',
    },

    chatButton: {
        marginTop: 15,
        marginBottom: 15,
        width: '50%'
    },

    slideView: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },

    rowView: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    colView: {
        width: '50%',
        flexDirection: 'row',
    },

    locationText: {
        fontFamily: Fonts.light,
        fontSize: 14,
        marginTop: 3,
        color: Colors.subTextColor,
        width: '85%',
    },

    reviewInfo: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    
    reviewInfoText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        textTransform: 'uppercase',
    },

    reviewTotalText: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        marginTop: 7,
    },

    reviewValueText: {
        fontFamily: Fonts.bold,
        fontSize: 28,
        color: Colors.subText,
        marginLeft: 5,
    },

    centerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    starImage: {
        width: 30,
        height: 30,
    },
    
    blueButton: {
        marginTop: 15,
        width: '90%',
        marginBottom: 30,
    },

    writeReviewBox: {
        width: '100%', 
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        paddingVertical: 20,
    },  

    reviewTipText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        color: 'gray',
    },

    feedbackText: {
        fontFamily: Fonts.italic,
        fontSize: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
        color: Colors.textColor,
    },

    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: 16,
    },

    aboutText: {
        fontFamily: Fonts.light,
        marginTop: 10,
    }
});