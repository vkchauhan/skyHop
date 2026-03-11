using UnityEngine;
using System;

namespace SkyHop.Managers
{
    public class DailyRewardManager : SkyHop.Core.Singleton<DailyRewardManager>
    {
        private const string LAST_REWARD_TIME = "LastRewardTime";
        private const int REWARD_AMOUNT = 100;

        public bool IsRewardAvailable()
        {
            string lastTimeStr = PlayerPrefs.GetString(LAST_REWARD_TIME, string.Empty);
            if (string.IsNullOrEmpty(lastTimeStr)) return true;

            DateTime lastTime = DateTime.Parse(lastTimeStr);
            return (DateTime.Now - lastTime).TotalHours >= 24;
        }

        public void ClaimReward()
        {
            if (IsRewardAvailable())
            {
                ScoreManager.Instance.AddCoins(REWARD_AMOUNT);
                PlayerPrefs.SetString(LAST_REWARD_TIME, DateTime.Now.ToString());
                AnalyticsManager.Instance.LogEvent("daily_reward_claimed");
            }
        }
    }
}
