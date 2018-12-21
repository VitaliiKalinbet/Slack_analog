import React, { Component } from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../redux/actions/setUserAction';
import firebase from '../firebase';
import App from '../App';
import Login from '../Authorization/Login';
import Registration from '../Authorization/Register';

class Root extends Component {

    componentDidMount () {
        firebase.auth().onAuthStateChanged( user =>  {
            if (user) {
                console.log(user);
                this.props.setUser(user);
                this.props.history.push('/');
            }
        })
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='/login' component={Login}/>
                <Route path='/registration' component={Registration}/>
            </Switch>
        );
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setUser: function (user) {
            dispatch(setUser(user));
        },
    }
}

export default withRouter(connect(null, mapDispatchToProps)(Root));