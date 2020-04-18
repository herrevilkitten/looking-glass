angular.module("LookingGlass").component("lookingGlassDisplay", {
  templateUrl: "components/display/template.html",
  controller: function (DisplayService) {
    const $ctrl = this;

    $ctrl.emptyDisplayConfiguration = "";
    $ctrl.launch = function () {
      const { ipcRenderer } = require("electron");

      console.log($ctrl.emptyDisplayConfiguration);
      let json;
      try {
        json = JSON.parse($ctrl.emptyDisplayConfiguration || "[]");
        console.log("Parsed it as json:", json);
      } catch (e) {
        json = jsyaml.load($ctrl.emptyDisplayConfiguration || "[]");
        console.log("Parsed it as yaml:", json);
      }
      console.log("Launching a display:", json);
      ipcRenderer.send("launch-display", json);
    };

    this.DisplayService = DisplayService;
  },
});
