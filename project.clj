(defproject om-tut "0.1.0-SNAPSHOT"
  :description "FIXME: write this!"
  :url "http://example.com/FIXME"

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2311"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [cljs-ajax "0.3.3"]
                 [om "0.7.1"]]

  :plugins [[lein-cljsbuild "1.0.4-SNAPSHOT"]
            [lein-haml-sass "0.2.7-SNAPSHOT"]
            [lein-pdo "0.1.1"]]

  :source-paths ["src"]

  :cljsbuild {
    :builds [{:id "circleci-monitor"
              :source-paths ["src"]
              :compiler {
                :output-to "circleci-monitor.js"
                :output-dir "out"
                :optimizations :none
                :source-map true}}]}

  :scss {:src "stylesheets"
    :output-directory "stylesheets"}
)
