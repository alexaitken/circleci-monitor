(ns om-tut.web)

(def background-page (js/chrome.extension.getBackgroundPage))
(def background background-page.om-tut.core)

(background.popup (. js/document (getElementById "app0")))

(defn shutdown []
  (background.shutdown-popup (. js/document (getElementById "app0"))))

(js/addEventListener "unload" shutdown)
