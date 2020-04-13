import {
  BrowserView,
  BrowserViewConstructorOptions,
  BrowserWindow,
  Rectangle,
} from "electron";
import { Display } from "./window";

export const GRID_HEIGHT = 12;
export const GRID_WIDTH = 12;

export type GridDimension =
  | number
  | "full"
  | "remaining"
  | "quarter"
  | "third"
  | "half";
export interface WidgetGridLocation {
  origin: number | "full";
  width?: GridDimension;
  height?: GridDimension;
}

export type WidgetConstructorOptions = BrowserViewConstructorOptions & {
  bounds?: Rectangle;
  grid?: WidgetGridLocation;
};

export class Widget extends BrowserView {
  attached?: BrowserWindow;
  grid?: WidgetGridLocation;

  constructor(opts?: WidgetConstructorOptions) {
    super(
      Object.assign(opts, {
        webPreferences: {
          nodeIntegration: true,
        },
      })
    );

    if (opts) {
      if (opts.bounds) {
        console.log("Setting bounds");
        this.setBounds(opts.bounds);
      }
      if (opts.grid) {
        this.grid = opts.grid;
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

  public static getBoundsForGrid(
    grid: WidgetGridLocation,
    target: Display
  ): Rectangle {
    const { x, y, width, height } = target.getBounds();

    if (!grid.height) {
      grid.height = 1;
    }

    if (!grid.width) {
      grid.width = 1;
    }

    const cellWidth = Math.floor(width / GRID_WIDTH);
    const cellHeight = Math.floor(height / GRID_HEIGHT);

    let transformedGrid = {
      origin: grid.origin,
      width: grid.width,
      height: grid.height,
    };

    if (transformedGrid.origin === "full") {
      transformedGrid.origin = 1;
      transformedGrid.width = "full";
      transformedGrid.height = "full";
    }

    const row = Math.floor((transformedGrid.origin - 1) / GRID_HEIGHT);
    const column = (transformedGrid.origin - 1) % GRID_WIDTH;

    transformedGrid.width = Widget.calculateGridRowHeight(
      transformedGrid.width,
      column,
      GRID_WIDTH
    );
    transformedGrid.height = Widget.calculateGridRowHeight(
      transformedGrid.height,
      row,
      GRID_HEIGHT
    );

    return {
      x: column * cellWidth,
      y: row * cellHeight,
      height: transformedGrid.height * cellHeight,
      width: transformedGrid.width * cellWidth,
    };
  }

  private static calculateGridRowHeight(
    value: GridDimension,
    position: number,
    fullSize: number
  ) {
    switch (value) {
      case "full":
        return fullSize;
        break;
      case "remaining":
        return fullSize - position;
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
