novitrixApp
.factory('Product', function($http, Configuration, CurrentUser){
	var baseUrl = Configuration.getBaseUrl();
	return{
		productlist : function(category_Id, callbackFunc){
	      var responsePromise = $http.get(baseUrl + "/itemList&id="+category_Id);
	      responsePromise.success(function(data,status,headers,config){
	        callbackFunc(data);
	      });
    	},

    	itemView : function(item_id, callbackFunc){
	      var responsePromise = $http.get(baseUrl + "/itemView&id="+item_id);
	      responsePromise.success(function(data,status,headers,config){
	        callbackFunc(data);
	      });
    	},

    	itemBuy : function(postData, callbackFunc){
	        $http({
	          method  : 'POST',
	          url     : baseUrl + '/BuyProduct',
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
		},
		itemDelete : function(image_id, callbackFunc){
			$http({
	          method  : 'POST',
	          url     : baseUrl + '/DeleteProductImg&item_image_id='+image_id,
	          data    : image_id,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
		},
		
		featuredItem: function(callbackFunc) {
			var responsePromise = $http.get(baseUrl + "/FeaturedList");
		    responsePromise.success(function(data,status,headers,config){
		    	callbackFunc(data);
		    });
		},
		// Trading Goes here //

		itemTrade : function(postData, callbackFunc){
			$http({
	          method  : 'POST',
	          url     : baseUrl + '/Trade',
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
		},
		itemTradeList: function(user_id, callbackFunc) {
			var responsePromise = $http.get(baseUrl + "/CheckTrade&to="+ user_id +"+&from="+ user_id);
		    responsePromise.success(function(data,status,headers,config){
		    	callbackFunc(data);
		    });
		},
		itemTradeApproval : function(postData, callbackFunc){
			$http({
	          method  : 'POST',
	          url     : baseUrl + '/TradeRequest&id='+ postData.trade_id +'&status='+ postData.status,
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
		},
		itemTradeDetails: function(user_id, trade_id,callbackFunc) {
			var responsePromise = $http.get(baseUrl + "/tradeDetails&id="+ trade_id +"+&user_id="+ user_id);
		    responsePromise.success(function(data,status,headers,config){
		    	callbackFunc(data);
		    });
		},
		updateNumber : function(id, postData, callbackFunc){
			$http({
	          method  : 'POST',
	          url     : baseUrl + '/GetUpdateCode&id='+id  ,
	          data    : postData,  // pass in data as strings
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
	        })
	        .success(function(data) {
	          callbackFunc(data);
	        })
	        .error(function() {
	          "in error";
	        });
		}

	}
});