
const isProduction = process.env.NODE_ENV === 'production';
const serverUrl = isProduction ? '3.26.24.197' : '127.0.0.1';

export default {
    SERVER_HOST: serverUrl,
}