import * as actionTypes from '../actions/type';

const initialColorState = {
    primaryColor: '#4c3c4c',
    secondColor: '#eee',
}

const color = (state = initialColorState, action) => {
    switch (action.type) {
        case actionTypes.SET_COLORS: 
            return {
                primaryColor: action.primary,
                secondaryColor: action.secondary
            }
        default: 
            return state;
    }
}

export default color;