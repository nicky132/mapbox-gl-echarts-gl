// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join ,resolve } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  define: {
    // dvl 环境的请求基础地址
    'process.env.baseUrl': 'http://10.100.218.95:8088'
  },
  // devtool: 'source-map',//生成map文件
  devtool: 'eval',//最快类型
  history: {
    type: 'browser',
  },
  publicPath: '/',
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    headerRender:false,
    footerRender:false,
    menuRender:false,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  chainWebpack(config, { webpack }) {
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less|scss|sass)$/,
          chunks: 'async',
          minChunks: 1,
          minSize: 0,
        }
      },
    });
    config.devServer.hot(true);
    config.devtool('eval');
    new webpack.HotModuleReplacementPlugin();
    config.module
    .rule('otf')
    .test(/.otf$/)
    .use('file-loader')
    .loader('file-loader');
    if (process.env.NODE_ENV === 'development') {
      config.module
        .rule('js-in-node_modules')
        .exclude.add(/node_modules/)
        .end()
      config.module
        .rule('ts-in-node_modules')
        .exclude.add(/node_modules/)
        .end()
    }
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
        path: '/',  //重定向到录像页
        exact:true,
        routes: [
            { path: '/', redirect: '/dataview',component: '../pages/dataView2.0/WelcomePage/index' },//视频录像
        ]
        // redirect: '/hls'
    },
    {
        path: '/hls',  //视频录像
        exact:true,
        routes: [
            { path: '/hls', component: '../pages/dataView1.0/HLS/index' },//视频录像
        ]
    },
    {
      path: '/railway/detail',  //铁路详情
      exact:true,
      routes: [
          { path: '/railway/detail', component: '../pages/dataView1.0/LeftPage/Railway/Detail/index' },//铁路详情
      ],
      access: 'normalRouteFilter',
    },
    {
      path: '/dataview',  //欢迎页
      exact:true,
      routes: [
          { path: '/dataview', component: '../pages/dataView2.0/WelcomePage/index' },//欢迎页
      ],
      access: 'normalRouteFilter',
    },
    {
      path: '/index',  //世界地图
      exact:true,
      routes: [
          { path: '/index', component: '../pages/dataView2.0/index' },//世界地图
      ],
      access: 'normalRouteFilter',
    },
    {
      path: '/centerCloud',  //中心云主页面
      exact:true,
      routes: [
          { path: '/centerCloud', component: '../pages/dataView2.0/CenterCloudPage/index' },//中心云主页面
      ],
      // access: 'normalRouteFilter',
    },
    {
      path: '/digitIndex',  //中心云主页面
      exact:true,
      routes: [
          { path: '/digitIndex', component: '../pages/dataView2.0/CenterCloudPage/DigitIndexPage/index' },//数字化指数主页面
      ],
      // access: 'normalRouteFilter',
    },
    {
      path: '/visualanalysis',  //中心云主页面
      exact:true,
      routes: [
          { path: '/visualanalysis', component: '../pages/dataView2.0/CenterCloudPage/VisualAnalysisPage/index' },//中心云可视化分析主页面
      ],
      // access: 'normalRouteFilter',
    },
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  "sass": { }, ///配这里
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
});
