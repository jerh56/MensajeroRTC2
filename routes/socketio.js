
module.exports = function(io){
var app = require('express');
var uuid = require('uuid4');
var router = app.Router();
var Usernames = require('../models/usernames.js');
var Agentnames = require('../models/agentnames.js');
var WaitList = require('../models/waitlist.js');
var Msglist = require('../models/msglist.js');
var User = require('../models/user.js');
var Rooms = require('../models/rooms.js');
var Apartado = require('../models/apartado.js');



// usernames which are currently connected to the chat
//var usernames = new Array();
//var WaitList = new Array();
var agentnames = new Array();
//var agentnames = {};
var currentroom ="";
// rooms which are currently available in chat
//var rooms = new Array();

//Cada ciertos milisegundos ejecuta esta funcion para buscar agentes disponibles
setInterval( function(){
  var agentroom = '0';
  WaitList.count({},function(err,nCount){
      if ( nCount > 0 ){
        Agentnames.findOne( {cantidad:{$lt:5}, estatus:1}, function(err,agentdoc){
          if(err){
            console.log(err);
          }
          else if(agentdoc){
            agentroom = agentdoc.idroom; // id del cuarto del agente 
            agentdoc.cantidad = agentdoc.cantidad + 1;
            agentdoc.save( function(err){
              if (err){
                console.log(err);
              }
              else
              {
                var username ='';
                WaitList.findOne({},function(err,waitdoc){
                  if(err){
                    console.log(err);
                  }
                  else{
                    Usernames.findOne( {_id:waitdoc.userid, estatus:1}, function(err, docUserName){
                      if (err){
                        console.log(err);
                      }
                      else {
                        username = waitdoc.nombre; //nombre del usuario en espera
                        currentroom = waitdoc.idroom; // id del cuarto del usuario en espera
                        io.sockets.in(currentroom).emit('updatechat', 'SERVER', 'Hay agente disponible ');
                        io.sockets.in(agentroom).emit('newuser', 'SERVER',username, currentroom, waitdoc.userid); // se le avisa al agente que hay un usuario por atender
                        //io.sockets.in(currentroom).emit('updatechat', 'SERVER','Te está atendiendo ' + agentdoc.nombre, currentroom);
                        waitdoc.remove({ _id: waitdoc._id }, function(err) {
                            if (err) {
                                console.log('Error');
                            }
                            else {
                                console.log('Se eliminó correctamente de la lista de espera');
                            }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
       });  
      }
  });
}, 2000); 


// setInterval( function(){

//   Agentnames.find({}, function(err,docAgentName){
//     if(err){
//       console.log(err);
//     }
//     else if(docAgentName){
//       var countRooms = 0;
//       for ( var i = 0; i < docAgentName.length ; i++){
        
//         countRooms = reviewRooms(docAgentName[i].userid);
//         console.log(countRooms);
//       }    
//     }
//   });

  
// }, 6000); 

 function reviewRooms(par_agentid){
       console.log(par_agentid);
        Rooms
        .find({useridagent:par_agentid})
        .exec(function(err,docRooms){
          if (docRooms.length > 0){
            //console.log(docRooms);
            var countUsers = 0;
            var nCount = 0;
            for ( var i = 0; i < docRooms.length ; i++){
              var par_userid = docRooms[i].userid;
              var par_roomid = docRooms[i].roomid;
              var par_username = docRooms[i].username;
              console.log(docRooms[i].userid, docRooms[i].useridagent);
               nCount = checkusername(par_roomid,par_userid,par_username); 
               console.log(nCount);
               countUsers = countUsers + nCount;  
            } 
            return countUsers;         
          }
        });  
    }

    function checkusername(par_roomid,par_userid,par_username){
      Usernames.findOne({userid: par_userid, idroom: par_roomid  }, function(err, docUserName){
        if (docUserName){
          console.log(docUserName);
          if (docUserName.estatus == 1){
             return 1; 
              
          }
          else{
              var dSegundosTrans = timeElapsed(docUserName.fecha_desconect);
              if (dSegundosTrans < (60 * 3)){
                 return 1;
              }
              else{
                 return 0;
              }
          }
        }
        else
        {
          return 0;
        }
      });
    }

io.sockets.on('connection', function (socket){
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;
    console.log('Id: ' + socket.id);
    console.log('Id: ' + socket.client.id);
    console.log(clientIp);
    console.log(socket.request.user);
    // when the client emits 'adduser', this listens and executes
    
    // cuando un usuario se conecta se produce este evento
    socket.on('connectuser', function(username){
      if ((username !== null)  && (username !=="")){

        User.findOne({_id:socket.request.user._id, usertype:'user'},function(err,docUser){
         if (docUser){
            Usernames.findOne({userid:socket.request.user._id},function(err,docUserName){
              if (err){
                console.log(err);
              }
              else{
                //console.log(docUserName);
                if (docUserName){
                  var dSegundosTrans = timeElapsed(docUserName.fecha_desconect);
                  console.log(dSegundosTrans);
                  if (dSegundosTrans > (60 * 3)){
                    WaitList.findOne({userid:socket.request.user._id}, function(err, docMsglist){
                      if (err){
                          console.log(err);
                      }
                      else{
                        if (docMsglist){
                          // 1 = se reconectó pero aun sigue en espera de un agente
                          userReconnect(docUserName.idroom, username, 1);
                        }
                        else{
                          userRegister(username);  
                        }
                      }
                    });  
                  }
                  else{
                    WaitList.findOne({userid:socket.request.user._id}, function(err, docMsglist){
                      if (err){
                          console.log(err);
                      }
                      else{
                        if (docMsglist){
                          // 1 = se reconectó pero aun sigue en espera de un agente
                          userReconnect(docUserName.idroom, username, 1);
                        }
                        else{
                          // 0 = se reconectó pero ya lo está atendiendo un agente
                          userReconnect(docUserName.idroom, username, 0); 
                        }
                      }
                    });
                  }       
                }
                else{
                  userRegister(username);
                }
              }
            }); 
          }
          else{
            console.log('No es un usuario');
            socket.emit('redirect', '/logout');
          }
        });  
      }
    });


  socket.on('connectagent', function(agentname){
    if ((agentname !== null)  && (agentname !=="")){
      console.log(socket.request.user);

      User.findOne({_id:socket.request.user._id, usertype:'agent'},function(err,docUser){
         if (docUser){
            Agentnames.findOne({userid:socket.request.user._id},function(err,docAgentName){
              if (err){
                console.log(err);
              }
              else{
                if (docAgentName){
                  agentReconnect(docAgentName.idroom, agentname);
                }
                else{
                  agentRegister(agentname);
                }
              }
            }); 
          }
          else{
            console.log('No es un agente');
            socket.emit('redirect', '/ag_logout');
          }
        });
      }
    });


    // Este evento sucede cuando un nuevo usuario se conecto y lo va a atender un agente
    socket.on('addagentroom', function(idroom,agentname,par_username, par_userid){
      if ((idroom !== null)  && (idroom!=="")){
        // Obtener numero de rooms que puede atender el agente
        // send client to room por default
        socket.join(idroom);

      var newRoom = new Rooms();
      newRoom.roomid = idroom;
      newRoom.useridagent = socket.request.user._id;
      newRoom.userid = par_userid;
      newRoom.fecha_creacion = Date.now();
      newRoom.username = par_username;
      newRoom.save(function(err){
        if (err){
          console.log('error');
        }
        else
        {
          console.log('se generó un nuevo cuarto');
        }
      });

        // echo to client they've connected
        //socket.emit('updatechat', 'MENSAJERO RTC', 'Bienvenido: ' + agentname, idroom);
        // echo to room 1 that a person has connected to their room:
        socket.broadcast.to(idroom).emit('updatechat', 'SERVER', 'Te atiende: ' +  agentname , '');
        //socket.broadcast.to(idroom).emit('updatechat', 'SERVER', 'Sala: ' + idroom, idroom);
        socket.emit('updatechat', 'MENSAJERO RTC', 'Se conectó el usuario ' + par_username , idroom);
        //socket.emit('updatechat', 'MENSAJERO RTC', 'Se conecto el usuario: '+ username , idroom);
        //socket.emit('updaterooms', agentnames, idroom);
        console.log('Se conectó el agente: ' + agentname);
      }
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      io.sockets.in(socket.room).emit('updatechat', socket.username, data, socket.room);
      var newMsglist = new Msglist();
      newMsglist.username = socket.username;
      newMsglist.userid = socket.request.user._id;
      newMsglist.room = socket.room;
      newMsglist.usertype = 'user';
      newMsglist.message = data;
      newMsglist.date_msg = Date.now();
      newMsglist.save(function(err){
        if (err){
          console.log('error');
        }
        else
        {
          console.log('se guardó un mensaje de usuario');
        }
      });
      console.log(socket.username);
      console.log(socket.room);
    });

    // Cuando el agente emite un mensaje sendchatagent
    socket.on('sendchatagent', function (data,idroom){
      io.sockets.in(idroom).emit('updatechat', socket.agentname, data, idroom);
      var newMsglist = new Msglist();
      newMsglist.username = socket.agentname;
      newMsglist.userid = socket.request.user._id;
      newMsglist.room = idroom;
      newMsglist.usertype = 'agent';
      newMsglist.message = data;
      newMsglist.date_msg = Date.now();
      newMsglist.save(function(err){
        if (err){
          console.log('error');
        }
        else
        {
          console.log('se guardó un mensaje de usuario');
        }
      });

      console.log(socket.room);
      console.log(socket.agentname);
      console.log(data);
    });

    socket.on('switchRoom', function(newroom){
      socket.leave(socket.room); // leave the current room (stored in session)
      socket.join(newroom); // join new room, received as function parameter
      //socket.emit('updatechat', 'MENSAJERO RTC', 'te has conectado a '+ newroom);
      // sent message to OLD room
      //socket.broadcast.to(socket.room).emit('updatechat', 'MENSAJERO RTC', socket.username+' ha salido de la sala');
      // update socket session room title
      socket.room = newroom;
      //socket.broadcast.to(newroom).emit('updatechat', 'MENSAJERO RTC', socket.username+' se ha unido a esta sala');
      socket.emit('updaterooms', agentnames, newroom);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        if (socket.isuser === true){
          // remove the username from global usernames list
          //delete usernames[socket.username];

         Usernames.findOne({ userid: socket.request.user._id, idroom: socket.room }, function(err,docUserName) {
              if (err) {
                  console.log('Error');
              }
              else {
                  // Usernames.find({},function(err,rUsernames){
                  //   if (err){
                  //     console.log(err);
                  //   }
                  //   else{

                    // localizar el id del agente
                    Rooms.findOne({roomid:socket.room}, function(err, docRoom){
                      if (docRoom){
                        Agentnames.findOne({userid:docRoom.useridagent}, function(err,docUserAgent){
                          if (docUserAgent){
                              docUserAgent.cantidad = docUserAgent.cantidad - 1;
                              docUserAgent.save();
                              Apartado.findOne({userid:socket.request.user._id}, function(err, docApartado){
                                if(docApartado){
                                  docApartado.useridagent = docUserAgent.userid;
                                  docApartado.fecha_creacion = new Date();
                                  docApartado.roomid = docRoom.roomid;
                                }
                                else{
                                  newApartado = new Apartado();
                                  newApartado.useridagent = docUserAgent.userid;
                                  newApartado.fecha_creacion = new Date();
                                  newApartado.roomid = docRoom.roomid;
                                  newApartado.userid = socket.request.user._id;
                                  newApartado.save();
                                }
                              });
                          }
                        });
                      }
                    });

                      console.log(docUserName);
                      docUserName.fecha_desconect = new Date();
                      docUserName.estatus = 0;
                      docUserName.save();
                      //io.sockets.emit('updateusers', rUsernames);
                      // echo globally that this client has left
                      // preguntar si es usuario para avisar al agente que se desconecto
                      io.sockets.in(socket.room).emit('updatechat', 'MENSAJERO RTC', "Se desconectó el usuario " + socket.username,socket.room);
                      console.log("Se desconectó el usuario " + socket.username)
                      //socket.broadcast.emit('updatechat', 'MENSAJERO RTC', socket.username + ' se ha desconectado');
                      socket.leave(socket.room);
                      setTimeout(function(){
                          console.log("se disminuyó");
                      },3000);
                    // }
                  // });  
              }
          });
       }
       else{
          if (socket.isuser === false){
            //socket.broadcast.emit('updatechat', 'MENSAJERO RTC', socket.agentname + ' se ha desconectado');
            Agentnames.findOne({ userid: socket.request.user._id }, function(err,docAgentName) {
              if (err) {
                  console.log('Error');
              }
              else {
                      console.log(docAgentName);
                      docAgentName.fecha_desconect = new Date();
                      docAgentName.estatus = 0;
                      docAgentName.save();
                      //io.sockets.emit('updateusers', rUsernames);
                      // echo globally that this client has left
                      // preguntar si es usuario para avisar al agente que se desconecto
                      //io.sockets.in(socket.room).emit('updatechat', 'MENSAJERO RTC', "Se desconecto el usuario " + socket.username,socket.room);
                      console.log("Se desconectó el usuario " + socket.agentname)
                      //socket.broadcast.emit('updatechat', 'MENSAJERO RTC', socket.username + ' se ha desconectado');
                      socket.leave(socket.room);
              }
            });
          }
       }
    });

    socket.on('typing', function(data){
      io.sockets.in(socket.room).emit('istyping', socket.username, data, socket.room);
      console.log(socket.id + 'is typing');
    });

  function userRegister(par_username){
    // store the username in the socket session for this client
        socket.username = par_username;
        // store the room name in the socket session for this client
        //se genera un identificador para el room
        var waitforagent = true;
        var idroom = uuid();
        // Se toma el identificador como id del room
        currentroom = idroom;
        agentroom = '0';
        //Se busca al agente disponible de los agentes conectados
        console.log(agentnames);
        Agentnames.findOne({cantidad:{$lt:5}, estatus:1}, function(err,doc){
          if(err){
            console.log(err);
          }
          else if(!doc){
            newWaitList = new WaitList();
            newWaitList.nombre = par_username;
            newWaitList.idroom = currentroom;
            newWaitList.userid = socket.request.user._id;
            newWaitList.save(function(err){
              if (!err) console.log('Se tiene un usuario en espera');
            });
            socket.isuser = true;
            socket.room = currentroom;
            // add the client's username to the global list
            
            Usernames.findOne({userid:socket.request.user._id},function(err,docUserName){
              if (err){
                console.log(err);
              }
              else{
                //console.log(docUserName);
                if (docUserName){
                  docUserName.nombre = par_username;
                  docUserName.socketid = socket.id;
                  docUserName.idroom = currentroom;
                  docUserName.userid = socket.request.user._id;
                  docUserName.fecha_conect = new Date();
                  docUserName.estatus = 1;
                  docUserName.save(function(err){
                      if (!err) console.log('Se conectó un usuario');
                  });
                }
                else{
                  newUsername = new Usernames();
                  newUsername.nombre = par_username;
                  newUsername.socketid = socket.id;
                  newUsername.idroom = currentroom;
                  newUsername.userid = socket.request.user._id;
                  newUsername.fecha_conect = new Date();
                  newUsername.estatus = 1;
                  newUsername.save(function(err){
                      if (!err) console.log('Se conectó un usuario');
                  });
                }
              }
            }); 
            socket.join(currentroom);
           // socket.broadcast.to(idroom).emit('updatechat', 'MENSAJERO RTC', par_agentname + ' es el agente disponible en esta sala', '');

            //socket.broadcast.to(idroom).emit('updatechat', 'MENSAJERO RTC', 'Todos nuestros agentes estan ocupados, por favor espere');
            socket.emit('updatechat', 'MENSAJERO RTC', 'Todos nuestros agentes están ocupados, por favor espere');
            
          }
          else{
            //console.log(!doc);
            console.log(doc);
            agentroom = doc.idroom;
            //waitforagent = false;
            doc.cantidad = doc.cantidad + 1;
            doc.save(function(err){
              if (err){
                console.log(err);
              }
              else
              {
                console.log("Se aumentó la cantidad de usuarios atendidos");
                console.log(currentroom);
                // Si es usuario asigna un valor verdadero al flag
                socket.isuser = true;
                socket.room = currentroom;
                // add the client's username to the global list
                
                // newUsername = new Usernames();
                // newUsername.nombre = par_username;
                // newUsername.socketid = socket.id;
                // newUsername.idroom = currentroom;
                // newUsername.userid = socket.request.user._id;
                // newUsername.fecha_conect = new Date();
                // newUsername.estatus = 1;
                // newUsername.save(function(err){
                //     //if (!err) 
                //       console.log('Se conectó un usuario');
                // });
                // if (usernames.length == 0){
                //     usernames[0] = ({"nombre":username, "socketid":socket.id});
                //          // add the client's username to the wait list
                // }
                // else{
                //     usernames.push ({"nombre":username, "socketid":socket.id});
                //     // add the client's username to the wait list
                       
                // }

                Usernames.findOne({userid:socket.request.user._id},function(err,docUserName){
                  if (err){
                    console.log(err);
                  }
                  else{
                    //console.log(docUserName);
                    if (docUserName){
                      docUserName.nombre = par_username;
                      docUserName.socketid = socket.id;
                      docUserName.idroom = currentroom;
                      docUserName.userid = socket.request.user._id;
                      docUserName.fecha_conect = new Date();
                      docUserName.estatus = 1;
                      docUserName.save(function(err){
                          if (!err) console.log('Se conectó un usuario');
                      });
                    }
                    else{
                      newUsername = new Usernames();
                      newUsername.nombre = par_username;
                      newUsername.socketid = socket.id;
                      newUsername.idroom = currentroom;
                      newUsername.userid = socket.request.user._id;
                      newUsername.fecha_conect = new Date();
                      newUsername.estatus = 1;
                      newUsername.save(function(err){
                          if (!err) console.log('Se conectó un usuario');
                      });
                    }
                  }
                }); 
                //usernames[username] = username;
                // send client to room 1
                socket.join(currentroom);
                // eco al room del agente para indicarle que hay un nuevo usuario, se le envía el id de ese usuario
                socket.broadcast.to(agentroom).emit('newuser', 'MENSAJERO RTC',par_username, currentroom, socket.request.user._id);
                // echo to client they've connected
                //El evento updatechat envia usuario que emite, Datos, Posicion (se descontinuara), ID del room (solo en caso de que el mensaje vaya para un usuario y no un agente)
                //socket.emit('updatechat', 'MENSAJERO RTC', 'Te esta atendiendo ' + currentroom, currentroom);
                // echo to room 1 that a person has connected to their room
                //socket.broadcast.to(agentroom).emit('updatechat', 'MENSAJERO RTC', par_username + ' se ha conectado a ' + currentroom, '');
                //socket.emit('updaterooms', agentnames, agentroom);
               // console.log('Se conecto el usuario: ' + username);
              }
            });
          }
        });
    }

  function userReconnect(par_idroom, par_username, par_espera){
    // store the username in the socket session for this client
        socket.username = par_username;
        // store the room name in the socket session for this client
        //se genera un identificador para el room
        socket.isuser = true;
        socket.room = par_idroom;
        // add the client's username to the global list

        socket.join(par_idroom);
        // eco al room del agente
        //socket.broadcast.to(agentroom).emit('newuser', 'MENSAJERO RTC',par_username, par_idroom);
        // echo to client they've connected
        //El evento updatechat envia usuario que emite, Datos, Posicion (se descontinuara), ID del room (solo en caso de que el mensaje vaya para un usuario y no un agente)
        //socket.emit('updatechat', 'MENSAJERO RTC', 'Te esta atendiendo ' + currentroom, currentroom);
        // echo to room 1 that a person has connected to their room
        //socket.broadcast.to(agentroom).emit('updatechat', 'MENSAJERO RTC', par_username + ' se ha conectado a ' + par_idroom, '');
        //socket.emit('updaterooms', agentnames, agentroom);
        // console.log('Se conecto el usuario: ' + username);



        Usernames.findOne({ userid: socket.request.user._id }, function(err,docUserName) {
              if (err) {
                  console.log('Error');
              }
              else {
                  docUserName.fecha_conect = new Date();
                  docUserName.estatus = 1;
                  docUserName.save();  




                  Rooms.findOne({roomid:par_idroom}, function(err, docRoom){
                      if (docRoom){
                        Agentnames.findOne({userid:docRoom.useridagent}, function(err,docUserAgent){
                          if (docUserAgent){
                              docUserAgent.cantidad = docUserAgent.cantidad + 1;
                              docUserAgent.save();
                              //Apartado.remove({userid:socket.request.user._id});
                          }
                        });
                      }
                    });

              }
          });
        if (par_espera == 1){
          socket.emit('updatechat', 'MENSAJERO RTC', 'Todos nuestros agentes están ocupados, por favor espere');
        }
        socket.broadcast.to(socket.room).emit('updatechat', 'MENSAJERO RTC', "Se conectó el usuario " + socket.username,socket.room);  
        console.log('Se reconectó el usuario: ' +  par_username);
    }



    function agentRegister(par_agentname){
              // store the username in the socket session for this client
      socket.isuser = false;
      socket.agentname = par_agentname;
      // store the room name in the socket session for this client
      var idroom = uuid();
      // Se toma el identificador como id del room
      currentroom = idroom;
      socket.room = idroom;
      //cantidad = 0 esta cantidad
      newAgentname = new Agentnames();
      newAgentname.nombre = par_agentname;
      newAgentname.idroom = idroom;
      newAgentname.userid = socket.request.user._id;
      newAgentname.fecha_conect = new Date();
      newAgentname.estatus = 1;
      newAgentname.save(function(err){
          if (!err){
            socket.join(idroom);
            //socket.join(agentname+'02');
            // echo to client they've connected
            // socket.emit('updatechat', 'MENSAJERO RTC', 'AGENTE: ' + agentname,'');
            // echo to room 1 that a person has connected to their room
            //socket.broadcast.to(idroom).emit('updatechat', 'MENSAJERO RTC', par_agentname + ' es el agente disponible en esta sala', '');
            //socket.emit('updaterooms', agentnames, par_agentname);
            socket.emit('conectedagent',idroom);
            console.log('Se conectó el agente: ' + par_agentname);
          }
      });

      // if (agentnames.length == 0){
      //   agentnames[0] = ({"nombre":par_agentname, "cantidad":0, "idroom":idroom});
      //   // add the client's username to the global list
      //   //rooms[0] = agentname;
      // }
      // else{
      //   agentnames.push ({"nombre":par_agentname, "cantidad":0, "idroom":idroom});
      //   // add the client's username to the global list
      //   //rooms[agentname] = agentname; 
       
      // }
      // Obtener numero de rooms que puede atender el agente
      // send client to room por default
      

    }



    function agentReconnect(par_idroom, par_agentname){
              // store the username in the socket session for this client
      socket.isuser = false;
      socket.agentname = par_agentname;
      // store the room name in the socket session for this client
      var idroom = par_idroom;
      // Se toma el identificador como id del room
      currentroom = idroom;
      socket.room = idroom;
      //cantidad = 0 esta cantidad
      // newAgentname = new Agentnames();
      // newAgentname.nombre = agentname;
      // newAgentname.idroom = idroom;
      // newAgentname.userid = socket.request.user._id;
      // newAgentname.save(function(err){
      //     if (!err) console.log('Se conectó un agente');
      // });

      // if (agentnames.length == 0){
      //   agentnames[0] = ({"nombre":agentname, "cantidad":0, "idroom":idroom});
      //   // add the client's username to the global list
      //   //rooms[0] = agentname;
      // }
      // else{
      //   agentnames.push ({"nombre":agentname, "cantidad":0, "idroom":idroom});
      //   // add the client's username to the global list
      //   //rooms[agentname] = agentname; 
       
      // }
      // Obtener numero de rooms que puede atender el agente
      // send client to room por default
      //resetAgentQuantity(socket.request.user._id); // reseta a 0 el número de usuarios atendidos
      socket.join(idroom);
      //socket.join(agentname+'02');
      // echo to client they've connected
     // socket.emit('updatechat', 'MENSAJERO RTC', 'AGENTE: ' + agentname,'');
      // echo to room 1 that a person has connected to their room
      socket.broadcast.to(idroom).emit('updatechat', 'MENSAJERO RTC', 'Te atiende: ' +  par_agentname , '');
      //socket.emit('updaterooms', agentnames,  par_agentname);
      socket.emit('conectedagent',idroom);
      console.log('Se reconectó el agente: ' +  par_agentname);

       Agentnames.findOne({ userid: socket.request.user._id }, function(err,docAgentName) {
              if (err) {
                  console.log('Error');
              }
              else {
                  docAgentName.fecha_conect = new Date();
                  docAgentName.estatus = 1;
                  docAgentName.cantidad = 0;
                  docAgentName.save();
                  reconnectRooms();         
              }
      });

     
    }

    function reconnectRooms(){
       
        Rooms
        .find({useridagent:socket.request.user._id})
        .exec(function(err,docRooms){
          //console.log(orderpacksdocs, orderpacksdocs.length);
          console.log(docRooms);
          if (docRooms.length > 0){
            //console.log(docRooms);
            for ( var i = 0; i < docRooms.length ; i++){
              console.log(i); 
              console.log(docRooms[i]);
              var par_userid = docRooms[i].userid;
              var par_roomid = docRooms[i].roomid;
              var par_username = docRooms[i].username;
              //console.log(docRooms[i].userid, docRooms[i].useridagent);
               checkmsg(par_roomid,par_userid,par_username); 
            }          
          }
        });  
    }

   

    /* Envia la lista de mensajes del cuarto de un usuario */
    function sendChatMsgList(par_roomid, par_username){
         Msglist.find({room:par_roomid}, function(err,docMsglist){
                  if (docMsglist.length > 0){

                    //for ( var i = 0; i < docMsglist.length ; i++){
                      socket.emit('msglist', 'SERVER',  docMsglist, par_roomid, par_username );
                      
                    //}
                      
                  }
              }).sort({date_msg:1});
              
    }
    /* Compara dos fechas y regresa los segundos transcurridos */
    function timeElapsed( date_to_compare){
      var d_to_compare = new Date(date_to_compare);
      var d_actual = new Date();
      var diff_dates_sec = (d_actual / 1000) - (d_to_compare.getTime() / 1000);
      return ( Math.floor(diff_dates_sec) );
    }

    function checkmsg(par_roomid,par_userid,par_username){
          Usernames.findOne({userid: par_userid, idroom: par_roomid  }, function(err, docUserName){
          if (docUserName){
            console.log(docUserName);
            if (docUserName.estatus == 1){
                  //console.log(docUserName);
                  socket.join(par_roomid);
                  socket.broadcast.to(par_roomid).emit('updatechat', 'SERVER',  'Te atiende: ' +  socket.request.user.username, '');
                  sendChatMsgList(par_roomid, par_username);
                  Agentnames.findOne({ userid: socket.request.user._id},function(err,docAgentName){
                    if (docAgentName){
                        docAgentName.cantidad = docAgentName.cantidad + 1;
                    }
                  });
                  //setUsersQuantity(par_roomid); // aumentar la cantidad de usuarios atendidos
            }
            else{
                console.log(docUserName);
                var dSegundosTrans = timeElapsed(docUserName.fecha_desconect);
                console.log(dSegundosTrans);
                if (dSegundosTrans < (60 * 3)){
                  socket.join(par_roomid);
                  socket.broadcast.to(par_roomid).emit('updatechat', 'SERVER',  'Te atiende: ' +  socket.request.user.username, '');
                  sendChatMsgList(par_roomid, par_username);
                  //setUsersQuantity(par_roomid); // aumentar la cantidad de usuarios atendidos
                }
            }
          }
      });
    }
    function setUsersQuantity(par_roomid){
      Rooms.findOne({roomid: par_roomid}, function(err, docRooms){  
        if (docRooms){
          console.log("Rooms", docRooms);
          console.log(docRooms.useridagent);
          Agentnames.findOneAndUpdate(
            { userid: docRooms.useridagent},
            { $inc: { cantidad: 1 } }
          );
        } 
      });
    }
    function resetAgentQuantity(par_agentid){
       console.log("se reseteó la cantidad de usuarios", par_agentid);
        
        Agentnames.findOneAndUpdate(
          { userid: par_agentid},
          { $set: { cantidad: 0 } }
        );
    }
  });
 return router;
 
};