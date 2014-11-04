(ns test.circleci-monitor.branches
  (:require-macros [cemerick.cljs.test :refer (is deftest with-test run-tests testing test-var)])
  (:require [cemerick.cljs.test :as t]
            [circleci-monitor.branches :as b]))

(deftest master-always-matters
    (is (b/branch-matters?
          "good-dev",
          ["master",
           {"pusher_logins" ["someone" "someoneelse"]}])))

(deftest branches-with-your-user-matter
    (is (b/branch-matters?
          "good-dev",
          ["some-branch",
           {"pusher_logins" ["someone" "good-dev" "someoneelse"]}])))

(deftest branches-that-are-not-master-and-you-have-not-pushed-to-dont-matter
    (is (not(b/branch-matters?
          "good-dev",
          ["some-branch",
           {"pusher_logins" ["someone" "someoneelse"]}]))))
