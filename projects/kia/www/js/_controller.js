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

  $scope.map = {center: {latitude: 4.624335, longitude: -74.063644 }, zoom: 6 };
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

.controller('ProfileCtrl', function($scope, $stateParams, $ionicModal, $ionicLoading, User, $http) {
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
      };

      $scope.selectedCategories = [];
      $scope.selectedTeams = [];
      $scope.selecteedCompras = [];
      $scope.selecteedMedia = [];
      $scope.selecteedMedio = [];

      $scope.categorias = [
       { name: 'Viajar', valor:'1', selected: false },
       { name: 'Moda', valor:'2',    selected: false },
       { name: 'Tecnología', valor:'3', selected: true },
       { name: 'Entretenimiento', valor:'4',    selected: false },
       { name: 'Salud y bienestar', valor:'5',    selected: true },
       { name: 'Autos', valor:'6',    selected: true },
       { name: 'Gastronomía', valor:'7',    selected: true }
      ];
  });

    $scope.doEditProfile= function(user) {
      console.log($scope.selectedCategories);
      console.log($scope.selectedTeams);
      console.log($scope.selecteedCompras);
      console.log($scope.selecteedMedia);
      console.log($scope.selecteedMedio);
    }
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
    $scope.fecha = $scope.locationData[0].fecha;
    $scope.conditions = $scope.locationData[0].condiciones;
    $scope.ocultar_mapa ="";
    $scope.instructions = $scope.locationData[0].instrucciones;
    $scope.virtual ="hiden_virtual";
    if ($scope.heading=="") {
         $scope.ocultar_mapa ="hiden_div";
         $scope.virtual ="show_virtual";
    };
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
