import { Display } from "./display";
import { Widget } from "./widget";
import { WebWidget } from "./widgets/web/web-widget";
import { ipcMain } from "electron";

export function stuff() {
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
      position: "full",
    });
    svgWidget.webContents.loadFile("../widgets/svg.html");
    svgWidget.webContents.on("did-finish-load", () => {
      //      svgWidget.webContents.openDevTools();
    });
    layer.addWidget(svgWidget);

    const googleWidget = new Widget({
      position: 11,
      width: 2,
      height: 6,
    });
    googleWidget.webContents.loadFile("../widgets/buttons.html");
    layer.addWidget(googleWidget);

    const t = new WebWidget({
      position: 1,
      width: 4,
      height: "full",
      //grid:{origin: 'full'},
      url: "https://salesforce.quip.com/Xa9xARNwdCWK",
    });

    t.webContents.on("did-finish-load", () => {
      t.webContents.insertCSS(`
      * {
        background-color: rgba(0,0,0,0) !important;
      }

      :not(:root):fullscreen::backdrop {
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: rgba(0,0,0,0);
    }
      `);
      t.webContents.openDevTools();
    });
    layer.addWidget(t);
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
  display.loadFile("../pages/display/index.html");
}
