import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';

// 引入封装好的  axios
import { API } from 'utils';

// 引入样式
import './index.scss';

export default class index extends Component {


    state = {
        hotList: [],
        citylist: []
    }


    goBack = () => {
        // 回到上一页
        this.props.history.go(-1);
    }

    async componentDidMount() {
        // API
        let hotList = await API.get(`/area/hot`);
        let citylist = await API.get(`/area/city?level=1`);

        console.log(hotList)
        let list = [
            { '当前定位': [this.props.location.loca_info.name.slice(0, 2)] },
            { '热门城市': hotList.map((v) => v.label) },
        ]


        citylist.sort(function (a, b) {
            return a['short'] > b['short'] ? 1 : -1
        });

        citylist.forEach((v, i, a) => {
            let lastItem = list[list.length - 1];
            let keys = Object.keys(lastItem);
            let key = keys[0];

            let short = v['short'];
            let mark = short[0].toUpperCase();
            // 把小写字母转成大写
            if (key === mark) {
                lastItem[key].push(v.label)
            } else {
                let obj = {
                    [mark]: [v.label]
                }
                list.push(obj);
            }
        })


        this.setState({
            hotList,
            citylist,
            list
        });

    }


    render() {

        console.log(this.props, this.state)

        return (
            <div className="citylist-wrapper">

                <NavBar
                    mode="light"
                    icon={<i className="iconfont  icon-back"></i>}
                    onLeftClick={this.goBack}
                // rightContent={[
                //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                //     <Icon key="1" type="ellipsis" />,
                // ]}
                >
                    城市选择
                </NavBar>
                城市选择
            </div>
        )
    }
}
