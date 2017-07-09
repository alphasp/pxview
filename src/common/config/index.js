const config =
  process.env.NODE_ENV === 'production'
    ? require('./env.prod').default
    : require('./env.dev').default;

export default config;
