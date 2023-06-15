import { url } from '../constants';
import { Platform } from 'react-native';
import { filterFileUri, filterFileName } from '../functions';

////////////////////////////////////////////////////////////////////////////
////////////////////////// Create Meal /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const createMeal = (data) => {
  const formData = new FormData();
  
  // photos.
  for (var i = 0; i < data.photos.length; i++) {
    var photo = data.photos[i];
    var filename = filterFileName(photo, Platform.OS);
    var filetype = photo.type ? photo.type : 'image/jpeg';
    const fileUri = filterFileUri(photo.uri, Platform.OS);
    formData.append("photo_" + i, {
        name: filename,
        type: filetype,
        uri: fileUri
    });    
  }

  formData.append("creator", data.creator);
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("inside", data.inside);
  formData.append("price", data.price);
  formData.append("extra", JSON.stringify(data.extra));

  const request_url = `${url}/meal/create`
  return fetch(request_url, {
      method: "POST",
      body: formData
  })
  .then(response => response.json())
};

//////////////////////////////////////////////////////////////
/////////////////////// Remove Meal /////////////////////////
//////////////////////////////////////////////////////////////
export const removeMeal = (meal_id) => {
  const method = 'POST';
  const request_url = `${url}/meal/remove`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    meal_id,
 });
  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

//////////////////////////////////////////////////////////////
/////////////////////// Get My Meals /////////////////////////
//////////////////////////////////////////////////////////////
export const getMyMeals = (user_id) => {
  const method = 'POST';
  const request_url = `${url}/meal/get_my_meals`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ 
    user_id,
 });
  return fetch(request_url, { method, body, headers})
  .then((response) => response.json())
};

//////////////////////////////////////////////////////////////
////////////////// Write Review For Meal /////////////////////
//////////////////////////////////////////////////////////////
export const writeReviewForMeal = (data) => {
  const method = 'POST';
  const request_url = `${url}/meal/write_review`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify(data);
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////
///////////////////////// Get Meal ///////////////////////////
//////////////////////////////////////////////////////////////
export const getMeal = (meal_id, user_id) => {
  const method = 'POST';
  const request_url = `${url}/meal/get`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({
    meal_id,
    user_id
  });
  return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};