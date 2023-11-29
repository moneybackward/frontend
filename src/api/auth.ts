import { api } from 'src/boot/axios';
import { ILogin, IRegister } from './authInterface';

export async function login(data: ILogin) {
  return await api.post('/auth/login', data);
}

export async function register(data: IRegister) {
  return await api.post('/auth/register', data);
}
