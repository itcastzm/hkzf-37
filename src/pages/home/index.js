import { TabBar } from 'antd-mobile';
import React, { Component } from 'react';

import { connect } from 'react-redux';

// 引入actions 方法
import { changeHomeTab } from 'store/actions';

// 首页
import Index from 'pages/index';
// 找房
import Rent from 'pages/rent';
// 资讯
import News from 'pages/news';
// 我的
import My from 'pages/my';

class Home extends Component {

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
            selected={this.props.selectedTab === 'index'}
            onPress={() => { this.props.dispatch(changeHomeTab('index'));}}
          >
            {/* 首页 */}
            <Index />
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-findHouse"></i>}
            selectedIcon={<i className="iconfont icon-findHouse"></i>}
            title="找房"
            key="rent"
            selected={this.props.selectedTab === 'rent'}
            onPress={() => { this.props.dispatch(changeHomeTab('rent'));}}
          >
            {/* 找房 */}
            <Rent />
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-infom"></i>}
            selectedIcon={<i className="iconfont icon-infom"></i>}
            title="资讯"
            key="news"
            selected={this.props.selectedTab === 'news'}
            onPress={() => { this.props.dispatch(changeHomeTab('news')); }}
          >
            {/* 资讯 */}
            <News />
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-myinfo"></i>}
            selectedIcon={<i className="iconfont icon-myinfo"></i>}
            title="我的"
            key="my"
            selected={this.props.selectedTab === 'my'}
            onPress={() => {  this.props.dispatch(changeHomeTab('my'));  }}
          >
            {/* 我的 */}
            <My />
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

const mapStateToProps = (state)=> {
  return {
    selectedTab: state.indexReducer.selectedTab
  }
}

export default  connect(mapStateToProps)(Home);