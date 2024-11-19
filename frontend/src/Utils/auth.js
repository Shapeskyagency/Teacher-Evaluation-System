import {jwtDecode} from "jwt-decode";



export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

export const getUserId = () => {
  const token = getToken()
  return token ? jwtDecode(token) : null;
};

export const getAllTimes = (timestamp) => {
  const dateTime = new Date(timestamp);

  const pad = (number) => number.toString().padStart(2, '0');

  const year = dateTime.getFullYear();
  const month = pad(dateTime.getMonth() + 1);
  const day = pad(dateTime.getDate());

  const hours = pad(dateTime.getHours());
  const minutes = pad(dateTime.getMinutes());
  const seconds = pad(dateTime.getSeconds());

  const timezoneOffsetMinutes = dateTime.getTimezoneOffset();
  const timezoneOffsetSign = timezoneOffsetMinutes > 0 ? '-' : '+';
  const timezoneOffsetHours = pad(Math.floor(Math.abs(timezoneOffsetMinutes) / 60));
  const timezoneOffsetMinutesAdjusted = pad(Math.abs(timezoneOffsetMinutes) % 60);

  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    formattedDate: `${year}-${month}-${day}`,
    formattedDate2: `${day}-${month}-${year}`,
    formattedTime: `${hours}:${minutes}:${seconds}`,
    formattedTimezone: `${timezoneOffsetSign}${timezoneOffsetHours}:${timezoneOffsetMinutesAdjusted}`,
  };
};
