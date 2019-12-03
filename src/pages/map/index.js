import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import { connect } from 'react-redux';

// 引入acitons 方法
import { changeHomeTab } from 'store/actions';
import { API } from 'utils';

import HouseListItem from 'components/HouseListItem';

import './index.scss';

const levelMap = [11, 13, 15];

class Index extends Component {
    goBack = () => {
        // 回到上一页
        this.props.history.go(-1);
    }

    state = {
        showHouseList: false,
        houselist: []
    }

    level = 0;

    async componentDidMount() {

        let { name } = this.props.loc_info;
        var map = new window.BMap.Map("container");
        // 创建地图实例  
        var point = new window.BMap.Point(113.261927, 23.17599);
        // 创建点坐标  
        map.centerAndZoom(point, levelMap[this.level]);
        map.setCenter(this.props.loc_info.name);
        let cityInfo = await API.get(`/area/info?name=${name}`);
        let houseList = await API.get(`/area/map?id=${cityInfo.value}`);


        // 监听地图移动事件  当房源列表打开时  移动地图 隐藏房源列表
        map.addEventListener('movestart', () => {
            if (this.state.showHouseList) {
                this.setState({
                    showHouseList: false,
                    houselist: []
                });
            }
        });


        houseList.forEach((v, i) => {
            this.renderCircle(map, v)
        });
    }

    // 渲染圆圈
    renderCircle(instance, item) {

        let that = this;

        var point = new window.BMap.Point(item.coord.longitude, item.coord.latitude);
        var opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new window.BMap.Size(30, -30)    //设置文本偏移量
        }
        var label = new window.BMap.Label("", opts);  // 创建文本标注对象
        // debugger
        if (this.level === 2) {
            // 小区级别
            label.setContent(`<div class="rect"><span>${item.label}</span>${item.count}套</div>`);
        } else {
            // 城市行政区和街道级别
            label.setContent(`<div class="cicle"><p>${item.label}</p><p>${item.count}套</p></div>`);
        }
        label.setStyle({
            cursor: 'pointer',
            border: '0px solid rgb(255, 0, 0)',
            padding: '0px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: 'rgb(255, 255, 255)',
            textAlign: 'center'
        });

        label.addEventListener('click', function (e) {

            if (that.level === 2) {
                // 移动选中的小区到加载房源列表以后的地图中心
                let target = e.changedTouches[0];
                instance.panBy(window.innerWidth / 2 - target.clientX,
                    (window.innerHeight - 350) / 2 - target.clientY
                );
                that.handleClickCommunity(instance, item);

            } else {
                // 1. 把地图移动到点击位置  并放大
                // 把地图移动到点击位置  并放大
                that.level = that.level + 1;
                instance.setCenter(point);
                instance.setZoom(levelMap[that.level]);
                // 2. 清除地图上的所有遮罩物 
                // 注意： 百度地图的bug  通过setTimeOut去解决
                setTimeout(() => {
                    instance.clearOverlays();
                }, 0);
                that.handleCircleClick(item, instance);
            }

        });

        instance.addOverlay(label);
    }

    // 点击小区后的处理函数
    async handleClickCommunity(instance, item) {

        // 1. 加载该小区房源列表数据
        let data = await API.get(`/houses?cityId=${item.value}`);
        // 2. 拿到加载好的数据 渲染在房源列表里头
        //TODO 显示房源列表
        this.setState({
            showHouseList: true,
            houselist: data.list
        });

    }

    async handleCircleClick(item, instance) {
        // 3.发请求
        let houseList = await API.get(`/area/map?id=${item.value}`);
        houseList.forEach((v, i) => {
            this.renderCircle(instance, v)
        });
    }

    // 跳转到找房页面
    toMoreHouse = () => {
        this.props.dispatch(changeHomeTab('rent'));
        this.props.history.push({
            pathname: '/home'
        });
    }

    //跳转到房源详情页
    toDetailPage(item) {
        this.props.history.push({
            pathname: `/detail/${item.houseCode}`
        });
    }

    render() {
        return (
            <div className="map-wrapper">
                <NavBar
                    mode="light"
                    icon={<i className="iconfont  icon-back"></i>}
                    onLeftClick={this.goBack}
                // rightContent={[
                //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                //     <Icon key="1" type="ellipsis" />,
                // ]}
                >
                    地图找房
                </NavBar>

                {/* 地图区域开始 */}
                <div className="geo-area" id="container">

                </div>
                {/* 地图区域结束 */}
                {/* 房屋列表开始 */}
                <div className={['house-list-area', this.state.showHouseList ? 'show' : ''].join(' ')}>
                    {/* 拿到加载好的数据 渲染在房源列表里头 */}
                    <div className="head">
                        <span>房源列表</span>
                        <span onClick={this.toMoreHouse}>更多房源</span>
                    </div>

                    <div className="items">
                        {this.state.houselist.map((v, i) => (
                            // 房源卡片组件
                            <HouseListItem onClick={this.toDetailPage.bind(this, v)} key={v.houseCode} item={v} />
                        ))}
                    </div>
                </div>
                {/* 房屋列表结束 */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loc_info: state.indexReducer.loc_info
    }
}

export default connect(mapStateToProps)(Index)