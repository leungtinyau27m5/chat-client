export const addLeadingZero = (num: number, place = 2): string =>
  String(num).padStart(place, "0");

export const formatDate = (timestamp: number, format: string) => {
  const date = new Date(timestamp);
  let result = format;
  result = result.replace(/yyyy/, addLeadingZero(date.getFullYear()));
  result = result.replace(/MM/, addLeadingZero(date.getMonth() + 1));
  result = result.replace(/dd/, addLeadingZero(date.getDate()));
  result = result.replace(/HH/, addLeadingZero(date.getHours()));
  result = result.replace(/mm/, addLeadingZero(date.getMinutes()));
  result = result.replace(/ss/, addLeadingZero(date.getSeconds()));
  return result;
};

export const getEmailRegex = () =>
  /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;

export const getPasswordRegex = () =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,16})/;

export const getFormData = (data: object) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};
