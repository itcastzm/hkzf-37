import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';
// 引入axios包
import axios from 'axios';

import SearchInput from 'components/searchInput';
import { withRouter } from 'react-router-dom';

// sass 样式引入
import './index.scss';

import { BASE_URL, API } from 'utils';


// 引入导航图片
import nav1 from 'assets/images/nav-1.png';
import nav2 from 'assets/images/nav-2.png';
import nav3 from 'assets/images/nav-3.png';
import nav4 from 'assets/images/nav-4.png';


const navs = [{ img: nav1, title: '整租' }, { img: nav2, title: '合租' },
{ img: nav3, title: '地图找房' }, { img: nav4, title: '去出租' }];

class Index extends React.PureComponent {
    state = {
        swiperList: [],
        zfzxList: [],
        zxzxList: [],
        imgHeight: 212,
        loca_info: {}
    }

    async componentDidMount() {
        // 请求轮播图数据
        // async  await
        let swiperList = await API.get(`/home/swiper`);
        let zfzxList = await API.get(`/home/groups?area=AREA%7C88cff55c-aaa4-e2e0`);
        let zxzxList = await API.get(`/home/news?area=AREA%7C88cff55c-aaa4-e2e0`);
        // 百度定位 拿到城市名
        let loca_info = await this.getCurrentCity();
        console.log(loca_info);


        this.setState({
            swiperList,
            zfzxList,
            zxzxList,
            loca_info
        });

    }
    // 百度定位 拿到城市名
    getCurrentCity() {
        var myCity = new window.BMap.LocalCity();
        return new Promise(function (resove, reject) {
            try {
                myCity.get((result) => {
                    resove(result);
                });
            } catch (e) {
                reject(e);
            }
        })
    }

    //跳转到城市列表页面
    toCityList = () => {
        // /citylist 1. 路由方式切换传递城市名   2.  redux全局管理信息
        this.props.history.push({
            pathname: '/citylist',
            loca_info: this.state.loca_info
        });
    }

    // 跳转到地图找房
    toMap = () => {
        this.props.history.push('/map');
    }


    render() {
        console.log('首页')
        return (
            <div className="index-wrapper">
                {/* 轮播图区域开始 */}
                <div className="swiper-area">
                    {/* 轮播图开始 */}
                    {this.state.swiperList.length ? <Carousel
                        autoplay={true}
                        infinite
                        autoplayInterval={2000}
                        speed={200}
                    >
                        {this.state.swiperList.map(val => (
                            <a
                                key={val.id}
                                href="http://m.itcast.cn/"
                                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                            >
                                <img
                                    src={`http://localhost:8080${val.imgSrc}`}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                    onLoad={() => {
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
                    {/* 搜索框开始 */}
                    <div className="search-area">
                        <SearchInput
                            // searchInput 需要对外至少三个api
                            // 1. 点击城市名的处理
                            onCity={this.toCityList}
                            // 2. 点击输入框的处理
                            onInput={() => { console.log('点击输入！') }}
                            // 3. 点击地图图标的处理
                            onMap={this.toMap}
                            cityName={this.state.loca_info.name}
                        />
                    </div>
                    {/* 搜索框结束 */}
                </div>
                {/* 轮播图区域结束 */}

                {/* 导航区域开始 */}
                <div className="nav-area">
                    {navs.map((v, i) => (
                        <div key={i} className="item">
                            <div className="img">
                                <img src={v.img} />
                            </div>
                            <span>{v.title}</span>
                        </div>

                    ))}
                </div>
                {/* 导航区域结束 */}

                {/* 租房小组开始 */}
                <div className="zfxz-area">
                    <div className="head">
                        <div className="title">租房小组</div>
                        <div className="more">更多</div>
                    </div>
                    <div className="body">
                        {this.state.zfzxList.map((v, i) => (
                            <div key={v.id} className="item">
                                <div className="left">
                                    <span>{v.title}</span>
                                    <span>{v.desc}</span>
                                </div>
                                <div className="img">
                                    <img src={`http://localhost:8080${v.imgSrc}`} />
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                {/* 租房小组结束 */}

                {/* 最新资讯开始 */}
                <div className="zxzx-area">
                    <div className="head">最新资讯</div>
                    <div className="items">
                        {this.state.zxzxList.map(v => (
                            <div key={v.id} className="item">
                                <div className="img">
                                    <img src={`${BASE_URL}${v.imgSrc}`} />
                                </div>
                                <div className="item-r">
                                    <div className="r-top">
                                        {v.title}
                                    </div>
                                    <div className="r-bottom">
                                        <span>{v.from}</span>
                                        <span>{v.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 最新资讯结束 */}
            </div>
        );
    }
}
//为了让组件  拿到history 对象  使用这种方式包裹一下组件
export default withRouter(Index);
