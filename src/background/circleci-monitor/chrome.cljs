(ns circleci-monitor.chrome)

(def browser-action (.-browserAction js/chrome))

(def background-page (js/chrome.extension.getBackgroundPage))

(defn set-badge-text [text]
  (. browser-action (setBadgeText (js-obj "text" text))))

(defn set-icon [options]
  (. browser-action (setIcon options)))

(defn open [url]
  (js/chrome.tabs.create (js-obj "url" url)))
