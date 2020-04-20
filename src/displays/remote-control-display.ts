import { Display } from "../display";
import { BrowserWindowConstructorOptions } from "electron";

export class RemoteControlDisplay extends Display {
  constructor(opts: BrowserWindowConstructorOptions) {
    super(opts);
  }
}
