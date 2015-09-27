'use strict';

/**
 * @ngdoc function
 * @name hackgtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hackgtApp
 */
angular.module('hackgtApp')
  .controller('MainCtrl', function ($scope, $http, Yelp) {
    var self = this;

    $scope.$on('$includeContentLoaded', function() {
      self.initMap();
    });

    // self.searchData = {
    //   location: {
    //     latitude: 33.776706,
    //     longitude: -84.395697
    //   },
    //   radius: 1000
    // }

    self.findMidpoint = function(loc1,loc2) {
      var latMidpoint = (loc1.latitude + loc2.latitude)/2;
      var lonMidpoint = (loc1.longitude + loc2.longitude)/2;
      return {
        latitude: latMidpoint,
        longitude: lonMidpoint
      }
    }

/*     Yelp.searchYelp(self.searchData, function(data){
      self.restaurants = data;
      self.setMarkers(self.map);
    }); */

    self.map;

    self.initMap = function() {
      var defaultLocation = {
        latitude: 33.776706,
        longitude: -84.395697
      };
      self.map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: defaultLocation.latitude,
          lng: defaultLocation.longitude
        },
        zoom: 13
      });
    }

    self.getCoordinates = function(address) {
      $http
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: address,
            key: 'AIzaSyDKTaF5QtzuZLiOH3TNIUnOEThG6db0k_w'
          }
        })
        .success(function(data){
          // console.log('getCoordinates data', data.results[0].geometry.location);
          // self.addressCoordinates = {
          //   latitude: data.results[0].geometry.location.lat,
          //   longitude: data.results[0].geometry.location.lng
          // }
          return {
            latitude: data.results[0].geometry.location.lat,
            longitude: data.results[0].geometry.location.lng
          }
        });
    }

    /* Yelp.searchYelp(self.searchData, function(data){
      self.restaurants = data;
      self.setMarkers(self.map);
    }); */

    self.setMarkers = function(map) {
      var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
      };
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var labelIndex = 0;

      self.restaurants.businesses.forEach(function(restaurant){
        var marker = new google.maps.Marker({
          position: {
            lat: restaurant.location.coordinate.latitude,
            lng: restaurant.location.coordinate.longitude
          },
          map: map,
          shape: shape,
          label: labels[labelIndex++ % labels.length],
          title: restaurant.name
        });
        marker.info = new google.maps.InfoWindow({
          content: '<h6> ' + restaurant.name + '</h6>'
        });
        google.maps.event.addListener(marker, 'mouseover', function() {
          marker.info.open(map, marker);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
          marker.info.close();
        });
      });
    }

    self.formData = {
      address1: '75 Fifth Street NW, Atlanta, GA, 30308',
      address2: '800 Spring Street, Atlanta, GA, 30308',
      radius: 5
    }

    self.submit = function (formData) {
      // var add1 = self.getCoordinates(formData.address1);
      // var add2 = self.getCoordinates(formData.address2);
      // var loc = self.findMidpoint(add1, add2);
      var loc = self.findMidpoint(self.addressCoordinates)
      console.log('add1', add1);
      console.log('add2', add2);
      console.log('loc', loc);
      self.searchData = {
        location: self.addressCoordinates,
        radius: formData.radius * 1000 || 5000
      };
      Yelp.searchYelp(searchData).success(function(data){
        console.log(data);
        self.restaurants = data;
        self.setMarkers(self.map);
      });
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

