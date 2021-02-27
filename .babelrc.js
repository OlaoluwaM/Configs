const isTest = process.env.NODE_ENV === 'test';

// runtime: 'automatic' enables jsx transforms introduced in react v17

module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        ssr: false,
      },
    ],
  ],
};
