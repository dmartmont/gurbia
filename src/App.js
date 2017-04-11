import React, { Component } from 'react'
import {
  Navigator,
  Text
} from 'react-native'
import * as firebase from 'firebase'

import Login from './scenes/login/Login'
import Register from './scenes/register/Register'
import Home from './scenes/home/Home'

class App extends Component {
  constructor( props ) {
    super( props )

    this.renderScene = this.renderScene.bind(this);

    var config = {
      apiKey: "AIzaSyCVSx_RrH9Dq9ZW91d2IOe9vZgkbRD3Uc4",
      authDomain: "gurbia-79ddc.firebaseapp.com",
      databaseURL: "https://gurbia-79ddc.firebaseio.com",
      storageBucket: "gurbia-79ddc.appspot.com",
    };

    firebase.initializeApp(config);
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    switch(route.id) {
      case 'Login':
        return( <Login navigator={_navigator} />);
        break;
      case 'Register':
        return( <Register navigator={_navigator} />);
        break;
      case 'Home':
        return( <Home navigator={_navigator} />);
        break;
      default:
        return ( <Text>SOMETHING WENT WRONG ${route}</Text> );
    }
  }

  render() {
    return(
      <Navigator
        initialRoute={this.props.initialRoute}
        renderScene={this.renderScene}
      />
    )
  }
}