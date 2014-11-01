(ns circleci-monitor.core
  (:require [circleci-monitor.requests :as requests]
            [circleci-monitor.state :as state]
            [circleci-monitor.view :as view]
            [clojure.string :as string]))

(def browser-action (.-browserAction js/chrome))

(add-watch state/app-state :badge-icon-watch
  (fn [key a old-val new-val]
    (. browser-action (setBadgeText (js-obj "text" (str (count (:current-branches new-val))))))))

(add-watch state/app-state :start-loading-branches
  (fn [key state old-val new-val]
    (if (and
          (not(= (:load-status old-val) :user-loaded))
          (= (:load-status new-val) :user-loaded))
      (requests/update-branches))))

(requests/start-requests)

