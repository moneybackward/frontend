export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
}