import { api } from 'src/boot/axios';
export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

export async function login(data: ILogin) {
  return await api.post('/auth/login', data);
}

export async function register(data: IRegister) {
  return await api.post('/auth/register', data);
}

export async function verify(jwt_token: string) {
  const head = {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  };
  return await api.get('/auth/verify', head);
}
