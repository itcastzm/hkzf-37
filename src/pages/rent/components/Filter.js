import React, { Component } from 'react';
import { PickerView } from 'antd-mobile';

import { Spring } from 'react-spring/renderprops';

// 引入发请求的模块
import { API } from 'utils';

// 引入样式文件
import './Filter.scss';

const tabs = [
    { label: '区域', index: 'qy', cols: 3, value: 'qyValue' },
    { label: '方式', index: 'rentType', cols: 1, value: 'rentTypeValue' },
    { label: "租金", index: 'price', cols: 1, value: 'priceValue' },
    { label: '筛选', index: 'filter', value: 'filterValue' }
];

export default class Filter extends Component {

    state = {
        currentTab: -1,
        condition: {},
        qy: [],
        rentType: [],
        price: [],
        filter: [],

        // 区域选中值
        qyValue: [],
        // 方式选中值
        rentTypeValue: [],
        // 租金选中值
        priceValue: [],
        // 筛选选中值
        filterValue: []
    }

    temp = [];

    // tab点击事件处理函数
    handleTabClick(index) {
        // 当当前页签是被选中状态 就把选中状态重置为未选中
        if (index === this.state.currentTab) {
            index = -1;
        }
        this.temp = [];
        this.setState({
            currentTab: index
        });
    }

    // pickerView 值改变时调用的回调函数
    handleValueChange = (val) => {
        this.temp = val;
    }

    // 前三个过滤条件确定按钮事件
    handleFCSure = () => {
        let { currentTab } = this.state;
        let item = tabs[currentTab];
        if (this.temp.length === 1 && (this.temp[0] === 'null')) {
            this.setState(() => {

                return {
                    currentTab: -1,
                    [item.value]: []
                }
            }, this.changeCallBack);
        } else if (this.temp.length) {
            this.setState(() => {

                return {
                    currentTab: -1,
                    [item.value]: this.temp
                }
            }, this.changeCallBack);
        } else {
            this.setState(() => {
                return {
                    currentTab: -1,
                }
            }, this.changeCallBack);
        }

    }

    // 回调
    changeCallBack() {
        let { qyValue, rentTypeValue, priceValue, filterValue } = this.state;
        this.props.onSearch({
            area: qyValue,
            mode: rentTypeValue,
            price: priceValue,
            more: filterValue
        });
    }

    // 第四种过滤条件确定按钮事件
    handleSure = () => {
        let { qyValue, rentTypeValue, priceValue, filterValue } = this.state;
        this.props.onSearch({
            area: qyValue,
            mode: rentTypeValue,
            price: priceValue,
            more: filterValue
        });
        this.setState({
            currentTab: -1,
        });
    }

    // 前三个过滤条件取消按钮事件
    handleFCC = () => {
        this.setState({
            currentTab: -1,
        });
    }

    // 第四个过滤条件 点击事件处理
    filterSelect(value) {
        let { filterValue } = this.state;
        let index = filterValue.indexOf(value);
        if (index > -1) {
            filterValue.splice(index, 1);
        } else {
            filterValue.push(value);
        }

        this.setState({
            filterValue
        });
    }

    // 第四种过滤条件清除按钮点击事件
    handleClear = () => {
        this.setState({
            filterValue: []
        });
    }

