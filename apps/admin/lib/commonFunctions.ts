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
