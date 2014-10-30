(ns circleci-monitor.popup)

(def background-page (js/chrome.extension.getBackgroundPage))
(def background background-page.circleci-monitor.view)

(background.start-popup (. js/document (getElementById "app0")))

(defn shutdown []
  (background.shutdown-popup (. js/document (getElementById "app0"))))

(js/addEventListener "unload" shutdown)
