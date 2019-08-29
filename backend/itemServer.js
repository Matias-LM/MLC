const express = require('express');
const routes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

let Item = require('./modelos/items.model');

app.use(cors()); 
app.use(bodyParser.json());
app.use('/MLitems', routes);

mongoose.connect('mongodb://127.0.0.1:27017/MLitems', { useNewUrlParser: true });
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

routes.route('/add').post(function(req, res) {

    let item = new Item(req.body);
    item.save()
        .then(item => {

            res.status(200).json({'item': 'item added successfully'});

        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/searchId/:id').get(function(req, res) {

    let id = req.params.id;
    Item.findById(id, function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

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

routes.route('/searchName/:name').get(function(req, res) {

    let name = req.params.name;
    Item.find().byName(name).exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/searchItemId/:id').get(function(req, res) {

    let id = req.params.id;
    Item.find().byItemId(id).exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/searchSeller/:seller').get(function(req, res) {

    let seller = req.params.seller;
    Item.find().bySeller(seller).exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/getFollowed').get(function(req, res) {

    Item.find().byFoll().exec(function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/delete').post(function(req, res) {

    Item.deleteMany({_seller: "HERRAMIENTASMATIAS"}, function(err) {

        if(err) console.log(err);
        res.json({item: "Eliminado con exito"});

    });

});