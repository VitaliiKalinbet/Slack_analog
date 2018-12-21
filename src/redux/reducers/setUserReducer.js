import * as actionTypes from '../actions/type';

const initialUserState = {
    currentUser: null,
    isLoading: true,
}

const user = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.data.currentUser,
                isLoading: false,
            }
        default: 
            return state;
    }
}

export default user;