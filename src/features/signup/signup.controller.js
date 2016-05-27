export default class SignupController {
  constructor($rootScope, auth) {
    this.$rootScope = $rootScope;
    this.auth = auth;
    
    this.messages = {};
    this.credentials = {};
    this.isLoading = false;
  }

  submit() {
    this.isLoading = true;

    let crds = this.credentials;
    let msgs = this.messages;
    
    this.auth
      .signup(crds.name, crds.username, crds.password)
      .then(result => {
          this.isLoading = false;
          if (result.status === 200) {
            this.$rootScope.$state.go('home');
          } else {
            if (result.data) {
              let data = result.data;
              
              msgs.name = data.name ? data.name.msg : '';
              msgs.username = data.username ? data.username.msg : '';
              msgs.password = data.password ? data.password.msg : '';
            }
          }
      });
  }
}

SignupController.$inject = ['$rootScope', 'auth'];