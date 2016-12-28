angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $stateParams, $ionicLoading, Category) {
 
  $ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });

  $scope.palce = window.localStorage.getItem('user_place');

  Category.getCategory(function(data) {
    $scope.category = data;
  });

  Category.getCity(function(data) {
    $scope.cities = data;
  });

  $scope.logout = function() {
    window.localStorage.clear();
    $state.go('user.home');
    return;
  }
  
  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
   $scope.chat = function() {
    if( window.plugins && window.plugins.Hipmob ) {
    var hipmob_app_id = 'aef17ad0060349c89198ab98c71b3e03';
    var Hipmob = window.plugins.Hipmob;

    Hipmob.openChat(hipmob_app_id, {
    'title': 'Chat clubk',
    'user': $scope.currentUser.id,
    'name': $scope.currentUser.nombre,
    'email': 'femi@hipmob.com',
    'context': 'Chat club-k',
    'tab':{ 'background-color': '#222222', 'color': 'red', 'font-size': '12px', 'font-weight': 'bold' },
    // 'location': 'At home'
    'input':'¿como puedo ayudarte?',
    });

    } 
    else {
     alert('Hipmob plugin not available/ready.');
    }
  };
  $ionicLoading.hide();
  
})

.controller('ChatCtrl', function($scope, $state, $ionicLoading, RedKia) {
  $ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });
   $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
   // console.log($scope.currentUser.nombre);
    if( window.plugins && window.plugins.Hipmob ) {
    var hipmob_app_id = 'aef17ad0060349c89198ab98c71b3e03';
    var Hipmob = window.plugins.Hipmob;

    Hipmob.openChat(hipmob_app_id, {
    'title': 'Chat clubk',
    'user': $scope.currentUser.id,
    'name': $scope.currentUser.nombre,
    'email': 'femi@hipmob.com',
    'context': 'Chat club-k',
    'tab':{ 'background-color': '#222222', 'color': '#FFFFFF', 'font-size': '12px', 'font-weight': 'bold' },
    // 'location': 'At home'
    'input':'¿como puedo ayudarte?',
    });

    } 
    else {
      alert('El servicio no esta listo.');
    }
  $ionicLoading.hide();
})

.controller('RedKiaCtrl', function($scope, $state, $ionicLoading, RedKia) {
 
  $scope.dealer_redkia =  { id_Concesionario : "", "nombre" : "Select" };
  $scope.department_redkia = { id : "", "nombre" : "Select" };

  $scope.map = {center: {latitude: 4.624335, longitude: -74.063644 }, zoom: 8 };
  $scope.locations = [];

  $scope.getLocation = function(city, department, dealer) {
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    if(city == undefined)
        city = "";

    if(department == undefined)
        department = "";

    if(dealer == undefined)
        dealer = "";

    RedKia.getLocation(city, department, dealer, function(data) {
      var locations = [];

      angular.forEach(data.data, function(value, key) {
        var marker = {};

        marker.coords = {latitude: value.latitud.trim(), longitude: value.longitud.trim()},
        marker.id = value.id;
        marker.point_id = value.id;
        marker.descriptionUser = value.nombreJefe;
        marker.email = value.correo;
        marker.phone = value.telefono;
        marker.timings = value.horariosEntreSemana;
        marker.timings2 = value.horarioSabado;
        marker.service = value.horarioDomingoFestivo;
        marker.latitude = value.latitud.trim();
        marker.longitude = value.longitud.trim();
        marker.show = false;
        marker.heading = value.nombreTaller;
         marker.direction = value.direccion;
        marker.onClick = function() {
          marker.show = true;
        };

        marker["id"] = key;  
        locations.push(marker);
      });

      $scope.locations = locations;
    });
    
    $ionicLoading.hide();
    return;
  };

  RedKia.getDealer(function(data) {
    $scope.dealer_redkia = data.data;
  });

  RedKia.getDepartment(function(data) {
    $scope.department_redkia = data;
  });

  $scope.getLocation("","","");

})

