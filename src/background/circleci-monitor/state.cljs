(ns circleci-monitor.state)

(def app-state (atom {:current_branches ["kjhkjh"]
                      :user nil
                      :load-status :started}))

(defn apply-user [app-state user]
  (swap! app-state (fn[state]
    (assoc state assoc :user :user))
    (assoc state :load-status :user-loaded)))

(defn user-load-failed [app-state]
  (swap! app-state assoc :load-status :not-signed-in))
