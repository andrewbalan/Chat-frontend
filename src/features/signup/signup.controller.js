import angular from 'angular';

export default class SignupController {
  constructor($rootScope, auth) {
    this.$rootScope = $rootScope;
    this.auth = auth;

    this.alerts = {};
    this.credentials = {
      name: '',
      username: '',
      password: '',
      avatar: null
    };
    this.isLoading = false;
  }

  submit($event) {
    $event.preventDefault();
    $event.stopPropagation();

    this.isLoading = true;

    this.auth
      .signup(this.credentials)
      .then(result => {
          this.isLoading = false;

          if (result.status === 200) {
            this.$rootScope.$state.go('home');
          } else {
            if (result.data) {
              let data = result.data.errors;

              this.alerts.name     = data.name || '';
              this.alerts.username = data.username || '';
              this.alerts.password = data.password || '';
              this.alerts.avatar   = data.avatar || '';
            }
          }
      });
  }
}

SignupController.$inject = ['$rootScope', 'auth'];