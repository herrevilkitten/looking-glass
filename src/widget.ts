import {
  BrowserView,
  BrowserViewConstructorOptions,
  BrowserWindow,
  Rectangle,
} from "electron";
import { Display } from "./display";

export const GRID_HEIGHT = 12;
export const GRID_WIDTH = 12;

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
export type GridSize = number | "full" | "quarter" | "third" | "half";
export interface WidgetGridLocation {
  position: GridPosition;
  width?: GridSize;
  height?: GridSize;
  both?: GridSize;
}

export type WidgetGrid = "full" | WidgetGridLocation;

export interface WidgetConstructorOptions
  extends BrowserViewConstructorOptions {
  bounds?: Rectangle;
  grid?: WidgetGrid;
  url?: string;
  file?: string;
  transparent?: boolean;
}

export class Widget extends BrowserView {
  attached?: BrowserWindow;
  grid?: WidgetGrid;

  constructor(opts?: WidgetConstructorOptions) {
    super(
      Object.assign(opts, {
        webPreferences: {
          nodeIntegration: true,
        },
      })
    );

    this.webContents.on("before-input-event", (event, input) => {
      //      console.log(event);
      //      console.log(input);
      /*
      {
  type: 'keyDown',
  key: 'w',
  code: 'KeyW',
  isAutoRepeat: false,
  shift: false,
  control: false,
  alt: false,
  meta: true
}
*/
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
      if (opts.bounds) {
        console.log("Setting bounds");
        this.setBounds(opts.bounds);
      }
      this.grid = "full";
      if (opts.grid) {
        this.grid = opts.grid;
      }
      if (opts.url) {
        this.webContents.loadURL(opts.url);
      } else if (opts.file) {
        this.webContents.loadFile(opts.file);
      }
      if (opts.transparent) {
        this.webContents.on("did-finish-load", () => {
          this.webContents.insertCSS(`
          html, body {
            background: none;
            background-color: rgba(0,0,0,0) !important;
          }
          `);
        });
      }
    }
  }

  attach(target: Display) {
    //    console.log("Attaching", this, "to", target);
    if (this.grid) {
      const bounds = Widget.getBoundsForGrid(this.grid, target);
      console.log("Grid", this.grid, "is", bounds);
      this.setBounds(bounds);
    }
    this.attached = target;
  }

  public static getBoundsForGrid(grid: WidgetGrid, target: Display): Rectangle {
    const { x, y, width, height } = target.getBounds();

    let transformedGrid: { position: number; width: number; height: number } = {
      position: 1,
      width: 1,
      height: 1,
    };

    if (grid === "full") {
      transformedGrid.position = 1;
      transformedGrid.width = GRID_WIDTH;
      transformedGrid.height = GRID_HEIGHT;
    } else {
      if (grid.both) {
        transformedGrid.width = Widget.calculateGridRowHeight(
          grid.both || 1,
          GRID_WIDTH
        );
        transformedGrid.height = Widget.calculateGridRowHeight(
          grid.both || 1,
          GRID_HEIGHT
        );
      } else {
        transformedGrid.width = Widget.calculateGridRowHeight(
          grid.width || 1,
          GRID_WIDTH
        );
        transformedGrid.height = Widget.calculateGridRowHeight(
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
          transformedGrid.position = GRID_WIDTH - transformedGrid.width;
          break;
        case "left":
          {
            const top = Math.floor(
              GRID_HEIGHT / 2 - transformedGrid.height / 2
            );
            transformedGrid.position = top * 12 + 1;
          }
          break;
        case "center":
          {
            const top = Math.floor(
              GRID_HEIGHT / 2 - transformedGrid.height / 2
            );
            const left = Math.floor(GRID_WIDTH / 2 - transformedGrid.width / 2);
            transformedGrid.position = top * 12 + left + 1;
          }
          break;
        case "right":
          {
            const top = Math.floor(
              GRID_HEIGHT / 2 - transformedGrid.height / 2
            );
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

  private static calculateGridRowHeight(value: GridSize, fullSize: number) {
    switch (value) {
      case "full":
        return fullSize;
        break;
      case "quarter":
        return Math.floor(fullSize / 4);
        break;
      case "third":
        return Math.floor(fullSize / 3);
        break;
      case "half":
        return Math.floor(fullSize / 2);
        break;
      default:
        return value;
        break;
    }
  }
}
