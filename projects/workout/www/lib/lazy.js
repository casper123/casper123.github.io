/*global angular*/

(function() {
    'use strict';

    angular.module('rn-lazy', []).
    /*directive('rnLazyBackground', ['$document', '$parse', function($document, $parse) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                function setLoading(elm) {
                    if (loader) {
                        elm.html('');
                        elm.append(loader);
                        elm.css({
                            'background-image': null
                        });
                    }
                }

                console.log("shahpar iElement: " + JSON.stringify(iElement));
                console.log("shahpar attrs: " + JSON.stringify(iAttrs));
                var loader = null;
                if (angular.isDefined(iAttrs.rnLazyLoader)) {
                    loader = angular.element($document[0].querySelector(iAttrs.rnLazyLoader)).clone();
                }
                var bgModel = $parse(iAttrs.rnLazyBackground);
                scope.$watch(bgModel, function(newValue) {
                    setLoading(iElement);
                    var src = bgModel(scope);
                    var img = $document[0].createElement('img');
                    img.onload = function() {
                        if (loader) {
                            loader.remove();
                        }
                        if (angular.isDefined(iAttrs.rnLazyLoadingClass)) {
                            iElement.removeClass(iAttrs.rnLazyLoadingClass);
                        }
                        if (angular.isDefined(iAttrs.rnLazyLoadedClass)) {
                            iElement.addClass(iAttrs.rnLazyLoadedClass);
                        }
                        iElement.css({
                            'background-image': 'url(' + this.src + ')'
                        });
                    };
                    img.onerror= function() {
                        //console.log('error');
                    };
                    img.src = src;
                });
            }
        };
    }]);*/

    directive('rnSrc', ['$document', '$parse', function($document, $parse) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                //console.log("shahpar iElement: " + JSON.stringify(iElement));
                //console.log("shahpar attrs: " + JSON.stringify(iAttrs));
                //console.log("shahpar rnSrc: " + iAttrs.rnSrc);
                var bgModel = $parse(iAttrs.rnSrc);
                scope.$watch(bgModel, function(newValue) {
                    //setLoading(iElement);
                    var src = bgModel(scope);                 
                    var img = $document[0].createElement('img');
                    img.onload = function() 
                    {
                        //console.log("shahpar this src: " + this.src);
                        //iElement.src(this.src);
                        iElement.attr("src", this.src);
                        /*iElement.css({
                            'background-image': 'url(' + this.src + ')'
                        });*/
                    };
                    img.onerror= function() {
                        //console.log('error');
                    };
                    img.src = src;
                });
            }
        };
    }]);
})();
