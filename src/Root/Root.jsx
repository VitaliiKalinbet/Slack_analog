import React, { Component } from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser, signOutUser } from '../redux/actions/setUserAction';
import firebase from '../firebase';
import App from '../App';
import Login from '../Authorization/Login';
import Registration from '../Authorization/Register';
import Spinner from '../Spinner/Spinner';

class Root extends Component {

    componentDidMount () {
        firebase.auth().onAuthStateChanged( user =>  {
            if (user) {
                console.log(user);
                this.props.setUser(user);
                this.props.history.push('/');
            } else {
                
                this.props.history.push('/login');
                this.props.signOutUser();
            }
        })
    }

    render() {
        return this.props.isLoading ?
        <Spinner/> :
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='/login' component={Login}/>
                <Route path='/registration' component={Registration}/>
            </Switch>;
    }
}

function mapStateToProps (state) {
    return {
        isLoading: state.user.isLoading,
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setUser: function (user) {
            dispatch(setUser(user));
        },
        signOutUser: function () {
            dispatch(signOutUser());
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));