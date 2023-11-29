export const emailRule = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+/.test(v) || 'Email must be valid',
];
export const passwordRule = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
];
export const nameRule = [(v: string) => !!v || 'Name is required'];
