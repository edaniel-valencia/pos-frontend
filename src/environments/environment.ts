export const environments = {
  production: false,
  endpoint: import.meta.env['NG_APP_API_URL'] ?? `http://localhost:3001/`
};
