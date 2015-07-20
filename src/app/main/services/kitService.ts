module cKit.app.services {
  export var NAME = "cKit.app.services";

  declare var cKit;
  function kitService() {
    this.kit = cKit.kit;

    this.kit.initializeCanvas();
    return this.kit;
  };

  export function run() {
    var mod = angular.module(NAME, []);
    mod.service("kitService", kitService);
  }
}
cKit.app.services.run();