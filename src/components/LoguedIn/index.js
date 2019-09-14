// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-light-accordion/demo/css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
//import { objectExpression } from '@babel/types';
import { parse } from 'query-string';


//var url = 'https://api.mercadolibre.com/oauth/token?';
var url = 'https://api.mercadolibre.com/sites/MLA/search?';

/*var options = {

  form: {

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

  }
  method: "GET",
  headers: {

    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json' 

  }

};*/
  
function startFollowing(id, item){

  item._following = true;
  axios.post('http://localhost:4000/MLHuergo/items/update/' + id, item)
    .then(function(data){
      //this.props.history.push('/FollowingItems');
  });

}

function isEmptyObject(obj){
  return !Object.keys(obj).length;
}

const Item = props => (
  <tr>
      <td>{props.item._itemId}</td>
      <td>{props.item._name}</td>
      <td> 
        <Link>
          <span onClick={() => startFollowing(props.item._itemId, props.item)}>Seguir</span>
        </Link>
      </td>
  </tr>
)


class LoguedIn extends Component {

  constructor(props) {
    super(props);
    this.state = {

      text: '',
      items: [],

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){

    const URLSearchParams = window.URLSearchParams;
    var burl = new URLSearchParams();

    burl.append("grant_type","authorization_code")
    burl.append("client_id", '1928415112086289')
    burl.append("client_secret", 'QOAOPJRyiMQgtW0HjF86OYS6Ky6fYR0a',)
    burl.append("code",parse(this.props.location.search).code);
    burl.append("redirect_uri","http://localhost:3000/logued_in")

    var aurl = url + burl

    fetch('http://localhost:4000/token', {
      method: 'POST',
      body: JSON.stringify({
        "url": aurl
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    })
    .then(function(response){ 
      return response.text()
        .then(function(data) {
          localStorage.setItem('token', data);
          console.log(data)
        })
    });

  }

  componentDidMount(){    

    axios.get('http://localhost:4000/MLHuergo/items/searchSeller/' + localStorage.getItem('seller'))
      .then(res => {
        if(!isEmptyObject(res.data)) this.setState({ items: res.data });
      })
      .catch(function (err){
          console.log(err);
      })

  }

  itemList() {

    return this.state.items.map(function(citem, i){
        return <Item item={citem} key={i} />;
    })

  }

  render() {

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
        <table className="table table-striped" style={{ marginTop: 20 }}>

          <thead>

            <tr>

              <th>Id</th>
              <th>Nombre</th>
              <th>Accion</th>

            </tr>

          </thead>  
          <tbody>
            {this.itemList()}
          </tbody>

        </table>

      </div>
      
    );

  }

  onClick(e){
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {

    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    var username = this.state.text;
    localStorage.setItem('seller', username)
    axios.get('http://localhost:4000/MLHuergo/items/searchItems/' + username)
      .then();

  }

  handleFollow(){

    if (!this.state.text.length) {
      return;
    }
    axios.post('http://localhost:4002/MLfollowing/add', {_name: this.state.text})
      .then(function(res){window.location.reload();});

  }

}

export default LoguedIn;