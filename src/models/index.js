/*
 * @Description: 用户全局dav配置
 *
 */
let indexModel ={
  namespace: 'indexModel',
  state : {
      token: '',      //token
      organsZheJiang: '',      //organsZheJiang
  },
  effects:{  // 异步操作

  },
  reducers: {  //更新状态(同步)
    setToken(state,{ payload }){   //设置token
      let newState = {...state};
      newState.token = payload.token;
      return newState
    },
    setOrgansZheJiang(state,{ payload }){   //设置token
      let newState = {...state};
      newState.organsZheJiang = payload.organsZheJiangNum;
      return newState
    }
  }
}

export default indexModel;