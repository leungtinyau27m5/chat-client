export const setLocalItem = (key: string, value: string) =>
  localStorage.setItem(key, value);

export const getLocalItem = (key: string) => localStorage.getItem(key);

export const removeLocalItem = (key: string) => localStorage.removeItem(key);

export const setSession = (key: string, value: string) =>
  sessionStorage.setItem(key, value);

export const getSession = (key: string) => sessionStorage.getItem(key);

export const deleteSession = (key: string) => sessionStorage.removeItem(key);

export const setCookie = (key: string, value: string, expireIn?: number) => {
  const now = Date.now();
  const expireTime = expireIn ? now + expireIn : now + 1000 * 60 * 60 * 24 * 30;
  const expireDate = new Date(expireTime);
  document.cookie = `${key}=${value}; expires=${expireDate.toUTCString()}; sameSite=Strict; path=/`;
};

export const getCookie = (key: string) => {
  const decoded = decodeURIComponent(document.cookie).split(";");
  let found = null;
  for (let i = 0; i < decoded.length; i++) {
    const ele = decoded[i].trimStart();
    const [k, v] = ele.split("=");
    if (k === key) {
      found = v;
      break;
    }
  }
  return found;
};

export const deleteCookie = (key: string) => {
  document.cookie = `${key}=""; expires=${new Date(
    "1970"
  ).toUTCString()}; sameSite=Strict; path=/`;
};
