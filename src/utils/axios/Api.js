const services = {
    //大数据接口
    getAllProjectInfo: "/api/exhibition/center/getAllProjectInfo", //当前告警一览数据
    getProjectProgress: "/api/exhibition/center/getProjectProgress", //建设进度
    liveStreamUrl: "/api/exhibition/hikvision/getVideoUrl", //直播url
    wsliveStreamUrl:
        "http://10.100.218.95:8084/api/exhibition/hikvision/getVideoUrl", //ws协议视频
    getAlarmInfo: "/api/exhibition/warn/getWarnData", //预警信息接口
    getRailwayTrackInfo: "/api/exhibition/railway/getRailwayData", //铁路轨道数据接口
    getContractInfo:
        "/api/exhibition/contractionManage/getContractionManageData", //合同管理
    getHighwayData: "/api/exhibition/highway/getHighwayData", //高速公路接口
    getCommercialData: "/api/exhibition/commercial/getCommercialData", //商业集团
    getInsuranceData: "/api/exhibition/insurance/getInsuranceData", //浙商保险
    getInformationSecurityData:
        "/api/exhibition/informationSecurity/getInformationSecurityData", //网络安全
    getItServiceData: "/api/exhibition/itService/getItServiceData", //it运维
    getSunshineData: "/api/exhibition/sunshine/getSunshineData", //阳光监管数据
    getUpsideData: "/api/exhibition/upside/getUpsideData", //中心上部数据
    getCoords:
        "https://10.100.225.11/hmappublish/service/rs/v1/geodata/bgd/mapSearch", //获取浙江省经纬度数据
    getHighwayCoords: "/api/exhibition/geographic/highway/geo/infos", //高速公路经纬度
    getRailwayCoords: "/api/exhibition/geographic/railway/geo/infos", //铁路经纬度
    getServerCoords: "/api/exhibition/geographic/server/area/geo/getServerArea", //服务区经纬度
    getPopInfo: "/api/exhibition/geographic/project/geo/allProject", //轮播信息
    getAddressInfo: "/api/exhibition/geographic/company/address/infos", //公司所在位置
    getSunshineUrl: "/api/exhibition/sunshine/getSunshineUrl", //阳光监管url
    getSecurityUrl: "/api/exhibition/informationSecurity/getSecurityUrl", //网络安全url
    getWarnWeatherData: "/api/exhibition/warnWeather/getWarnWeatherData", //天气预警
    getWarnHighwayInfoData:
        "/api/exhibition/warnHighwayInfo/getWarnHighwayInfoData", //高速公路预警
    getWarnContractInfoData:
        "/api/exhibition/warnContractInfo/getWarnContractInfoData", //合同管理预警
    getWarnVaccinesInfoData:
        "/api/exhibition/warnVaccinesInfo/getWarnVaccinesInfoData", //疫苗预警数据
    getProjectYearRate: "/api/exhibition/center/getProjectYearRate", //投资概述
};
const $API = Object.assign(services);
export default $API;
