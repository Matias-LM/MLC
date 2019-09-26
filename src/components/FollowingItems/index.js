import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-light-accordion/demo/css/index.css';

function isEmptyObject(obj){
    return !Object.keys(obj).length;
}

const Change = props => (
    <tr>
        <td>{props.item._field}</td>
        <td>{props.item._prevValue}</td>
        <td>{props.item._nextValue}</td>
    </tr>
  )
  
function getChanges(id){

    axios.get('http://localhost:4000/MLHuergo/changes/' + id)
    .then(function(response){

        return response.data.map(function(item, i){

            console.log(item);
            return <Change item={item} key={i}/>;
    
        })

    });

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
            <tbody>{getChanges(props.item._itemId)}</tbody>

        </table>
            
    </AccordionItem>

)

class FollowingItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
          empty: true,
          items: []
    
        };
        this.handleSubmit = this.handleSubmit.bind(this);

    }
      
    componentDidMount(){    

        //this.setState({changes: JSON.parse(localStorage.getItem('changes'))});
        axios.get('http://localhost:4000/MLHuergo/items/getFollowed')
            .then(res => {

                /*res.data.map(function(citem, i){

                    var itemId = citem._itemId;
                    axios.get('http://localhost:4000/MLHuergo/changes/' + itemId)
                    .then(resp => {
                        
                        var item = resp.data;
                        aux.push([{
                            id: itemId,
                            results: item
                        }])

                    })
                    console.log('algo')
                });
                console.log('ao')
                console.log(aux);*/
                this.setState({items: res.data});

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
                <form onSubmit={this.handleSubmit}>
                <button>
                    Buscar cambios 
                </button>
                </form>
                <Accordion atomic={true}>
                    {this.itemList()}
                </Accordion>

            </div>

        );

    }

    onClick(e){
        e.preventDefault();
      }

    handleSubmit(e) {

        e.preventDefault();
        var itemId;
        var aux = [];
        this.state.items.map(function(citem, i){

            citem = JSON.stringify(citem);
            axios.post('http://localhost:4000/MLHuergo/items/getChanges', {citem})
            .then(res => {

                citem = JSON.parse(citem);
                itemId = citem._itemId;
                console.log(itemId);
                axios.get('http://localhost:4000/MLHuergo/changes/' + itemId)
                .then(res => {
                    citem = JSON.stringify(res.data);
                    aux.push({
                        id: itemId,
                        results: citem
                    })
                    setTimeout(function() {
                        //window.location.reload()
                        }.bind(this), 1000)
                })

            });

        })
        //console.log(JSON.stringify(aux));
        /*aux = aux.join(',');
        localStorage.setItem('changes', JSON.stringify(aux));
        this.setState({changes: aux});*/

    }

}

export default FollowingItems;