import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import NavImage from '../../components/NavImage'
import LoadingOverlay from '../../components/LoadingOverlay'
import MealCell from '../../components/Cells/MealCell'
import EmptyView from '../../components/EmptyView'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class MealsListScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isFirst: true,

      meals: [],
    }
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => [
      this.props.dispatch({
        type: actionTypes.GET_MY_MEALS,
        user_id: currentUser._id,
      })
    ]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyMealsStatus != this.props.getMyMealsStatus) {
      if (this.props.getMyMealsStatus == Status.SUCCESS) {
        this.setState({isLoading: false, isFirst: false});
        this.filterOrders(this.props.myMeals);
      } 
      else if (this.props.getMyMealsStatus == Status.FAILURE) {
          this.onFailure(this.props.errorMessage);
      }      
    }

    if (prevProps.myMeals != this.props.myMeals) {
      this.filterOrders(this.props.myMeals);
    }
  }

  onFailure(message) {
    this.setState({isLoading: false});
    if (message && message.length > 0) {
      this.toast.show(message, TOAST_SHOW_TIME);
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }    
  }

  filterOrders(list) {
    if (list) {
      this.setState({meals: list});
    }
  }

  onSelectMeal(meal) {
    this.props.navigation.navigate('MealDetail', {meal});
  }

  render() {
    const { isLoading, meals, isFirst } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.appColor}}>
        <NavImage />
        <TopNavBar title="Meals" theme="black" onBack={() => this.onBack()}/>
        <View style={styles.container}>
          <View style={styles.pageView}>
            {
              (meals && meals.length > 0)
              ? <FlatList
                  style={styles.listView}
                  data={meals}
                  keyExtractor={(item, index) => index.toString()}
                  ListFooterComponent={() => (<View style={{height: 40}}/>)}
                  renderItem={({item, i}) => (
                    <MealCell 
                      data={item} 
                      key={i} 
                      onSelect={(data) => this.onSelectMeal(data)} 
                    />
                  )}
                />
              : !isFirst && <EmptyView title="No meals." />
            }
          </View>
        </View>
        <Toast ref={ref => (this.toast = ref)}/>
        { isLoading && <LoadingOverlay /> }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  pageView: {
    flex: 1,
  },

  listView: {
    padding: 15,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,

    myMeals: state.meals.myMeals,
    errorMessage: state.meals.errorMessage,
    getMyMealsStatus: state.meals.getMyMealsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(MealsListScreen);
