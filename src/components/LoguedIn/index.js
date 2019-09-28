// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-light-accordion/demo/css/index.css';
import "bootstrap";
import { Card, CardImg, Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { parse } from 'query-string';
//import "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js";
//import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";
//import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";


var url = 'https://api.mercadolibre.com/oauth/token?';

function startFollowing(item, token) {

  console.log(item);
  item = JSON.stringify(item);
  axios.post('http://localhost:4000/items/startFollowing', { item, token })
    .then(function (data) {
      //this.props.history.push('/FollowingItems');
    });

}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

const Item = props => (
  <tr>
    <td>{props.item._itemId}</td>
    <td>{props.item._name}</td>
    <td>
      <Link>
        <span onClick={() => startFollowing(props.item, localStorage.getItem('token'))}>Seguir</span>
      </Link>
    </td>
  </tr>
)


class LoguedIn extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {

      render: true,
      text: '',
      items: [],
      popoverOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }
  componentWillMount() {

    var ask = localStorage.getItem('ask')
    console.log(ask);
    if (!ask) {

      const URLSearchParams = window.URLSearchParams;
      var burl = new URLSearchParams();

      burl.append("grant_type", "authorization_code")
      burl.append("client_id", '1928415112086289')
      burl.append("client_secret", 'QOAOPJRyiMQgtW0HjF86OYS6Ky6fYR0a')
      burl.append("code", parse(this.props.location.search).code);
      burl.append("redirect_uri", "http://localhost:3000/logued_in")

      var aurl = url + burl

      fetch('http://localhost:4000/token', {

        method: 'POST',
        body: JSON.stringify({
          "url": aurl
        }),
        headers: {
          'Content-Type': 'application/json',
        }

      }).then(function (response) {

        return response.text()
          .then(function (data) {
            console.log(data);
            localStorage.setItem('token', data);
            localStorage.setItem('ask', true)
          })

      });

    }

  }

  componentDidMount() {

    axios.get('http://localhost:4000/MLHuergo/items/searchSeller/' + localStorage.getItem('seller'))
      .then(res => {
        if (!isEmptyObject(res.data)) this.setState({ items: res.data });
      })
      .catch(function (err) {
        console.log(err);
      })

  }

  itemList() {

    return this.state.items.map(function (citem, i) {
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
          <Button id="Popover1" type="button">
          ¿?
        </Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
          <PopoverHeader>¿Cómo buscar tiendas oficiales?</PopoverHeader>
          <Card>
              <CardImg top width="100%" src ="https://i.imgur.com/H3pRjHy.gif" alt="Carrrrs" />
        </Card>
          <PopoverBody><div class="media-body"><p></p><p>1. En la página del producto, diríjase hasta encontrar la información de la tienda. Cliquee en "Ver más datos de (Nombre de la tienda)". </p> <p> 2. Introduzca el nombre de la tienda que figura en la URL de la página (remarcado en celeste) dentro del cuadro de búsqueda.</p> </div></PopoverBody>
        </Popover>
          
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

  onClick(e) {
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
    axios.get('http://localhost:4000/items/searchItems/' + username)
      .then(setTimeout(function () {
        window.location.reload()
      }.bind(this), 1000));

  }

  handleFollow() {

    if (!this.state.text.length) {
      return;
    }
    axios.post('http://localhost:4000/MLfollowing/add', { _name: this.state.text })
      .then(function () { window.location.reload(); });

  }

}

export default LoguedIn;