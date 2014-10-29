(ns om-tut.web
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [ajax.core :refer [GET POST]]
            [clojure.string :as string]
            [cljs.core.async :refer [chan <! >! timeout onto-chan]]))

(def background (js/chrome.extension.getBackgroundPage))

(def app-state js/om-tut.web.background.om-tut.core.app-state)
(.log js/console @app-state)
(.log js/console (str (:current_branches @app-state)))
(defn contact-view [app owner]
  (reify
    om/IRender
    (render [this]
      (apply dom/ul nil
        (map (fn [text]
          (dom/li nil text))
        (:current_branches app))))))

(om/root contact-view app-state
   {:target (. js/document (getElementById "app0"))})

