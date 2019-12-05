// 首页的数据
import { FETCH_CITYLIST, SET_CURRENT_CITY, CHANGE_HOME_TAB } from 'store/constants';
// 初始值
const defaultState = {
    loc_info: {
        center: { lng: 120.70586918667834, lat: 28.00109529176603 },
        code: 178,
        level: 12,
        name: "广州市"
    },
    // 热门城市
    hotList: [],
    // 后台返回的城市列表数据
    citylist: [],
    // 我们排序好的城市列表数据
    sortedclist: [],
    selectedTab: 'index'

}

export default function (state = defaultState, action) {

    switch (action.type) {

        // 获取城市列表数据
        case FETCH_CITYLIST: {
            let { hotList, list, citylist } = action;
            return {
                ...state,
                hotList,
                sortedclist: list,
                citylist
            }
        }

        // 重新设定当前城市定位
        case SET_CURRENT_CITY: {
            let { cityName, sortedclist } = action;
            let { loc_info } = state;

            return {
                ...state,
                loc_info: {
                    ...loc_info,
                    name: cityName
                },
                sortedclist: [...sortedclist]
            };

        }

        case CHANGE_HOME_TAB: {
            let { target } = action;

            return {
                ...state,
                selectedTab: target
            }
        }

        default: {
            return state;
        }
    }
}