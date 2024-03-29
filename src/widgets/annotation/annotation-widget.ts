import { Widget, WidgetConstructorOptions } from "../../widget";

export interface AnnotationWidgetConstructionOptions
  extends WidgetConstructorOptions {
  source: string;
}

export class AnnotationWidget extends Widget {
  source: string;

  constructor(opts: AnnotationWidgetConstructionOptions) {
    super(opts);

    this.source = opts.source;
    this.loadFile("annotation");
  }
}
