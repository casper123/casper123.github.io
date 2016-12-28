appinioService.factory('Tracker', function () {
  return {
    init: function (){
      // TODO: Dev mode umstellen
      try {
        var adjustConfig = new AdjustConfig("3k39xcujnwzk", AdjustConfig.EnvironmentSandbox);
        Adjust.create(adjustConfig);
        Localytics.autoIntegrate();
        Localytics.openSession();
      } catch (err) {}
    },
    trackEvent: function(a, b){
      try{
        Localytics.tagEvent(a, b, 0);
      } catch(err) {}
    },
    trackScreen: function(name) {
      try {
        Localytics.tagScreen(name);
        Localytics.tagEvent('screen' + name, null, 0);
      } catch (err) {}
    }
  };
});
