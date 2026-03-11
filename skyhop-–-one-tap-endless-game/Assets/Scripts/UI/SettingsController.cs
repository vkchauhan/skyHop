using UnityEngine;

namespace SkyHop.UI
{
    public class SettingsController : MonoBehaviour
    {
        public void SetMusicVolume(float value)
        {
            SkyHop.Managers.AudioManager.Instance.SetMusicVolume(value);
        }

        public void ToggleVibration(bool enabled)
        {
            PlayerPrefs.SetInt("Vibration", enabled ? 1 : 0);
        }
    }
}
