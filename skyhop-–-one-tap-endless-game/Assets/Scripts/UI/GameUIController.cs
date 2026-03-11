using UnityEngine;
using TMPro;
using SkyHop.Managers;
using SkyHop.Gameplay;
using SkyHop.Ads;

namespace SkyHop.UI
{
    public class GameUIController : MonoBehaviour
    {
        [Header("HUD")]
        [SerializeField] private TextMeshProUGUI scoreText;
        
        [Header("GameOver Panel")]
        [SerializeField] private GameObject gameOverPanel;
        [SerializeField] private TextMeshProUGUI finalScoreText;
        [SerializeField] private TextMeshProUGUI bestScoreText;
        [SerializeField] private GameObject reviveButton;

        private bool hasRevived = false;

        void OnEnable()
        {
            PlayerController.OnPlayerDeath += HandleGameOver;
            PlayerController.OnCoinCollected += UpdateCoinUI;
        }

        void OnDisable()
        {
            PlayerController.OnPlayerDeath -= HandleGameOver;
            PlayerController.OnCoinCollected -= UpdateCoinUI;
        }

        void Start()
        {
            gameOverPanel.SetActive(false);
            AdsManager.Instance.ShowBanner();
        }

        void Update()
        {
            if (GameManager.Instance.CurrentState == GameManager.GameState.Playing)
            {
                scoreText.text = ScoreManager.Instance.CurrentScore.ToString();
            }
        }

        private void HandleGameOver()
        {
            GameManager.Instance.SetState(GameManager.GameState.GameOver);
            gameOverPanel.SetActive(true);
            
            finalScoreText.text = "Score: " + ScoreManager.Instance.CurrentScore;
            bestScoreText.text = "Best: " + ScoreManager.Instance.HighScore;

            reviveButton.SetActive(!hasRevived);

            AnalyticsManager.Instance.LogEvent("game_over");
            AnalyticsManager.Instance.LogScore(ScoreManager.Instance.CurrentScore);
            PlayGamesManager.Instance.PostScore(ScoreManager.Instance.CurrentScore);
        }

        public void OnRestartClicked()
        {
            GameManager.Instance.RestartGame();
        }

        public void OnReviveClicked()
        {
            AdsManager.Instance.ShowRewarded(() => {
                hasRevived = true;
                gameOverPanel.SetActive(false);
                FindAnyObjectByType<PlayerController>().Revive();
                GameManager.Instance.SetState(GameManager.GameState.Playing);
                AnalyticsManager.Instance.LogEvent("revive_used");
            });
        }

        public void OnMenuClicked()
        {
            GameManager.Instance.BackToMenu();
        }

        private void UpdateCoinUI()
        {
            ScoreManager.Instance.AddCoins(1);
        }
    }
}
