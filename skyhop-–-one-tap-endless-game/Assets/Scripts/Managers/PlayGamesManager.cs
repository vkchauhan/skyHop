using UnityEngine;
using GooglePlayGames;
using GooglePlayGames.BasicApi;
using SkyHop.Core;

namespace SkyHop.Managers
{
    public class PlayGamesManager : Singleton<PlayGamesManager>
    {
        [SerializeField] private string leaderboardId = "YOUR_LEADERBOARD_ID";

        protected override void Awake()
        {
            base.Awake();
            PlayGamesPlatform.Activate();
            Authenticate();
        }

        public void Authenticate()
        {
            PlayGamesPlatform.Instance.Authenticate(status => {
                if (status == SignInStatus.Success)
                {
                    Debug.Log("Logged in to Google Play Games");
                }
            });
        }

        public void PostScore(int score)
        {
            if (PlayGamesPlatform.Instance.IsAuthenticated())
            {
                Social.ReportScore(score, leaderboardId, success => {
                    Debug.Log(success ? "Score posted" : "Score post failed");
                });
            }
        }

        public void ShowLeaderboard()
        {
            if (PlayGamesPlatform.Instance.IsAuthenticated())
            {
                Social.ShowLeaderboardUI();
            }
            else
            {
                Authenticate();
            }
        }
    }
}
