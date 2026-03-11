using UnityEngine;
using System.Collections.Generic;

namespace SkyHop.Gameplay
{
    public class ObstacleSpawner : MonoBehaviour
    {
        [Header("Prefabs")]
        [SerializeField] private GameObject[] obstaclePrefabs;
        [SerializeField] private GameObject coinPrefab;

        [Header("Settings")]
        [SerializeField] private Transform playerTransform;
        [SerializeField] private float spawnDistance = 10f;
        [SerializeField] private float minGap = 3f;
        [SerializeField] private float maxGap = 6f;
        [SerializeField] private float verticalRange = 3f;

        private float lastSpawnX;

        void Start()
        {
            lastSpawnX = playerTransform.position.x + 5f;
        }

        void Update()
        {
            if (playerTransform.position.x + spawnDistance > lastSpawnX)
            {
                SpawnObstacle();
            }
        }

        private void SpawnObstacle()
        {
            float spawnX = lastSpawnX + Random.Range(minGap, maxGap);
            float spawnY = Random.Range(-verticalRange, verticalRange);
            Vector3 spawnPos = new Vector3(spawnX, spawnY, 0);

            // Spawn Obstacle
            GameObject prefab = obstaclePrefabs[Random.Range(0, obstaclePrefabs.Length)];
            Instantiate(prefab, spawnPos, Quaternion.identity);

            // Occasionally spawn a coin
            if (Random.value > 0.7f)
            {
                Vector3 coinPos = spawnPos + Vector3.up * Random.Range(1.5f, 2.5f);
                Instantiate(coinPrefab, coinPos, Quaternion.identity);
            }

            lastSpawnX = spawnX;
        }
    }
}
