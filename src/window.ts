import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { Layer } from "./layer";
import { Widget } from "./widget";

export class Display extends BrowserWindow {
  private layers: Set<Layer> = new Set();
  private widgets: Set<Widget> = new Set();

  constructor(args?: BrowserWindowConstructorOptions) {
    super(args);

    this.addLayer(new Layer());
  }

  paint() {
    const existingWidgets = new Set(this.getBrowserViews());
    for (let layer of this.layers) {
      const widgets = layer.getWidgets();
      for (let widget of widgets) {
        if (existingWidgets.has(widget)) {
          continue;
        }
        this.addWidget(widget);
      }
    }
  }

  repaint() {
    const existingWidgets = this.getBrowserViews();
    for (let widget of existingWidgets) {
      if (widget instanceof Widget) {
        this.removeWidget(widget);
      }
    }
  }

  getLayers() {
    return Array.from(this.layers);
  }

  addLayer(layer: Layer) {
    if (this.layers.has(layer)) {
      return;
    }

    this.layers.add(layer);
    layer.setDisplay(this);

    layer.getWidgets().forEach((widget) => {
      this.addBrowserView(widget);
    });

    layer.addListener("add-widget", (widget: Widget) => {
      this.addWidget(widget);
    });

    layer.addListener("remove-widget", (widget: Widget) => {
//      console.log("remove-widget", widget);
      this.removeWidget(widget);
    });
  }

  removeLayer(layer: Layer) {
    if (!this.layers.has(layer)) {
      return;
    }

    this.layers.delete(layer);
    layer.removeDisplay();
    layer.removeAllListeners("add-widget");

    layer.getWidgets().forEach((widget) => {
      this.removeWidget(widget);
    });
  }

  protected addWidget(widget: Widget) {
    //   console.log("add-widget", widget);
    widget.attach(this);
    const bounds = widget.getBounds();
    widget.setBounds({
      x: -8000,
      y: -8000,
      width: bounds.width,
      height: bounds.height,
    });
    console.log(bounds);
    this.addBrowserView(widget);
    widget.setBounds(bounds);
  }

  protected removeWidget(widget: Widget) {
    /*
    const bounds = widget.getBounds();
    widget.setBounds({
      x: -8000,
      y: -8000,
      width: bounds.width,
      height: bounds.height,
    });
    */
    this.removeBrowserView(widget);
  }
}
