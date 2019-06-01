// Dependencies
import React, { Component } from 'react';
//import { objectExpression } from '@babel/types';
//import { parse } from 'query-string';


//var url = 'https://api.mercadolibre.com/oauth/token?';
var url = 'https://api.mercadolibre.com/sites/MLA/search?';

var options = {

  /*form: {

    "grant_type":"authorization_code",
    "client_id": '1928415112086289',
    "client_secret": 'QOAOPJRyiMQgtW0HjF86OYS6Ky6fYR0a',
    "redirect_uri": "http://localhost:3000/logued_in",
    "code": ""

  },
  method: "POST", 
  headers: {

    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json' 

  }*/
  form: {

    "nickname": 'HERRAMIENTASMATIAS'

  },
  method: "GET",
  headers: {

    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json' 

  }

};

class LoguedIn extends Component {

  constructor(props) {
    super(props);
    this.state = {text: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){    

    
  }

  render() {

    var printing = localStorage.getItem('user')
    return (

      <div className="LoguedIn">

        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">
            Usuarios:
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Buscar
          </button>
        </form>
        <p>{printing}</p>

      </div>

    );

  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {

    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    const URLSearchParams = window.URLSearchParams;
    var burl = new URLSearchParams();
    /*burl.append("grant_type","authorization_code")
    burl.append("client_id", '1928415112086289')
    burl.append("client_secret", 'QOAOPJRyiMQgtW0HjF86OYS6Ky6fYR0a',)
    burl.append("code",parse(this.props.location.search).code);
    burl.append("redirect_uri",options.form.redirect_uri)*/

    burl.append("nickname", this.state.text)
    var aurl = url + burl
    fetch(aurl,options)
      .then(function(response){ 

        return response.json()
          .then(function(data) {
            
            var items = data;
            localStorage.setItem('user', JSON.stringify(items.results));
            /*var token = data;
            localStorage.setItem('token',JSON.stringify(token));
            console.log(token)  */  

          })
          .catch(function(error) {
          console.log('Fetch Error:', error);
          });

    });

  }

}

export default LoguedIn;