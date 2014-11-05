(ns circleci-monitor.core
  (:require [circleci-monitor.requests :as requests]
            [circleci-monitor.state :as state]
            [circleci-monitor.view :as view]
            [circleci-monitor.chrome :as chrome]
            [circleci-monitor.branches :as b]
            [clojure.string :as string]))

(def statuses-to-icons {"success" "green",
                        "fixed" "green"
                        "failed" "red"
                        "running" "blue"
                        "other" "grey"
                        })

(add-watch state/app-state :badge-icon-watch
  (fn [key a old-val new-val]
    (chrome/set-badge-text (str (b/count-feature-branches (:current-branches new-val))))

    (let [icon (or (get statuses-to-icons (b/recent-branch-status (b/feature-branches (:current-branches new-val))))
                   (get statuses-to-icons "other"))]
      (chrome/set-icon (js-obj "path" (js-obj "19" (str "images/" icon "-19.png")
                                                    "38" (str "images/" icon "-38.png")))))))

(add-watch state/app-state :start-loading-branches
  (fn [key state old-val new-val]
    (if (and
          (not(= (:load-status old-val) :user-loaded))
          (= (:load-status new-val) :user-loaded))
      (requests/update-branches))))

(requests/start-requests)
