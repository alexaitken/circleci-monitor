(ns circleci-monitor.branches
  (:require [clojure.string :as string]))

(defn branch-matters? [username, branch]
  (or (= (first branch) "master") (some #(= username %) (get (second branch) "pusher_logins"))))

(defn extract-branches [projects, username]
  (def user-branch? (partial branch-matters? username))
  (flatten
    (mapv (fn [project] (keys (filter user-branch? (get project "branches"))))
    projects)))

