import React, { Component } from 'react';
import { BrowserRouter,  HashRouter, Route , Link, Redirect } from 'react-router-dom';
// 引入大首页组件
import  Home  from 'pages/home';
// 引入城市列表组件
import   CityList  from 'pages/citylist';
// 引入地图找房
import  MapPage   from 'pages/map';


export default class App extends Component {
  render() {
    return (
      <div>
        {/* 定义路由 */}
        <BrowserRouter>
          {/* 导航区 */}
          {/* 默认路径自动跳转到大首页 */}
          <Route exact  path="/"  >
                <Redirect  to="/home" />
          </Route>

          {/* 城市列表页面 */}
          <Route   path="/citylist" component={ CityList }  />
          {/* 地图找房 */}
          <Route  path="/map"  component={ MapPage }   />

          {/* 路径和组件匹配区 */}
          {/* 大首页页面 */}
          <Route  path="/home"  component={ Home } />
        </BrowserRouter>
      </div>
    )
  }
}
