import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-light-accordion/demo/css/index.css';
import 'react-day-picker/lib/style.css';

function isEmptyObject(obj){
    return !Object.keys(obj).length;
}

function paid(speedwagon){ //Reemplaza el "paid" por "finalizado" porque esto es argentina
    if (speedwagon == "paid"){
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

    //<AccordionItem title={"Comprador: " + props.item.buyer.nickname + " Producto: " + props.item.order_items["0"].item.title}>
    <AccordionItem title={props.item.order_items["0"].item.title + ", Fecha: " + props.item.date_closed.substr(0,10)}>
        <table className="table table-striped" style={{ marginTop: 20 }}>

            <thead>

                <tr>
                    <th>Comprador</th>

                    <th>Estado</th>
                    <th>Dirección</th>
                    <th>Valor total</th>
                    
                </tr>

            </thead>  
            <tbody>
                <tr>
                    <td>{props.item.buyer.nickname}</td>

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
          desde: null,
          hasta: null
    
        };
        this.pedirDatosABackend = this.pedirDatosABackend.bind(this);
        this.handleDayChangeDesde = this.handleDayChangeDesde.bind(this)
        this.handleDayChangeHasta = this.handleDayChangeHasta.bind(this)

    }
    
    pedirDatosABackend() {
        console.log(this.state.desde==null)
        console.log(this.state.desde===null)
        //if (this.state.desde!=null && this.state.hasta!=null) {
            console.log(this.state)
            console.log('va a hacer el get')
            axios.get('http://localhost:4000/ventasEnOrden',{
                params: {
                  desde: this.state.desde,
                  hasta: this.state.hasta
                }})
            .then(res => {

                if(!isEmptyObject(res)) {
                    console.log(res.data.results)
                    this.setState({ items: res.data.results });
                }
            })
            .catch(function (err){
                console.log(err);
            });
        //}
        }
    
    componentDidMount() {    

        this.pedirDatosABackend()

    }

    itemList() {

        return this.state.items.map(function(citem, i){
            return <Item item={citem} key={i} />;
        })
    
    }
    
    handleDayChangeDesde(selectedDay) {
       console.log('handle day desde')
       this.setState({ desde: selectedDay }, () => this.pedirDatosABackend())
    }

    
    handleDayChangeHasta(selectedDay) {
        console.log('entro a hasta')
        this.setState({ hasta: selectedDay }, () => this.pedirDatosABackend())
        //this.pedirDatosABackend()
    }

    render() {
        var fecha = new Date();
        //var fechaprime = //2015-07-01
        var ytoday = fecha.getFullYear();
        var mtoday = fecha.getMonth()+1;
        var dtoday = fecha.getDate();
        var hoy = ytoday + "-" + mtoday + "-" + dtoday

        return(
            <div>
                    
        <DayPickerInput onDayChange={this.handleDayChangeDesde} format='yyyy-mm-dd'placeholder='2015-01-01'
        />
        <DayPickerInput onDayChange={this.handleDayChangeHasta} format='yyyy-mm-dd' placeholder={hoy}
        />

                <div className="FollowingItems">
                    
                    <Accordion atomic={true}>
                        {this.itemList()}
                    </Accordion>

                </div>
            </div>

        );

    }

}

export default Ventas;
