import React, { Component } from "react";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ParticlesBg from 'particles-bg';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
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

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = (data) => {
    if (
      !data ||
      !data.outputs ||
      !data.outputs[0] ||
      !data.outputs[0].data ||
      !data.outputs[0].data.regions
    ) {
      return [];
    }

    const regions = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image?.width || 0);
    const height = Number(image?.height || 0);

    return regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    fetch('https://samusbackend.onrender.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: this.state.input })
    })
      .then(response => response.json())
      .then(response => {
        if (response?.outputs?.length) {
          fetch('https://samusbackend.onrender.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.state.user.id })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);

          this.displayFaceBox(this.calculateFaceLocation(response));
        } else {
          console.warn("No face data returned:", response);
          this.displayFaceBox([]);
        }
      })
      .catch(err => {
        console.error("API call failed:", err);
        this.displayFaceBox([]);
      });
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ ...initialState });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;

    const config = {
      num: [4, 7],
      rps: 0.7,
      radius: [5, 40],
      life: [1.2, 3],
      v: [2, 3],
      tha: [-40, 40],
      rotate: [5, 20],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "all",
      color: ["random", "#ff0000"],
      cross: "dead",
      random: 15,
      g: 20,
      onParticleUpdate: (ctx, particle) => {
        ctx.beginPath();
        ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
      }
    };

    return (
      <div className="App">
        <ParticlesBg color="#A8E1E1" type="cobweb" config={config} bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : (
          route === 'signin' ? (
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          ) : (
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        )}
      </div>
    );
  }
}

export default App;