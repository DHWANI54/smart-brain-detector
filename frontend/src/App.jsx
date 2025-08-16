import React, { Component } from "react";
import Navigation from "./components/logo/Navigation/Navigation";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/logo/ImageLinkForm/ImageLinkForm";
import Rank from "./components/logo/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import { getApiBaseUrl } from "./config.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  loadUser = (data) => {
    const userData = {
      id: data.id || '',
      name: data.name || '',
      email: data.email || '',
      entries: data.entries || 0,
      joined: data.joined || ''
    };
    this.setState({ user: userData, isSignedIn: true, route: 'home' });
    localStorage.setItem('user', JSON.stringify(userData));
  }

  componentDidMount() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loadUser(JSON.parse(storedUser));
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box });
  }

  onInputChange = (event) => this.setState({ input: event.target.value });

  onButtonSubmit = async () => {
  this.setState({ imageUrl: this.state.input });
  const dummyBox = { leftCol: 100, topRow: 100, rightCol: 50, bottomRow: 50 };

  try {
    const API_BASE_URL = await getApiBaseUrl();
    const response = await fetch(API_BASE_URL + '/image', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.state.user.id })
    });
    const count = await response.json();

    if (count !== undefined) {
      
      this.setState(prevState => {
        const updatedUser = { ...prevState.user, entries: count };
        return { user: updatedUser };
      });
      
      localStorage.setItem('user', JSON.stringify({ ...this.state.user, entries: count }));
    }
  } catch (err) {
    console.log('Error updating entries:', err);
  }

  this.displayFaceBox(dummyBox);
}


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false, route: 'signin', user: {} });
      localStorage.removeItem('user');
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }

  render() {
    const { isSignedIn, imageUrl, box, route, user } = this.state;

    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={user.name || ''} entries={user.entries || 0} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