    // 获取过滤区内容
    getContent() {

        let item = this.state.currentTab === -1 ? {} : tabs[this.state.currentTab];
        let data = this.state.currentTab === -1 ? [] : this.state[item.index];
        let { filterValue } = this.state;

        let from = this.state.currentTab === 3 ? '100vw' : '20vw';
        let to = this.state.currentTab === 3 ? '20vw' : '100vw';
        // let fitlerList = this.state.

        return (
            <React.Fragment>
                {this.state.currentTab === 3 ? <div onClick={this.resetTab} className="mask"></div> : null}
                <div className={["fitler-area", this.state.currentTab === 3 ? 'show' : null].join(' ')} >
                    <div className="items">
                        {this.state.filter.length && this.state.filter.map((v, i) => (
                            <div key={i} className="item">
                                <div className="head">{v.label}</div>
                                <div className="spans">
                                    {v.list.map(p => <span className={filterValue.indexOf(p.value) > -1 ? 'active' : ''}
                                        key={p.value}
                                        onClick={this.filterSelect.bind(this, p.value)}
                                    >{p.label}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {this.state.currentTab === 3 ?
                        <div className="opers">
                            <span onClick={this.handleClear}>清除</span>
                            <span onClick={this.handleSure}>确定</span>
                        </div> : null}
                </div>
                {/* 
                <Spring
                    from={{ left: from }}
                    to={{ left: to }}>
                    {props => (
                        <div className={["fitler-area"].join(' ')} style={{ left: props.left }}>
                            {this.state.filter.length && this.state.filter.map((v, i) => (
                                <div key={i} className="item">
                                    <div className="head">{v.label}</div>
                                    <div className="spans">
                                        {v.list.map(p => <span className={filterValue.indexOf(p.value) > -1 ? 'active' : ''}
                                            key={p.value}
                                            onClick={this.filterSelect.bind(this, p.value)}
                                        >{p.label}</span>)}
                                    </div>
                                </div>
                            ))}
                            <div className="opers">
                                <span onClick={this.handleClear}>清除</span>
                                <span onClick={this.handleSure}>确定</span>
                            </div>
                        </div>
                    )}
                </Spring> */}


                <div className={["filter-content", [0, 1, 2].indexOf(this.state.currentTab) > -1 ? 'show' : null].join(' ')}>
                    {[0, 1, 2].indexOf(this.state.currentTab) > -1 ? <PickerView
                        data={data}
                        cols={item.cols}
                        value={this.state[item.value]}
                        onChange={this.handleValueChange}
                    /> : null}
                    <div className="opers">
                        <span onClick={this.handleFCC}>取消</span>
                        <span onClick={this.handleFCSure}>确定</span>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    // 重置遮罩选中效果
    resetTab = () => {
        this.setState({ currentTab: -1 });
    }

    // 获取遮罩
    getMask() {
        // 当当前选中页签的时候  返回遮罩
        return [0, 1, 2].indexOf(this.state.currentTab) > -1 ? <div onClick={this.resetTab} className="mask"></div> : null;
    }

    async componentDidMount() {
        // 获取过滤条件数据
        let condition = await API.get(`/houses/condition?id=AREA|e4940177-c04c-383d`);

        let qy = [{ ...condition.area }, { ...condition.subway }];
        let rentType = condition.rentType;
        let price = condition.price;

        let filter = [
            { label: '户型', list: [...condition.roomType] },
            { label: '朝向', list: [...condition.oriented] },
            { label: '楼层', list: [...condition.floor] },
            { label: '房屋亮点', list: [...condition.characteristic] },
        ]

        console.log(condition);
        this.setState({
            condition,
            qy,
            rentType,
            price,
            filter
        });
    }

    isActive(index) {
        // currentTab 等于index  返回true 
        // 如果不等于  但是  currentTab 对应的页签有选中值的话 也返回true
        // 否则返回false
        let item = tabs[index];
        let data = this.state[item.value]
        if (this.state.currentTab === index) {
            return true;
        } else if (data.length > 0) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div className="comp-filter-wrapper">

                {this.getMask()}

                {/* 组件头部开始 */}
                <div className="head">
                    {tabs.map((v, i) => <span className={this.isActive(i) ? 'active' : ''} onClick={this.handleTabClick.bind(this, i)} key={i}>{v.label}<i className="iconfont icon-arrow"></i></span>)}
                </div>
                {/* 组件头部结束 */}
                {/* 过滤内容区开始 */}

                {this.getContent()}
                {/* 过滤内容区结束 */}
            </div>
        )
    }
}
