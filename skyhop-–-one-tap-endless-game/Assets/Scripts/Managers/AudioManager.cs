using UnityEngine;
using SkyHop.Gameplay;
using SkyHop.Managers;

namespace SkyHop.Managers
{
    public class AudioManager : SkyHop.Core.Singleton<AudioManager>
    {
        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioSource musicSource;

        [SerializeField] private AudioClip jumpClip;
        [SerializeField] private AudioClip coinClip;
        [SerializeField] private AudioClip crashClip;
        [SerializeField] private AudioClip powerupClip;

        void OnEnable()
        {
            PlayerController.OnPlayerJump += () => PlaySFX(jumpClip);
            PlayerController.OnPlayerDeath += () => PlaySFX(crashClip);
            PlayerController.OnCoinCollected += () => PlaySFX(coinClip);
        }

        public void PlaySFX(AudioClip clip)
        {
            if (clip != null)
                sfxSource.PlayOneShot(clip);
        }

        public void SetMusicVolume(float volume)
        {
            musicSource.volume = volume;
        }
    }
}
