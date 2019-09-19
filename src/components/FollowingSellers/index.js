import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
import Card from 'react-bootstrap/Card'
import "bootstrap/dist/css/bootstrap.min.css";

import 'react-light-accordion/demo/css/index.css';
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

function isEmptyObject(obj){
    return !Object.keys(obj).length;
}

const Head = props => (

    <AccordionItem title={props.item._name}>

        <Accordion atomic={true}>
            {props.content}
        </Accordion>
            
    </AccordionItem>

)

const Item = props => (

    <AccordionItem title={props.item._name}>

        <table className="table table-striped" style={{ marginTop: 20 }}>

            <thead>

                <tr>

                    <th>Campo</th>
                    <th>Valor Anterior</th>
                    <th>Valor Actual</th>

                </tr>

            </thead>  
            <tbody> </tbody>

        </table>
            
    </AccordionItem>

)

class FollowingSellers extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
          empty: true,
          items: [],
    
        };

    }
      
    /*componentDidMount(){    

        axios.get('http://localhost:4002/MLfollowing')
            .then(res => {

                if(!isEmptyObject(res.data)){ 

                    this.setState({ items: res.data._name });
                    this.setState({ empty: false });

                }else
                    this.setState({ empty: true });

            })
            .catch(function (err){
                console.log(err);
            })

    }*/

    itemList() {

        return this.state.items.map(function(citem, i){

            const URLSearchParams = window.URLSearchParams;
            var burl = new URLSearchParams();
            burl.append("nickname", citem);
            var aurl = url + burl;
            fetch(aurl,options)
                .then(function(response){ 
                    return response.json()
                        .then(function(data) {
                            return <Head item={citem} content={
                                data.results.map(function(result){
                                    return <Item item={result} key={i} />
                                })
                            } key={i} />
                        });
                });

        })
    
    }

    render(){
        
        return(

            <div className="FollowingSellers">
                
                <Accordion atomic={true}>
                    {this.itemList()}
                </Accordion>

            </div>

        );

    }

}

export default FollowingSellers;