// Dependencies
const express = require('express');
const routes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const request = require('request');
const PORT = 4000;
var valores = {

    "grant_type":"authorization_code",
    "client_id": '1928415112086289',
    "client_secret": 'QOAOPJRyiMQgtW0HjF86OYS6Ky6fYR0a',
    "redirect_uri": "http://localhost:3000/logued_in",
    "code": ""

};

// Opciones que voy a tener que usar al momento de hacer el pedido del Token por mensaje POST.
var options = {

   url:'https://api.mercadolibre.com/oauth/token',
   form: valores,
   method: "POST",
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
   }

};

//Aca importo los modelos para los jsons a guardar
let Item = require('./modelos/items.model'); //Productos
let FollSell = require('./modelos/following.model'); //Vendedores seguidos
let CatSell = require('./modelos/categorySellers.model'); //Cantidad de vendedores por categoria
let CatTend = require('./modelos/categoryTendency.model'); //Tendencias en el tiempo para categorias
let CatTime = require('./modelos/competencyCatTime.model'); //Tendencias en el tiempo para categorias de otro vendedor

//Conecto las bases
app.use(cors()); 
app.use(bodyParser.json());
app.use('/MLHuergo', routes); //route.routes('/algo').get(function()); = app.get('MLHuergo/algo', function());

mongoose.connect('mongodb://157.92.32.246:27017/MLHuergo', { useNewUrlParser: true });
const connection = mongoose.connection;
console.clear();

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

app.post('/token',function(req,rest){
    var url = req.body.url;
    request.post({url: url, json:true, options},function(req,res,body){
        token = body.access_token
        rest.send(token)
    })
})

app.get('/items/searchItems/:username', function(req, res) {

    let username = req.params.username;
    var url = 'https://api.mercadolibre.com/sites/MLA/search?nickname=' + username + '&offset=50';
    var options = {

        method: "GET",
        headers: {
      
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json' 
      
        }
      
      };
    var optionsPost = {

        method: "POST",
        body: [],
        headers: {
      
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json' 
      
        }
      
      };
    fetch(url,options)
      .then(function(response){ 

        response.json()
          .then(function(data) {
            
            var items = data;
            items.results.map(function(item){
              
              url = 'http://localhost:4000/MLHuergo/items/searchItemId/' + item.id
              fetch(url,options)
                .then(function(resp){
                    resp.json().then(function(res){

                        console.log(res);
                        if(!isEmptyObject(res)) 
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
                            url = 'http://localhost:4000/MLHuergo/items/add';
                            fetch(url, {
                                method: 'POST',
                                body: JSON.stringify(obj),
                                headers:{
                                    'Content-Type': 'application/json',
                                }
                            })
                            .then(function(res){ 
                                res.json().then(function(response){
                                console.log(response)
                                }
                            )})
                            return obj;

                        }

                    })

                .catch(function(error) {
                    console.log('Fetch Error:', error);
                  });

                });

            })

          })
          .catch(function(error) {
            console.log('Fetch Error:', error);
          });

    });

});

function isEmptyObject(obj){
    return !Object.keys(obj).length;
  }

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Funciones de los productos/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

