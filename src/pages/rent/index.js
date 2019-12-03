import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import SearchInput from 'components/searchInput';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './index.scss';

class Index extends React.PureComponent {


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
                找房
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