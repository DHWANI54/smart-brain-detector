import React, { Component } from "react";
import Navigation from "./components/logo/Navigation/Navigation";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/logo/ImageLinkForm/ImageLinkForm";
import Rank from "./components/logo/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

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
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      },
      isSignedIn: true,
      route: 'home'
    });
    localStorage.setItem('user', JSON.stringify(data)); // ✅ persist login
  }

  componentDidMount() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.loadUser(userData);
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    const dummyBox = { leftCol: 100, topRow: 100, rightCol: 50, bottomRow: 50 };

    fetch('http://localhost:3000/image', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.state.user.id })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count }));
      localStorage.setItem('user', JSON.stringify(this.state.user));
    });

    this.displayFaceBox(dummyBox);
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false, route: 'signin', user: {} });
      localStorage.removeItem('user'); // ✅ clear login
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, box, route, user } = this.state;

    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home' ? (
            <div>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
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
          )
        }
      </div>
    );
  }
}

export default App;
