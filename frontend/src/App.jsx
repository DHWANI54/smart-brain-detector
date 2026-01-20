import React, { Component } from "react";
import * as faceapi from 'face-api.js';
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
      },
      modelLoaded: false,
      statusMessage: '' // User feedback on status
    };
  }

  componentDidMount() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loadUser(JSON.parse(storedUser));
    }
    this.loadModels();
  }

  loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log('FaceAPI Models Loaded');
      this.setState({ modelLoaded: true });
    } catch (err) {
      console.log('Error loading models:', err);
    }
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

  calculateFaceLocation = (data) => {
    const face = data.box;
    return {
      left: face.x,
      top: face.y,
      width: face.width,
      height: face.height
    };
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Resetting input to avoid confusion if they click detect later
        this.setState({
          imageUrl: e.target.result,
          box: {},
          input: '', // Clear URL input when uploading
          statusMessage: 'Analyzing image...'
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageLoaded = async () => {
    if (this.state.imageUrl && this.state.modelLoaded) {
      try {
        const image = document.getElementById('inputimage');
        // Detect face
        const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions());

        if (detection) {
          const displaySize = { width: image.width, height: image.height };
          const resizedDetections = faceapi.resizeResults(detection, displaySize);

          this.displayFaceBox(this.calculateFaceLocation(resizedDetections));
          this.setState({ statusMessage: 'Face Detected!' });
          this.updateEntries();
        } else {
          this.setState({ box: {}, statusMessage: 'No Human Face Detected' });
          this.updateEntries();
        }
      } catch (error) {
        console.log("Detection error:", error);
        this.setState({ statusMessage: 'Error detecting face' });
      }
    }
  }

  updateEntries = async () => {
    if (!this.state.user.id) return;
    try {
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(API_BASE_URL + '/image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: this.state.user.id })
      });
      const count = await response.json();

      if (count !== undefined) {
        this.setState(Object.assign(this.state.user, { entries: count }));
        localStorage.setItem('user', JSON.stringify(this.state.user));
      }
    } catch (err) {
      console.log(err);
    }
  }

  onButtonSubmit = () => {
    // Only update if there is actually a URL in the input
    if (this.state.input.trim().length > 0) {
      this.setState({
        imageUrl: this.state.input,
        box: {},
        statusMessage: 'Analyzing image...'
      });
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({
        isSignedIn: false,
        route: 'signin',
        user: {},
        imageUrl: '',
        box: {},
        statusMessage: ''
      });
      localStorage.removeItem('user');
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box, statusMessage } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              onFileUpload={this.onFileUpload}
            />
            {/* Status Message Display */}
            <div className='white f4 pa2'>{statusMessage}</div>

            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
              onImageLoaded={this.onImageLoaded}
            />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
