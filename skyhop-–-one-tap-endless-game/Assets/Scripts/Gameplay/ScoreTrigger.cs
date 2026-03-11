using UnityEngine;
using SkyHop.Managers;

namespace SkyHop.Gameplay
{
    public class ScoreTrigger : MonoBehaviour
    {
        private bool triggered = false;

        private void OnTriggerEnter2D(Collider2D collision)
        {
            if (!triggered && collision.CompareTag("Player"))
            {
                triggered = true;
                ScoreManager.Instance.AddScore(1);
            }
        }
    }
}
