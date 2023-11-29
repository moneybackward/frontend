import { api } from 'src/boot/axios';
import { ILogin, IRegister } from './authInterface';

export async function login(data: ILogin) {
  const response = await api.post('/auth/login', data);
  return response.data;
}

export async function register(data: IRegister) {
  const response = await api.post('/auth/register', data);
  return response.data;
}
