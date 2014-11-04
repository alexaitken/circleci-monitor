(defproject om-tut "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :url "http://example.com/FIXME"

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2311"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [cljs-ajax "0.3.3"]
                 [com.cognitect/transit-cljs "0.8.188"]
                 [om "0.7.1"]]

  :plugins [[lein-cljsbuild "1.0.4-SNAPSHOT"]
            [lein-haml-sass "0.2.7-SNAPSHOT"]
            [com.cemerick/clojurescript.test "0.3.1"]
            [lein-pdo "0.1.1"]]

  :source-paths ["src"]

  :cljsbuild {
    :builds [{:id "circleci-monitor"
              :source-paths ["src/background"]
              :compiler {
                :output-to "circleci-monitor.js"
                :output-dir "out/background"
                :externs ["vendor/react.js"]
                :optimizations :none
                :closure-defines {"goog.json.USE_NATIVE_JSON" true}
                :source-map :true
                }}
             {:id "circleci-monitor-test"
              :source-paths ["src/background" "src/test"]
              :compiler {
                :output-to "circleci-monitor-test.js"
                :output-dir "out/test"
                :externs ["vendor/react.js"]
                :optimizations :simple
                :closure-warnings {:externs-validation :off}
                }}
             {:id "circleci-monitor-pop"
              :source-paths ["src/popup"]
              :compiler {
                :output-to "circleci-monitor-popup.js"
                :output-dir "out/popup"
                :optimizations :none
                }}]

    :test-commands {"unit-tests" ["phantomjs" :runner "out/test/goog/base.js" "circleci-monitor-test.js" "test-run.js"]}}

  :scss {
    :src "stylesheets"
    :output-directory "stylesheets"}
)
