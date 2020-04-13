import { BrowserView } from "electron";

import { Widget } from "./widget";
import { EventEmitter } from "events";
import { Display } from "./window";

export interface LayerConstructorOptions {
  id?: string;
}

export class Layer extends EventEmitter {
  private display?: Display;
  private widgets: Set<Widget> = new Set();
  private id = "";

  constructor(opts?: LayerConstructorOptions) {
    super();

    if (opts) {
      this.id = opts.id || "";
    }
  }

  getWidgets() {
    return Array.from(this.widgets);
  }

  addWidget(widget: Widget): this {
    if (this.widgets.has(widget)) {
      return this;
    }

//    console.log("Adding", widget, "to layer");
    this.widgets.add(widget);
    this.emit("add-widget", widget);
    return this;
  }

  removeWidget(widget: Widget): this {
    if (!this.widgets.has(widget)) {
      return this;
    }

//    console.log("Removing", widget, "from layer");
    this.widgets.delete(widget);
    this.emit("remove-widget", widget);
    return this;
  }

  setDisplay(display: Display): this {
    this.removeDisplay();
    this.display = display;
    return this;
  }

  removeDisplay(): this {
    this.display = undefined;
    return this;
  }
}
