(ns circleci-monitor.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [ajax.core :refer [GET POST]]
            [clojure.string :as string]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [cljs.core.async :refer [chan <! >! timeout onto-chan]]))

(def circle-ci-url "https://circleci.com/api/v1")
(def circle-ci-user-url (string/join "" [circle-ci-url "/me"]))
(def circle-ci-project-url (string/join "" [circle-ci-url "/projects"]))

(def branch-updates (chan))
(def app-state (atom { :current_branches ["kjhkjh"] }))

; define the function for publishing
(defn randomly-constantly
  [channel publish-value]
    (go (loop []
      (<! (timeout 10000 ))
      (>! channel publish-value)
    (recur))))
(randomly-constantly branch-updates ["channel-one" "boo" "lakjsdf"] )

(defn handler [response]
    (swap! app-state assoc :current_branches ["error", "other"]))

(defn error-handler [{:keys [status status-text]}]
    (.log js/console (str "something bad happened: " status " " status-text)))

(def browser-action (.-browserAction js/chrome))

(add-watch app-state :watch-change (fn [key a old-val new-val]
    (. browser-action (setBadgeText (js-obj "text" (str (count (:current_branches new-val))))))))

(GET circle-ci-user-url {:handler handler :error-handler error-handler})

(defn contact-view [app owner]
  (reify
    om/IRender
    (render [this]
      (apply dom/ul nil
        (map (fn [text]
          (dom/li nil text))
        (:current_branches app))))))

(defn popup [root-node]
  (.log js/console "attaching")
  (om/root contact-view app-state
     {:target root-node}))

(defn shutdown-popup [root-node]
  (.log js/console "detaching")
  (om/detach-root root-node))
