import {
  app,
  ipcMain,
  Tray,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from "electron";

import { Display } from "./window";
import { Widget } from "./widget";
import { Layer } from "./layer";
import { RemoteControlWidget } from "./widgets/remote-control-widget";
import { SalesforceWidget } from "./widgets/salesforce";
import { RemoteControlServer } from "./server";
import { DisplayManager } from "./display-manager";
import { createTrayMenu } from "./tray-menu";

app.on("ready", () => {
  const m = new RemoteControlServer();
  m.start();

  createTrayMenu();

  const display = new Display({
    fullscreen: true,
    simpleFullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  display.webContents.on("did-finish-load", () => {
    console.log("ready to show");
    const layer = display.getLayers()[0];

    const svgWidget = new Widget({
      grid: {
        origin: "full",
      },
    });
    svgWidget.webContents.loadFile("../widgets/svg.html");
    svgWidget.webContents.on("did-finish-load", () => {
      //      svgWidget.webContents.openDevTools();
    });
    layer.addWidget(svgWidget);

    const googleWidget = new Widget({
      grid: {
        origin: 11,
        width: 2,
        height: 6,
      },
    });
    googleWidget.webContents.loadFile("../widgets/buttons.html");
    layer.addWidget(googleWidget);

    layer.addWidget(
      new SalesforceWidget({ grid: { origin: 1, width: 4, height: "full" } })
    );
/*
    const remoteControlWidget = new RemoteControlWidget({
      grid: {
        origin: "full",
      },
    });
    */
//    layer.addWidget(remoteControlWidget);
/*
    setTimeout(() => {
      layer.removeWidget(googleWidget);
      setTimeout(() => {
        layer.addWidget(googleWidget);
      }, 3000);
    }, 3000);
*/
    ipcMain.on("widget-log", (event, ...args) => {
      console.log(args);
    });

    ipcMain.on("indexFinger", (event, coordinates) => {
      //      console.log('indexFinger', coordinates);
      //      svgWidget.webContents.send("indexFinger", coordinates);
    });

    //    display.show();
  });
  display.on("resize", () => {
//    display.repaint();
  });
  display.loadFile("../screens/index.html");
});
