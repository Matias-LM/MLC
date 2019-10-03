import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

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

class Ventas extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
          empty: true,
          items: [],
    
        };

    }
      
    componentDidMount(){    

        axios.get('http://localhost:4000/MLHuergo/items/getFollowed')
            .then(res => {

                if(!isEmptyObject(res.data))
                    this.setState({ items: res.data });

            })
            .catch(function (err){
                console.log(err);
            })

    }

    itemList() {

        return this.state.items.map(function(citem, i){
            axios.get()//Conseguir la fecha de la ultima actualizacion
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

export default Ventas;