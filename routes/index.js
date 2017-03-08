var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var passport = require('passport');
var Incidencia = require('../models/incidencia.js');
var Dialogo = require('../models/dialogo.js');
var Origen = require('../models/origen.js');
var Empresa = require('../models/empresa.js');
var Departamento = require('../models/departamento.js');
var Tipificacion_Controller = require('../controllers/tipificacion');
var Dialogo_Controller = require('../controllers/lista_mensaje');
var Descripcion = require('../models/descripcion.js');


//ejemplo listas desplegables lista_mensaje

router.get('/lista_mensaje', function(req,res){
  res.render('lista_mensaje');
});


router.get('/tipificacion/db/departamento', Tipificacion_Controller.departamento);
router.get('/tipificacion/db/incidencia/:incidencia', Tipificacion_Controller.incidencia);
router.get('/tipificacion/db/origen/', Tipificacion_Controller.origen);


router.get('/dialogos/db/departamento', Dialogo_Controller.dpto);
router.get('/dialogos/db/dialogo/:cd', Dialogo_Controller.dialogo);


router.get('/configuracion', require('connect-ensure-login').ensureLoggedIn('/login'), function (req, res) {
  //res.sendFile(__dirname + '/indexUser.html');

  res.render('configuracion', {message: req.flash('message'), user: req.user});
});

//ejemplo listas desplegables



router.get('/burbuja', function(req, res){
  res.render('burbuja');
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

  router.get('/user', require('connect-ensure-login').ensureLoggedIn('/login'), function (req, res) {
    //res.sendFile(__dirname + '/indexUser.html');
    console.log(req.user.username);
    console.log(req.user.No_empleado);
    res.render('user', {username: req.user.username, numeroempleado: req.user.No_empleado});
  });
  
  
  router.get('/agent', require('connect-ensure-login').ensureLoggedIn('/ag_login'), function (req, res) {

    console.log(req.user.username);
    res.render('agent', {agentname: req.user.username});

  });

// PASSPORT

  router.get('/login', function(req, res) {

    var msjres = req.flash('message');
    res.render('login', {message: msjres[0]});

  });
  
    router.get('/ag_login', function(req, res) {

    var msjres = req.flash('message');
    res.render('ag_login', {message: msjres[0]});
  });

    //REGISTRO USUARIOS
    router.get('/registro', function(req, res) {
        res.render('registro', {message: req.flash('message')});
    });
  
    //REGISTRO AGENTES
  router.get('/ag_registro', function(req, res) {

  res.render('ag_registro', {message: req.flash('message')});
  });

  //ENSURELOGGED USSERS
 router.get('/principal', require('connect-ensure-login').ensureLoggedIn('/login'),function(req, res){
    res.render('principal', {message: req.flash('message'), user: req.user});
 });

router.get('/usuario', require('connect-ensure-login').ensureLoggedIn('/login'),function(req, res){

          res.render('usuario', {message: req.flash('message'), user: req.user});
 });

 router.post('/user', require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){


        var newDescripcion = new Descripcion();

        newDescripcion.coddep = req.body.coddep;
        newDescripcion.descripcion = req.body.descripcion;

      newDescripcion.save(function(err) {
        if (err){
          console.log('No se pudo hacer registro de la descripcion de el problema: '+err);
          res.render('usuario', {message: 'No se pudo hacer registro de la descripcion de el problema: '+err});
          }
          else{
            console.log('se guardo descripcion');
            res.render('user', {username: req.user.username, numeroempleado: req.user.No_empleado});
            
          }
        });

 });


 router.get('/agente',
  require('connect-ensure-login').ensureLoggedIn('/ag_login'),function(req, res){

          res.render('agente', {message: req.flash('message'), user: req.user});
 });

  router.get('/seleccion_empresa',
  require('connect-ensure-login').ensureLoggedIn('/ag_login'),function(req, res){

          res.render('seleccion_empresa', {message: req.flash('message'), user: req.user});
 });


  router.get('/chatuser',
require('connect-ensure-login').ensureLoggedIn('/ag_login'),function(req, res){

        res.render('chatuser', {message: req.flash('message'), user: req.user});
});

  
 
  //ENSURELOGGED AGENT
  router.get('/ag_principal',
  require('connect-ensure-login').ensureLoggedIn('/ag_login'),function(req, res){
    console.log(req.user);
          res.render('ag_principal', {message: req.flash('message'), user: req.user});
 });

router.get('/agente',
  require('connect-ensure-login').ensureLoggedIn('/ag_login'),function(req, res){
    console.log(req.user);
          res.render('agente', {message: req.flash('message'), user: req.user});
 });
 

 

  router.get('/signup_success', require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res){


        var msjres = req.flash('message');
        

    res.render('registro', {message: msjres[0], user: req.user});

  });
  
  router.get('/ag_signup_success', require('connect-ensure-login').ensureLoggedIn('/ag_login'),
    function(req, res){

        var msjres = req.flash('message');
        

    res.render('ag_principal', {message: msjres[0], user: req.user});

  });


  // Si sucede un error al registrar un usuario se ejecuta esta ruta
  router.get('/signup_error', function(req, res) {
     var msjres = req.flash('message');

      res.render('registro', {message: msjres[0], user: req.user});

  });
  
  // Si sucede un error al registrar un usuario se ejecuta esta ruta
  router.get('/ag_signup_error', function(req, res) {
     var msjres = req.flash('message');

        console.log(req.flash('failure'));
      res.render('ag_signup_error', {message: msjres[0], user: req.user});

  });