.controller("UserCtrl", function($scope, $state, $ionicModal, $ionicLoading, $timeout, $ionicPlatform, User) {

  var jsonArr = [];
  var d = new Date();
  var n = d.getFullYear()+1;
  for (var i = 0; i < 20; i++) {
    jsonArr.push({
        anio: n-i
    });
  }
  $scope.empleados = jsonArr;

  var uuid="";
  if(window.localStorage.getItem('user') != null || window.localStorage.getItem('user') != undefined)
  {
    $state.go('app.benefit');
    return;
  }

  $scope.loginData = {};
  $scope.user = {};
  $scope.places = {};

  User.getBackground(function(image){
    // console.log(image);
    $scope.backgroundImage = image;
  });
  //Login Modal
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  //Activate Modal
  $ionicModal.fromTemplateUrl('templates/activate.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.activateModal = modal;
  });

  //Register user Modal
  $ionicModal.fromTemplateUrl('templates/register.html', {

    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  //Place modal
  $ionicModal.fromTemplateUrl('templates/select_place.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.placeModal = modal;
  });

  //terms modal
  $ionicModal.fromTemplateUrl('templates/terms.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.terms = modal;
  });
  $scope.closeterms = function() {
    $scope.terms.hide();
  };

  $scope.terms = function() {
    $scope.terms.show();
  };
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  $scope.login = function() {
    $scope.loginModal.show();
  };

  $scope.closeActivate = function() {
    $scope.loginModal.hide();
    $scope.activateModal.hide();
  };

  $scope.closeSelectPlace = function() {
    $scope.placeModal.hide();
  };

  $scope.activate = function() {
    $scope.activateModal.show();
  };

  $scope.register = function() {
    $scope.registerModal.show();
  };
   $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };

  $scope.doActivate = function(user) {

    console.log(user);

    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    User.activate(user.tarjeta, user.cedula, user.correo, user.contrasena, user.contrasena2, function(data) {
      if(data.success == false)
      {
        $ionicLoading.hide();
        return $scope.errorMessage2 = data.message;
      }

      $scope.activateModal.hide();
      $ionicLoading.hide();
      alert(data.message);
    });

  }
  $scope.doRegister = function(user) {

    console.log(user);
    var data=user.category_id;
    var text = "";
    var x;

    for (x in data) {
        text += x +',';
    }
    var categoria=text;

    text = "";
    data=user.temas_favorito;
    for (x in data) {
        text += x +',';
    }
  var temas=text;

    text = "";
    data=user.compras_hogar;
    for (x in data) {
        text += x +',';
    }
    compras=text;

    text = "";
    data=user.medio_info;
    for (x in data) {
        text += x +',';
    }
    var medioi=text;

    text = "";
    data=user.medio_conocido_k;
    for (x in data) {
        text += x +',';
    }
    var conocido_k=text;

    // console.log(text);
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    User.registerUser(user.nombre,user.apellido,user.documento,user.tipo_documento,user.fecha_nacimiento,user.correo, user.estado_civil, user.genero, user.ocupacion, user.departamento,user.ciudad, user.direccion,user.barrio, user.estrato, user.celular, categoria, user.temas_favorito, compras, medioi, conocido_k,user.recibir_info,user.terminos,user.estado_vehiculo,user.modelo, function(data) {
      if(data.success == false)
      {

        $ionicLoading.hide();
        return $scope.errorMessage2 = data.message;
        // alert(data.message);
        // mystring.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      }

      $scope.activateModal.hide();
      $ionicLoading.hide();
      $scope.registerModal.hide();
      alert(data.message);
    });

  }


  $ionicPlatform.ready(function() {

    var device = ionic.Platform.device();
    uuid = device.uuid;
    localStorage.setItem("uuid", uuid);
    if (!uuid) {uuid="";};
          $scope.doLogin = function(user) {

            if(!(user.username && user.password)) 
              return $scope.errorMessage = 'Ingrese correo y contraseña';
           
            $ionicLoading.show({
              template: '<i class="icon ion-ios7-reloading"></i>'
            });

            User.login(user.username, user.password,uuid, function(data) {
              if(data.success == false)
              {
                $ionicLoading.hide();
                return $scope.errorMessage = data.message;
              }

              $scope.loginModal.hide();

              if(data.data.placa.length > 1)
              {
                $scope.places = data.data.placa;
                console.log($scope.places);
                $scope.placeModal.show();
                $ionicLoading.hide();
              }

              window.localStorage.setItem("user", JSON.stringify(data.data));
              if(data.data.placa.length == 1)
              {
                window.localStorage.setItem("user_place", data.data.placa[0]);
                $state.go('app.benefit');
              }
            });
          },

          $scope.doSelectPlace = function(user) {
            if(!(user.place)) 
              return $scope.errorMessage = 'Seleccione una placa.';
           
            $ionicLoading.show({
              template: '<i class="icon ion-ios7-reloading"></i>'
            });

            $scope.placeModal.hide();
            window.localStorage.setItem("user_place", user.place);
            $state.go('app.benefit');
          }
   });
})

