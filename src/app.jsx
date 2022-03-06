import { PageLoading } from '@ant-design/pro-layout';
import { history, Link, RequestConfig, getLocale, useModel } from 'umi';
import { extend } from 'umi-request';
import { message, notification } from 'antd';
// import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser, getAuthRoute } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import errorHandler from './errorHandler';
const isDev = process.env.NODE_ENV === 'development';
// const loginPath = '/user/login';
const loginPath = '/dataview';
const baseUrl = process.env.baseUrl;
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      errorHandler(error);
      window.localStorage.clear();
      history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  const fetchUserAuthRoute = async () => {
    //获取授权路由
    try {
      const routeData = await getAuthRoute();
      return routeData.resultData;
    } catch (error) {
      errorHandler(error);
      window.localStorage.clear();
      history.push(loginPath);
    }
    return undefined;
  };
  if (history.location.pathname !== loginPath) {
    const currentUserUserInfo = await fetchUserInfo();
    const authRoutes = await fetchUserAuthRoute();
    localStorage.setItem('authRoutes', JSON.stringify(authRoutes));
    const currentUser = currentUserUserInfo?.username ?? '';
    return {
      fetchUserInfo,
      fetchUserAuthRoute,
      currentUser,
      authRoutes,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    fetchUserAuthRoute,
    settings: {},
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => null,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        window.localStorage.clear();
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank" key={1}>
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key={2}>
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  // timeout: 30000,
  // headers: {
  //   'Content-Type': 'application/json',
  //   Accept: 'application/json',
  //   Authorization:localStorage.getItem("token")
  // },
  throwErrIfParseFail: true, //当JSON.parse(res) 出错时，抛出错误
});

export function onRouteChange({ location, routes, action }) {
  let token = location?.query?.token ?? '';
  if (token) {
    localStorage.setItem('token', token);
    const msg = queryCurrentUser();
    const routeData = getAuthRoute();
    if (msg.data) {
      localStorage.setItem('userInfo', JSON.stringify(msg.data));
    }
    if (routeData.resultData) {
      localStorage.setItem('authRoutes', JSON.stringify(routeData.resultData));
    }
  }
}

request.interceptors.request.use(async (url, options) => {
  let requestUrl = url;
  // if(process.env.NODE_ENV != 'development'){
  //   requestUrl = url.replace(/\/api/g,'').replace(/\/yyf/g,'');
  // }
  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };
  return {
    url: requestUrl,
    options: { ...options, headers },
  };
});

request.interceptors.response.use((response) => {
  // const codeMaps = {
  //   502: '网关错误。',
  //   503: '服务不可用，服务器暂时过载或维护。',
  //   504: '网关超时。',
  // };
  // message.error(codeMaps[response.status]);
  return response;
});
