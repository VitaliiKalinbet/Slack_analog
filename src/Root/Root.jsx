import React, { Component } from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import firebase from '../firebase';
import App from '../App';
import Login from '../Authorization/Login';
import Registration from '../Authorization/Register';

class Root extends Component {

    componentDidMount () {
        firebase.auth().onAuthStateChanged( user =>  {
            if (user) {
                console.log(user);
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

export default withRouter(Root);