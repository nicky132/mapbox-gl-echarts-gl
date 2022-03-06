/*
 * @Description: Axios请求
 * @FilePath: \umi-admin\src\assets\axios\Https.js
 */
import { message , Modal,Spin ,notification} from 'antd';
import { history } from 'umi';
import UserRedux from '../../models/UserRedux'
import axios from 'axios'
const { confirm } = Modal
let requestUrl = ''//请求url

function showDeleteConfirm() {
    confirm({
      title: '是否现在去登录?',
      content: '你还没有登录',
      okText: '去登陆',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        history.push('/login');
      },
      onCancel() {
        message.warning('你取消了登录');
      },
    });
  }
var instance = axios.create({
    baseURL:   UserRedux.state.https, //,   //全局接口公共部分
    // timeout: 3000
    // timeout: 10000
    timeout: 20000
  })

function loading(){
  return (<Spin />)
}
let key = 'ITSM'   //控制是否关闭动画
// let token = UserRedux.state.token;
//   拦截请求
  instance.interceptors.request.use(config=>{
        //token放在拦截器外面有时候拿不到，所以拿到拦截器里面
        let token = localStorage.getItem("token");
        if (token) {
            config.headers = {
              Authorization: token,
              ...config.headers
            }
        }
        // config.timeout = 10000;
        //加载动画
        requestUrl = config.url;
        // if(requestUrl.indexOf('bigData')<0){
        //   //数字大屏不要loading效果
        //   // message.loading({ content: 'Loading...', key });
        // }
        // loading()
        UserRedux.state.isLogin= true  //是否正在登录
  
        return config  
    },error =>{
        return Promise.reject(error)
    })
//  响应请求
    instance.interceptors.response.use(response=>{
       if(response.data.code === 0 && response.data.msg){
            message.success({ content: response.data.msg, key, duration: 1  })
       }else if(response.data.code === 4 && response.data.msg){
            message.error({ content: response.data.msg, key, duration: 1  })
        }else if(response.data.code === 400 && response.data.msg){
            // message.error({ content: "Loading...", key, duration: 1  })
            // history.push('/login');
            
            if(localStorage.getItem('token')){
              localStorage.removeItem('token')
            }
            if(sessionStorage.getItem('token')){
              sessionStorage.removeItem('token')
            }
            showDeleteConfirm()
        }else{
          // alert(JSON.stringify(requestUrl.indexOf('sevencloud')<0 || requestUrl.indexOf('bigData')<0))
          // if(requestUrl.indexOf('bigData')<0){
          //   //数字大屏不要loading效果
          //   // message.success({ content: 'Loading...', key, duration: 1 });
          // }
        }
        
        UserRedux.state.isLogin= false //是否正在登录
        return response.data;
    },error =>{
        message.error({ content: '网络错误,请稍后重试', key, duration: 3 })
        UserRedux.state.isLogin= false  //是否正在登录
        if(error.response && error.response.status === 401){
          message.error({ content: '登录过期，请重新登录！', key, duration: 3 })
          if(localStorage.getItem('token')){
            localStorage.removeItem('token')
          }
          history.push("/login");
        }
       return Promise.reject(error)
    })
    export default instance;
