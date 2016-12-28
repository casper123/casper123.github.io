appinioService
  .service('User', function ($http, $rootScope, currentUser, appinioConfig, $cordovaFacebook, $cordovaDevice, authService, $cordovaPush, Badges, Tracker) {
    return {
      register: function (postData, callbackFunc, callbackErrorFunc) {
        postData.appstoreVersion = $rootScope.appstoreVersion;
        var device = ionic.Platform.device();
        //TODO random
        if (device && device.platform) {
          postData.device = {
            platform: device.platform,
            version: device.version,
            uuid: device.uuid + Math.random(),
            model: device.model,
            appstoreVersion: $rootScope.appstoreVersion
          };
        }else{
          postData.device = {
            platform: 'iOS',
            version: '1.0',
            uuid: 'ABC' + Math.random(),
            model: 'iphone',
            appstoreVersion: $rootScope.appstoreVersion
          };
        }
        if (navigator) {
/*          try{
            $cordovaGlobalization.getLocaleName().then(function(result) {
              //alert(result.value.substring(0, 2));
              //alert(result.value.substring(3, 5));
            });
          }catch(err){}*/
          var lang = navigator.language || navigator.userLanguage;
          if (lang) {
            postData.locale = lang.replace("-", "_").split("_")[0];
            postData.locale = 'de-DE';
            postData.countryCode = lang.replace("-", "_").split("_")[0];
            postData.countryCode = 'DEU';
          }
        }
        $http({
          method: 'POST',
          url: appinioConfig.baseUrl + 'user',
          data: postData
        })
          .success(function (data) {
            callbackFunc(data);
          })
          .error(function (data) {
            callbackErrorFunc(data)
          });
      },
      fbRegister: function (postData, callbackFunc, callbackErrorFunc) {
        postData.appstoreVersion = $rootScope.appstoreVersion;
        var device = ionic.Platform.device();
        //TODO random
        if (device && device.platform) {
          postData.device = {
            platform: device.platform,
            version: device.version,
            uuid: device.uuid + Math.random(),
            model: device.model,
            appstoreVersion: $rootScope.appstoreVersion
          };
        }else{
          postData.device = {
            platform: 'iOS',
            version: '1.0',
            uuid: 'ABC' + Math.random(),
            model: 'iphone',
            appstoreVersion: $rootScope.appstoreVersion
          };
        }
        if (navigator) {
/*          $cordovaGlobalization.getLocaleName().then(function(result) {
            //alert(result.value.substring(0, 2));
            //alert(result.value.substring(3, 5));
          });*/
          var lang = navigator.language || navigator.userLanguage;
          if (lang) {
            postData.locale = lang.replace("-", "_").split("_")[0];
            postData.locale = 'de-DE';
            postData.countryCode = lang.replace("-", "_").split("_")[0];
            postData.countryCode = 'DEU';
          }
        }
        $http.post(appinioConfig.baseUrl + 'user/facebook/create', postData).success(function (data) {
            callbackFunc(data);
          })
          .error(function (data) {
            callbackErrorFunc(data)
          });
      },
      confirmLogin: function(data){
        authService.loginConfirmed(data, function (config) {
          return config;
        });
      },
      resume: function () {
        $http.get(appinioConfig.baseUrl + 'user/resume')
          .success(function () {
            //console.log('resume success');
          })
          .error(function () {
            //console.log('resume error');
          });
      },
      login: function (postData, callbackFunc, callbackFuncErr) {
        $http.post(appinioConfig.baseUrl + 'user/login', postData, {ignoreAuthModule: true})
          .success(function (data) {
            $http.get(appinioConfig.baseUrl + 'user/resume');
            authService.loginConfirmed(data, function (config) {
              return config;
            });
            callbackFunc(data);
          })
          .error(function (data) {
            callbackFuncErr(data);
          });
      },
      logout: function (callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + "user/logout");
        responsePromise.success(function (data, status, headers, config) {
          callbackFunc(data);
          currentUser.removeUser();

          if ($cordovaFacebook) {
            $cordovaFacebook.logout().then(function (success) {
            }, function (error) {
            });
            //TODO: ???
          }
        });
      },
      responseTooFast: function(){
        var responsePromise = $http.post(appinioConfig.baseUrl + 'user/fastResponse');
        responsePromise.success(function (data, status, headers, config) {});
      },
      details: function (callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + "user/me");
        responsePromise.success(function (data, status, headers, config) {
          currentUser.setUser(data.success);
          if(data.success &&  data.success.oldXp == null && data.success.level > 1){
            $rootScope.$broadcast('migrate', true);
          }
          callbackFunc(data);
          try{
            if(data.success.pushPermission || true){
              // TODO: das macht keinen sinn hier!!!!!
              var wantPush = false;
              for(var k in data.success.pushPermission){
                if(data.success.pushPermission[k] == true){
                  wantPush = true;
                  break;
                }
              }
              if (ionic.Platform.isIOS() == true && wantPush){
                var iosConfig = {
                  "badge": true,
                  "sound": true,
                  "alert": true
                };
                $cordovaPush.register(iosConfig);
              }
            }
          }catch(err){}
          try {
            var user = data.success;
            if (user && user.device) {
              var diff = false;
              var appVersion;
              if (user.device.appstoreVersion) {
                appVersion = user.device.appstoreVersion.generation + '.' + user.device.appstoreVersion.version +
                  '.' + user.device.appstoreVersion.patch;
                if (appVersion != $rootScope.appstoreVersion) {
                  diff = true;
                }
              }
              if (user.device.platform != $cordovaDevice.getPlatform()
                || user.device.version != $cordovaDevice.getVersion()
                || user.device.model != $cordovaDevice.getModel()) {

                diff = true;
              }
              if(diff){
                $http.put(appinioConfig.baseUrl + 'user/device', {device: {
                  model: $cordovaDevice.getModel(),
                  platform: $cordovaDevice.getPlatform(),
                  version:  $cordovaDevice.getVersion(),
                  appstoreVersion: $rootScope.appstoreVersion
                }}).success(function (data) {});
              }
            }
          } catch (err) {}
        });
      },
      update: function (postData, url, callbackFunc) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + url,
          data: postData
        })
          .success(function (data) {
            callbackFunc(data);
          })
          .error(function () {
            "in error";
          });
      },
      updateDeviceToken: function (token) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/deviceToken',
          data: {deviceToken: token}
        }).success(function (data) {
          $rootScope.loggedInUser.device.deviceToken = token;
        });
      },
      updatePush: function (type, value, callbackFunc) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/pushPermission',
          data: {type: type, state: value}
        }).success(function () {
          if($rootScope.loggedInUser.pushPermission && $rootScope.loggedInUser.pushPermission[type]){
            $rootScope.loggedInUser.pushPermission[type] = value;
          }
          if(callbackFunc){
            callbackFunc();
          }
        });
      },
      activateAllPermissions: function () {
        if($rootScope.loggedInUser && $rootScope.loggedInUser.pushPermission){
          var hadPush = false;
          for(var k in $rootScope.loggedInUser.pushPermission){
            if($rootScope.loggedInUser.pushPermission[k] == true){
              hadPush = true;
              break;
            }
          }
          if(!hadPush){
            for(var k in $rootScope.loggedInUser.pushPermission){
              if($rootScope.loggedInUser.pushPermission[k] != null){
                $rootScope.loggedInUser.pushPermission[k] = true;
                $http.put(appinioConfig.baseUrl + 'user/pushPermission', {
                  type: k,
                  state: true
                }).success(function(){});
              }
            }
          }
        }
      },
      updateColor: function (color, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/color',
          data: {color: color}
        })
          .success(function (data) {
            $rootScope.loggedInUser.color = color;
            currentUser.setUser($rootScope.loggedInUser);
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      updateAvatar: function (avatar, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/avatar',
          data: {avatar: avatar}
        })
          .success(function (data) {
            $rootScope.loggedInUser.avatar = avatar;
            currentUser.setUser($rootScope.loggedInUser);
            Badges.checkForBadges();
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      quickUpdate: function () {
        $http.get(appinioConfig.baseUrl + 'user/tick/')
          .success(function (data) {
            // TODO : ....
            if(true || $rootScope.loggedInUser && data.success.xp && data.success.xp > $rootScope.loggedInUser.xp){
              Badges.checkForBadges();
              $rootScope.checkForUpdates(data.success, true);
            }
          });
      },
      checkEasteregg: function (hash, cb) {
        $http({
          method: 'GET',
          url: appinioConfig.baseUrl + 'user/easteregg/'+hash
        })
          .success(function (data) {
            if(data.success){
              Badges.checkForBadges();
              if(cb){
                cb();
              }
            }
          });
      },
      updateNickname: function (nickname, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/nickname',
          data: {nickname: nickname}
        })
          .success(function (data) {
            Tracker.trackEvent("changeNickname");
            $rootScope.loggedInUser.nickname = nickname;
            currentUser.setUser($rootScope.loggedInUser);
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      updateUniqueName: function (name, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/uniqueName',
          data: {uniqueName: name}
        })
          .success(function (data) {
            $rootScope.loggedInUser.uniqueName = name;
            currentUser.setUser($rootScope.loggedInUser);
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      updateEmail: function (email, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/email',
          data: {email: email}
        })
          .success(function (data) {
            $rootScope.loggedInUser.email = email;
            currentUser.setUser($rootScope.loggedInUser);
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      updatePassword: function (password, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/password',
          data: {password: password}
        })
          .success(function (data) {
            $rootScope.loggedInUser.password = password;
            currentUser.setUser($rootScope.loggedInUser);
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      updateZipcode: function (zipcode, callbackFunc, callbackFuncErr) {
        $http({
          method: 'PUT',
          url: appinioConfig.baseUrl + 'user/zip',
          data: {zip: zipcode}
        })
          .success(function (data) {
            $rootScope.loggedInUser.zipcode = zipcode;
            currentUser.setUser($rootScope.loggedInUser);
            if (callbackFunc) {
              callbackFunc(data);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data);
            }
          });
      },
      addShare: function (callbackFunc) {
        $http({
          method: 'POST',
          url: appinioConfig.baseUrl + 'user/share'
        })
          .success(function (data) {
            if(data.success && callbackFunc) {
              callbackFunc(data.success);
            }
          });
      },
      migrateToFacebook: function (token, callbackFunc) {
        $http({
          method: 'POST',
          url: appinioConfig.baseUrl + 'user/facebook/migrate',
          data: {token: token}
        })
          .success(function () {
            if(callbackFunc){
              callbackFunc();
            }
          })
      },
      resendVerifyLink: function (callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/sendVerifyEmail');
        responsePromise.success(function (data, status, headers, config) {
          callbackFunc(data);
        });
      },
      getUserProfile: function (userId, callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + "user/profile/" + userId + "");
        responsePromise.success(function (data, status, headers, config) {
          callbackFunc(data);
        });
      },
      searchOtherUsers: function (nickname, callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + "user/search/" + nickname);
        responsePromise.success(function (data, status, headers, config) {
          if (data.success) {
            callbackFunc(data.success);
          }
        });
      },
      addUserRelation: function (id, callbackFunc) {
        $http({
          method: 'POST',
          url: appinioConfig.baseUrl + 'user/relation',
          data: {userId: id}
        })
          .success(function (data) {
            callbackFunc(data);
          })
          .error(function () {
            "in error";
          });
      },
      getUserRelations: function (callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/relation');
        responsePromise.success(function (data) {
          if (data.success) {
            callbackFunc(data.success);
          }
        });
      },
      deleteFriend: function (id, callbackFunc) {
        $http({
          method: 'DELETE',
          url: appinioConfig.baseUrl + 'user/relation/' + id,
        })
          .success(function (data) {
            callbackFunc(data);
          })
          .error(function () {
            "in error";
          });
      },
      acceptFriendRequest: function (id, callbackFunc) {
        $http({
          method: 'POST',
          url: appinioConfig.baseUrl + 'user/relation/approve',
          data: {relationId: id}  // pass in data as strings
        })
          .success(function (data) {
            callbackFunc(data);
          })
          .error(function () {
            "in error";
          });
      },
      declineFriendRequest: function (id, callbackFunc) {
        $http({
          method: 'POST',
          url: appinioConfig.baseUrl + 'user/relation/decline',
          data: {relationId: id}  // pass in data as strings
        })
          .success(function (data) {
            callbackFunc(data);
          })
          .error(function () {
            "in error";
          });
      },
      getUserPendingRelations: function (callbackFunc) {
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/relation/pending');
        responsePromise.success(function (data) {
          if (data.success) {
            callbackFunc(data.success);
          }
        });
      },
      getFacebookSuggestion: function (callbackFunc, callbackFuncErr) {
        var responsePromise = $http.get(appinioConfig.baseUrl + 'user/relation/facebook');
        responsePromise
          .success(function (data) {
            if (data.success) {
              callbackFunc(data.success);
            }
          })
          .error(function (data) {
            if (callbackFuncErr) {
              callbackFuncErr(data.error);
            }
          });
      },
      delete: function (callbackFunc) {
        $http({
          method: 'DELETE',
          url: appinioConfig.baseUrl + 'user'
        })
          .success(function (data) {
            if (data.success) {
              currentUser.removeUser();
              callbackFunc(data);
            }
          })
      }
    }
  });
