export interface User {
  name: string;
  email: string;
  dob: string;
  login: string;
  accessToken: string;
}

export interface UpdateUser {
  message: string;
  user: {
    dob: string;
    email: string;
    name: string;
  };
}
