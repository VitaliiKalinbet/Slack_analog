import * as actionTypes from './type';

export const setColors = (primary, secondary) => ({
    type: actionTypes.SET_COLORS,
    primary,
    secondary,
})