.controller('BenefitCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, Category) {

  $scope.category_id =  { id :$stateParams.id, "nombre" : "Select" };
  $scope.city = { id_Ciudad : "", "nombre" : "Select" };

  $scope.palce = window.localStorage.getItem('user_place');
  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));

  $scope.getPlaces = function(category_id, city) {
    // console.log(category_id);
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    Category.getPlaces($scope.palce, category_id, city, function(data) {
      // console.log();
      $scope.allies = data.data;
      $ionicLoading.hide();
    }); 
    
    return;
  };

  $scope.getPlaces($stateParams.id, "");
})

.controller('AlliesCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, Category) {

  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
  $scope.benefitID = $stateParams.id;

  $scope.getPromo = function(city_id) {
    
    $ionicLoading.show({
      template: '<i class="icon ion-ios7-reloading"></i>'
    });

    Category.getPromo($scope.currentUser.id, $stateParams.id, $scope.currentUser.perfil[0], window.localStorage.getItem('user_place'), city_id, function(data) {
      $scope.allies = data.data;
      console.log($scope.allies);
      $ionicLoading.hide();
    });

    return;
  }

  $scope.getPromo("");

})

.controller('MiscCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, Misc) {

  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
 
  $ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });

  $scope.doSuggest = function(data) {
    Misc.postSuggestion(data.name, data.email, data.subject, data.message, function(response) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
      });

      $scope.successMessage = response.message;

      $ionicLoading.hide();    
    });
  };

  $ionicLoading.hide();

})

