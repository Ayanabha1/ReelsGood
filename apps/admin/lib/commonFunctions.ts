import { toast } from "react-toastify";

export const getDate2 = (timeStamp: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(timeStamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};
export const showSuccess = (msg: string) => {
  toast.success(msg || "Success", { pauseOnHover: false, theme: "dark" });
};

export const showError = (msg: string) => {
  toast.error(msg || "Something went wrong", {
    pauseOnHover: false,
    theme: "dark",
  });
};

export const getTime = (timeStamp: Date) => {
  const date = new Date(timeStamp);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return formattedHours + ":" + formattedMinutes + " " + ampm;
};

export const getLocalTime = (timeStamp: Date) => {
  const date = new Date(timeStamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return formattedHours + ":" + formattedMinutes + " " + ampm;
};
