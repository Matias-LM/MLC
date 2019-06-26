const express = require('express');
const routes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

let Item = require('./items.model');

app.use(cors());
app.use(bodyParser.json());
app.use('/MLserver', routes);

mongoose.connect('mongodb://127.0.0.1:27017/MLserver', { useNewUrlParser: true });
const connection = mongoose.connection;

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

routes.route('/:id').get(function(req, res) {

    let id = req.params.id;
    Item.findById(id, function(err, item) {

        if(err)
            console.log(err)
        else
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

routes.route('/update/:id').post(function(req, res) {

    Item.findById(req.params.id, function(err, item) {

        if (!item)
            res.status(404).send("data is not found");
        else{

            item.name = req.body.name;
            item.seller = req.body.seller;
            item.data = req.body.data;
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