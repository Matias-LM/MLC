const express = require('express');
const routes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4003;

let Item = require('./modelos/ml.model');

app.use(cors()); 
app.use(bodyParser.json());
app.use('/MLserver', routes);

mongoose.connect('mongodb://127.0.0.1:27017/MLserver', { useNewUrlParser: true });
const connection = mongoose.connection;
console.clear();

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

routes.route('/').get(function(req, res) {

    Item.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/searchItems/:username').get(function(req, res) {

    var username = req.params.username;
    var url = 'https://api.mercadolibre.com/sites/MLA/search?';
    //const URLSearchParams = window.URLSearchParams;
    var burl = new URLSearchParams();
    burl.append("nickname", username);
    var aurl = url + burl;
    fetch('https://api.mercadolibre.com/sites/MLA/search?nickname=' + username /*aurl,options*/)
      .then(function(response){ 

        response.json()
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
                    axios.post('http://localhost:4000/MLitems/add', obj)
                      .then(res => console.log(res.data));
                    return obj;

                  }

                })
              
            });
            res.json({mensaje: "Funcion completada"});

          })
          .catch(function(error) {
            console.log('Fetch Error:', error);
          });

    });

});

routes.route('/update/:id').post(function(req, res) {

    let id = req.params.id;
    /*Item.find().byItemId(id).exec(function(err, item) {

        if (!item)
            res.status(404).send("data is not found");
        else{

            item._itemId = req.body._itemId;
            item._name = req.body._name;
            item._seller = req.body._seller;
            item._following = req.body._following;
            item._data = req.body._data;
            item.save(function(err,res){
                res.json('List updated!');
            })
            /*.then(todo => {
                res.json('List updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });

        }

    });*/
    Item.updateOne({_itemId: id}, {
        $set: {"_following":req.body._following},
    }, function(err, resp){ 
        if(err) 
            console.log(err);
        else
            res.json({mensaje:"Actualizacion completada"});

    })

});