// PASSPORT

//INCIDENCIA
router.get('/administrador', function (req,res){
  res.render('administrador');
});

router.get('/tipificacion', require('connect-ensure-login').ensureLoggedIn('/ag_login'), function(req,res){

  var msjres = req.flash('message');
  res.render('tipificacion', {message: msjres[0], user: req.user} );

});


//REGISTRO DE INCIDENCIAS
router.post('/registroincidencia', function(req, res){

  var despro = req.body.despro;
  var coddep = req.body.coddep

  Incidencia.findOne({$and:[{"coddep":coddep} , {"despro":despro}]}, function(err, doc){


    if (doc){
      console.log('Ya existe esta incidencia');
      res.render('tipificacion', {message: 'Ya existe esta incidencia', user: req.user})
    }
    else{

        var countinci = req.body.coddep * 100; 
        console.log('Código Departamento: '+req.body.coddep);
        console.log('Código Incidencia: '+countinci);

        Incidencia.count( { $and: [ {"codpro":{$gte:countinci}}, {"codpro":{$lt: countinci+100}} ]}, function(err,nCount){

            var newIncidencia = new Incidencia();
            newIncidencia.codpro = countinci+nCount+1;
            newIncidencia.despro = req.body.despro;
            newIncidencia.coddep = req.body.coddep;

            newIncidencia.save(function(err){
               
                if (err){
                    console.log('No se pudo guardar el incidencia: '+err);
                    res.render('error', {message: 'No se pudo guardar el incidencia: ', user: req.user});
                }
                else{
                    console.log('se guardo incidencia');
                    res.render('tipificacion', {message: 'se guardo incidencia', user: req.user});
                }
            });

        });//count

    }

  });

});

//REGISTRO DE ORIGEN
router.post('/registroorigen', function(req, res){

    Origen.count({}, function(err,nCount){

        var newOrigen = new Origen();
        newOrigen.codorig = nCount+1;
        newOrigen.desorig = req.body.desorig;


        newOrigen.save(function(err){
           
            if (err){
                console.log('No se pudo registrar el Origen: '+err);
                res.render('error', {message: 'No se pudo guardar Origen', user: req.user});
            }
            else{
                console.log('se guardo origen');
                res.render('tipificacion', {message: 'se guardo Origen', user: req.user});
            }
        });


    });

});

//ACTUALIZACION DE STATUS

router.post('/updatestatus', function(req,res){

  var codpro = req.body.codpro;

  Incidencia.findOne({"codpro": codpro}, function(err, doc){

    if (err || !doc){
      console.log(err);      
    }
    else{

      doc.status = req.body.status;

        doc.save(function(err){
        if (err){
        console.log(err);
        }
        else
        {

      console.log('Codpro: '+ codpro);
      console.log('Se actualizo Incidencia' +doc);
      res.render('tipificacion', {message: 'Se actualizo correctamente', user: req.user})
          
      };
    });
    }

  });//findone function
 });//function post

