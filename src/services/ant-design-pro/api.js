// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

/** V2.0看板接口开始 */
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options) {
  return request('/yyf/sys/current/user', {
    skipErrorHandler:true,
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body, options) {
  return request('/api/exhibition/login', {
    skipErrorHandler:true,
    method: 'POST',
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: body,
    ...(options || {}),
  });
}

//退出登录
export async function logout(body, options) {
  return request('/yyf/logout', {
    skipErrorHandler:true,
    method: 'GET',
    data: body,
    ...(options || {}),
  });
}

//获取后台的授权路由
export async function getAuthRoute(body, options) {
  return request('/yyf/sys/current/user/routes', {
    skipErrorHandler:true,
    method: 'GET',
    ...(options || {}),
  });
}

//获取美好出行接口数据
export async function getBeautifulTravel(body, options) {
  return request('/api/exhibition/beautiful_travel/index', {
    skipErrorHandler:true,
    method: 'GET',
    ...(options || {}),
  });
}

//获取基础投资接口数据
export async function getBaseInvest(body, options) {
  return request('/api/exhibition/baseinvest', {
    skipErrorHandler:true,
    method: 'GET',
    ...(options || {}),
  });
}

//获取世界地图点位接口数据
export async function getAgencyPoints(body, options) {
  return request('/api/exhibition/world/map/points', {
    skipErrorHandler:true,
    method: 'GET',
    ...(options || {}),
  });
}

//获取世界地图船舶实际点位接口数据
export async function getShipTrackPoints(body, options) {
  return request('/api/exhibition/sea/ship/track', {
    skipErrorHandler:true,
    method: 'GET',
    ...(options || {}),
  });
}


/** V2.0看板接口结束 */

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options) {
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}