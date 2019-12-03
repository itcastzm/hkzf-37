import React, { Component } from 'react';
import { API, BASE_URL } from 'utils';
import { Carousel, NavBar } from 'antd-mobile';

import HouseListItem from 'components/HouseListItem';
import './index.scss';


const iconMap = {
    '电视': 'icon-vid',
    '空调': 'icon-air',
    '热水器': 'icon-heater',
    '沙发': 'icon-sofa',
    '洗衣机': 'icon-wash',
    '天然气': 'icon-gas',
    '冰箱': 'icon-ref'
};

// 猜你喜欢
const recommendHouses = [
    {
        id: 1,
        houseImg: '/img/message/1.png',
        desc: '72.32㎡/南 北/低楼层',
        title: '安贞西里 3室1厅',
        price: 4500,
        tags: ['随时看房']
    },
    {
        id: 2,
        houseImg: '/img/message/2.png',
        desc: '83㎡/南/高楼层',
        title: '天居园 2室1厅',
        price: 7200,
        tags: ['近地铁']
    },
    {
        id: 3,
        houseImg: '/img/message/3.png',
        desc: '52㎡/西南/低楼层',
        title: '角门甲4号院 1室1厅',
        price: 4300,
        tags: ['集中供暖']
    }
]

export default class index extends Component {

    state = {
        hosueObj: {},
        imgHeight: 250,
    }

