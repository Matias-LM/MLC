const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

// Settings
app.set('port', process.env.PORT || 4000);


var options = { 
   method: "POST",
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json' 
   }
};



app.get('/',function(req,res){
	res.write('<h1>Server Node</h1>');
	res.end();
});


app.post('/sasara',function(req,res){
    console.log(req.body.url);
    var url = req.body.url;

    request.post({url: url, json:true, options}, function (error, response, body) {
        var token = body;
        var murl = "https://api.mercadolibre.com/orders/search?seller="+ token.user_id +"&order.status=paid&access_token="+ token.access_token;

        request.get({url: murl}, function (error, response, body) {
            var orders = JSON.parse(body);
            res.send(orders)
        })
    });	
});

app.post('/categories',function(req,res){
    console.log(req.body.category);
    var cat = req.body.category;
    var url = 'https://api.mercadolibre.com/categories/' + cat
    request.get({url: url}, function (error, response, body) {
        var catName = JSON.parse(body);
        res.send(catName.name)
    })
});	

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});