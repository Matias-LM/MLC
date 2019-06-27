// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
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

/*class List extends Component{

  /*constructor(props) {
    super(props);

  }

  render(){

    return(

      <div>
        
      </div>

    );
    
  }

  
}*/
  
function startFollowing(id, item){

  item._following = true;
  axios.post('http://localhost:4000/MLitems/update/' + id, item)
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
    //this.state.products = {}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){    

    axios.get('http://localhost:4000/MLitems/searchSeller/' + localStorage.getItem('seller'))
      .then(res => {
        if(!isEmptyObject(res.data)) this.setState({ items: res.data });
      })
      .catch(function (err){
          console.log(err);
      })

  }

  itemList() {

    /*const Store = [];
    var algo = localStorage.getItem('user');*/
    /*for(var i = 0; i < this.state.items.length; i++){
      Store.push(<Item item={JSON.stringify(algo[i])} key={i} />);
    }
    return Store;*/
    return this.state.items.map(function(citem, i){
        return <Item item={citem} key={i} />;
    })

  }

  render() {

    //var algo = localStorage.getItem('user');
    //<Accordion atomic={true} title={this.state.products}/>
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
        <button onClick={() => this.handleFollow()}>
            Seguir
        </button>
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
    const URLSearchParams = window.URLSearchParams;
    var burl = new URLSearchParams();
    /*burl.append("grant_type","authorization_code")
    burl.append("client_id", '1928415112086289')
    burl.append("client_secret", 'QOAOPJRyiMQgtW0HjF86OYS6Ky6fYR0a',)
    burl.append("code",parse(this.props.location.search).code);
    burl.append("redirect_uri",options.form.redirect_uri)*/
    burl.append("nickname", username);
    var aurl = url + burl;
    fetch(aurl,options)
      .then(function(response){ 

        return response.json()
          .then(function(data) {
            
            var items = data;
            items.results.map(function(item){
              
              axios.get('http://localhost:4000/MLitems/searchItemId/' + item.id)
                .then(res => {
                  if(!isEmptyObject(res.data)) 
                    return;
                  else{

                    var obj = {

                      "_itemId": item.id,
                      "_name": item.title,
                      "_seller": username,
                      "_following": false,
                      "_data": {
      
                        "price": item.price,
                        "currency": item.currency_id,
                        "availableQuantity": item.available_quantity,
                        "soldQuantity": item.sold_quantity
      
                      }
      
                    };
                    //window.location.reload();
                    axios.post('http://localhost:4000/MLitems/add', obj)
                      .then(res => console.log(res.data));
                    return obj;

                  }

                })
              
            })
            //var timestamp = (new Date()).getTime();
            /*items.results.forEach(element => {
              
              
              this.setState({products: element});
              

            });*/
            /*var titles = items.results.map(
              function iterator(result){
                return result.title
              },
              this
            )*/
            //localStorage.setItem('user', JSON.stringify(items.results));
            //window.location.reload();
            /*var token = data;
            localStorage.setItem('token',JSON.stringify(token));
            console.log(token)  */  

          })
          .catch(function(error) {
            console.log('Fetch Error:', error);
          });

    });

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