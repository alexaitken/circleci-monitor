(ns circleci-monitor.branches
  (:require [clojure.string :as string]))

(defn branch-matters? [username branch]
  (or (= (:branch-name branch) "master")
      (some #(= username %)
            (:pusher-logins branch))))

(defn reduce-to-branches [projects]
  (flatten (mapv (fn [project]
                   (def project-convert-branch (partial convert-branch project))
                   (mapv project-convert-branch (get project "branches")))
                 projects)))

(defn count-feature-branches [branches]
  (count (feature-branches branches)))

(defn feature-branches [branches]
  (filter (fn [branch]
            (not (= (:branch-name branch) "master")))
          branches))

(defn extract-branches [projects username]
  (def user-branch? (partial branch-matters? username))
  (filter user-branch? (reduce-to-branches projects)))

(defn convert-branch [project branch]
  (let [branch-details (second branch)]
    {:branch-name (first branch)
     :pusher-logins (get branch-details "pusher_logins")
     :reponame (get project "reponame")
     :username (get project "username")
     :builds (take 5
                   (concat (get branch-details "running_builds")
                           (get branch-details "recent_builds")))}))

(defn last-build-status [branch]
  (get (first (:builds branch)) "status"))

(defn last-build-number [branch]
  (get (first (:builds branch)) "build_num"))

(defn recent-branch-status [branches]
  (last-build-status (first (order-branches branches))))

(defn order-branches [branches]
  (sort-by (fn [branch]
             (get (first (:builds branch)) "added_at"))
           branches))
