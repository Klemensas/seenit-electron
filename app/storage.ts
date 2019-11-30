import Store from 'electron-store'

const store = new Store({
  defaults: {
    isConfigured: false,
    services: {
      vlc: false,
      browser: false,
    }
  },
});

export default store;
