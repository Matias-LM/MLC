const express = require('express');
const routes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4001;

let OfSel = require('./oficialSellers.model');

function isEmptyObject(obj){
    return !Object.keys(obj).length;
}

app.use(cors()); 
app.use(bodyParser.json());
app.use('/MLofsel', routes);

mongoose.connect('mongodb://127.0.0.1:27017/MLofsel', { useNewUrlParser: true });
const connection = mongoose.connection;
console.clear();

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

routes.route('/').get(function(req, res) {

    OfSel.find(function(err, item) {

        if (err){ 

            console.log(err);
            return 0;

        }else
            res.json(item);

    });

});

routes.route('/add').post(function(req, res) {

    let ofsel = new OfSel(req.body);
    ofsel.save()
        .then(item => {

            res.status(200).json({'ofsel': 'item added successfully'});

        })
        .catch(err => {

            res.status(400).send('adding new item failed');

        });

});

routes.route('/searchId/:id').get(function(req, res) {

    let id = req.params.id;
    OfSel.findById(id, function(err, item) {

        if(err)
            console.log(err)
        else
            res.json(item);

    });

});

routes.route('/update/:id').post(function(req, res) {

    OfSel.findById(req.params.id, function(err, item) {

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

routes.route('/searchName/:name').get(function(req, res) {

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