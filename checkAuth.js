"use strict";

const WebSocket = require("ws"); 


const noEEGclientId = '0ZTPAZJI7zbUWvYZusWWKYAh1mHNk95oZ0mWtGj3'; 
const noEEGclientSecret = '2FKxZnyOI7YvrslJk1MJv6eqBj8a9nOz9HF9fqmRO8mlnmufXLFH6h905jvcSwWw1CL0CB9J15Fb1TlnkHaIt8L9qdMrQBJd0CHucNPK2iOzjvfe7eDczs2U12RqOIjR'; 
const url = "wss://localhost:6868";

// this is a messy hack to avoid root certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


let socket = new WebSocket(url);


// hacky way to add waiting for responses from server
let promiseResolve;
let promiseReject;

function sendMessage(id, method, params) {
   return new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;

      console.log("sending " + method + " message");
     
      let msg = JSON.stringify({"id": id, "jsonrpc":"2.0", "method": method, "params": params});
      socket.send(msg); 
   });
}

function endSession() {
   console.log("ending session");
   socket.close();
}




socket.on('open', async () => {

   await sendMessage(1, "getUserLogin", null);

   let accessInfo = {
      "clientId": noEEGclientId,
      "clientSecret": noEEGclientSecret
   };
   await sendMessage(2, "requestAccess", accessInfo);

   let authInfo = {
      "clientId": noEEGclientId,
      "clientSecret": noEEGclientSecret,
      // "debit": 10      // GW - add this to increment localQuota
   };
   let token = await sendMessage(3, "authorize", authInfo);

   let licenseInfo = {
      "cortexToken": token
   };
   await sendMessage(4, "getLicenseInfo", licenseInfo);

   endSession();
});


socket.on('message', (message) => {

   console.log("received message:");

   let data = JSON.parse(message);
   console.log(data);

   if(data.result?.cortexToken) {
      console.log("obtained token");
      promiseResolve(data.result?.cortexToken);
   }
   else {
      promiseResolve();
   }
});


socket.on('close', () => {

   console.log("closing socket");

});


socket.on('error', console.error);


