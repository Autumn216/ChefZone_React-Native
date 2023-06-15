export const url = 'https://chefzone.herokuapp.com';
// export const url = 'http://localhost:5000';

export const STRIPE_KEY = 'pk_test_dLJ33IRW8RHlczyqwEYGH7G4';
export const ONE_SIGNAL_APP_ID = '150fc3cb-adb9-4cdd-aa31-c10e460f2e3e'
export const GOOGLE_API_KEY = 'AIzaSyCGJg6E9WkiiIbbOhAWw_A0wSMS3YKaNBs'
export const GOOGLE_SIGNIN_WEB_CLIENT_ID = '61222512413-gerljhq8a8v988hci5usdtk3ci8pmm4u.apps.googleusercontent.com';
export const GOOGLE_SIGNIN_IOS_CLIENT_ID = '61222512413-amrt194vdmoivc4vjqk3q0d2ip4ns2u2.apps.googleusercontent.com';

export const TERMS_LINK = "https://wengerallen.gadaiweb.com/terms-and-conditions.html";
export const PRIVACY_LINK = "https://wengerallen.gadaiweb.com/privacy-policy.html";

export const WEB_PAGE_TYPE = {
  TERMS: 1,
  PRIVACY: 2,
};

/**
 * Possible requests status
 */
export const Status = {
  NONE: 'NONE',
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

export const IMAGE_COMPRESS_QUALITY = 50;
export const MAX_IMAGE_WIDTH = 500;
export const MAX_IMAGE_HEIGHT = 1000;
export const TOAST_SHOW_TIME = 2000;
export const RELOAD_GLOBAL_TIME = 20000;
export const PASSWORD_MIN_LENGTH = 8
export const DATE_TIME_FORMAT = 'MM/DD/YYYY hh:mm A';
export const DATE_FORMAT = 'MM/DD/YYYY';

export const JOB_STATUS = {
  NEW: 0,
  PROGRESSING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  OFFER_SENT: 4,
};

export const NOTIFICATION_TYPE = {
  CREATE_ORDER: 0,
  PICKUP_ORDER: 1,
  COMPLETE_DELIVERY: 2,
  WRITE_REVIEW_FOR_MEAL: 3,
};

export const SIZE_LIST = [
  "Small",
  "Medium",
  "Large",
];

export const generatedMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]