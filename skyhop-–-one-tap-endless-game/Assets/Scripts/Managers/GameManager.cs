using UnityEngine;
using UnityEngine.SceneManagement;
using SkyHop.Core;
using SkyHop.Ads;

namespace SkyHop.Managers
{
    public class GameManager : Singleton<GameManager>
    {
        public enum GameState { MainMenu, Playing, GameOver }
        public GameState CurrentState { get; private set; }

        private int sessionCount = 0;

        void Start()
        {
            SetState(GameState.MainMenu);
        }

        public void SetState(GameState newState)
        {
            CurrentState = newState;
            switch (newState)
            {
                case GameState.Playing:
                    Time.timeScale = 1f;
                    break;
                case GameState.GameOver:
                    Time.timeScale = 0f;
                    sessionCount++;
                    CheckForInterstitial();
                    break;
            }
        }

        private void CheckForInterstitial()
        {
            // Show interstitial every 3 games
            if (sessionCount % 3 == 0)
            {
                AdsManager.Instance.ShowInterstitial();
            }
        }

        public void StartGame()
        {
            SceneManager.LoadScene("GameScene");
            SetState(GameState.Playing);
        }

        public void RestartGame()
        {
            StartGame();
        }

        public void BackToMenu()
        {
            SceneManager.LoadScene("MainMenu");
            SetState(GameState.MainMenu);
        }
    }
}
