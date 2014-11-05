(ns circleci-monitor.popup
  (:require [circleci-monitor.chrome :as chrome]))

(def background chrome/background-page.circleci-monitor.view)

(background.start-popup (. js/document (getElementById "branches")))

(defn shutdown []
  (background.shutdown-popup (. js/document (getElementById "branches"))))

(js/addEventListener "unload" shutdown)
