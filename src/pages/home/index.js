import { TabBar } from 'antd-mobile';
import React, { Component } from 'react';

// 首页
import Index from 'pages/index';
// 找房
import Rent from 'pages/rent';
// 资讯
import News from 'pages/news';
// 我的
import My from 'pages/my';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'index',
    };
  }

  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="rgb(33, 185, 122)"
          barTintColor="white"
        >
          <TabBar.Item
            title="首页"
            key="index"
            icon={<i className="iconfont  icon-ind"></i>}
            selectedIcon={<i className="iconfont  icon-ind"></i>}
            selected={this.state.selectedTab === 'index'}
            onPress={() => { this.setState({ selectedTab: 'index', }); }}
          >
            {/* 首页 */}
            <Index />
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-findHouse"></i>}
            selectedIcon={<i className="iconfont icon-findHouse"></i>}
            title="找房"
            key="rent"
            selected={this.state.selectedTab === 'rent'}
            onPress={() => { this.setState({ selectedTab: 'rent', }); }}
          >
            {/* 找房 */}
            <Rent />
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-infom"></i>}
            selectedIcon={<i className="iconfont icon-infom"></i>}
            title="资讯"
            key="news"
            selected={this.state.selectedTab === 'news'}
            onPress={() => { this.setState({ selectedTab: 'news', }); }}
          >
            {/* 资讯 */}
            <News />
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-myinfo"></i>}
            selectedIcon={<i className="iconfont icon-myinfo"></i>}
            title="我的"
            key="my"
            selected={this.state.selectedTab === 'my'}
            onPress={() => { this.setState({ selectedTab: 'my', }); }}
          >
            {/* 我的 */}
            <My />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}
