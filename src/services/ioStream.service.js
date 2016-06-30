import angular from 'angular';
import ss from 'socket.io-stream';

let IoStream = function($rootScope) {
  return {
    emit: function ({socket, eventName, stream, data, callback}) {
      ss(socket).emit(eventName,stream, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(ss(socket), args);
          }
        });
      });
    },

    createBlobReadStream: function (file) {
      return ss.createBlobReadStream(file);
    },

    createWriteStream: function () {
      return ss.createStream();
    }
  };
};

IoStream.$inject = ['$rootScope'];

export default angular.module('services.io-stream', [])
  .factory('ioStream', IoStream)
  .name;