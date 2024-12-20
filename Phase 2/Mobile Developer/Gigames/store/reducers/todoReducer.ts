const initialState = {
  isPending: false,
  isDropdownAlert: {type: '', title: '', message: ''},
  isMaintenanceMode: false,
  isToManyRequestMode: false,
  isLogOut: false,
  isProfile: '',
  isWebSetting: '',
  isLogin: '',
  isTokenNotify: '',
  isPopup: false,
  isSession: false,
  darkMode: false,


  // from-[#13BE25] to-[#078C15] 

  colorSystem: {
    light: {
      background: '#ffffff',
      card: '#f3f3f3',
      primary: '#13BE25',
      secondary: '#078C15',
      primary_opacity: '#13BE2520',
      bordercolor: '#DDDDDD',
      gradient: ['#078C15', '#13BE25'],
    },dark: {
      background: '#111016',
      card: '#012445',
      primary: '#02386A',
      secondary: '#012445',
      primary_opacity: '#01244520',
      bordercolor: '#ffffff20',
      gradient: ['#012445', '#02386A'],
    },
  },
};
const todoReducer = (state = initialState, action: any) => {
  const {type, payload} = action;
  switch (type) {
    case 'ISMAINTENANCEMODE':
      return {
        ...state,
        isMaintenanceMode: payload,
      };
    case 'ISTOMANYREQUESTMODE':
      return {
        ...state,
        isToManyRequestMode: payload,
      };
    case 'ISLOGOUT':
      return {
        ...state,
        isLogOut: payload,
      };
    case 'ISSESSION':
      return {
        ...state,
        isSession: payload,
      };
    case 'ISPENDING':
      return {
        ...state,
        isPending: payload,
      };
    case 'ISWEBSETTING':
      return {
        ...state,
        isWebSetting: payload,
      };
    case 'ISPROFILE':
      return {
        ...state,
        isProfile: payload,
      };
    case 'ISLOGIN':
      return {
        ...state,
        isLogin: payload,
      };
    case 'ISTOKENNOTIFY':
      return {
        ...state,
        isTokenNotify: payload,
      };
    case 'ISDROPDOWNALERT':
      return {
        ...state,
        isDropdownAlert: payload,
      };
    case 'SET_DARK_MODE_PREFERENCE':
      return {
        ...state,
        darkMode: action.payload,
      };
    case 'ISPOPUP':
      return {
        ...state,
        isPopup: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
export default todoReducer;
