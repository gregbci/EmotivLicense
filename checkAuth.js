"use strict";

const WebSocket = require("ws"); 


const noEEGclientId = '0ZTPAZJI7zbUWvYZusWWKYAh1mHNk95oZ0mWtGj3'; 
const noEEGclientSecret = '2FKxZnyOI7YvrslJk1MJv6eqBj8a9nOz9HF9fqmRO8mlnmufXLFH6h905jvcSwWw1CL0CB9J15Fb1TlnkHaIt8L9qdMrQBJd0CHucNPK2iOzjvfe7eDczs2U12RqOIjR'; 
const url = "wss://localhost:6868";

// this is a messy hack to avoid root certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


let socket = new WebSocket(url);

function sendMessage(id, method, params) {
   let msg = JSON.stringify({"id": id, "jsonrpc":"2.0", "method": method, "params": params});
   socket.send(msg); 
}


socket.on('open', async () => {

   console.log("sending request");

   sendMessage(1, "getUserLogin", null);

   let clientInfo = {
      "clientId": noEEGclientId,
      "clientSecret": noEEGclientSecret
   };
   sendMessage(2, "requestAccess", clientInfo);

});


socket.on('message', (message) => {

   console.log("received message:");

   let data = JSON.parse(message);
   console.log(data);

});

socket.on('close', () => {

   console.log("closing socket");

});

socket.on('error', console.error);


