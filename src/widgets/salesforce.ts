import { Widget, WidgetConstructorOptions } from "../widget";

export class SalesforceWidget extends Widget {
  constructor(opts: WidgetConstructorOptions) {
    super(opts);

    this.webContents.loadURL("https://www.google.com");
  }
}
