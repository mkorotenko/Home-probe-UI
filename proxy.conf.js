const PROXY_CONFIG = [
  {
    context: [
      '/docs'
    ],
    // pathRewrite: {
    //   "^/auth": ""
    // },
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true
  },
];

module.exports = PROXY_CONFIG;
