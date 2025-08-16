import React from 'react';
import { getApiBaseUrl } from '../../config.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      error: ''
    };
  }

  onNameChange = (event) => this.setState({ name: event.target.value });
  onEmailChange = (event) => this.setState({ email: event.target.value });
  onPasswordChange = (event) => this.setState({ password: event.target.value });

  onSubmitRegister = async (event) => {
    event.preventDefault();

    const { name, email, password } = this.state;

    if (!name || !email || !password) {
      this.setState({ error: 'All fields are required!' });
      return;
    }

    try {
      const API_BASE_URL = await getApiBaseUrl();
      console.log('Submitting register:', { name, email, password });

      const response = await fetch(API_BASE_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.status === 200 && data.id) {
        this.props.loadUser(data);
        this.props.onRouteChange('home');
      } else {
        this.setState({ error: data || 'Registration failed' });
      }
    } catch (err) {
      console.error('Register request error:', err);
      this.setState({ error: 'Unable to register. Check server.' });
    }
  }

  render() {
    const { error } = this.state;

    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <form className="measure" onSubmit={this.onSubmitRegister}>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label htmlFor="name" className="db fw6 lh-copy f6">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  onChange={this.onNameChange}
                  required
                />
              </div>
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
            {error && <div className="red mv2">{error}</div>}
            <div>
              <input
                type="submit"
                value="Register"
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              />
            </div>
          </form>
        </main>
      </article>
    );
  }
}

export default Register;
