(ns circleci-monitor.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [ajax.core :refer [GET POST]]
            [clojure.string :as string]
            [cljs.core.async :refer [chan <! >! timeout onto-chan]]))

(def circle-ci-url "https://circleci.com/api/v1")
(def circle-ci-user-url (string/join "" [circle-ci-url "/me"]))
(def circle-ci-project-url (string/join "" [circle-ci-url "/projects"]))
(def load-statuses [:started
                    :not-signed-in
                    :user-loaded
                    :branches-loaded
                    :branches-not-loaded
                    :update-failure])

(def app-state (atom {:current_branches ["kjhkjh"]
                      :user nil
                      :load-status :started}))

(defn handler [response]
  (let [r (.parse js/JSON response)]
    (swap! app-state (fn[state]
      (assoc state assoc :user (aget r "login"))
      (assoc state :load-status :user-loaded)))))

(defn error-handler [{:keys [status status-text]}]
  (swap! app-state assoc :load-status :not-signed-in)
  (.log js/console (str "something bad happened: " status " " status-text)))

(def browser-action (.-browserAction js/chrome))

(add-watch app-state :badge-icon-watch (fn [key a old-val new-val]
    (. browser-action (setBadgeText (js-obj "text" (str (count (:current_branches new-val))))))))

(add-watch app-state :start-loading-branches (fn [key state old-val new-val]
                                               (.log js/console (str key " " old-val " " new-val))
                                               (if (and
                                                     (not(= (:load-status old-val) :user-loaded))
                                                     (= (:load-status new-val) :user-loaded))
                                                 (.log js/console "should start branch loading"))))

(GET circle-ci-user-url {:handler handler
                         :error-handler error-handler
                         :response-format :raw
                         :headers {"Accept" "application/json"}
                        })
