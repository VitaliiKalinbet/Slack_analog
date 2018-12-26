import * as actionTypes from '../actions/type';

const channel = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {...action.data,
                    isPrivateChannel: false,
                }
        case actionTypes.SET_PRIVATE_CHANNEL: 
            return {...state,
                    isPrivateChannel: action.data,
            }
        default:
            return state;
    }
}

export default channel;