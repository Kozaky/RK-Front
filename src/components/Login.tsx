import React from 'react';
import { Redirect, RouteProps } from 'react-router-dom';
import * as H from 'history';

type LoginProps = {
    location?: H.Location
}

type LoginState = {
    redirectToReferrer: boolean
}

class Login extends React.Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {

        super(props);

        this.state = { redirectToReferrer: false };

        this.login = this.login.bind(this);
    }

    login() {
        this.setState({ redirectToReferrer: true });
    }

    render() {
        const { from } = this.props.location !== undefined
            ? this.props.location.state
            : { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <div>
                <p>You must log in to view the page at {from.pathname}</p>
                <button onClick={this.login}>Log in</button>
            </div>
        )
    }


}

/* A fake authentication function */

export const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb: any) {
        this.isAuthenticated = true;
        setTimeout(cb, 1000);
    }
};


export default Login;