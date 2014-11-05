(ns test.circleci-monitor.branches
  (:require-macros [cemerick.cljs.test :refer (is deftest with-test run-tests testing test-var)])
  (:require [cemerick.cljs.test :as t]
            [circleci-monitor.branches :as b]))

(deftest master-always-matters
    (is (b/branch-matters? "good-dev"
                           {:branch-name "master"
                            :pusher-logins ["someone" "someoneelse"]})))

(deftest branches-with-your-user-matter
    (is (b/branch-matters? "good-dev"
                           {:branch-name "some-branch"
                            :pusher-logins ["someone" "good-dev" "someoneelse"]})))

(deftest branches-that-are-not-master-and-you-have-not-pushed-to-dont-matter
    (is (not(b/branch-matters? "good-dev"
                               {:branch-name "some-branch"
                                :pusher-logins ["someone" "someoneelse"]}))))

(deftest no-projects-results-in-no-branches
  (is (= [{:branch-name "branch_123"
           :pusher-logins ["login1" "login2"]
           :reponame "repo1"
           :username "Shopify"}]
         (b/reduce-to-branches [{"branches" { "branch_123" { "pusher_logins" ["login1", "login2"] }}
                                "reponame" "repo1"
                                "username" "Shopify"}]))))


(deftest feature-branches-removes-all-masters
  (let [feature-branch-1 { :branch_name "feature-branch-1" }]
    (is (= [feature-branch-1]
           (b/feature-branches [{:branch-name "master"}
                                feature-branch-1
                                {:branch-name "master"}])))))

