import {
  BrowserView,
  BrowserViewConstructorOptions,
  BrowserWindow,
  Rectangle,
} from "electron";
import { Display } from "./display";
import { join } from "path";

export const GRID_HEIGHT = 12;
export const GRID_WIDTH = 12;

const WIDGET_COUNTER: { [name: string]: number } = {};
function getWidgetCounterName(widget: Widget) {
  const constructorName = widget.constructor.name;
  let value = WIDGET_COUNTER[constructorName] || 0;
  WIDGET_COUNTER[constructorName] = value + 1;

  return `${constructorName} ${value}`;
}

function getBoundsForGrid(grid: WidgetGrid, target: Display): Rectangle {
  const { x, y, width, height } = target.getBounds();

  let transformedGrid: { position: number; width: number; height: number } = {
    position: 1,
    width: 1,
    height: 1,
  };

  if (grid.position === "full") {
    transformedGrid.position = 1;
    transformedGrid.width = GRID_WIDTH;
    transformedGrid.height = GRID_HEIGHT;
  } else {
    if (grid.size) {
      transformedGrid.width = calculateGridRowHeight(
        grid.size || 1,
        GRID_WIDTH
      );
      transformedGrid.height = calculateGridRowHeight(
        grid.size || 1,
        GRID_HEIGHT
      );
    } else {
      transformedGrid.width = calculateGridRowHeight(
        grid.width || 1,
        GRID_WIDTH
      );
      transformedGrid.height = calculateGridRowHeight(
        grid.height || 1,
        GRID_HEIGHT
      );
    }

    switch (grid.position) {
      case "upper-left":
        transformedGrid.position = 1;
        break;
      case "upper":
        transformedGrid.position = Math.floor(
          GRID_WIDTH / 2 - transformedGrid.width / 2
        );
        break;
      case "upper-right":
        transformedGrid.position = GRID_WIDTH - transformedGrid.width + 1;
        break;
      case "left":
        {
          const top = Math.floor(GRID_HEIGHT / 2 - transformedGrid.height / 2);
          transformedGrid.position = top * 12 + 1;
        }
        break;
      case "center":
        {
          const top = Math.floor(GRID_HEIGHT / 2 - transformedGrid.height / 2);
          const left = Math.floor(GRID_WIDTH / 2 - transformedGrid.width / 2);
          transformedGrid.position = top * 12 + left + 1;
        }
        break;
      case "right":
        {
          const top = Math.floor(GRID_HEIGHT / 2 - transformedGrid.height / 2);
          const left = GRID_WIDTH - transformedGrid.width;
          transformedGrid.position = top * 12 + left + 1;
        }
        break;
      case "lower-left":
        {
          const top = GRID_HEIGHT - transformedGrid.height;
          transformedGrid.position = top * 12 + 1;
        }
        break;
      case "lower":
        {
          const top = GRID_HEIGHT - transformedGrid.height;
          const left = Math.floor(GRID_WIDTH / 2 - transformedGrid.width / 2);
          transformedGrid.position = top * 12 + left + 1;
        }
        break;
      case "lower-right":
        {
          const top = GRID_HEIGHT - transformedGrid.height;
          const left = GRID_WIDTH - transformedGrid.width;
          transformedGrid.position = top * 12 + left + 1;
        }
        break;
      default:
        transformedGrid.position = grid.position;
    }
  }
  const cellWidth = Math.floor(width / GRID_WIDTH);
  const cellHeight = Math.floor(height / GRID_HEIGHT);

  const row = Math.floor((transformedGrid.position - 1) / GRID_HEIGHT);
  const column = (transformedGrid.position - 1) % GRID_WIDTH;

  return {
    x: column * cellWidth,
    y: row * cellHeight,
    height: transformedGrid.height * cellHeight,
    width: transformedGrid.width * cellWidth,
  };
}

