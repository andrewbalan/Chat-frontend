export default class LoginController {
  constructor($rootScope, auth) {
    this.$rootScope = $rootScope;
    this.auth = auth;

    this.messages = {};
    this.credentials = {};
    this.isLoading = false;
  }

  submit() {
    this.isLoading = true;
    let msgs = this.messages;
    
    this.auth
      .login(this.credentials.username, this.credentials.password)
      .then(result => {
        this.isLoading = false;

        if (result.status === 200) {
          this.$rootScope.$state.go('home');
        } else {
          if(result.data){
            let data = result.data;
            
            msgs.username = data.username ? data.username.msg : '';
            msgs.password = data.password ? data.password.msg : '';
          }
        }
      });
  }
}

LoginController.$inject = ['$rootScope', 'auth'];