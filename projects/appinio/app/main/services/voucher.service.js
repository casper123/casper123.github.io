appinioService.service('Voucher', function($http, appinioConfig){
    return{
      getVoucherList: function(callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/voucher');
        responsePromise.success(function(data,status,headers,config){
          callbackFunc(data);
        });
      },
      getUsersVoucherList: function(callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/orders');
        responsePromise.success(function(data,status,headers,config){
          callbackFunc(data);
        });
      },
      buy: function(id, callbackFunc, callbackFuncErr) {
        var responsePromise = $http.post(appinioConfig.baseUrl + 'user/voucher', {itemId:id});
        responsePromise.success(function(data,status,headers,config){
          callbackFunc(data);
        }).error(function(data){
          callbackFuncErr(data);
        });
      },
      getVoucherDetail: function(voucherId, callbackFunc){
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/voucher/'+voucherId+'');
        responsePromise.success(function(data,status,headers,config){
          callbackFunc(data);
        });
      }
    }
  });
