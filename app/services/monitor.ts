function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export enum PlayerState {
  Inactive = 'inactive',
  Stopped = 'stopped',
  Paused = 'paused',
  Playing = 'playing',
}

export type MonitorConfig = {
  isMonitoring: boolean;
  pollInterval: number;
  activePollInterval: number;
}

export type PlayerStatus = {
  state: PlayerState;
  time?: number;
  length?: number;
  title?: string;
  showName?: string;
  filename?: string;
  episodeNumber?: string;
  seasonNumber?: string;

}

export abstract class BaseMonitor {
  progressThreshold = 0.95
  lastStatus: PlayerStatus;

  constructor(public config: MonitorConfig) {
  }

  setConfig() {}

  updateStatus(status: PlayerStatus) {
    const stateChanged = this.lastStatus.state !== status.state;
    const hasActivePlay = !!this.lastStatus.filename
    const progress = this.lastStatus.time / this.lastStatus.length;

    // No previous item
    if (!hasActivePlay) {
      // No interesting change
      if (!status.filename) {
        this.lastStatus = { ...this.lastStatus, ...status };
        return;
      }

      //  Play started
      this.lastStatus = { ...this.lastStatus, ...status };
      return;
    }

    // Changed playing item
    if (status.filename !== this.lastStatus.filename) {
      // Could have finished the previous item

      if (progress >= this.progressThreshold) {
        // Log
      }

      this.lastStatus = { ...this.lastStatus, ...status };
      return;
    }

    // Player turned off
    if (stateChanged) {

      if (progress >= this.progressThreshold) {
        // Log
      }

      this.lastStatus = { ...this.lastStatus, ...status };
    }




    // if (stateChanged) {

    //   if (status.filename)
    //   if (this.lastStatus.state !== PlayerState.Playing)
    // }
    // this.lastStatus
  }

  abstract getStatus(): Promise<PlayerStatus>

  async listenToStatus() {
    while (this.config.isMonitoring) {
      const status = await this.getStatus();
      this.updateStatus(status);

      const pollInterval = status.state === PlayerState.Inactive ? this.config.activePollInterval : this.config.pollInterval;

      await sleep(pollInterval);
    }
  }
}
