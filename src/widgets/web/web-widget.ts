import { Widget, WidgetConstructorOptions } from "../../widget";

export interface WebWidgetConstructorOptions extends WidgetConstructorOptions {
  url: string;
}

export class WebWidget extends Widget {
  constructor(opts: WebWidgetConstructorOptions) {
    super(opts);

    this.webContents.loadURL(opts.url);
  }
}
