import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  myMeals: [],
  selectedMeal: {},
  hasOrder: false,
  errorMessage: '',

  createMealStatus: Status.NONE,
  removeMealStatus: Status.NONE,
  getMyMealsStatus: Status.NONE,
  writeReviewMealStatus: Status.NONE,
  getMealStatus: Status.NONE,
};

//////////////////////////////////////////////////////////////
///////////////////// Create Meal ////////////////////////////
//////////////////////////////////////////////////////////////
const createMealRequest = (state) => ({
  ...state,
  createMealStatus: Status.REQUEST,
});

const createMealSuccess = (state, action) => {
  state.createMealStatus = Status.SUCCESS;
  const { myMeals } = state;
  var list = [ ...myMeals ];
  const meal = action.payload; 
  list.push(meal);
  state.myMeals = list;  

  return {
    ...state,
  };
};

const createMealFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  createMealStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
////////////////////// Remove Meal ///////////////////////////
//////////////////////////////////////////////////////////////
const removeMealRequest = (state) => ({
  ...state,
  removeMealStatus: Status.REQUEST,
});

const removeMealSuccess = (state, action) => {
  state.removeMealStatus = Status.SUCCESS;
  var list = [];
  const { myMeals } = state;
  const meal = action.payload; 

  myMeals.forEach((item, index) => {
    if (item._id != meal._id) {
      list.push(item);
    }
  });
  state.myMeals = list;  
  return {
    ...state,
  };
};

const removeMealFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  removeMealStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
///////////////////// Get My Meals ///////////////////////////
//////////////////////////////////////////////////////////////
const getMyMealsRequest = (state) => ({
  ...state,
  getMyMealsStatus: Status.REQUEST,
});

const getMyMealsSuccess = (state, action) => ({
  ...state,
  myMeals: action.payload,
  getMyMealsStatus: Status.SUCCESS,
});

const getMyMealsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getMyMealsStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
////////////////// Write Review For Meal /////////////////////
//////////////////////////////////////////////////////////////
const writeReviewForMealRequest = (state) => ({
  ...state,
  writeReviewMealStatus: Status.REQUEST,
});

const writeReviewForMealSuccess = (state, action) => ({
  ...state,
  selectedMeal: action.payload,
  writeReviewMealStatus: Status.SUCCESS,
});

const writeReviewForMealFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  writeReviewMealStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////
////////////////////// Get Meal //////////////////////////////
//////////////////////////////////////////////////////////////
const getMealRequest = (state) => ({
  ...state,
  getMealStatus: Status.REQUEST,
});

const getMealSuccess = (state, action) => ({
  ...state,
  selectedMeal: action.payload.meal,
  hasOrder: action.payload.hasOrder,
  getMealStatus: Status.SUCCESS,
});

const getMealFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getMealStatus: Status.FAILURE,
});
//////////////////////////////////////////////////////////////
/////////////////////// Reset ////////////////////////////////
//////////////////////////////////////////////////////////////
const resetMeal = (state, action) => {
  state.myMeals = [];
  state.selectedMeal = {};

  return {
    ...state,
  };
};

const actionHandlers = {
  [Types.CREATE_MEAL_REQUEST]: createMealRequest,
  [Types.CREATE_MEAL_SUCCESS]: createMealSuccess,
  [Types.CREATE_MEAL_FAILURE]: createMealFailure,

  [Types.REMOVE_MEAL_REQUEST]: removeMealRequest,
  [Types.REMOVE_MEAL_SUCCESS]: removeMealSuccess,
  [Types.REMOVE_MEAL_FAILURE]: removeMealFailure,

  [Types.GET_MY_MEALS_REQUEST]: getMyMealsRequest,
  [Types.GET_MY_MEALS_SUCCESS]: getMyMealsSuccess,
  [Types.GET_MY_MEALS_FAILURE]: getMyMealsFailure,

  [Types.WRITE_REVIEW_MEAL_REQUEST]: writeReviewForMealRequest,
  [Types.WRITE_REVIEW_MEAL_SUCCESS]: writeReviewForMealSuccess,
  [Types.WRITE_REVIEW_MEAL_FAILURE]: writeReviewForMealFailure,

  [Types.GET_MEAL_REQUEST]: getMealRequest,
  [Types.GET_MEAL_SUCCESS]: getMealSuccess,
  [Types.GET_MEAL_FAILURE]: getMealFailure,

  [Types.RESET_MEAL]: resetMeal,
};

export default createReducer(initialState, actionHandlers);
