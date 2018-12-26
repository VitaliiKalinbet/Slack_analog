import * as actionTypes from './type';

export const setCurrentChannel = channel => ({
    type: actionTypes.SET_CURRENT_CHANNEL,
    data: channel,
})

export const setPrivateChannel = isPrivateChannel => ({
    type: actionTypes.SET_PRIVATE_CHANNEL,
    data: isPrivateChannel,
})