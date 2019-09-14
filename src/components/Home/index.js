// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg'
import axios from 'axios';
class Home extends Component {

  render() {

    return (

        <header className="App-header">

          <img src={logo} alt="logo" />
          <p>

            Click<a
            className="App-link"
            href="https://auth.mercadolibre.com/authorization?client_id=1928415112086289&response_type=code&state=5ca75bd30"
            >
              here 
            </a> 
            to get the token.

          </p>

        </header>

    );
    
  }

}
/**/
export default Home;