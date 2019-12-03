import { API } from 'utils';
import { FETCH_CITYLIST, SET_CURRENT_CITY , CHANGE_HOME_TAB} from 'store/constants';
//获取城市列表数据
export const fetchCityList = () => {
    return async (dispatch, getState) => {

        // API
        let hotList = await API.get(`/area/hot`);
        let citylist = await API.get(`/area/city?level=1`);

        let { loc_info } = getState().indexReducer;
        let list = [
            { '当前定位': [loc_info.name.slice(0, 2)] },
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

        dispatch({
            type: FETCH_CITYLIST,
            citylist,
            list,
            hotList
        });

    }
}


// 重新设定当前城市

export const setCurrentCity = (cityName) => {

    return (dispatch, getState) => {
        let { sortedclist } = getState().indexReducer;
        sortedclist[0]['当前定位'][0] = cityName.slice(0, 2);
        dispatch({
            type: SET_CURRENT_CITY,
            cityName: cityName,
            sortedclist
        });
    }
}

// 改变大首页tab页签
export const  changeHomeTab = (target) => {

    return (dispatch , getState) => {

        dispatch({
            type: CHANGE_HOME_TAB,
            target
        });
    }
}