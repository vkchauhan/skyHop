using UnityEngine;
using System.Collections.Generic;

namespace SkyHop.Managers
{
    [System.Serializable]
    public class CharacterSkin
    {
        public string id;
        public Sprite sprite;
        public int price;
        public bool isUnlocked;
    }

    public class ShopManager : SkyHop.Core.Singleton<ShopManager>
    {
        public List<CharacterSkin> skins;
        private const string SKIN_PREFIX = "SkinUnlocked_";

        protected override void Awake()
        {
            base.Awake();
            foreach (var skin in skins)
            {
                skin.isUnlocked = PlayerPrefs.GetInt(SKIN_PREFIX + skin.id, 0) == 1 || skin.price == 0;
            }
        }

        public bool PurchaseSkin(string id)
        {
            var skin = skins.Find(s => s.id == id);
            if (skin != null && !skin.isUnlocked && ScoreManager.Instance.TotalCoins >= skin.price)
            {
                ScoreManager.Instance.AddCoins(-skin.price);
                skin.isUnlocked = true;
                PlayerPrefs.SetInt(SKIN_PREFIX + id, 1);
                return true;
            }
            return false;
        }
    }
}
