import { promisify } from 'util';
import { access } from 'fs';

import { getConfigs } from './config'
import { VlcMonitor } from './monitor';

const checkFile = promisify(access)

export const configPaths = {
  darwin: [
    '~/Library/Preferences/org.videolan.vlc/vlcrc',
  ],
  win32: [
    `${process.env.appdata}/vlc/vlcrc`
  ],
  // use linux config as default
  default: [
    '~/.config/vlc/vlcrc',
    '~/.vlc/vlcrc',
  ],
}

export class Vlc {
  configs: {
    port: string
    host: string
    password: string
  }

  monitor: VlcMonitor;

  constructor() {
    this.init();
  }

  async readConfigs(filePaths: string[]) {
    const pathPromises = filePaths.map(path => checkFile(path)
      .then(() => path)
      .catch(() => undefined)
    )
    const paths = await Promise.all(pathPromises)
    const target = paths.find((path) => !!path)

    if (!target) return

    const configs = await getConfigs(target)
    this.configs = configs
  }

  async init() {
    const os = process.platform;
    const filePaths = configPaths[os] || configPaths.default;

    await this.readConfigs(filePaths);

    this.monitor = new VlcMonitor({
      isMonitoring: true,
      pollInterval: 60000,
      activePollInterval: 10000,
    }, {
      host: this.configs.host,
      port: this.configs.port,
      auth: {
        username: '',
        password: this.configs.password,
      }
    });
    this.monitor.listenToStatus();
  }
}
