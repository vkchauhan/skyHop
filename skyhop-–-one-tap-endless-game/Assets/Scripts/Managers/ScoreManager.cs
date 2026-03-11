using UnityEngine;
using SkyHop.Core;

namespace SkyHop.Managers
{
    public class ScoreManager : Singleton<ScoreManager>
    {
        public int CurrentScore { get; private set; }
        public int HighScore { get; private set; }
        public int TotalCoins { get; private set; }

        private const string HIGH_SCORE_KEY = "HighScore";
        private const string COINS_KEY = "TotalCoins";

        protected override void Awake()
        {
            base.Awake();
            HighScore = PlayerPrefs.GetInt(HIGH_SCORE_KEY, 0);
            TotalCoins = PlayerPrefs.GetInt(COINS_KEY, 0);
        }

        public void AddScore(int amount)
        {
            CurrentScore += amount;
            if (CurrentScore > HighScore)
            {
                HighScore = CurrentScore;
                PlayerPrefs.SetInt(HIGH_SCORE_KEY, HighScore);
            }
        }

        public void AddCoins(int amount)
        {
            TotalCoins += amount;
            PlayerPrefs.SetInt(COINS_KEY, TotalCoins);
        }

        public void ResetSessionScore()
        {
            CurrentScore = 0;
        }
    }
}
