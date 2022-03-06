/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  // dev: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^': '',
  //     },
  //   },
  // },
  dev: {
    // "/api": {
    //   "target": "http://10.100.218.62:8083/api",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api" : "/" }
    // },

    // "/api": {
    //   "target": "http://10.100.218.95:8084/api",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api" : "/" }
    // },

    // "/api": {
    //   "target": "http://10.100.218.95/api",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api" : "/" }
    // },
    // "/yyf": {
    //   "target": "http://10.100.218.95:8088/yyf",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/yyf" : "/" }
    // }

    // "/api": {
    //   "target": "http://10.100.218.62/api",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api" : "/" }
    // },
    // "/yyf": {
    //   "target": "http://10.100.218.62/yyf",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/yyf" : "/" }
    // }
  },
  test: {
    "/api": {
      "target": "http://10.100.218.62:8083/api",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "/" }
    }
  },
  // pre: {
  //   "/api": {
  //     "target": "http://10.100.218.62:8083/api",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api" : "/" }
  //   },
  //   "/yyf": {
  //     "target": "http://10.100.218.95:8088/yyf",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/yyf" : "/" }
  //   }
  // },
};
