import { jwtDecode } from "jwt-decode";

export const isUserLogined = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
  }
  return token ? true : false;
};

export const getToken = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("accessToken");
    return token;
  }else if(typeof window == "undefined"){
    localStorage.clear()
  }
  return token;
};

export const getUserId = () => {
    var token = getToken();
    let decoded = null;
    if (token) {
      decoded = jwtDecode(token);
    }
    return decoded;
  };

  export const LocalFbRole = () => {
    var fb_role = localStorage.getItem("userRole");
    let decoded = null;
    if (fb_role) {
      decoded = fb_role;
    }
    return decoded;
  };

export const getAllTimes = (timestamp) =>{
    
 // Create a Date object from the timestamp
const dateTime = new Date(timestamp);

// Extract date, time, and timezone components
const year = dateTime.getFullYear();
const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
const day = dateTime.getDate().toString().padStart(2, '0');

const hours = dateTime.getHours().toString().padStart(2, '0');
const minutes = dateTime.getMinutes().toString().padStart(2, '0');
const seconds = dateTime.getSeconds().toString().padStart(2, '0');

// Timezone offset in minutes
const timezoneOffsetMinutes = dateTime.getTimezoneOffset();
const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
const timezoneOffsetSign = timezoneOffsetMinutes > 0 ? '-' : '+';

// Format the date, time, and timezone
const formattedDate = `${year}-${month}-${day}`;
const formattedTime = `${hours}:${minutes}:${seconds}`;
const formattedTimezone = `${timezoneOffsetSign}${timezoneOffsetHours.toString().padStart(2, '0')}:${(Math.abs(timezoneOffsetMinutes) % 60).toString().padStart(2, '0')}`;

const meinData = {
  year:year,
  month:month,
  day:day,
  hours:hours,
  minutes:minutes,
  seconds:seconds,
  formattedDate:formattedDate,
  formattedTime:formattedTime,
  formattedTimezone:formattedTimezone
}
return meinData
}