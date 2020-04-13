import { Widget, WidgetConstructorOptions } from "../widget";
import { networkInterfaces } from "os";

export type RemoteControlWidgetConstructorOptions = WidgetConstructorOptions & {
  ip?: string;
};

export class RemoteControlWidget extends Widget {
  ip: string;

  constructor(opts: RemoteControlWidgetConstructorOptions) {
    super(opts);

    if (!opts.ip) {
      opts.ip = this.getIpAddress();
    }

    this.ip = opts.ip;

    this.webContents.loadFile("../widgets/remote-control.html", {
      search: `ip=${this.ip}`,
    });
    this.webContents.openDevTools();
  }

  private getIpAddress() {
    const ifaces = networkInterfaces();
    const ifacenames = Object.keys(ifaces);
    for (let ifname of ifacenames) {
      let alias = 0;
      for (let iface of ifaces[ifname]) {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          continue;
        }

        console.log(iface);
        return iface.address; /*
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          console.log(ifname + ":" + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          console.log(ifname, iface.address);
        }
        ++alias;*/
      }
    }
    return "127.0.0.1";
  }
}
