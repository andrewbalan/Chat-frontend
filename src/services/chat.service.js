import angular from 'angular';
import uirouter from 'angular-ui-router';

class Chat {
  constructor($http, $q, $rootScope) {
    this.$q         = $q;
    this.$http      = $http;
    this.$rootScope = $rootScope;
  }

  getOpenedChats() {
    return this.$http.get('http://localhost:3000/api/chat/opened');
  }

  getAvailableChats() {
    return this.$http.get('http://localhost:3000/api/chat/available');
  }

  createChat(caption) {
    return this.$http.post('http://localhost:3000/api/chat', {
      caption: caption
    });
  }

  deleteChat(id) {
    return this.$http.delete('http://localhost:3000/api/chat/' + id);
  }

  joinChat(id) {
    return this.$http.put('http://localhost:3000/api/chat/join/' + id);
  }

  leaveChat(id) {
    return this.$http.put('http://localhost:3000/api/chat/leave/' + id);
  }
}

Chat.$inject = ['$http', '$q', '$rootScope'];

export default angular.module('services.chat', [uirouter])
  .service('chat', Chat)
  .name;