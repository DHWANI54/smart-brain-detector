import React from 'react';
import { getApiBaseUrl } from '../../config.js';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      error: ''
    };
  }

  onEmailChange = (event) => this.setState({ signInEmail: event.target.value });
  onPasswordChange = (event) => this.setState({ signInPassword: event.target.value });

  onSubmitSignIn = async (event) => {
    event.preventDefault();
    const { signInEmail, signInPassword } = this.state;
    const API_BASE_URL = await getApiBaseUrl();

    if (!signInEmail || !signInPassword) {
      this.setState({ error: 'Email and password are required!' });
      return;
    }

    try {
      const response = await fetch(API_BASE_URL + '/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword })
      });
      const user = await response.json();

      if (response.status === 200 && user.id) {
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      } else {
        this.setState({ error: 'Invalid email or password' });
      }
    } catch (err) {
      this.setState({ error: 'Signin failed. Try again.' });
    }
  }

  render() {
    const { onRouteChange } = this.props;
    const { error } = this.state;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <form className="measure" onSubmit={this.onSubmitSignIn}>
            <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label htmlFor="email-address" className="db fw6 lh-copy f6">Email</label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  onChange={this.onEmailChange}
                  required
                />
              </div>
              <div className="mv3">
                <label htmlFor="password" className="db fw6 lh-copy f6">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  onChange={this.onPasswordChange}
                  required
                />
              </div>
            </fieldset>
            {error && <div className="red f6 mv2">{error}</div>}
            <div>
              <input
                type="submit"
                value="Sign in"
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange('register')}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </form>
        </main>
      </article>
    );
  }
}

export default Signin;
