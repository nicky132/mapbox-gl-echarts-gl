/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser ,authRoutes } = initialState || {};
  localStorage.setItem("authRoutes",JSON.stringify(authRoutes));
  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    normalRouteFilter:(route) => authRoutes && authRoutes.includes(route.path)
  };
}
