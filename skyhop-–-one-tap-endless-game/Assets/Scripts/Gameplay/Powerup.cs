using UnityEngine;
using System.Collections;
using SkyHop.Managers;

namespace SkyHop.Gameplay
{
    public class Powerup : MonoBehaviour
    {
        public enum PowerupType { Shield, SlowMotion, Magnet, DoubleScore }
        public PowerupType type;
        public float duration = 10f;

        private void OnTriggerEnter2D(Collider2D collision)
        {
            if (collision.CompareTag("Player"))
            {
                ApplyPowerup();
                Destroy(gameObject);
            }
        }

        private void ApplyPowerup()
        {
            // Logic to apply powerup to player or game state
            Debug.Log("Powerup collected: " + type);
            AnalyticsManager.Instance.LogEvent("powerup_collected_" + type.ToString().ToLower());
        }
    }
}
