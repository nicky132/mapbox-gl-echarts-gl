// 引入request.js文件
import HttpRequest from './request';
export default {
	// async getRailwayTrackInfo(params: any): Promise<any> {
	//    return HttpRequest({
	//      method: 'put',  // 如果是get方法可省
	//      body: params, //  所有方法传参都通过body，没有省略即可
	//   //  })(`/api/exhibition/railway/getRailwayData`);
	//    })(this.$API.getRailwayTrackInfo);
	// },
  async _getUpsideData(params: any): Promise<any> {
      return HttpRequest({
        method: 'post',  // 如果是get方法可省
        body: params, //  所有方法传参都通过body，没有省略即可
      // })(`/api/exhibition/railway/getRailwayData`);
      })(this.$API.getUpsideData);
  },
}

export async function _getUpsideData(options) {
  return HttpRequest('/api/notices', {
    method: 'post',
    ...(options || {}),
  });
}
/** 获取规则列表 GET /api/rule */

export async function rule(params, options) {
  return HttpRequest('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// export async function currentUser(options) {
//   return request('/yyf/sys/current/user', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }
// /** 退出登录接口 POST /api/login/outLogin */

// export async function outLogin(options) {
//   return request('/api/login/outLogin', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }