using UnityEngine;
using Firebase;
using Firebase.Analytics;
using SkyHop.Core;

namespace SkyHop.Managers
{
    public class AnalyticsManager : Singleton<AnalyticsManager>
    {
        private bool isFirebaseInitialized = false;

        protected override void Awake()
        {
            base.Awake();
            FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task => {
                var dependencyStatus = task.Result;
                if (dependencyStatus == DependencyStatus.Available)
                {
                    FirebaseAnalytics.SetAnalyticsCollectionEnabled(true);
                    isFirebaseInitialized = true;
                    LogEvent("app_open");
                }
            });
        }

        public void LogEvent(string eventName)
        {
            if (!isFirebaseInitialized) return;
            FirebaseAnalytics.LogEvent(eventName);
        }

        public void LogScore(int score)
        {
            if (!isFirebaseInitialized) return;
            FirebaseAnalytics.LogEvent("post_score", "score", score);
        }
    }
}
