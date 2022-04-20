export const helperText: HelperText = {
  password: {
    required: "Password is Required",
    minLength: "must at least 8 - 16 charcters long",
    maxLength: "must at least 8 - 16 charcters long",
    pattern: `**must contain at least 1 lowercase character 
      **must contain at least 1 uppercase character 
      **must contain at least 1 numeric character`,
  },
  username: {
    required: "Username is Required",
    minLength: "must at least 1 - 25 character",
    maxLength: "must at least 1 - 25 character",
  },
  email: {
    required: "Email is Required",
    pattern: "invalid email address",
  },
};

interface HelperText {
  [key: string]: {
    [key: string]: string;
  };
}