    goBack = () => {
        // 回到上一页
        this.props.history.go(-1);
    }
    async componentDidMount() {
        let { match: {
            params: {
                id
            }
        } } = this.props;
        let hosueObj = await API.get(`/houses/${id}`);
        this.setState({
            hosueObj
        });


        // 百度地图API功能
        var mp = new window.BMap.Map("mapcontianer");
        mp.centerAndZoom(new window.BMap.Point(hosueObj.coord.longitude, hosueObj.coord.latitude), 15);
        mp.enableScrollWheelZoom();
        // 复杂的自定义覆盖物
        function ComplexCustomOverlay(point, text) {
            this._point = point;
            this._text = text;
        }
        ComplexCustomOverlay.prototype = new window.BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function (map) {
            this._map = map;
            var div = this._div = document.createElement("div");
            div.style.position = "absolute";
            div.style.zIndex = window.BMap.Overlay.getZIndex(this._point.lat);
            div.style.backgroundColor = "#EE5D5B";
            div.style.border = "1px solid #BC3B3A";
            div.style.color = "white";
            div.style.height = "18px";
            div.style.padding = "2px";
            div.style.lineHeight = "18px";
            div.style.whiteSpace = "nowrap";
            div.style.MozUserSelect = "none";
            div.style.fontSize = "12px"
            var span = this._span = document.createElement("span");
            div.appendChild(span);
            span.appendChild(document.createTextNode(this._text));
            var that = this;

            var arrow = this._arrow = document.createElement("div");
            arrow.style.background = "url(//map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
            arrow.style.position = "absolute";
            arrow.style.width = "11px";
            arrow.style.height = "10px";
            arrow.style.top = "22px";
            arrow.style.left = "10px";
            arrow.style.overflow = "hidden";
            div.appendChild(arrow);

            div.onmouseover = function () {
                this.style.backgroundColor = "#6BADCA";
                this.style.borderColor = "#0000ff";
                this.getElementsByTagName("span")[0].innerHTML = that._overText;
                arrow.style.backgroundPosition = "0px -20px";
            }

            div.onmouseout = function () {
                this.style.backgroundColor = "#EE5D5B";
                this.style.borderColor = "#BC3B3A";
                this.getElementsByTagName("span")[0].innerHTML = that._text;
                arrow.style.backgroundPosition = "0px 0px";
            }

            mp.getPanes().labelPane.appendChild(div);

            return div;
        }
        ComplexCustomOverlay.prototype.draw = function () {
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
            this._div.style.top = pixel.y - 30 + "px";
        }

        var myCompOverlay = new ComplexCustomOverlay(new window.BMap.Point(hosueObj.coord.longitude, hosueObj.coord.latitude), hosueObj.community);

        mp.addOverlay(myCompOverlay);


    }
    render() {
        let { hosueObj } = this.state;
        let { houseImg, tags } = hosueObj;
        return (
            <div className="detail-wrapper">

                {/* 轮播图区域开始 */}
                <div className="swiper-area">
                    {/* 轮播图开始 */}
                    {houseImg && houseImg.length ? <Carousel
                        autoplay={true}
                        infinite
                        autoplayInterval={2000}
                        speed={200}
                    >
                        {houseImg.map((val, i) => (
                            <a
                                key={i}
                                href="http://m.itcast.cn/"
                                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                            >
                                <img
                                    src={`${BASE_URL}${val}`}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top', height: '100%' }}
                                    onLoad={(e) => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        // this.setState({ imgHeight: 'auto' });
                                    }}
                                />
                            </a>
                        ))}
                    </Carousel> : null
                    }
                    {/* 轮播图结束 */}
                    {/* 详情页顶部开始 */}
                    <div className="head-area">
                        <NavBar
                            mode="light"
                            icon={<i className="iconfont  icon-back"></i>}
                            onLeftClick={this.goBack}
                            rightContent={[
                                <i key={0} className="iconfont  icon-share"></i>,
                            ]}
                        >
                            {hosueObj.community}
                        </NavBar>
                    </div>
                    {/* 详情页顶部结束 */}
                </div>
                {/* 轮播图区域结束 */}

                {/* 房屋标题开始 */}
                <div className="title">
                    {hosueObj.title}
                </div>
                {/* 房屋标题结束 */}
                {/* 标签列表开始 */}
                <div className="tags">
                    {tags && tags.map((v, i) => <span key={i}>{v}</span>)}
                </div>
                {/* 标签列表结束 */}
                {/* 房屋行情开始 */}
                <div className="house-status">
                    <div className="status-items">
                        <div className="item">
                            <div className="up">{hosueObj.price}<span>/月</span></div>
                            <div className="bottom">租金</div>
                        </div>
                        <div className="item">
                            <div className="up">{hosueObj.roomType}<span>/月</span></div>
                            <div className="bottom">房型</div>
                        </div>
                        <div className="item">
                            <div className="up">{hosueObj.size}<span>/月</span></div>
                            <div className="bottom">面积</div>
                        </div>
                    </div>
                </div>
                {/* 房屋行情结束 */}
                {/* 房屋的结构开始 */}
                <div className="house-type">
                    <div className="item">
                        <span>装修：</span>
                        <span>精装</span>
                    </div>
                    <div className="item">
                        <span>朝向：</span>
                        <span>{hosueObj.oriented && hosueObj.oriented.join(',')}</span>
                    </div>
                    <div className="item">
                        <span>楼层：</span>
                        <span>{hosueObj.floor}</span>
                    </div>
                    <div className="item">
                        <span>类型：</span>
                        <span>普通楼层</span>
                    </div>
                </div>
                {/* 房屋的结构结束 */}

                {/* 定位区域开始 */}
                <div className="map-area">
                    <div className="head">小区：{hosueObj.community}</div>
                    <div className="map" id="mapcontianer">

                    </div>
                </div>
                {/* 定位区域结束 */}

                {/* 房屋配套开始 */}
                <div className="house-pt">
                    <div className="head">房屋配套</div>
                    <div className="supports">
                        {hosueObj.supporting && hosueObj.supporting.map((v, i) => (
                            <div key={i} className="item">
                                <i className={['iconfont', iconMap[v]].join(' ')}></i>
                                <span>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 房屋配套结束 */}

                {/* 房源概况开始 */}
                <div className="house-gk">
                    <div className="head">房源概况</div>
                    <div className="fd-info">
                        <div className="info-l">
                            <div className="img">
                                <img src={`${BASE_URL}/img/avatar.png`} />
                            </div>
                            <div className="info-fd">
                                <span>王女士</span>
                                <span><i className="iconfont icon-auth"></i>已认证房主</span>
                            </div>
                        </div>
                        <span className="fxx">发消息</span>
                    </div>
                    <div className="description">
                        {hosueObj.description}
                    </div>
                </div>
                {/* 房源概况结束 */}

                {/* 操作按钮开始 */}
                <div className="opers">
                    <span><i className="iconfont icon-coll"></i>收藏</span>
                    <span>在线咨询</span>
                    <a href="tel:400-618-4000">电话预约</a>
                </div>
                {/* 操作按钮结束 */}

                {/* 猜你喜欢开始 */}
                <div className="u-like">
                    <div className="head">猜你喜欢</div>
                    <div className="items">
                        {recommendHouses.map((v, i) => (
                            <HouseListItem key={i} item={v} onClick={() => { console.log(); }} />
                        ))}
                    </div>
                </div>
                {/* 猜你喜欢结束 */}


                详情页
            </div>
        )
    }
}
