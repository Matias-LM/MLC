import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-light-accordion/demo/css/index.css';

function isEmptyObject(obj){
    return !Object.keys(obj).length;
}

function paid(speedwagon){
    if (speedwagon = "paid"){
        return "Finalizado"
    } else{
        return "Por finalizar"
    }

}

function shipping(ship){
    if (ship == null) {
        return "-"
    } else{
        return ship.address_line + ", " + ship.city.name
    } 

}

const Item = props => (

    <AccordionItem title={"Comprador: " + props.item.buyer.nickname + " Producto: " + props.item.order_items["0"].item.title}>

        <table className="table table-striped" style={{ marginTop: 20 }}>

            <thead>

                <tr>

                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Dirección</th>
                    <th>Valor total</th>
                    
                </tr>

            </thead>  
            <tbody>
                <tr>
                    <td>{props.item.date_closed.substr(0,10)}</td>
                    <td>{paid(props.item.status)}</td>
                    <td>{shipping(props.item.shipping.receiver_address)}</td>
                    <td>{"$" + props.item.payments["0"].total_paid_amount}</td>
                </tr>
            </tbody>

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

        axios.get('http://localhost:4000/ventasEnOrden')
            .then(res => {

                if(!isEmptyObject(res))
                    console.log(res.data.results)
                    this.setState({ items: res.data.results });

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