router.post('/tipificacionupdate', function(req,res){

  var codpro = req.body.codpro;

  Incidencia.findOne({"codpro": codpro}, function(err, doc){

    if (err || !doc){
      console.log(err);      
    }
    else{

      doc.despro = req.body.despro;

        doc.save(function(err){
        if (err){
        console.log(err);
        }
        else
        {

      console.log('Se actualizo Incidencia' +doc);
      res.render('tipificacion', {message: 'Se actualizo correctamente', user: req.user})
          
      };
    });
    }

  });//findone function
 });//function post


//ACTUALIZACION DE ORIGEN

router.post('/origenupdate', function(req,res){

  var codorig = req.body.codorig;

  Origen.findOne({"codorig": codorig}, function(err, doc){

    if (err || !doc){
      console.log(err);      
    }
    else{

      doc.desorig = req.body.desorig;

        doc.save(function(err){
        if (err){
        console.log(err);
        }
        else
        {

      console.log('Se actualizo Origen' +doc);
      res.render('tipificacion', {message: 'Se actualizo origen correctamente', user: req.user})
          
      };
    });
    }

  });//findone function
 });//function post




//DIALOGOS PREDETERMINADOS
router.get('/dialogos', function(req, res) {

  var msjres = req.flash('message');
  res.render('dialogos', {message: msjres[0]});
});

router.post('/dialogos', function(req, res){

  var tecla1 = req.body.tecla_1;
  var tecla2 = req.body.tecla_2;
  var coddep = req.body.coddep;
  var coddial = coddep*100;

  Dialogo.findOne({$and: [ {"tecla_1": tecla1}, {"tecla_2": tecla2}, {"coddep": coddep}]}, function(err, doc){

    if (!doc)
    {

      Dialogo.count({$and: [ {"coddep":{$gte:coddep}}, {"coddep":{$lt: coddial+100}} ]}, function (err, nCount){

         var newDialogo = new Dialogo();
                
                newDialogo.coddial = coddial+nCount+1;
                newDialogo.desdia = req.body.desdia;
                newDialogo.coddep = req.body.coddep;
                newDialogo.tecla_1 = req.body.tecla_1;
                newDialogo.tecla_2 =  req.body.tecla_2;
                

      newDialogo.save(function(err) {
        if (err){
          console.log('No se pudo registrar la dialogo : '+err);
          res.render('error', {message: 'No se pudo registrar la dialogo', user: req.user});
          }
          else{
            console.log('se guardo dialogo');
            res.render('dialogos', {message: 'Se registro correctamente el dialogo', user: req.user});

          }
       });
      });
    }
    else
    {
      console.log("Se encontro Comando " + doc);
      res.render('dialogos', {message: 'Comando ya existe', user: req.user});

    }


  });

  });//dialogo post

//ACTUALIZAR DIALOGOS PREDETERMINADOS

router.post('/dialogosupdate', function(req,res){

 var coddial = req.body.coddial;

  Dialogo.findOne({"coddial": coddial}, function(err, doc){

    if (err || !doc){
      console.log(err);  
       res.render('error', {message: 'No se pudo modificar la dialogo', user: req.user});    
    }
    else{

      doc.desdia = req.body.desdia;

        doc.save(function(err){
        if (err){
        console.log(err);
        }
        else
        {

      console.log('Coddial: '+ coddial);
      console.log('Se actualizo Dialogo' +doc);
      res.render('dialogos', {message: 'Se actualizo el dialogo correctamente', user: req.user})
          
      };
    });
    }

  });//findone function

});//function post


//ACTUALIZAR DIALOGOS PREDETERMINADOS


//DIALOGOS PREDETERMINADOS

//REGISTRO DE EMPRESA

  router.get('/registro_empresa', require('connect-ensure-login').ensureLoggedIn('/ag_login'),function(req, res){

          res.render('registro_empresa', {message: req.flash('message'), user: req.user});
 });


router.post('/registro_empresa', function(req, res){

      var newEmpresa = new Empresa();


          newEmpresa.Nombre = req.body.Nombre;
          newEmpresa.Razon_social = req.body.Razon_social;
          newEmpresa.RFC = req.body.RFC;
          newEmpresa.Pais = req.body.Pais;
          newEmpresa.Estado = req.body.Estado;
          newEmpresa.Ciudad = req.body.Ciudad;
          newEmpresa.Colonia = req.body.Colonia;
          newEmpresa.Calle = req.body.Calle;
          newEmpresa.Numero = req.body.Numero;
          newEmpresa.Telefono = req.body.Telefono;



      newEmpresa.save(function(err) {
        if (err){
          console.log('No se pudo registrar la empresa : '+err);
          res.render('error', {message: 'No se pudo registrar la empresa', user: req.user});
          }
          else{
            console.log('se guardo empresa');
            res.render('registro_empresa', {message: 'se registro correctamente la empresa', user: req.user});

          }
        })
    }
    );

