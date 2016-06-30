import angular from 'angular';
import uirouter from 'angular-ui-router';

class Auth {
  constructor($injector) {
    this.$injector  = $injector;

    this.$rootScope = $injector.get('$rootScope');
    this.authToken  = $injector.get('authToken');

    this.$rootScope.user = {
      id: '',
      name: '',
      username: ''
    };

    this.$rootScope.isLoggedIn = this.isLoggedIn();
  }

  signup({name, username, password, avatar}) {
    let $http = this.$injector.get('$http');

    let fd = new FormData();
    fd.append('name', name);
    fd.append('username', username);
    fd.append('password', password);
    fd.append('avatar', avatar);

    return $http.post(`${HOST}/api/signup`, fd,{
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .then(
      result => {
        this.$rootScope.isLoggedIn = true;
        this.authToken.setToken(result.data.token);
        this.getUser();
        return result;
      },
      error => {
        return error;
    });
  }

  login(username, password) {
    let $http = this.$injector.get('$http');

    return $http.post(`${HOST}/api/login`, {
      username: username,
      password: password
    })
    .then(
      result => {
        this.$rootScope.isLoggedIn = true;
        this.authToken.setToken(result.data.token);
        this.getUser();
        return result;
      },
      error => {
        return error;
    });
  }

  logout() {
    this.$rootScope.isLoggedIn = false;

    this.$rootScope.user.name     = '';
    this.$rootScope.user.id       = '';
    this.$rootScope.user.username = '';

    this.authToken.setToken();
    this.$rootScope.$state.go('login');
  }

  isLoggedIn() {
    if(this.authToken.getToken()){
      return true;
    } else {
      return false;
    }
  }

  getUser() {
    let $http = this.$injector.get('$http');

    return $http.get(`${HOST}/api/me`)
    .then(
      result => {
        this.$rootScope.user.name     = result.data.name;
        this.$rootScope.user.id       = result.data._id;
        this.$rootScope.user.username = result.data.username;
        this.$rootScope.user.avatar   = result.data.avatar;

        return result;
      },
      error => {
        return error;
    });
  }

  checkAccess(event, toState, toParams, fromState, fromParams) {
    switch (toState.data.access) {
      case 'all':
        // Any actions if needed
        break;
      case 'onlyLoggedIn':
        if (!this.isLoggedIn()) {
          event.preventDefault();
          this.$rootScope.$state.go('login');
        }
        break;
      case 'onlyNotLoggedIn':
        if (this.isLoggedIn()) {
          event.preventDefault();
          this.$rootScope.$state.go('home');
        }
        break;
    }
  }
}

class AuthToken {
  constructor($window, $rootScope) {
    this.$window = $window;
  }

  getToken() {
    return this.$window.localStorage.getItem('token');
  }

  setToken(token) {
    if(token){
      this.$window.localStorage.setItem('token', token);
    } else {
      this.$window.localStorage.removeItem('token');
    }
  }
}

let AuthInterceptor =  function($q, authToken, auth) {
  return {
    request: config => {
      let token = authToken.getToken();
      if (token) {
        config.headers['x-access-token'] = token;
      }

      return config;
    },

    responseError: response => {
      if (response.status === 401) {
        auth.logout();
      }

      return $q.reject(response);
    }
  };
};

Auth.$inject            = ['$injector'];
AuthInterceptor.$inject = ['$q', 'authToken', 'auth'];
AuthToken.$inject       = ['$window'];

export default angular.module('services.auth', [uirouter])
  .service('auth', Auth)
  .service('authToken', AuthToken)
  .factory('authInterceptor', AuthInterceptor)
  .name;