import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import { API } from 'utils';

import './index.scss';

const levelMap = [11, 13, 15];

class Index extends Component {
    goBack = () => {
        // 回到上一页
        this.props.history.go(-1);
    }

    state = {
        showHouseList: false
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

        label.addEventListener('click', function () {

            if (that.level === 2) {
                //TODO 显示房源列表
                that.setState({
                    showHouseList: true
                });
                return;
            }
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
        });

        instance.addOverlay(label);
    }

    async handleCircleClick(item, instance) {
        // 3.发请求
        let houseList = await API.get(`/area/map?id=${item.value}`);
        houseList.forEach((v, i) => {
            this.renderCircle(instance, v)
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