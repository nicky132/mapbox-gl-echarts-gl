import React, { Component } from 'react';
import './index.scss';
import { Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { BorderBox1 } from '@jiaminghi/data-view-react';
import { ScrollBoard } from '@jiaminghi/data-view-react';
import { history, withRouter } from 'umi';
import * as echarts from 'echarts';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'echarts-gl';
import '@/utils/js/flexible';
import zhejiangData from '@/assets/zhejianggeojson.json';
import beijingData from '@/assets/beijing-polygon.json';
let colorList = [
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
  "#F84E2D", "#1372EC", "#44DEA3", "#FFC544", "#6C44FF",
];
let attrAndColor = [];
 // 各比例尺下地图分辨率，及一个像素代表的地图单位
// 该resolutions为EPSG:900913的分辨率，及个比例尺下一个像素代表多少米
let resolutions = [
  156543.03392800014, 78271.516963999937, 39135.758482000092, 19567.879240999919,
  9783.9396204999593, 4891.9698102499797, 2445.9849051249898, 1222.9924525624949, 611.49622628137968,
  305.74811314055756, 152.87405657041106, 76.437028285073239, 38.21851414253662, 19.10925707126831,
  9.5546285356341549, 4.7773142679493699, 2.3886571339746849, 1.1943285668550503, 0.59716428355981721,
  0.29858214164761665, 0.149291070823808325, 0.0746455354119041625
]
class MapIndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setBarData (data) {
    return data.map((item, index) => {
      return {name: item.name, value: item.value.concat(100 * Math.random())}
    })
  }
  // geojson格式MultiPolygon转MultiLineString
  convertPolygonToPolyline(MultiPolygon) {
    var MultiLineString = []
    MultiPolygon.forEach(Polygon => {
        Polygon.forEach(LinearRing => {
            var LineString = LinearRing
            MultiLineString.push(LineString)
        })
    });
    return MultiLineString
  }
  addPolyline(geojson,map) {
    // 8 ~ 18 级
    for (var i = 6; i <= 18; i++) {
        var radius = 2 * resolutions[i + 1] // 2个像素，缓冲后4个像素
        var lineBuffer = turf.buffer(geojson, radius, {
            units: 'meters'
        });
        map.addSource('lineBufferSource-' + i, {
            'type': 'geojson',
            'data': lineBuffer
        });
        map.addLayer({
            'id': 'lineBufferLayer-' + i,
            'type': 'fill-extrusion',
            'source': 'lineBufferSource-' + i,
            "minzoom": (i - 1),
            "maxzoom": (i + 1),
            'paint': {
                'fill-extrusion-vertical-gradient': true,
                'fill-extrusion-color': '#FFFFFF',
                // 'fill-extrusion-height': 10100, // 挤出高度
                // 'fill-extrusion-base': 10000,// 底部的高度。必须小于或等于挤出高度
                'fill-extrusion-height': 20010, // 挤出高度
                'fill-extrusion-base': 20000,// 底部的高度。必须小于或等于挤出高度
                'fill-extrusion-opacity': 0.8
            }
        });
    }
  }
  addPolygon(geojson,map) {
    map.addSource('beijingPolygonSource', {
        'type': 'geojson',
        'data': geojson
    });

    map.addLayer({
        'id': 'beijingPolygonLayer',
        'type': 'fill-extrusion',
        'source': 'beijingPolygonSource',
        'paint': {
            'fill-extrusion-vertical-gradient': true,
            'fill-extrusion-color': ['match', ['number', ['get', 'adcode']], ...attrAndColor, '#AAAAAA'],
            // 'fill-extrusion-color':'#AAAAAA',
            'fill-extrusion-height': 20000,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.8
        }
    });
  }
  
  init(){
      var mapboxMap = new mapboxgl.Map({
        container: this.basicMapbox,
        center: [120.210792, 30.246026],
        zoom: 6.2,
        pitch: 60,
        bearing: 0,
        style: 'mapbox://styles/mapbox/satellite-v9'
      });
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 200
        // offset: {'top': [1000, 1000]}
      });  
      mapboxMap.on('load',()=>{
        mapboxMap.addSource('states', {
          'type': 'geojson',
          'data': zhejiangData
        })
        console.log("zhejiangData",zhejiangData)
        let addPolygonLine = JSON.parse(JSON.stringify(zhejiangData));
        for (var i = 0; i < addPolygonLine.features.length; i++) {
            attrAndColor.push(addPolygonLine.features[i].properties.adcode);
            attrAndColor.push(colorList[i % 5]);

            addPolygonLine.features[i].geometry.type = 'MultiLineString' //面转线
            addPolygonLine.features[i].geometry.coordinates = this.convertPolygonToPolyline(addPolygonLine.features[
                i].geometry.coordinates)
        }
        this.addPolygon(zhejiangData,mapboxMap);
        this.addPolyline(addPolygonLine,mapboxMap)
        mapboxMap.addLayer({
          'id': 'state-fills',
          'type': 'fill',
          'source': 'states',
          'layout': {},
          'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 0.1
          }
        })
        // mapboxMap.addLayer({
        //   'id': 'state-borders',
        //   'type': 'line',
        //   'source': 'states',
        //   'layout': {},
        //   'paint': {
        //     'line-color': '#fff',
        //     'line-width': 2
        //   }
        // })
        // mapboxMap.addLayer({
        //   'id': 'state-fills-hover',
        //   'type': 'fill',
        //   'source': 'states',
        //   'layout': {},
        //   'paint': {
        //     'fill-color': 'orange',
        //     'fill-opacity': 0.3,
        //   },
        //   'filter': ['==', 'name', '']
        // })

        map.addLayer({
          'id': 'state-fills-hover',
          'type': 'fill-extrusion',
          'source': 'states',
          'filter': ['==', 'name', ''],
          'paint': {
            'fill-extrusion-vertical-gradient': true,
            'fill-extrusion-color': '#FFFFFF',
            // 'fill-extrusion-height': 10100, // 挤出高度
            // 'fill-extrusion-base': 10000,// 底部的高度。必须小于或等于挤出高度
            'fill-extrusion-height': 20010, // 挤出高度
            'fill-extrusion-base': 20000,// 底部的高度。必须小于或等于挤出高度
            'fill-extrusion-opacity': 0.8
          }
        });

        mapboxMap.on("mousemove", function(e) {
            var features = mapboxMap.queryRenderedFeatures(e.point, { layers: ["beijingPolygonLayer"] });/*queryRenderedFeatures  ([geometry], [parameters]):返回满足查询条件并且能够可视化的Geojson特性对象数组，查询条件可以是layers或者filter，如果是layers，则在这些layer之内的特性能够返回  */
            if (features.length) {
              mapboxMap.setFilter("state-fills-hover", ["==", "name", features[0].properties.name]); /* 通过设置filter更新要显示的数据，即出现鼠标悬停之后的变色效果 */

              // Change the cursor style as a UI indicator.
              mapboxMap.getCanvas().style.cursor = 'pointer';
                
              // var coordinates = e.features[0].geometry.coordinates.slice();
              // var description = e.features[0].properties.description;

              var coordinates = features[0].properties.center.replace(/\[|]/g,'').split(",");
              coordinates = [parseFloat(coordinates[0]),parseFloat(coordinates[1])];
              var description = features[0].properties.name;

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates)
              .setHTML(description)
              .addTo(mapboxMap);
            } else {
              mapboxMap.setFilter("state-fills-hover", ["==", "name", ""]);

              mapboxMap.getCanvas().style.cursor = '';
              popup.remove();
            }
        });
      
        // Reset the state-fills-hover layer's filter when the mouse leaves the map
        mapboxMap.on("mouseout", function() {
          mapboxMap.setFilter("state-fills-hover", ["==", "name", ""]); /* 鼠标移开时还原layer的过滤器 */
          console.log("mouseout");
          mapboxMap.getCanvas().style.cursor = '';
          popup.remove();
        });
  
      })
  }
  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {}
  render() {
    return (
      <div id="MapIndexPage" style={{width:'100vw',height:'100vh'}}>
        <div style={{width:'100%',height:'100%'}}>
          <div ref={(el) => (this.basicMapbox = el)} style={{width:'100vw',height:'100vh'}} >
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MapIndexPage);
