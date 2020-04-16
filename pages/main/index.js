angular
  .module("LookingGlass", ["ngComponentRouter", "ui.bootstrap"])
  .config(function ($locationProvider) {
//    $locationProvider.html5Mode(true);
  })
  .value("$routerRootComponent", "lookingGlassApp");
