angular.module('starter.services', [])

.factory('User', function($http) {
  	return {
	    login: function(username, password,uuid, callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getLogin_w?usuario=" + username + "&contrasena=" + password +"&uuid=" + uuid );

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },

	    activate: function(card, id, email, password, confirmPassword, callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getActivar?tarjeta=" + card + "&cedula=" + id + "&correo=" + email + "&contrasena=" + password + "&contrasena2=" + confirmPassword );

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },

	    // registerUser: function(device_id) {
	    //   var responsePromise = $http.get("http://wahabkotwal.net/projects/bawarchi/index.php/webservice/save_device/" + device_id);
	    // }

	    registerUser: function(name, last_name, id, t_id, date_born,email,marital_status,gender,occupation,dep,city,dir,neighborhood ,est,mobil_phone,category_id,hoobie,shop,medio_info,medio_k,info,terms,car,model, callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getRegistro?nombre=" + name + "&apellido=" + last_name + "&documento=" + id + "&tipo_documento=" + t_id + "&fecha_nacimiento=" + date_born + "&correo=" + email + "&estado_civil=" + marital_status + "&genero=" + gender + "&ocupacion=" + occupation + "&departamento=" + dep + "&ciudad=" + city + "&direccion=" + dir + "&barrio=" + neighborhood + "&estrato=" + est + "&celular=" + mobil_phone + "&category_id=" + category_id + "&temas_favorito=" + hoobie + "&compras_hogar=" + shop + "&medio_info=" + medio_info + "&medio_conocido_k=" + medio_k + "&recibir_info=" + info + "&terminos=" + terms + "&estado_vehiculo=" + car + "&modelo=" +model);

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },
	    editProfile: function(id,callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getEdit_profile?id_user="+id);

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },
	    editPicture: function(id, image, callbackFunc) {
	    	var requestData = {"id_user" : id, "image" : image};

	    	$http({
		        method  : 'POST',
		        url     : 'http://clubk.com.co/server/Change_picture',
		        data    : requestData,  // pass in data as strings
		        headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
		    })
		    .success(function(data) {
		        callbackFunc(data);
		    })
		    .error(function() {
		        "in error";
		    });
	    },
	    getBackground: function(callbackFunc){
	    	var responsePromise = $http.get("http://clubk.com.co/server/getBackground");

		    responsePromise.success(function(data, status, headers, config) {
		    	callbackFunc(data.data[0].image);
		    });

		    responsePromise.error(function(data, status, headers, config) {
		    	console.log("in fail");
		    });
	    },
	    getReminders: function(callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/Notificaciones_push");

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },

  	}
})

.factory('RedKia', function($http) {
  	return {
	    getLocation: function(city, department, dealer, callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getRed_kia?ciudad="+ city +"&departamento="+ department +"&dealer=" + dealer);

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },

	    getDealer: function(callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getDealer");

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },

	    getDepartment: function(callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getDepartamento");

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },
	     
    }
})

.factory('Category', function($http) {
  	return {
	    getCategory: function(callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getCategorias");

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },

	    getPlaces: function(place_id, category_id, city, callbackFunc){
	    	var responsePromise = $http.get("http://clubk.com.co/server/getAliados?placa=" + place_id + "&id_categoria=" + category_id + "&ciudad=" + city);

		    responsePromise.success(function(data, status, headers, config) {
		    	callbackFunc(data);
		    });

		    responsePromise.error(function(data, status, headers, config) {
		    	console.log("in fail");
		    });
	    },

	    getPromo: function(user_id, allies_id, profile_type, place_id, city_id, callbackFunc){
	    	var responsePromise = $http.get("http://clubk.com.co/server/getPromociones?id_usuario=" + user_id + "&id_Aliado=" + allies_id + "&perfil=" + profile_type + "&placa=" + place_id + "&ciudad=" + city_id);

		    responsePromise.success(function(data, status, headers, config) {
		    	callbackFunc(data);
		    });

		    responsePromise.error(function(data, status, headers, config) {
		    	console.log("in fail");
		    });
	    },

	    getLocation: function( benefit_id,ally_id, callbackFunc){
	    	var responsePromise = $http.get("http://clubk.com.co/server/getPunto?id_Aliado=" + ally_id + "&id_Benefit=" + benefit_id);

		    responsePromise.success(function(data, status, headers, config) {
		    	callbackFunc(data);
		    });

		    responsePromise.error(function(data, status, headers, config) {
		    	console.log("in fail");
		    });
	    },

	    getCode: function(place_id, city_id, promo_id, sale_point_id, user_id, callbackFunc) {
	    
	    	var responsePromise = $http.get("http://clubk.com.co/server/getRedencion?placa=" + place_id + "&id_Ciudad=" + city_id + "&id_Promociones=" + promo_id + "&id_Punto_Venta=" + sale_point_id + "&id_Usuario=" + user_id);

		    responsePromise.success(function(data, status, headers, config) {
		    	callbackFunc(data);
		    });

		    responsePromise.error(function(data, status, headers, config) {
		    	console.log("in fail");
		    });
	    },

	    getBonusImage: function(bonus_id, callbackFunc){
	    	var responsePromise = $http.get("http://clubk.com.co/server/Image_bonus?id_bonus=" + bonus_id);

		    responsePromise.success(function(data, status, headers, config) {
		    	callbackFunc(data.data[0].url);
		    });

		    responsePromise.error(function(data, status, headers, config) {
		    	console.log("in fail");
		    });
	    },

	    getCity: function(callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getCiudades?menu=1");

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    },
    }
})


.factory('Misc', function($http) {
  	return {
	    postSuggestion: function(name, email, subject, message, callbackFunc) {
	      var responsePromise = $http.get("http://clubk.com.co/server/getbuzon?name=" + name + "&email=" + email + "&subject=" + subject + "&message=" + message);

	      responsePromise.success(function(data, status, headers, config) {
	        callbackFunc(data);
	      });

	      responsePromise.error(function(data, status, headers, config) {
	        console.log("in fail");
	      });
	    }
    }
});


