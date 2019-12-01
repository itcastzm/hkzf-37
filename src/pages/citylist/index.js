import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';

// 引入强大列表组件
import { List, AutoSizer } from 'react-virtualized';

import { connect } from 'react-redux';

// 引入actions

import  {  fetchCityList , setCurrentCity} from 'store/actions';

// 引入封装好的  axios
import { API } from 'utils';

// 引入样式
import './index.scss';


class Index extends Component {

    state = {
        hotList: [],
        citylist: [],
        list: [],
        startIndex: 0
    }

    constructor() {
        super();
        // 创建列表组件的引用
        this.listRef = React.createRef();
    }


    goBack = () => {
        // 回到上一页
        this.props.history.go(-1);
    }

    // 重置设置当前城市
    setCurrentCity(cityName) {
        this.props.dispatch(setCurrentCity(cityName));
        this.props.history.push('/home');
    }

    async componentDidMount() {
        if (this.props.sortedclist.length === 0) {
            // 发异步的action
            this.props.dispatch(fetchCityList());
        }
    }


    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        let item = this.props.sortedclist[index];
        let keys = Object.keys(item);
        let mark = keys[0];
        let arr = item[mark];
        return (
            <div key={key} style={style} className="list-item">
                {/* {list[index]} */}
                <div className="title">{mark}</div>
                {arr.map((v, i) => <div  onClick={this.setCurrentCity.bind(this, v)} className="item" key={i}>{v}</div>)}
            </div>
        );
    }

    // 动态获取每行的高度
    getHeight = ({ index }) => {
        let item = this.props.sortedclist[index];
        let keys = Object.keys(item);
        let mark = keys[0];
        let arr = item[mark];
        return 50 + arr.length * 50;
    }

    // 点击右侧索引联动效果

    toIndex(index) {
        //将List表格移动相应行
        // scrollToRow  
        // 拿List实例  通过非受控表单的方式拿到List实例
        // 通过创建好的List Ref 引用拿到List实例 然后调用组件公共方法
        this.listRef.current.scrollToRow(index);
    }

    // 右侧列表渲染
    getRightRender = () => {
        let {  startIndex } = this.state;
        return (
            <React.Fragment>
                {this.props.sortedclist.map((v, i) => {
                    let keys = Object.keys(v);
                    let mark = keys[0];
                    let mk = mark[0];
                    return (<span onClick={this.toIndex.bind(this, i)} className={startIndex === i ? 'active' : ''} key={i}>{mk === '当' ? '#' : mk}</span>)
                })}
            </React.Fragment>
        )
    }

    // 监听行渲染事件
    rowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
        this.setState({
            startIndex
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

                {/* 城市列表区开始 */}
                <div className="list-area">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={this.props.sortedclist.length}
                                rowHeight={this.getHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.rowsRendered}
                                // 为了跳转精确  需要配置 对齐方式
                                scrollToAlignment="start"
                                // 把引用和组件绑定
                                ref={this.listRef}
                            />
                        )}
                    </AutoSizer>
                    {/* 列表右侧索引开始 */}
                    <div className="list-r">
                        {this.getRightRender()}
                    </div>
                    {/* 列表右侧索引结束 */}
                </div>
                {/* 城市列表区结束 */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loc_info: state.indexReducer.loc_info,
        hotList: state.indexReducer.hotList,
        citylist: state.indexReducer.citylist,
        sortedclist: state.indexReducer.sortedclist,
    }
}

export default connect(mapStateToProps)(Index);