//REGISTRO DE EMPRESA

//ORIGEN DE INCIDENCIAS


router.get('/origenincidencias', function(req,res){
  res.render('origenincidencias');
});

router.post('/origenincidencias', function(req, res){

      var newOrigen = new Origen();

      newOrigen.Num_origen = req.body.Num_origen;
      newOrigen.Origen = req.body.Origen;
      newOrigen.Area = req.body.Area;



      newOrigen.save(function(err) {
        if (err){
          console.log('No se pudo guardar dialogo : '+err);
          res.render('error', {message: 'No se pudo guardar dialogo', user: req.user});
          }
          else{
            console.log('se guardo dialogo');
            res.render('origenincidencias', {message: 'se guardo dialogo correctamente', user: req.user});

          }
        })
    }
    );

//ORIGEN DE INCIDENCIAS

//SELECCION DE DEPARTAMENTO Y DESCRIPCION DE INCIDENCIA

router.get('/departamento', function(req,res){

  var msjres = req.flash('message');
  res.render('departamento', {message: msjres[0], user: req.user} );

});

router.post('/registro_departamento', function(req, res){

    Departamento.count({}, function (err, nCount){

        var newDepartamento = new Departamento();

        newDepartamento.desdep = req.body.desdep
        newDepartamento.coddep = nCount + 1;

        newDepartamento.save(function(err) {

            if (err){
                console.log('No se pudo guardar  departamento');
                res.render('departamento', {message: 'No se pudo guardar departamento: ', user: req.user});
            }
            else{
                console.log('se guardo Departamento');
                res.render('departamento', {message: 'Se guardo nuevo departamento: ', user: req.user});
            }
        });
    });    
});

//Función para actualizar la descripccion de los departamentos (desdep).
router.post('/update_departamento', function(req,res){

    var coddep = req.body.coddep;

    Departamento.findOne({"coddep": coddep}, function(err, doc){

        if (err || !doc){
            console.log(err);      
        }
        else{

            doc.desdep = req.body.desdep;

            doc.save(function(err){
                if (err){
                    console.log(err);
                }
                else{

                    console.log('Se actualizo departamento');
                    res.render('departamento', {message: 'Se actualizo departamento', user: req.user})

                };
            });
        }

    });//findone function
});//function post


//Función para actualizar el status de un departamento.
router.post('/status_departamento', function(req,res){

    var coddep = req.body.coddep;

    Departamento.findOne({"coddep": coddep}, function(err, doc){

        if (err || !doc){
            console.log(err);      
        }
        else{

            doc.status = req.body.status;

            doc.save(function(err){
                if (err){
                    console.log(err);
                }
                else
                {

                    console.log('Se actualizo estatus del departamento' +doc);
                    res.render('departamento', {message: 'Se actualizo estatus del departamento', user: req.user})

                };
            });
        }

    });//findone function
});//post function




//SELECCION DE DEPARTAMENTO Y DESCRIPCION DE INCIDENCIA

// PASSPORT USUARIOS
  router.post('/signin', passport.authenticate('login', {
    successRedirect: '/usuario',
    failureRedirect: '/login',
    failureFlash : true,
    successFlash : true 
  }));
 
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/signup_success',
    failureRedirect: '/signup_error',
    failureFlash : true, 
    successFlash : true 
  }));
// PASSPORT USUARIOS


// PASSPORT AGENTESF
  router.post('/ag_signin', passport.authenticate('ag_login', {
    successRedirect: '/agent',
    failureRedirect: '/ag_login',
    failureFlash : true,
    successFlash : true 
  }));
 
  router.post('/ag_signup', passport.authenticate('ag_signup', {
    successRedirect: '/ag_signup_success',
    failureRedirect: '/ag_signup_error',
    failureFlash : true, 
    successFlash : true 
  }));
// PASSPORT AGENTES



//LOGOUT
router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

//AGENTE LOGOUT
router.get('/ag_logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/ag_login');
});


module.exports = router;