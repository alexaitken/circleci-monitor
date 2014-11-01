(ns circleci-monitor.requests
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [circleci-monitor.state :as state]
            [ajax.core :refer [GET POST]]
            [clojure.string :as string]
            [cljs.core.async :refer [chan <! >! timeout onto-chan]]))

(def circle-ci-url "https://circleci.com/api/v1")
(def circle-ci-user-url (string/join "" [circle-ci-url "/me"]))
(def circle-ci-project-url (string/join "" [circle-ci-url "/projects"]))

(defn handler [response]
  (let [r (.parse js/JSON response)]
    (state/apply-user state/app-state (aget r "login"))))

(defn error-handler [{:keys [status status-text]}]
  (state/user-load-failed state/app-state)
  (.log js/console (str "something bad happened: " status " " status-text)))

(defn ^:export start-requests []
  (GET circle-ci-user-url {:handler handler
                       :error-handler error-handler
                       :response-format :raw
                       :headers {"Accept" "application/json"}
                      }))
