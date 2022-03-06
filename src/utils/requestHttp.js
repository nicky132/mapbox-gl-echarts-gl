import { history, Link ,RequestConfig ,getLocale ,useModel} from 'umi';
const httpErrorMessage = {
  'en-US': {
    200: 'The server successfully returned the requested data.',
    201: 'Data is created or modified successfully. Procedure',
    202: 'A request has been queued in the background (asynchronous task).',
    204: 'Succeeded in deleting data. Procedure',
    400: 'The server did not create or modify data.',
    401: 'User does not have permission (wrong token, username, password).',
    403: 'The user is authorized, but access is prohibited.',
    404: 'The request was made for a nonexistent record, and the server did not act on it.',
    406: 'The requested format is not available.',
    410: 'The requested resource is permanently deleted and will not be retrieved.',
    422: 'A validation error occurred while creating an object.',
    500: 'An error occurred on the server. Check the server.',
    502: 'Gateway error.',
    503: 'The service is unavailable, the server is temporarily overloaded or maintained.',
    504: 'The gateway timed out.',
  },
  'zh-CN': {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  }
};

const lang = getLocale() // zh-CN | en-US
// 服务器请求错误状态处理
const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = httpErrorMessage[lang][response.status] || response.statusText;
    message.error({
      content: errorText,
    });
  } 
  return response;
};

export default request = {
  // errorHandler,
  requestInterceptors: [    // 请求拦截器，接收数组，可设置多个拦截器
    (_, options) => {
      return {
        options: {
          ...options,
          headers: {
            ...(options?.headers ?? {}),
            // Authorization: `bearer ${initialState?.token}`,    // 这里获取自己的token携带在请求头上
            Authorization: `bearer ${_token}`,    // 这里获取自己的token携带在请求头上
          },
        },
      };
    },
  ],
  responseInterceptors: [  // 相应拦截器，也接受数组
    async (response) => {
      // if (response) {
      //   if (response.status === 401) {   // token过期的时候自动刷新获取新的token自动登录，当然这是根据自己页面的需求决定，大多都是token过期跳转登录页面，重新登陆
          
      //   }
      //   if (response.status === 200) {  // 后端规定了一些自定义返回的errorCode码，返回后端的自定义提示信息
      //     const data = await response.clone().json();
      //     if (data && data.messageCode) {
      //       const errorText = codeErrorMessage[lang][data.messageCode] || codeErrorMessage[lang][10000];          //  codeErrorMessage支持多语言环境的json文件，和httpErrorMessage 一样写法
      //       message.error({
      //         content: errorText,
      //       })
      //     }
      //   }
      // } else {
      //   message.error({
      //     content: lang == 'zh-CN' ? '您的网络发生异常，无法连接服务器' : 'Your network is abnormal and you cannot connect to the server',
      //   })
      // }
      return response;
    },
  ],
};