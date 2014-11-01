(ns circleci-monitor.state)

(def app-state (atom {:current-branches []
                      :user nil
                      :load-status :started}))

(defn apply-user [app-state user]
  (swap! app-state assoc :user user :load-status :user-loaded))

(defn user-load-failed [app-state]
  (swap! app-state assoc :load-status :not-signed-in))

(defn apply-branches [app-state branches]
  (swap! app-state assoc :current-branches (vec branches) :load-status :branches-loaded))
