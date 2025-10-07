import React, { useEffect, useState } from "react";

interface LogEntry {
  url: string;
  status: string;
  size: string;
  time: string;
}

type MonitorKind = 'js' | 'css' | 'prefetch' | 'xhr';

interface MonitorTypes {
  js?: boolean;
  xhr?: boolean;
  css?: boolean;
  prefetch?: boolean; 
}

interface Props {
  types?: MonitorTypes;
}

const NetworkMonitor: React.FC<Props> = ({ types }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [enabledTypes, setEnabledTypes] = useState<Required<MonitorTypes>>({
    js: false,
    xhr: false,
    css: false,
    prefetch: false,
  });

  useEffect(() => {
    setEnabledTypes({
      js: types?.js ?? false,
      xhr: types?.xhr ?? false,
      css: types?.css ?? false,
      prefetch: types?.prefetch ?? false,
    });
  }, [types]);
  
  const titleText = (() => {
    const t = enabledTypes;
    const labels: Array<string> = [];
    if (t.js) labels.push('JS');
    if (t.css) labels.push('CSS');
    if (t.prefetch) labels.push('Prefetch');
    if (t.xhr) labels.push('XHR');
    return labels.length === 4 ? 'All' : labels.join(', ');
  })();

  useEffect(() => {
    const seen = new Set<string>();

    const addLog = (url: string, status: string, size: string) => {
      setLogs(prev => [
        ...prev,
        { url, status, size, time: new Date().toLocaleTimeString() },
      ]);
    };

    const probe = (url: string, kind: MonitorKind) => {
      const allow = enabledTypes;
      if ((kind === 'js' && !allow.js) ||
          (kind === 'css' && !allow.css) ||
          (kind === 'prefetch' && !allow.prefetch) ||
          (kind === 'xhr' && !allow.xhr)) {
        return;
      }
      if (!url || seen.has(url)) return;
      seen.add(url);
      const start = performance.now();
      // HEAD is often blocked; use GET but don't cache-bust to keep CDNs effective
      fetch(url, { method: 'GET', credentials: 'same-origin' })
        .then(async res => {
          let size = '-';
          try {
            const buf = await res.arrayBuffer();
            size = `${(buf.byteLength / 1024).toFixed(1)} KB`;
          } catch {}
          const time = (performance.now() - start).toFixed(0);
          addLog(url, `${res.status} (${time} ms)`, size);
        })
        .catch(() => addLog(url, 'ERR', '-'));
    };

    const scriptDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
    let restoredScriptSetter: (() => void) | null = null;
    if (scriptDesc && scriptDesc.set) {
      const originalSet = scriptDesc.set;
      const originalGet = scriptDesc.get;
      Object.defineProperty(HTMLScriptElement.prototype, 'src', {
        configurable: true,
        get: function (this: HTMLScriptElement) {
          return originalGet ? originalGet.call(this) : '';
        },
        set: function (this: HTMLScriptElement, value: string) {
          try { probe(value, 'js'); } catch {}
          originalSet!.call(this, value);
        }
      });
      restoredScriptSetter = () => {
        Object.defineProperty(HTMLScriptElement.prototype, 'src', scriptDesc);
      };
    }

    const originalSetAttrScript = HTMLScriptElement.prototype.setAttribute;
    HTMLScriptElement.prototype.setAttribute = function(this: HTMLScriptElement, name: string, value: string) {
      if (name === 'src' && typeof value === 'string') probe(value, 'js');
      return originalSetAttrScript.call(this, name, value);
    } as any;

    const originalSetAttrLink = HTMLLinkElement.prototype.setAttribute;
    HTMLLinkElement.prototype.setAttribute = function(this: HTMLLinkElement, name: string, value: string) {
      if ((name === 'href' || name === 'as') && typeof this.href === 'string') {
        const rel = this.rel;
        const href = name === 'href' ? value : this.href;
        if (rel === 'preload' || rel === 'prefetch' || rel === 'modulepreload') {
          if (href) probe(href, 'prefetch');
        }
        if (rel === 'stylesheet' && name === 'href' && href) probe(href, 'css');
      }
      return originalSetAttrLink.call(this, name, value);
    } as any;

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (node instanceof HTMLScriptElement && node.src) {
            probe(node.src, 'js');
          }
          if (node instanceof HTMLLinkElement) {
            const rel = node.rel;
            if ((rel === 'preload' || rel === 'prefetch' || rel === 'modulepreload') && node.href) {
              probe(node.href, 'prefetch');
            }
            if (rel === 'stylesheet' && node.href) probe(node.href, 'css');
          }
        });
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      try {
        const url = typeof input === 'string' ? input : (input as Request).url;
        probe(url, 'xhr');
      } catch {}
      return originalFetch.call(window, input as any, init);
    } as typeof window.fetch;

    const OriginalXHR = window.XMLHttpRequest;
    const openKey: 'open' = 'open';
    const sendKey: 'send' = 'send';
    (window as any).XMLHttpRequest = function(this: XMLHttpRequest) {
      const xhr = new OriginalXHR();
      let _url = '';
      const originalOpen: any = (xhr as any)[openKey];
      (xhr as any)[openKey] = function(this: XMLHttpRequest, method: string, url: string, ...rest: any[]) {
        _url = url;
        return originalOpen.apply(this, [method, url, ...rest] as any);
      } as any;
      const originalSend: any = (xhr as any)[sendKey];
      (xhr as any)[sendKey] = function(this: XMLHttpRequest, body?: any) {
        try { if (_url) probe(_url, 'xhr'); } catch {}
        return originalSend.call(this, body as any);
      } as any;
      return xhr;
    } as any;

    return () => {
      if (restoredScriptSetter) restoredScriptSetter();
      HTMLScriptElement.prototype.setAttribute = originalSetAttrScript;
      HTMLLinkElement.prototype.setAttribute = originalSetAttrLink;
      observer.disconnect();
      window.fetch = originalFetch;
      window.XMLHttpRequest = OriginalXHR;
    };
  }, [enabledTypes]);

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>📜 Network Monitor ({titleText})</h4>
      <div style={styles.logBox}>
        {logs.length === 0 ? (
          <div style={styles.empty}>No JS requests yet…</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={styles.logEntry}>
              <span style={styles.time}>[{log.time}]</span>{" "}
              <span style={styles.status}>{log.status}</span>{" "}
              <span style={styles.url}>{log.url}</span>{" "}
              <span style={styles.size}>({log.size})</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    bottom: 10,
    right: 10,
    width: 380,
    maxHeight: 300,
    overflowY: "auto",
    background: "rgba(0, 0, 0, 0.9)",
    color: "#00ff99",
    fontFamily: "monospace",
    fontSize: 12,
    border: "1px solid #00ff99",
    borderRadius: 6,
    padding: 8,
    zIndex: 99999,
  },
  title: {
    margin: "0 0 6px",
    color: "#fff",
    textAlign: "center",
    fontWeight: 500,
  },
  logBox: {
    maxHeight: 260,
    overflowY: "auto",
  },
  logEntry: {
    marginBottom: 3,
    wordBreak: "break-all",
  },
  time: { color: "#888" },
  status: { color: "#0f0" },
  url: { color: "#0ff" },
  size: { color: "#ccc" },
  empty: {
    textAlign: "center",
    color: "#888",
  },
};

export default NetworkMonitor;
