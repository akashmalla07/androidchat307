/**
 * Created by sreejeshpillai on 09/05/15.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
var coordinates = {};
var groupchat = [];

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

io.on('connection',function(socket){
    console.log('one user connected '+socket.id);

    socket.on('add-user', function(data){
    console.log("data",data);
    clients[data] = {
      "socket": socket.id
    };
    console.log("socketid = "+ data+"=="+socket.id+"=="+clients[data].socket);
    });


    socket.on('LatLng', function(data){
    console.log("LatLng",data);
    coordinates[data.sender] = {
      "currentLatitude": data.currentLatitude,
       "currentLongitude": data.currentLongitude
    };
    console.log("coordinate = "+data.sender+"=="+ data.currentLatitude+"=="+data.currentLongitude);
    //socket.broadcast.to(clients[data.sender].socket).emit('message', coordinates[data.receiver]);
    });


    socket.on('LatLng3', function(data){
    console.log("LatLng",data);
  /*  groupchat[data.sender] = {
      "currentLatitude": data.currentLatitude,
       "currentLongitude": data.currentLongitude
    };*/

    groupchat.push({"currentLatitude": data.currentLatitude, "currentLongitude":data.currentLongitude});
    console.log("coordinate = "+data.sender+"=="+ data.currentLatitude+"=="+data.currentLongitude);

    console.log("coordinate = "+groupchat);
    console.log( JSON.stringify(groupchat, null, "    ") );
    //socket.broadcast.to(clients[data.sender].socket).emit('message', coordinates[data.receiver]);
    });

    socket.on('privatemessage', function(data){
        console.log(data);
    console.log("Sending: " + data.message+ " to " + clients[data.receiver].socket +" from "+ data.sender);
    if (clients[data.receiver].socket){
  //    io.sockets.connected[clients[data.receiver].socket].emit("message", data.message);
   // io.sockets.socket(clients[data.receiver].socket).emit('message',data.message);
    socket.broadcast.to(clients[data.receiver].socket).emit('message',data);
    } else {
      console.log("User does not exist: " + data.username); 
    }
    });
 
   socket.on('LatLng2',function(data){
     console.log(data.receiver);
     console.log(data.sender);
     console.log(coordinates[data.receiver]);
   socket.broadcast.to(clients[data.sender].socket).emit('message',coordinates[data.receiver]);
    //socket.broadcast.emit('message', data);
    })

  socket.on('LatLng4',function(data){
     console.log(data.receiver);
    // console.log(data.sender);
     //console.log(coordinates[data.receiver]);
   socket.broadcast.to(clients[data.receiver].socket).emit('message',groupchat);
    //socket.broadcast.emit('message', data);
    })
    socket.on('message',function(data){
    var sockets = io.sockets.sockets;

       /* sockets.foreach(function(sock){
            if(sock.id != socket.id)
            {
                sock.emit('message',data);
            }
        })*/
    console.log(data);
    socket.broadcast.emit('message', data);
    })
/*    socket.on('disconnect',function(){
        console.log('one user disconnected '+socket.id);
    })
*/
 socket.on('disconnect', function() {
    console.log('one user disconnected '+socket.id);
    for(var name in clients) {
        if(clients[name].socket === socket.id) {
            delete clients[name];
            break;
        }
    }   
  })


})



http.listen(8000,function(){
    console.log('server listening on port 8000');
})
