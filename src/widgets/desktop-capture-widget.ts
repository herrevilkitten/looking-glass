import { Widget, WidgetConstructorOptions } from "../widget";
import { desktopCapturer } from "electron";

export interface DesktopCaptureidgetConstructorOptions
  extends WidgetConstructorOptions {
  source: string;
}

export class DesktopCaptureWidget extends Widget {
  constructor(opts: DesktopCaptureidgetConstructorOptions) {
    super(opts);

    this.webContents.on("before-input-event", (event, input) => {
      //      console.log(event);
      console.log("Capture:", input);
      /*
      {
  type: 'keyDown',
  key: 'w',
  code: 'KeyW',
  isAutoRepeat: false,
  shift: false,
  control: false,
  alt: false,
  meta: true
}
*/
      let meta = false;
      if (process.platform === "darwin") {
        meta = input.meta;
      } else {
        meta = input.control;
      }

      if (input.code === "KeyS" && meta) {
        this.webContents.send("select-source");
      }
    });

    this.webContents.loadFile("../widgets/desktop-capture.html", {
      search: `source=${opts.source || ""}`,
    });
  }
}
