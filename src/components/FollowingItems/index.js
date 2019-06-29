import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
//import Accordion from 'react-bootstrap/Accordion'
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-light-accordion/demo/css/index.css';

function isEmptyObject(obj){
    return !Object.keys(obj).length;
}

const Item = props => (

    <AccordionItem title={"Nombre: " + props.item._name + " Vendedor: " + props.item._seller}>

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

class FollowingItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
          empty: true,
          items: [],
    
        };

    }
      
    componentDidMount(){    

        axios.get('http://localhost:4000/MLitems/getFollowed')
            .then(res => {

                if(!isEmptyObject(res.data)){ 

                    this.setState({ items: res.data });
                    this.setState({ empty: false });

                }else
                    this.setState({ empty: true });

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

    render(){
        
        return(

            <div className="FollowingItems">
                
                <Accordion atomic={true}>
                    {this.itemList()}
                </Accordion>

            </div>

        );

    }

}

export default FollowingItems;