(ns circleci-monitor.view
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [circleci-monitor.chrome :as chrome]
            [circleci-monitor.branches :as branches]
            [circleci-monitor.state :as state]))
(defn branch-url [branch]
  (str "https://circleci.com/gh/" (:username branch) "/" (:reponame branch) "/" (branches/last-build-number branch)))

(defn contact-view [app owner]
  (reify
    om/IRender
    (render [this]
      (apply dom/ul nil
        (map (fn [branch]
          (let [url (branch-url branch)]
            (dom/li #js {:className (branches/last-build-status branch)
                         :onClick #(chrome/open url)}
                    (:branch-name branch))))
        (:current-branches app))))))

(defn ^:export start-popup [root-node]
  (.log js/console "attaching")
  (om/root contact-view state/app-state
     {:target root-node}))

(defn ^:export shutdown-popup [root-node]
  (.log js/console "detaching")
  (om/detach-root root-node))
