import { Widget, WidgetConstructorOptions } from "../../widget";

export interface YoutubeWidgetConstructionOptions
  extends WidgetConstructorOptions {
  source: string;
}

export class YoutubeWidget extends Widget {
  source: string;

  constructor(opts: YoutubeWidgetConstructionOptions) {
    super(opts);

    this.source = opts.source;
    this.webContents.loadFile("../widgets/youtube.html", {
      search: `source=${opts.source || ""}`,
    });
  }
}
