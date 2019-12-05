import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import SearchInput from 'components/searchInput';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Filter from './components/Filter';


// 引入强大列表组件
import { List, AutoSizer } from 'react-virtualized';
import HouseListItem from 'components/HouseListItem';

import { API, BASE_URL } from 'utils';

import './index.scss';

class Index extends React.PureComponent {


    state = {
        list: []
    }
    //跳转到城市列表页面
    toCityList = () => {
        // /citylist 1. 路由方式切换传递城市名   2.  redux全局管理信息
        this.props.history.push({
            pathname: '/citylist',
            // loca_info: this.state.loca_info
        });
    }

    // 跳转到地图找房
    toMap = () => {
        this.props.history.push('/map');
    }

    // 请求数据
    async  searchByParams(params) {
        console.log(params);
        let start = 1;
        let end = 20;
        let cityId = 'AREA|e4940177-c04c-383d';
        let area = 'null';
        if (params.area.length > 1 && params.area[params.area.length - 1]) {
            area = params.area[params.area.length - 1];
        }
        let mode = 'null';
        if (params.mode.length) {
            mode = params.mode[0];
        }
        let price = 'null';
        if (params.price.length) {
            price = params.price[0];
        }
        let more = 'null';
        if (params.more.length) {
            more = params.more.join(',');
        }
        let url = `&area=${area}&mode=${mode}&price=${price}&more=${more}`;
        let data = await API.get(`/houses?cityId=${cityId}&start=${start}&end=${end}&${url}`);

        this.setState({
            list: data.list
        });

    }

    async  componentDidMount() {
        let start = 1;
        let end = 20;
        let cityId = 'AREA|e4940177-c04c-383d';
        let area = 'null';
        let mode = 'null';
        let price = 'null';
        let more = 'null';
        let url = `&area=${area}&mode=${mode}&price=${price}&more=${more}`;
        let data = await API.get(`/houses?cityId=${cityId}&start=${start}&end=${end}&${url}`);

        this.setState({
            list: data.list
        });
    }

    //跳转到房源详情页
    toDetailPage(item) {
        this.props.history.push({
            pathname: `/detail/${item.houseCode}`
        });
    }

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        let item = this.state.list[index];

        // return <HouseListItem key={key} style={style} item={item}
        //     onClick={this.toDetailPage.bind(this, item)}
        // />

        return (
            <div className="comp-house-list-item" key={key} style={style}  onClick={this.toDetailPage.bind(this, item)}>
                <div className="img">
                    <img src={`${BASE_URL}${item.houseImg}`} />
                </div>
                <div className="item-r">
                    <div className="title">{item.title}</div>
                    <div className="desc">{item.desc}</div>
                    <div className="tags">
                        {item.tags.map((v, i) => <span key={i}>{v}</span>)}
                    </div>
                    <div className="price"> <span>{item.price}</span>元/月</div>
                </div>
            </div>
        )
    }

    hanleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
        console.log(clientHeight, scrollHeight, scrollTop);
    }

    render() {
        console.log('找房')
        return (
            <div className="rent-wrapper">
                <NavBar
                    mode="light"
                    icon={<i className="iconfont  icon-back"></i>}
                    onLeftClick={this.goBack}
                // rightContent={[
                //     <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                //     <Icon key="1" type="ellipsis" />,
                // ]}
                >
                    <SearchInput
                        // searchInput 需要对外至少三个api
                        // 1. 点击城市名的处理
                        onCity={this.toCityList}
                        // 2. 点击输入框的处理
                        onInput={() => { console.log('点击输入！') }}
                        // 3. 点击地图图标的处理
                        onMap={this.toMap}
                        cityName={this.props.loc_info.name}
                    />
                </NavBar>


                {/* 过滤区开始 */}
                <Filter onSearch={this.searchByParams.bind(this)} />
                {/* 过滤区结束 */}
                {/* 房源列表开始 */}
                <div className={'house-list'}>
                    {this.state.list.map((v, i) => (
                        <HouseListItem key={i} item={v}
                            onClick={this.toDetailPage.bind(this, v)}
                        />
                    ))}

                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={this.state.list.length}
                                rowHeight={150}
                                rowRenderer={this.rowRenderer}
                                // onRowsRendered={this.rowsRendered}
                                // 为了跳转精确  需要配置 对齐方式
                                scrollToAlignment="start"
                                onScroll={this.hanleScroll}
                            // 把引用和组件绑定
                            // ref={this.listRef}
                            />
                        )}
                    </AutoSizer>
                </div>
                {/* 房源列表结束 */}

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        loc_info: state.indexReducer.loc_info
    }
}
//为了让组件  拿到history 对象  使用这种方式包裹一下组件
// 注意事项  withRouter  是要放在最外层
export default withRouter(connect(mapStateToProps)(Index));