.controller('ProfileCtrl', function($scope, $ionicActionSheet, $stateParams, $ionicModal, $ionicLoading, User, $http) {
    var jsonArr = [];
  var d = new Date();
  var n = d.getFullYear()+1;
  for (var i = 0; i < 20; i++) {
    jsonArr.push({
        anio: n-i
    });
  }
  $scope.empleados = jsonArr;

  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
  console.log($scope.currentUser);
  /*$ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });

  $ionicLoading.hide();*/

  User.editProfile($scope.currentUser.id,function(data) {
      $scope.editp = data.data;
       console.log("sd");
      console.log($scope.editp);
      $scope.user = {
          nombre:$scope.editp.nombre,
          apellido:$scope.editp.apellido,
          documento:$scope.editp.documento,
          tipo_documento:$scope.editp.tipo_documento,
          fecha_nacimiento:$scope.editp.fecha_nacimiento,

          correo:$scope.editp.correo,
          estado_civil:$scope.editp.estado_civil,
          genero:$scope.editp.genero,
          ocupacion:$scope.editp.ocupacion,
          departamento:$scope.editp.departamento,

          ciudad:$scope.editp.ciudad,
          telfono_casa:$scope.editp.telfono_casa,
          barrio:$scope.editp.barrio,
          direccion:$scope.editp.direccion,
          estrato:$scope.editp.estrato,
          celular:$scope.editp.celular,

          terminos:$scope.editp.terminos,
          medio_conocido_k:$scope.editp.medio_conocido_k,
          medio_info:$scope.editp.medio_info,
          temas_favorito:$scope.editp.temas_favorito,
          category_id:$scope.editp.category_id,

          recibir_info:$scope.editp.recibir_info,
          estado_vehiculo:$scope.editp.estado_vehiculo,
          modelo:$scope.editp.modelo,
          
          
          
          compras_hogar:$scope.editp.compras_hogar,
          terminos:$scope.editp.terminos,
      }

      console.log($scope.user.category_id.split(","));
      $scope.categorias = [
       { name: 'Viajar', valor:'1',    selected: false },
       { name: 'Moda', valor:'2',    selected: false },
       { name: 'Tecnología', valor:'3',    selected: true },
       { name: 'Entretenimiento', valor:'4',    selected: false },
       { name: 'Salud y bienestar', valor:'5',    selected: true },
       { name: 'Autos', valor:'6',    selected: true },
       { name: 'Gastronomía', valor:'7',    selected: true }
      ];
      // $scope.nombre = $scope.editp.nombre;
  });

  $scope.doEditProfile= function(user) {
      // console.log(user.nombre);
  }

  $scope.showActionsheet = function() {
    $ionicActionSheet.show({
      titleText: 'Change Profile Picture',
        buttons: [
          { text: 'Take a Picture' },
          { text: 'Upload from Library' },
        ],
        cancelText: 'Cancel',
        cancel: function() {
          //console.log('CANCELLED');
        },
        buttonClicked: function(index) 
        {
          if(index == 0)
          {
            navigator.camera.getPicture(gotPic, failHandler, {
              quality:50, 
              destinationType:navigator.camera.DestinationType.DATA_URL,
              sourceType:navigator.camera.PictureSourceType.CAMERA
            });
          }
          else if(index == 1)
          {
            navigator.camera.getPicture(gotPic, failHandler, {
              quality:50, 
              destinationType:navigator.camera.DestinationType.DATA_URL,
              sourceType:navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
          }

          return true;
        }
    });
  }

  function gotPic(imageData) 
  {
    console.log("in got pic");
    var data = 'data:image/jpeg;base64,' + imageData;
    User.editPicture($scope.currentUser.id, data, function(data){
      console.log("upload done");
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-reloading"></i>'
      });

      console.log(JSON.stringify(data));
      $scope.currentUser.foto = data.data[0].url;

      $ionicLoading.hide();    
    });
  }

  function failHandler(e)
  {
    alert(e);
  }
  
})

.controller('ReminderCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, User) {
  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
   User.getReminders(function(data) {
    $scope.remind = data.data;
    console.log($scope.remind);
  });
})

