import { Vlc } from './vlc/service'

type ServiceTypes = 'vlc' | 'browser'

export class Services {
  vlc: Vlc;

  constructor(public config: Record<ServiceTypes, boolean>) {
    Object.entries(config).forEach(([key, value]: [ServiceTypes, boolean]) => value && this.startService(key))
  }

  startService(target: ServiceTypes) {
    switch (target) {
      case 'vlc': {
        this.vlc = new Vlc();
      }
    }
  }
}
