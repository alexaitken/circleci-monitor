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
            [lein-pdo "0.1.1"]]

  :source-paths ["src"]

  :cljsbuild {
    :builds [{:id "circleci-monitor"
              :source-paths ["src/background"]
              :compiler {
                :output-to "circleci-monitor.js"
                :output-dir "out/background"
                :optimizations :none
                :closure-defines {"goog.json.USE_NATIVE_JSON" true}
                :source-map :true
                }}
             {:id "circleci-monitor-pop"
              :source-paths ["src/popup"]
              :compiler {
                :output-to "circleci-monitor-popup.js"
                :output-dir "out/popup"
                :optimizations :none
                }}]}

  :scss {:src "stylesheets"
    :output-directory "stylesheets"}
)
