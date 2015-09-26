'use strict';

/**
 * @ngdoc function
 * @name hackgtApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hackgtApp
 */
angular.module('hackgtApp')
  .controller('MainCtrl', function (Yelp) {
    var self = this;

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
