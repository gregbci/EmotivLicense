"use strict";

const WebSocket = require("ws"); 


// 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const url = "wss://localhost:6868";

let socket = new WebSocket(url);

function sendMessage(id, method, params) {
   let msg = JSON.stringify({"id": id, "jsonrpc":"2.0", "method": method, "params": params});
   socket.send(msg); 
}


socket.on('open', async () => {

   console.log("sending request");
   sendMessage(1, "getUserLogin", null);

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


