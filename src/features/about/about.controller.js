export default class AboutController {
  constructor(randomNames) {
    this.random = randomNames;
    this.name = 'World';
  }

  changeName() {
    // this.name = 'angular-tips';
  }

  randomName() {
    // this.name = this.random.getName();
  }
}

// AboutController.$inject = ['randomNames'];