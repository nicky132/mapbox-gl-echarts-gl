import React, { Component } from 'react';
import './index.scss';
import { Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { BorderBox1 } from '@jiaminghi/data-view-react';
import { ScrollBoard } from '@jiaminghi/data-view-react';
import { history, withRouter } from 'umi';
import echarts from 'echarts'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import 'echarts-gl'
import '@/utils/js/flexible';
class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <div id="MapIndexPage">
        MapIndexPage...
      </div>
    );
  }
}

export default withRouter(WelcomePage);
