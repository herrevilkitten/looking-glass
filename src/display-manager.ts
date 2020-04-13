import { Display } from "./window";

export class DisplayManager {
  displays: Set<Display> = new Set();

  getDisplays() {
    return Array.from(this.displays);
  }

  createDisplay() {
    const display = new Display({
      fullscreen: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.displays.add(display);
    return display;
  }

  showDisplay(display: number): Display;
  showDisplay(display: Display): Display;
  showDisplay(display: Display | number) {
    if (typeof display === "number") {
      const displayToShow = Array.from(this.displays)[display];
      if (displayToShow) {
        displayToShow.show();
        return displayToShow;
      } else {
        throw new Error(`No display for index "${display}"`);
      }
    } else {
      display.show();
    }
  }
}