routes.route('/items').get(function(req, res) {

    Item.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/items/add').post(function(req, res) {

    let item = new Item(req.body);
    item.save()
        .then(item => {

            res.status(200).json({'item': 'item added successfully'});
            
        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/items/searchId/:id').get(function(req, res) {

    let id = req.params.id;
    Item.findById(id, function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/items/update/:id').post(function(req, res) {

    let id = req.params.id;
    Item.updateOne({_itemId: id}, {
        $set: {"_following":req.body._following},
    }, function(err, resp){ 
        if(err) 
            console.log(err);
        else
            res.json({mensaje:"Actualizacion completada"});

    })

});

routes.route('/items/searchName/:name').get(function(req, res) {

    let name = req.params.name;
    Item.find().byName(name).exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});


routes.route('/items/searchItemId/:id').get(function(req, res) {

    let id = req.params.id;
    Item.find().byItemId(id).exec(function(err, item) {

        console.log('Algo');
        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/items/searchSeller/:seller').get(function(req, res) {

    let seller = req.params.seller;
    Item.find().bySeller(seller).exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/items/getFollowed').get(function(req, res) {

    Item.find().byFoll().exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/items/delete').post(function(req, res) {

    Item.deleteMany({_seller: "HERRAMIENTASMATIAS"}, function(err) {

        if(err) console.log(err);
        res.json({item: "Eliminado con exito"});

    });

});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////Funciones de los vendedores seguidos////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

routes.route('/FollSell').get(function(req, res) {

    FollSell.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/FollSell/add').post(function(req, res) {

    let FollSell = new FollSell(req.body);
    ofsel.save()
        .then(item => {

            res.status(200).json({'ofsel': 'item added successfully'});

        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/FollSell/searchId/:id').get(function(req, res) {

    let id = req.params.id;
    OfSel.findById(id, function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/FollSell/update/:id').post(function(req, res) {

    FollSell.findById(req.params.id, function(err, item) {

        if (!item)
            res.status(404).send("data is not found");
        else{

            item._sellerName = req.body._sellerName;
            item._sellerId = req.body._sellerId;
            item.save()
                .then(todo => {
                    res.json('Todo updated!');
                })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });

        }

    });

});

routes.route('/FollSell/searchName/:name').get(function(req, res) {

    let name = req.params.name;
    OfSel.find().byName(name).exec(function(err, item) {

        if(err)
            console.log(err)
        else{

            if(isEmptyObject(item))
                res.json({error: 'Nonexistent item.'})
            else
                res.json(item);
                
        }

    });

});

routes.route('/FollSell/delete').post(function(req, res) {

    OfSel.deleteMany({_id: "5d1506238069d42b5837cdd1"}, function(err) {

        if(err) console.log(err);
        res.json({item: "Eliminado con exito"});

    });

});

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Funciones de los vendedores X categorias/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

routes.route('/CatSell').get(function(req, res) {

    CatSell.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/CatSell/add').post(function(req, res) {

    let catSell = new CatSell(req.body);
    catSell.save()
        .then(item => {

            res.status(200).json({'ofsel': 'item added successfully'});

        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/CatSell/searchName/:name').get(function(req, res) {

    let name = req.params.name;
    CatSell.find().byName(name).exec(function(err, item) {

        if(err)
            console.log(err)
        else{

            if(isEmptyObject(item))
                res.json({error: 'Nonexistent item.'})
            else
                res.json(item);
                
        }

    });

});

routes.route('/CatSell/delete').post(function(req, res) {

    CatSell.deleteMany({_id: "5d1506238069d42b5837cdd1"}, function(err) {

        if(err) console.log(err);
        res.json({item: "Eliminado con exito"});

    });

});

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////Funciones de las tendencias X categorias/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

routes.route('/CatTend').get(function(req, res) {

    CatTend.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/CatTend/add').post(function(req, res) {

    let catTend = new CatTend(req.body);
    catTend.save()
        .then(item => {

            res.status(200).json({'ofsel': 'item added successfully'});

        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/CatTend/searchName/:name').get(function(req, res) {

    let name = req.params.name;
    CatTend.find().byName(name).exec(function(err, item) {

        if(err)
            console.log(err)
        else{

            if(isEmptyObject(item))
                res.json({error: 'Nonexistent item.'})
            else
                res.json(item);
                
        }

    });

});

routes.route('/CatTend/delete').post(function(req, res) {

    CatTend.deleteMany({_id: "5d1506238069d42b5837cdd1"}, function(err) {

        if(err) console.log(err);
        res.json({item: "Eliminado con exito"});

    });

});

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////Funciones de las vendedores X categorias/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

routes.route('/CatTime').get(function(req, res) {

    CatTime.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/CatTime/add').post(function(req, res) {

    let catTime = new CatTime(req.body);
    catTime.save()
        .then(item => {

            res.status(200).json({'ofsel': 'item added successfully'});

        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/CatTime/searchName/:name').get(function(req, res) {

    let name = req.params.name;
    CatTime.find().byName(name).exec(function(err, item) {

        if(err)
            console.log(err)
        else{

            if(isEmptyObject(item))
                res.json({error: 'Nonexistent item.'})
            else
                res.json(item);
                
        }

    });

});

routes.route('/CatTime/delete').post(function(req, res) {

    CatTime.deleteMany({_id: "5d1506238069d42b5837cdd1"}, function(err) {

        if(err) console.log(err);
        res.json({item: "Eliminado con exito"});

    });

});