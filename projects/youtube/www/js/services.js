/* .service('googleService', ['$http', '$q', function ($http, $q) {

    var deferred = $q.defer();
    this.googleApiClientReady = function () {
        gapi.client.setApiKey('AIzaSyBLZzOnpbqkcg3qkNm9HNl5AZBNDhYbhmc');
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.playlistItems.list({
                part: 'snippet',
				q : 'dog',
                maxResults: 8
            });
            request.execute(function(response) {
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };
}])
 */
angular.module('googleService').service('googleService', [googleService]);
function googleService() {
var items = [{
    id: 1,
    label: 'Balle Balle, Service Chal Payi'
}, {
    id: 2,
    label: 'Item 1'
}];
this.list = function() {
    return items;
};
this.add = function(item) {
    items.push(item);
};
}