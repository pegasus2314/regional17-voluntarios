/* Regional 17 — stability preload
   Must load BEFORE app.js. Prevents full-shell repaints during data refreshes
   while preserving real navigation between views. */
(() => {
  'use strict';
  if (window.__R17_STABILITY_PRELOAD__) return;
  window.__R17_STABILITY_PRELOAD__ = true;

  const mount = document.getElementById('app');
  if (!mount) return;

  const proto = Object.getPrototypeOf(mount);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'innerHTML') ||
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');
  if (!descriptor?.set || !descriptor?.get) return;

  const nativeGet = descriptor.get;
  const nativeSet = descriptor.set;

  Object.defineProperty(mount, 'innerHTML', {
    configurable: true,
    enumerable: false,
    get: nativeGet.bind(mount),
    set(value) {
      const html = String(value ?? '');
      const current = nativeGet.call(mount);
      const isShell = html.includes('class="shell"');
      const hasShell = current.includes('class="shell"');

      // app.js calls layout() after every database refresh. Replacing the
      // complete shell is what caused the visible blink and destroyed UI state.
      // Keep it when the view is unchanged; render() updates #content itself.
      if (isShell && hasShell) {
        const incoming = document.createElement('div');
        incoming.innerHTML = html;
        const currentTitle = mount.querySelector('.topbar h1')?.textContent?.trim() || '';
        const incomingTitle = incoming.querySelector('.topbar h1')?.textContent?.trim() || '';
        if (currentTitle === incomingTitle) return;
      }

      nativeSet.call(mount, value);
    }
  });

  // Realtime can emit several table changes in one logical operation.
  // Debounce the callback chain before app.js's reload() runs.
  const originalCreateClient = window.supabase?.createClient;
  if (typeof originalCreateClient === 'function') {
    window.supabase.createClient = function(...args) {
      const client = originalCreateClient.apply(this, args);
      const originalChannel = client.channel.bind(client);
      client.channel = function(...channelArgs) {
        const channel = originalChannel(...channelArgs);
        const originalOn = channel.on.bind(channel);
        const timers = new Map();
        const proxy = new Proxy(channel, {
          get(target, prop, receiver) {
            if (prop === 'on') {
              return (type, filter, callback, ...rest) => {
                if (type === 'postgres_changes' && typeof callback === 'function') {
                  const key = `${filter?.table || '*'}:${filter?.event || '*'}`;
                  const wrapped = (...cbArgs) => {
                    clearTimeout(timers.get(key));
                    timers.set(key, setTimeout(() => {
                      timers.delete(key);
                      callback(...cbArgs);
                    }, 180));
                  };
                  const result = originalOn(type, filter, wrapped, ...rest);
                  return result === target ? proxy : result;
                }
                const result = originalOn(type, filter, callback, ...rest);
                return result === target ? proxy : result;
              };
            }
            const value = Reflect.get(target, prop, receiver);
            return typeof value === 'function' ? value.bind(target) : value;
          }
        });
        return proxy;
      };
      return client;
    };
  }
})();
