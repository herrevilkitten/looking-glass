import { MenuItemConstructorOptions, Tray, Menu } from "electron";

export function createTrayMenu() {
  let layouts: MenuItemConstructorOptions[] = [];

  let showDisplaySubMenu: MenuItemConstructorOptions[] = [
    {
      label: "Instant Display",
      click: () => {},
      accelerator: "CommandOrControl+N",
    },
  ];
  if (layouts.length > 0) {
    showDisplaySubMenu.push({
      type: "separator",
    });

    showDisplaySubMenu.push(...layouts);
  }

  let tray = new Tray("resources/elephant-white-18x18.png");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Looking Glass",
      enabled: false,
    },
    {
      label: "Show Display",
      submenu: showDisplaySubMenu,
    },
    {
      label: "Open Remote Control",
      accelerator: "Shift+CommandOrControl+R",
      click: () => {},
    },
    {
      label: "Open Layout Builder",
      accelerator: "Shift+CommandOrControl+B",
      click: () => {},
    },
    {
      type: "separator",
    },
    {
      label: "Settings",
      click: () => {},
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      role: "quit",
    },
  ]);
  tray.setPressedImage("resources/elephant-black-18x18.png");
  tray.setToolTip("Looking Glass");
  tray.setContextMenu(contextMenu);

  return tray;
}
