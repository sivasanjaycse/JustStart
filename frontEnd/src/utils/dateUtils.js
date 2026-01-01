// src/utils/dateUtils.js
export const formatDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const mergeDate = (newDate, oldDate) => {
  return new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
    oldDate.getHours(),
    oldDate.getMinutes()
  );
};

export const mergeTime = (newTime, oldDate) => {
  return new Date(
    oldDate.getFullYear(),
    oldDate.getMonth(),
    oldDate.getDate(),
    newTime.getHours(),
    newTime.getMinutes()
  );
};

export const isOverdue = (endingTime) => {
  return new Date(endingTime) < new Date();
};
