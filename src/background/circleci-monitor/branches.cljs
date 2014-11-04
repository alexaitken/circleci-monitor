(ns circleci-monitor.branches
  (:require [clojure.string :as string]))

(defn branch-matters? [username branch]
  (or (= (:branch-name branch) "master")
      (some #(= username %)
            (:pusher-logins branch))))


(defn reduce-to-branches [projects]
  (flatten (mapv (fn [project]
             (mapv (fn [branch]
                     {:branch-name (first branch)
                      :pusher-logins (get (second branch) "pusher_logins")
                      :reponame (get project "reponame")
                      :username (get project "username")})
                   (get project "branches")))
             projects)))

(defn extract-branches [projects username]
  (def user-branch? (partial branch-matters? username))
  (filter user-branch? (reduce-to-branches projects)))
