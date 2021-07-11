import { combineReducers, createStore } from 'redux'
import configReducer from './configReducer'
import userReducer from './userReducer'

const store = createStore(
    combineReducers({
        config: configReducer,
        user: userReducer,
    }))
export default store
