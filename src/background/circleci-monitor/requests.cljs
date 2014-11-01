(ns circleci-monitor.requests
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [circleci-monitor.state :as state]
            [circleci-monitor.branches :as branches]
            [ajax.core :refer [GET POST]]
            [cognitect.transit :as transit]
            [clojure.string :as string]))

(def circle-ci-url "https://circleci.com/api/v1")
(def circle-ci-user-url (string/join "" [circle-ci-url "/me"]))
(def circle-ci-project-url (string/join "" [circle-ci-url "/projects"]))
(def reader (transit/reader :json))

(defn user-handler [response]
  (let [r (.parse js/JSON response)]
    (state/apply-user state/app-state (aget r "login"))))

(defn user-error-handler [{:keys [status status-text]}]
  (state/user-load-failed state/app-state)
  (.log js/console (str "something bad happened: " status " " status-text)))

(defn ^:export start-requests []
  (GET circle-ci-user-url {:handler user-handler
                           :error-handler user-error-handler
                           :response-format :raw
                           :headers {"Accept" "application/json"}}))

(defn project-handler [projects]
  (.log js/console projects)
  (state/apply-branches state/app-state (branches/extract-branches projects (:user @state/app-state))))

(defn project-error-handler [{:keys [status status-text]}]
  (.log js/console (str "branch: something bad happened: " status " " status-text)))

(defn ^:export update-branches []
  (GET circle-ci-project-url {:handler project-handler
                           :error-handler project-error-handler
                           :response-format :transit
                           :headers {"Accept" "application/json"}}))
