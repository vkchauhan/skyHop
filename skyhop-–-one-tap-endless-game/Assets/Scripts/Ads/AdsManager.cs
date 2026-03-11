using UnityEngine;
using GoogleMobileAds.Api;
using SkyHop.Core;
using System;

namespace SkyHop.Ads
{
    public class AdsManager : Singleton<AdsManager>
    {
        [Header("Ad Unit IDs (Test IDs)")]
        private string bannerId = "ca-app-pub-3940256099942544/6300978111";
        private string interstitialId = "ca-app-pub-3940256099942544/1033173712";
        private string rewardedId = "ca-app-pub-3940256099942544/5224354917";

        private BannerView bannerView;
        private InterstitialAd interstitialAd;
        private RewardedAd rewardedAd;

        protected override void Awake()
        {
            base.Awake();
            MobileAds.Initialize(initStatus => {
                LoadInterstitial();
                LoadRewarded();
            });
        }

        #region Banner
        public void ShowBanner()
        {
            if (bannerView != null) bannerView.Destroy();
            bannerView = new BannerView(bannerId, AdSize.Banner, AdPosition.Bottom);
            AdRequest request = new AdRequest();
            bannerView.LoadAd(request);
        }

        public void HideBanner()
        {
            if (bannerView != null) bannerView.Hide();
        }
        #endregion

        #region Interstitial
        public void LoadInterstitial()
        {
            if (interstitialAd != null) interstitialAd.Destroy();
            
            InterstitialAd.Load(interstitialId, new AdRequest(), (ad, error) => {
                if (error != null) return;
                interstitialAd = ad;
            });
        }

        public void ShowInterstitial()
        {
            if (interstitialAd != null && interstitialAd.CanShowAd())
            {
                interstitialAd.Show();
                LoadInterstitial(); // Preload next
            }
        }
        #endregion

        #region Rewarded
        public void LoadRewarded()
        {
            if (rewardedAd != null) rewardedAd.Destroy();

            RewardedAd.Load(rewardedId, new AdRequest(), (ad, error) => {
                if (error != null) return;
                rewardedAd = ad;
            });
        }

        public void ShowRewarded(Action onRewardEarned)
        {
            if (rewardedAd != null && rewardedAd.CanShowAd())
            {
                rewardedAd.Show((Reward reward) => {
                    onRewardEarned?.Invoke();
                });
                LoadRewarded(); // Preload next
            }
        }
        #endregion
    }
}
