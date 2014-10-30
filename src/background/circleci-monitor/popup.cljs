(ns circleci-monitor.view
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [circleci-monitor.core :as core]))

(defn contact-view [app owner]
  (reify
    om/IRender
    (render [this]
      (apply dom/ul nil
        (map (fn [text]
          (dom/li nil text))
        (:current_branches app))))))

(defn ^:export start-popup [root-node]
  (.log js/console "attaching")
  (om/root contact-view core/app-state
     {:target root-node}))

(defn ^:export shutdown-popup [root-node]
  (.log js/console "detaching")
  (om/detach-root root-node))
