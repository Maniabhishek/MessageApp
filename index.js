//dependencies
const http  = require('http');
const https  = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder
const dotenv = require('dotenv');
const config = require('./config');
const lib = require('./lib/data');


dotenv.config();

lib.create('test','file',{name:'john'},(err)=>{
    console.log(err)
})

//the server should respond to all requests with a string 
const httpServer = http.createServer(function(req,res){

    unifiedServer(req,res);

})

const httpsOption = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
}

const httpsServer = https.createServer(httpsOption,function(req,res){

    unifiedServer(req,res);

})

const unifiedServer = (req,res) => {
    //get the url and parse it
    let parseURL = url.parse(req.url,true);

    //get the path 
    let path = parseURL.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //find the method of the req
    let method = req.method.toLowerCase();

    //get the query string object
    let queryStringObj = parseURL.query

    //get the headers 
    let headerObj = req.headers

    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data',function(data){
        buffer += decoder.write(data)
    });

    req.on('end',function(){

        buffer += decoder.end()

        //choose handler 
        let chosenHandler = typeof(routes[trimmedPath])!== 'undefined' ? routes[trimmedPath] : handler.notFound;   

        //constructing the data object to send to the handler 
        let data = {
            'trimmedPath':trimmedPath,
            'queryStringObj':queryStringObj,
            'headerObj':headerObj,
            'method':method,
            'payload':buffer
        }

        chosenHandler(data,function(statusCode,payload){
            //define status code
            statusCode = typeof(statusCode) === 'number' ? statusCode:200;

            //use the payload called back by the handler , or default 
            payload = typeof(payload)=== 'object' ? payload:{}
            
            let payloadStringify = JSON.stringify(payload)
            res.setHeader('content-type','application/json')
            res.writeHead(statusCode)
            res.end(payloadStringify);

        })  

        

        //log the request path 
        console.log("the parsed path is here",trimmedPath)
        console.log("the method is ",method+" with parsed query as ",queryStringObj)
        console.log(headerObj)
        console.log(buffer)
    })
}

// defining the handler
const handler = {}

handler.hello = function(data, callback){
    // callback a http status code and a payload object 
    callback(406,{'message':'Hello world'});
}

handler.notFound = function(data,callback){
    callback(404,{})
}

let routes = {
    'hello':handler.hello,
    'bye':handler.bye
}


httpServer.listen(config.port,()=>console.log("server listening on port ",config.port,config.envName))
httpsServer.listen(config.httpsport,()=>console.log("server listening on port ",config.httpsport,config.envName))
