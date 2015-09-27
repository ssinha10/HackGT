'use strict';

/**
 * @ngdoc function
 * @name hackgtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hackgtApp
 */
angular.module('hackgtApp')
  .controller('MainCtrl', function ($scope, $rootScope, Yelp) {
    var self = this;

    $scope.$on('$includeContentLoaded', function() {
      self.initMap();
    });

    self.searchData = {
      location: {
        latitude: 33.776706,
        longitude: -84.395697
      },
      radius: 1000
    }

    Yelp.searchYelp(self.searchData, function(data){
      self.restaurants = data;
    });

    self.map;
    self.initMap = function() {
      self.map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: self.searchData.location.latitude,
          lng: self.searchData.location.longitude
        },
        zoom: 13
      });
      self.setMarkers(self.map);
    }

    self.restaurants = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    self.setMarkers = function(map) {
      var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
      };
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var labelIndex = 0;
      console.log(self.restaurants);
      for (var i = 0; i < self.restaurants.length; i++) {
        var restaurant = self.restaurants[i];
        var marker = new google.maps.Marker({
          position: {lat: restaurant[1], lng: restaurant[2]},
          map: map,
          shape: shape,
          label: labels[labelIndex++ % labels.length],
          title: restaurant[0],
          zIndex: restaurant[3]
        });
      }
    }

  })
  .factory('Yelp', function($http) {
    return {
      'searchYelp': function(searchData, callback) {
        var method = 'GET';
        var url = 'http://api.yelp.com/v2/search';
        var params = {
          callback: 'angular.callbacks._0',
          ll: searchData.location.latitude + ',' + searchData.location.longitude,
          oauth_consumer_key: 'pXun5utVb1biyXf21kVKTA', //Consumer Key
          oauth_token: 'bo-kcLjmsh3SHjLPScHnxkvM9sQ7wJzg', //Token
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: new Date().getTime(),
          oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
          term: 'restaurants',
          radius_filter: searchData.radius,
          sort: 2,
          limit: 3
        };
        var consumerSecret = 'dTnYPlPtjqVuCPLBew6TxuaXv78'; //Consumer Secret
        var tokenSecret = 'mFFZloRU190j6NBGwYPvbvTI-E4'; //Token Secret
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
        params['oauth_signature'] = signature;
        $http.jsonp(url, {params: params}).success(callback);
      }
    }
  });

  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

