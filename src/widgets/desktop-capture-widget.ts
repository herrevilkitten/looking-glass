import { Widget, WidgetConstructorOptions } from "../widget";
import { desktopCapturer } from "electron";

export interface DesktopCaptureidgetConstructorOptions
  extends WidgetConstructorOptions {
  source: string;
}

export class DesktopCaptureWidget extends Widget {
  constructor(opts: DesktopCaptureidgetConstructorOptions) {
    super(opts);

    this.webContents.loadFile("../widgets/desktop-capture.html", {
      search: `source=${opts.source || ""}`,
    });
  }
}
