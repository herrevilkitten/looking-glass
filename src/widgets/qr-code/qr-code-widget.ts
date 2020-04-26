import { Widget, WidgetConstructorOptions } from "../../widget";

export interface QrCodeWidgetConstructorOptions
  extends WidgetConstructorOptions {
  data: string;
}

export class QrCodeWidget extends Widget {
  constructor(opts: QrCodeWidgetConstructorOptions) {
    super(opts);

    this.webContents.loadFile("../widgets/qr-code.html", {
      search: `data=${opts.data || ""}`,
    });
  }
}
