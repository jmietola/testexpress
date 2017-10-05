var storage = require('node-persist');
var helpers = require('../utils/helpers.js');

module.exports = function (io) {

  storage.initSync({ttl: 10000});

  io.on('connection', (socket) => {

  io.set('transports', ['websocket']);
  console.log("user connected");

  socket.on('say to', function(data){
    console.log("say to", data.id, data.msg);
    socket.broadcast.to(data.id).emit('chat message', data.msg);
  });

  socket.on('add user', function(data){
    console.log("add user", data.id, data.msg, data.latitude, data.longitude);

    var currentLocation = { lat: data.latitude, lng: data.longitude };

    var obj = storage.getItemSync('locationKey');

    if (typeof obj === 'undefined' || obj.locations.length < 0) {
      var obj = {
      locations: [{ lat: data.latitude, lng: data.longitude }]
      };
    }

    if(obj.locations.length > 0){
      obj.locations.push(currentLocation);
      storage.setItemSync('locationKey', obj);
    }

      let value = storage.getItemSync('locationKey');
      var locationArray = value.locations;

      console.log("LOCATION ARAYS", locationArray);

      for (let values of locationArray) {
        if(currentLocation.lat !== values.lat){
          var n = helpers.arePointsNear(currentLocation, values, 20);
      //        console.log("send hip match to room", data.id, n);
      //        socket.join(data.id);
      //        socket.broadcast.to(data.id).emit('hip match', data.msg);
                console.log("emit hip match to all clients");
                //socket.emit('hip match', "test");
                io.sockets.emit('hip match',  "test");
      //      console.log("sent hip match to all");

            return;
        } else {
          // just do nothing
        }
      }
  });

  });
 }
