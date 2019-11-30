import React, { Component } from 'react'
import './index.scss';
// import PropTypes from 'prop-types';
export default class Index extends Component {

    handleCity = () => {
        //点击城市名的事件处理
        this.props.onCity();
    }
    handleInput = () => {
        // {/* 点击输入框的事件 */}
        this.props.onInput();
    }
    handleMap = () => {
        // 点击地图的操作
        this.props.onMap();
    }
    render() {
        return (
            <div className="comp-searchinput">
                {/* 左边开始 */}
                <div className="s-l">
                    {/* 城市名开始 */}
                    <div className="city">
                        {/* 点击城市名的事件 */}
                        <span onClick={this.handleCity}>{this.props.cityName && this.props.cityName.slice(0, 2)}</span>
                        {/* 小图标开始 */}
                        <i className="iconfont icon-arrow"></i>
                        {/* 小图标结束 */}
                    </div>
                    {/* 城市名结束 */}
                    <div className="input">
                        {/* 小图标开始 */}
                        <i className="iconfont icon-seach"></i>
                        {/* 小图标结束 */}
                        {/* onPress */}
                        {/* 点击输入框的事件 */}
                        <span onClick={this.handleInput} className="word">请输入小区或地址</span>
                    </div>
                </div>
                {/* 左边结束 */}
                {/* 地图图标开始 */}
                <div className="s-r">
                    {/* 点击地图的事件 */}
                    <i className="iconfont icon-map" onClick={this.handleMap}></i>
                </div>
                {/* 地图图标结束 */}
            </div>
        )
    }
}
// props的默认值
Index.defaultProps = {
    onCity: () => { },
    onInput: () => { },
    onMap: () => { },
}
// props的类型检查


