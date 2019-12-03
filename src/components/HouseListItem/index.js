import React, { Component } from 'react';

import { BASE_URL } from 'utils';

import  './index.scss';

export default class index extends Component {

    handleClick=()=> {
        // 调用父组件传来的方法
        this.props.onClick();
    }

    render() {

        let { item } = this.props;

        return (
            <div className="comp-house-list-item"  onClick={this.handleClick}>
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
}
