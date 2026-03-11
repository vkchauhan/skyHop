using UnityEngine;
using SkyHop.Managers;

namespace SkyHop.UI
{
    public class MainMenuController : MonoBehaviour
    {
        public void OnPlayClicked()
        {
            GameManager.Instance.StartGame();
            AnalyticsManager.Instance.LogEvent("game_start");
        }

        public void OnLeaderboardClicked()
        {
            PlayGamesManager.Instance.ShowLeaderboard();
        }

        public void OnSettingsClicked()
        {
            // Open settings panel
        }

        public void OnQuitClicked()
        {
            Application.Quit();
        }
    }
}
