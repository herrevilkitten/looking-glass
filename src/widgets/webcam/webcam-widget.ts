import { Widget, WidgetConstructorOptions } from "../../widget";

export interface WebcamWidgetConstructorOptions
  extends WidgetConstructorOptions {
  source: string;
}

export class WebcamWidget extends Widget {
  constructor(opts: WebcamWidgetConstructorOptions) {
    super(opts);

    this.loadFile("webcam", { source: opts.source || "" });
  }
}
