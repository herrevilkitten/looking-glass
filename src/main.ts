import {
  app,
  ipcMain,
  Tray,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  BrowserWindow,
} from "electron";

import { Display } from "./display";
import { Widget } from "./widget";
import { Layer } from "./layer";
import { RemoteControlWidget } from "./widgets/remote-control-widget";
import { WebWidget } from "./widgets/web-widget";
import { RemoteControlServer } from "./server";
import { DisplayManager } from "./display-manager";
import { createTrayMenu } from "./tray-menu";

app.commandLine.appendArgument("--enable-features=Metal");

import { stuff } from "./sample-display";
import { WebcamWidget } from "./widgets/webcam-widget";
import { DesktopCaptureWidget } from "./widgets/desktop-capture-widget";

const WIDGETS = {
  web: WebWidget,
  widget: Widget,
  webcam: WebcamWidget,
  "desktop-capture": DesktopCaptureWidget,
};

function createDisplay(json: any) {
  const display = new Display({
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  display.on("closed", () => {
    console.log("Window has closed");
    if (display && !display.isDestroyed()) {
      console.log("Window is not destroyed");
      display.setFullScreen(false);
      display.destroy();
    }
  });

  display.webContents.on("did-finish-load", () => {
    console.log("ready to show");
    const layer = display.getLayers()[0];

    if (!Array.isArray(json)) {
      json = [json];
    }

    for (let config of json) {
      if (!config || !config.type) {
        continue;
      }
      const type: keyof typeof WIDGETS = config.type;
      const url = config.url;
      const file = config.file;

      if (!WIDGETS[type]) {
        continue;
      }

      const newWidget = new WIDGETS[type](config);
      if (config.showDevConsole) {
        newWidget.webContents.on("did-finish-load", () => {
          console.log("Loaded page");
          newWidget.webContents.openDevTools();
        });
      }
      newWidget.webContents.on("did-fail-load", (event, ...errors) => {
        console.log(errors);
      });
      layer.addWidget(newWidget);
      console.log(newWidget);
    }

    ipcMain.on("indexFinger", (event, coordinates) => {
      //      console.log('indexFinger', coordinates);
      //      svgWidget.webContents.send("indexFinger", coordinates);
    });

    //    display.show();
  });
  display.on("resize", () => {
    //    display.repaint();
  });
  display.loadFile("../pages/display/index.html");
}

app.on("ready", () => {
  const m = new RemoteControlServer();
  m.start();

  createTrayMenu();

  const dashboardWindow = new BrowserWindow({
    width: 1080,
    height: 607,
    fullscreen: false,
    simpleFullscreen: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  dashboardWindow.webContents.on("did-finish-load", () => {
    dashboardWindow.show();
  });

  dashboardWindow.loadFile("../pages/main/index.html");

  ipcMain.on("widget-log", (event, ...args) => {
    console.log(args);
  });

  ipcMain.on("launch-display", (event, json) => {
    //    console.log(event);
    console.log(json);
    createDisplay(json);
  });
  // stuff();
});
