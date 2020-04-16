angular.module("LookingGlass").component("lookingGlassApp", {
  templateUrl: "components/app/template.html",
  controller: function () {
    console.log("Controller!");
  },
  $routeConfig: [
    {
      path: "/dashboard",
      name: "LookingGlassDashboard",
      component: "lookingGlassDashboard",
    },
    {
      path: "/display",
      name: "LookingGlassDisplay",
      component: "lookingGlassDisplay",
      useAsDefault: true,
    },
    {
      path: "/display-builder",
      name: "LookingGlassDisplayBuilder",
      component: "lookingGlassDisplayBuilder",
    },
    {
      path: "/remote",
      name: "LookingGlassRemote",
      component: "lookingGlassRemote",
    },
    {
      path: "/preferences",
      name: "LookingGlassPreferences",
      component: "lookingGlassPreferences",
    },
  ],
});

console.log("Component!");
