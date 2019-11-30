import Axios, { AxiosBasicCredentials } from 'axios';

import { BaseMonitor, MonitorConfig, PlayerState } from '../monitor';

export type VlcConfig = {
  host: string;
  port: string;
  auth?: AxiosBasicCredentials;
}

// Only added the used types
export type VlcStatusResponse = {
  state: Exclude<PlayerState, PlayerState.Inactive>;
  time?: number;
  length?: number;
  information?: {
    category: {
      meta: {
        filename: string;
        episodeNumber?: string;
        seasonNumber?: string;
        showName?: string;
        title?: string;
      }
    }
  }
}

export class VlcMonitor extends BaseMonitor {
  paths = {
    status: `http://${this.vlcConfig.host}:${this.vlcConfig.port}/requests/status.json`,
  }

  constructor(public config: MonitorConfig, public vlcConfig: VlcConfig) {
    super(config);
  }

  async getStatus() {
    try {
      const { data } = await Axios.get<VlcStatusResponse>(this.paths.status, { auth: this.vlcConfig.auth });

      const meta = data.information && data.information && data.information.category && data.information.category.meta
      const { filename, episodeNumber, seasonNumber, showName, title } = (meta || {})

      return {
        filename,
        episodeNumber,
        seasonNumber,
        showName,
        title,
        state: data.state,
        time: data.time,
        length: data.length,
      }
    } catch (error) {
      return {
        state: PlayerState.Inactive,
      }
    }
  }
}
