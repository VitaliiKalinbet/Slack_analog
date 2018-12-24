import * as actionType from './type';

export const setCurrentChannel = channel => ({
    type: actionType.SET_CURRENT_CHANNEL,
    data: channel,
})