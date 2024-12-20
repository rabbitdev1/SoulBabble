export const isMaintenanceAction = (data: any) => {
  return {
    type: 'ISMAINTENANCEMODE',
    payload: data,
  };
};
export const isToManyRequestAction = (data: any) => {
  return {
    type: 'ISTOMANYREQUESTMODE',
    payload: data,
  };
};
export const isPending = (data: any) => {
  return {
    type: 'ISPENDING',
    payload: data,
  };
};
export const setDropdownAlert = (
  type: string,
  title: string,
  message: string,
) => {
  return {
    type: 'ISDROPDOWNALERT',
    payload: {type: type, title: title, message: message},
  };
};

export const isWebSetting = (data: any) => {
  return {
    type: 'ISWEBSETTING',
    payload: data,
  };
};
export const isProfile = (data: any) => {
  return {
    type: 'ISPROFILE',
    payload: data,
  };
};
export const isLogin = (data: any) => {
  return {
    type: 'ISLOGIN',
    payload: data,
  };
};
export const isTokenNotify = (data: any) => {
  return {
    type: 'ISTOKENNOTIFY',
    payload: data,
  };
};
export const isLogOut = (data: any) => {
  return {
    type: 'ISLOGOUT',
    payload: data,
  };
};

export const isSession = (data: any) => {
  return {
    type: 'ISSESSION',
    payload: data,
  };
};

export const setDarkModePreference = (data:any) => {
  return {
    type: 'SET_DARK_MODE_PREFERENCE',
    payload: data,
  };
};


export const isPopup = (data:any) => {
  return {
    type: 'ISPOPUP',
    payload: data,
  };
};
