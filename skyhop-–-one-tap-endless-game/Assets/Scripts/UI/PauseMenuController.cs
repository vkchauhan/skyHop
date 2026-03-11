using UnityEngine;

namespace SkyHop.UI
{
    public class PauseMenuController : MonoBehaviour
    {
        [SerializeField] private GameObject pausePanel;

        public void PauseGame()
        {
            pausePanel.SetActive(true);
            Time.timeScale = 0f;
        }

        public void ResumeGame()
        {
            pausePanel.SetActive(false);
            Time.timeScale = 1f;
        }

        public void QuitToMenu()
        {
            Time.timeScale = 1f;
            SkyHop.Managers.GameManager.Instance.BackToMenu();
        }
    }
}
