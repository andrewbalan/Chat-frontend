import angular from 'angular';
import io from 'socket.io-client';

let Io = function($rootScope) {
  return {
    connect: function(url, token, callback) {
      return io.connect(url, {
        query: `token=${token}`,
        forceNew: true
      });
    },

    on: function (socket, eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

    emit: function (socket, eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}

Io.$inject = ['$rootScope'];

export default angular.module('services.io', [])
  .factory('io', Io)
  .name;