function calculateGridRowHeight(value: GridSize, fullSize: number) {
  switch (value) {
    case "full":
      return fullSize;
    case "sixth":
      return Math.floor(fullSize / 6);
    case "quarter":
      return Math.floor(fullSize / 4);
    case "third":
      return Math.floor(fullSize / 3);
    case "half":
      return Math.floor(fullSize / 2);
    default:
      return value;
  }
}

export type GridPosition =
  | number
  | "upper-left"
  | "upper"
  | "upper-right"
  | "left"
  | "center"
  | "right"
  | "lower-left"
  | "lower"
  | "lower-right";
export type GridSize = number | "full" | "sixth" | "quarter" | "third" | "half";
export interface WidgetGridLocation {
  position: "full" | GridPosition;
  width?: GridSize;
  height?: GridSize;
  size?: GridSize;
}

export type WidgetGrid = WidgetGridLocation;

export interface WidgetConstructorOptions
  extends BrowserViewConstructorOptions,
    WidgetGridLocation {
  bounds?: Rectangle;
  // grid?: WidgetGrid;
  url?: string;
  file?: string;
  transparent?: boolean;
  opacity?: number;
  /*
  position?: "full" | GridPosition;
  width?: GridSize;
  height?: GridSize;
  size?: GridSize;*/
  name?: string;
}

export class Widget extends BrowserView {
  attached?: BrowserWindow;
  position: "full" | GridPosition;
  width: GridSize;
  height: GridSize;
  size: GridSize;
  name: string;
  hideCss?: string;

  constructor(opts?: WidgetConstructorOptions) {
    super(
      Object.assign(opts, {
        webPreferences: {
          nodeIntegration: true,
        },
      })
    );

    this.name = getWidgetCounterName(this);
    this.position = "center";
    this.width = 1;
    this.height = 1;
    this.size = "full";

    this.setBackgroundColor("#0000");

    this.webContents.on("before-input-event", (event, input) => {
      //      console.log(event);
      //      console.log(input);
      let meta = false;
      if (process.platform === "darwin") {
        meta = input.meta;
      } else {
        meta = input.control;
      }

      if (input.code === "KeyW" && meta) {
        if (this.attached) {
          this.attached.close();
        }
      }
    });

    if (opts) {
      if (opts.name) {
        this.name = opts.name;
      }

      if (opts.position) {
        this.position = opts.position;
      }

      if (opts.bounds) {
        console.log("Setting bounds");
        this.setBounds(opts.bounds);
      }
      if (opts.size) {
        this.size = opts.size;
        this.height = opts.size;
        this.width = opts.size;
      } else {
        if (opts.width) {
          this.width = opts.width;
        }

        if (opts.height) {
          this.height = opts.height;
        }
      }
      if (opts.url) {
        this.webContents.loadURL(opts.url);
      } else if (opts.file) {
        this.webContents.loadFile(opts.file);
      }

      this.webContents.on("did-finish-load", () => {
        if (opts.transparent) {
          this.webContents.insertCSS(`
          html, body {
            background: none;
            background-color: rgba(0,0,0,0) !important;
          }
          `);
        }
        if (opts.opacity !== undefined) {
          this.webContents.insertCSS(`
          * {
            opacity: ${opts.opacity};
          }
          `);
        }
      });
    }
  }

  attach(target: Display) {
    //    console.log("Attaching", this, "to", target);
    const bounds = getBoundsForGrid(this, target);
    console.log("Grid is", bounds);
    console.log(this);
    this.setBounds(bounds);

    this.attached = target;
  }

  loadFile(path: string, search?: { [name: string]: any }) {
    const opts: any = {};

    const widgethPath = join(__dirname, "widgets", path);

    if (search && Object.keys(search).length > 0) {
      opts.search = "";
      const entries = [];

      for (let [key, value] of Object.entries(search)) {
        const transformedKey = encodeURIComponent(key);
        const transformedValue = encodeURIComponent(
          value === null || value === undefined ? "" : value
        );
        entries.push(`${transformedKey}=${transformedValue}`);
      }
      opts.search = entries.join("&");
    }

    this.webContents.loadFile(widgethPath, opts);
  }
}