.controller('BenefitMapCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, Category) {

  $scope.map = {center: {latitude: 4.624335, longitude: -74.063644 }, zoom: 8, bounds: {} };
  $scope.locations = [];

  $ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });

  //Bonus modal
  $ionicModal.fromTemplateUrl('templates/bonus.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.pointsModal = modal;
  });

  Category.getLocation($stateParams.position_id, $stateParams.id, function(data) {
    $scope.locationData = data.data;
    $scope.point_id_city=0;
    $scope.point_id=1;
    var locations = [];
    angular.forEach(data.data, function(value, key) {

      var marker = {};
      marker.coords = {latitude: value.longitud, longitude: value.latitud};
      marker.id = value.id_Punto_Venta;
      marker.point_id = value.id_Punto_Venta; 
      marker.point_id_city = value.id_Ciudad; 
      marker.options = { title: "Southerners" };
      marker.latitude = value.longitud;
      marker.longitude = value.latitud;
      marker.show = false;
      marker.heading = value.nombre;
      marker.address = value.direccion;

      marker.onClick = function() {
        marker.show = true;
        console.log();
        $scope.point_id = $scope.locationData[marker.id].id_Punto_Venta;
        $scope.point_id_city = $scope.locationData[marker.id].id_Ciudad;
      };

      marker["id"] = key;
      locations.push(marker);
    });

    $scope.closeCode = function() {
      $scope.pointsModal.hide();
    };

    $scope.confirmCode = function() {
      if(confirm("¿Esta seguro de redimir este beneficio?"))
      {
        // console.log("aqui"+$scope.point_id);
        if (!$scope.point_id) {$scope.point_id=1;};

        if ($scope.point_id_city==undefined) {$scope.point_id=0;};
        console.log("punto"+$scope.point_id);
        console.log("city"+$scope.point_id_city);
        Category.getCode(window.localStorage.getItem('user_place'), $scope.point_id_city, $stateParams.position_id, $scope.point_id, $scope.currentUser.id, function(data) {
          $scope.code = data.data[0];
          $scope.pointsModal.show();
        });
      }
    };

    var imagePath = "";
    var folderName = "Kia App";
    var fileName = "none";

    $scope.downloadImage = function() {
      Category.getBonusImage($scope.code.id_bonus ,function(imageUrl){
        fileName = $scope.code.id_bonus + "_bonus";
        imagePath = imageUrl;
        console.log("casper image path" + imagePath);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, fail);
      });
    };

    function onRequestFileSystemSuccess(fileSystem) 
    {
      console.log('onRequestFileSystemSuccess');
      var download_link = encodeURI(imagePath);
      ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

      var directoryEntry = fileSystem.root; // to get root path of directory
      directoryEntry.getDirectory(folderName, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
      
      var rootdir = fileSystem.root;
      var fp = rootdir.fullPath; // Returns Fulpath of local directory

      //fp = fp + "/" + folderName + "/" + fileName + "." + ext; // fullpath and name of the file which we want to give
      fp = "file:///sdcard/" + fileName + "." + ext;
      // download function call
      filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
      // Directory created successfuly
    }

    function onDirectoryFail(error) {
      //Error while creating directory
      alert("Unable to create new directory: " + error.code);
    }

    function filetransfer(download_link, fp) 
    {
      console.log('filetransfer: ' + fp);
      var fileTransfer = new FileTransfer();
      // File download function with URL and local path
      fileTransfer.download(download_link, fp,
        function (entry) {
          alert("download complete: " + entry.fullPath);
        },
        function (error) {
          console.log(JSON.stringify(error));
          alert("download error");
        }
      );
    }

    function fail(evt) {
      console.log("in file error");
      console.log(JSON.stringify(evt.target.error.code));
    }


    $ionicLoading.hide();

    if(locations == null)
      return;
    // console.log(locations);
    $scope.show_link ="";
    $scope.locations = locations;
    $scope.heading = $scope.locationData[0].nombre;
    $scope.address = $scope.locationData[0].direccion;
    $scope.phone = $scope.locationData[0].telefono;
    $scope.email = $scope.locationData[0].correo;
    $scope.point_id = $scope.locationData[0].id_Punto_Venta;
    $scope.background = $scope.locationData[0].url;
    $scope.tittle = $scope.locationData[0].titulo;
    $scope.desc = $scope.locationData[0].descripcion;
    $scope.benefit = $scope.locationData[0].beneficio;
    $scope.colortext = $scope.locationData[0].colortexto;
    $scope.idcity = $scope.locationData[0].id_Ciudad;
    $scope.fecha = $scope.locationData[0].fecha;
    $scope.conditions = $scope.locationData[0].condiciones;
    $scope.ocultar_mapa ="";
    $scope.instructions = $scope.locationData[0].instrucciones;
    $scope.virtual ="hiden_virtual";

    if ($scope.idcity=="" || $scope.idcity==0) {
         $scope.ocultar_mapa ="hiden_div";
         $scope.virtual ="show_virtual";
    };
    console.log("sds"+$scope.address);
    if ($scope.instructions!="") {
         $scope.show_link ="instrucciones";
         $scope.virtual ="hiden_virtual";
    };
  });
})

.controller('BenefitCodeCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, Category) {

  $scope.currentUser = JSON.parse(window.localStorage.getItem('user'));
 
  $ionicLoading.show({
    template: '<i class="icon ion-ios7-reloading"></i>'
  });

  $scope.benefitID = $stateParams.id;
  Category.getCode(window.localStorage.getItem('user_place'), 0, $stateParams.promo_id, $stateParams.point_id, $scope.currentUser.id, function(data) {
    $scope.code = data.data;
    console.log($scope.code);
  });
});
