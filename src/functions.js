import { Platform } from 'react-native';
import Moment from 'moment'
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from './constants'
import NetInfo from "@react-native-community/netinfo";

export const compressImage = async (imageFile) => {
  if (Platform.OS === 'android') {
    image = await ImageResizer.createResizedImage(
      imageFile.uri,
      MAX_IMAGE_WIDTH,
      MAX_IMAGE_HEIGHT,
      'JPEG',
      IMAGE_COMPRESS_QUALITY,      
    );
  } else {
    image = await ImageResizer.createResizedImage(
      imageFile.uri,
      MAX_IMAGE_WIDTH,
      MAX_IMAGE_HEIGHT,
      'JPEG',
      IMAGE_COMPRESS_QUALITY,
      0,
      RNFS.TemporaryDirectoryPath
    );
    const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()}.jpg`;
    await RNFS.copyFile(image.uri, dest);
  }
  return image
}

export const makeRandomText = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const filterFileName = (file, platform) => {
  var filename = '';
  if (platform === 'ios') {
    filename = file.fileName ? file.fileName : makeRandomText(20) + ".jpg";
  } else {
    filename = file.name ? file.name : makeRandomText(20) + ".jpg";
  }
  return filename;
}

export const filterFileUri = (fileUri, platform) => {
  if (platform === "ios") {
    if (fileUri.indexOf('file://') === 0) {
      return fileUri.replace("file://", "");
    }
  } else {
    if (fileUri.indexOf('://') < 0) {
      return "file://" + fileUri;
    } 
  }

  return fileUri;
}

export const filterSkills = (skills, selected) => {
  var list = [];
  skills.forEach(item => {
    var isExisting = false;
    for (var i = 0; i < selected.length; i++) {
      if (item._id === selected[i]._id) {
        isExisting = true;
        break;
      }
    }
    if (!isExisting) {
      list.push(item);
    }
  });
  return list;
}

export const isValidEmail = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) === false) {
    return false;
  }
  return true;
}

export const trimEllip = function (text, length) {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * compares a
 * @param {Array<any>} arr array to uniq
 * @return {Array<any>}
 */
export const uniq = (arr) => [...new Set(arr)];

/**
 * fetch a json endpoint
 * @param  {...any} params fetch params
 */
export const jsonFetch = (...params) => fetch(...params)
  .then((res) => {
    if (res.status !== 204) {
      return res.json();
    }
    return null;
  })
  .then((data) => data);

/**
 * get headers for fetch request
 * @param {string} token auth token
 */
export const fetchHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  "Accept-Encoding" : "gzip",

});

/**
 * marks badges as locked
 */
export const lockBadge = (userBadges = []) => (badge) => {
  if (userBadges.includes(badge._id)) {
    return badge;
  }
  return { ...badge, isLock: true };
};


/**
 * Capitalizes the first letter of a string
 * @param {string} str string to capitalize
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Truncates an array
 * @param {string} str string to truncate
 * @param {number} max max allowed chars without truncation
 */

export const truncateToDecimals = (num, dec = 2) => {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
}

export const truncate = (str = '', max = 10) => (str.length <= max ? str : (`${str.slice(0, max - 3)}...`));

export const filterOnlyDigits = (value) => {
  return value.replace(/\D/g, '');
};

export const validateZipCode = (elementValue) => {
  var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
   return zipCodePattern.test(elementValue);
}

export const kFormatter = (num) => {
  if (num === null) { return null; } // terminate early
  if (num === 0) { return '0'; } // terminate early
  var fixed = 2;
  var b = (num).toPrecision(2).split("e"), // get power
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
      c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
      d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
      e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
  return e;
}

export const checkInternetConnectivity = async () => {
  return NetInfo.fetch().then(state => {
    return state.isConnected
  });
};

export const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const getOnlyAlphabetLetters = (text) => {
  return  text.replace(/[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
};

export const filterPickerData = (data, isCapitalize) => {
  var response = [];
  for (var i = 0; i < data.length; i++) {
    const item = data[i];
    response.push({
      id: item, 
      label: isCapitalize ? capitalizeFirstLetter(item) : item, 
      value: item,
    });
  }

  return response;
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export const isUSZipCode = (str) => 
{
  regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;
  if (regexp.test(str)) {
    return true;
  }
  return false;
}

export const getPaymentIcon = (brand) => {
  var icon = "credit-card";
  if (brand.toLowerCase() == "visa") {
    icon = "cc-visa";
  }
  else if (brand.toLowerCase() == "mastercard") {
    icon = "cc-mastercard";
  }
  else if (brand.toLowerCase() == "american express") {
    icon = "cc-amex";
  }
  else if (brand.toLowerCase() == "discover") {
    icon = "cc-discover";
  }
  else if (brand.toLowerCase() == "diners club") {
    icon = "cc-diners-club";
  }
  else if (brand.toLowerCase() == "jcb") {
    icon = "cc-jcb";
  }

  return icon;
}

export const getOrderStatusText = (status) => {
  if (status == 0) {
    return "New order";
  }
  else if (status == 1) {
    return "For delivery"; 
  }
  return "Completed";
}

export const isExistingList = (list, item) => {
  var isExisting = false;
  if (list) {
    list.forEach(record => {
      if (record._id == item._id) {
        isExisting = true;
        return;
      }
    });
  }
  return isExisting;
}

export const calcDistance = (lat1, lon1, lat2, lon2, unit) => {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

export const calcReceipt = (meal, amount, size, extra) => {
  const price = meal ? meal.price : 0;
  var extraPrice = 0;
  if (extra && extra.length > 0) {
      extra.forEach(item => {
          extraPrice += item.price;
      });
  }
  var subtotal = (price + extraPrice) * amount;
  var deliveryFee = 0;
  var taxRate = 0;

  var chef = null;
  if (meal) {
    if (meal.creator && meal.creator._id) {
      chef = meal.creator;
    } else if (meal.chef) {
      chef = meal.chef;
    }

    deliveryFee = chef ? chef.deliveryFee : 0;
    taxRate = chef ? chef.taxRate: 0;
  }
  
  var tax = (subtotal * taxRate / 100);
  var total = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    total
  }
}

export const calcDeliveryTime = (time, today) => {
  var now = Moment(new Date()).unix();
  if (today) {
    now = Moment(today).unix();
  }
  const d = (time - now);

  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);

  if (d >= 60) {
    var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";

    if (hDisplay && hDisplay.length > 0) {
      return "in " + hDisplay + ", " + mDisplay; 
    }
    else {
      return "in " + mDisplay; 
    }
  }
  
  return null;
}
