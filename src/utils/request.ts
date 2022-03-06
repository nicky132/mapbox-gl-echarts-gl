import { extend } from 'umi-request';
import { notification, message } from 'antd';
import _omit from 'lodash/omit';
const codeMessage = {
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
};
/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const authorization = (noAuth?: boolean) => {
  const AuthorizationToken = '请求头携带的Token'
  return AuthorizationToken;
};

/**
 * @param noAuth
 * 是否带token请求
 *
 * @param credential
 * 默认请求是否带上cookie 
 *  include 携带
 *  omit 不携带
 */
const HttpRequest = (option?:any, noAuth?: boolean, credential?: 'include' | 'omit') => {
  let newOption = {...option}
  if(newOption.method === 'post' || newOption.method === 'delete' || newOption.method === 'put') {
   // params --> 会被放到body的请求参数，POST／PUT／DELETE 方法
    newOption.data = newOption.body
  }else {
   // params --> 会被拼接到url上的的请求参数，GET方法
    newOption.params = newOption.body  
  }
  if(newOption.body) {
   //  为了保证调用的一致性，外部都通过自定义的body传递参数，但body是关键字需要手动清除
    newOption = _omit(newOption, 'body') 
  }
  const request = extend({
    errorHandler, // 默认错误处理
    timeout: 15000,
    credentials: credential || 'omit',
    ...newOption,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: authorization(noAuth),
    }
  })

  // 添加拦截器统一处理返回response
  request.interceptors.response.use(async response => {
    const data = await response.clone().json()
    if(data.status !== 200 && data.message){
      message.error(data.message)
    }
    return  response;
  });
  return request
};

export default HttpRequest;