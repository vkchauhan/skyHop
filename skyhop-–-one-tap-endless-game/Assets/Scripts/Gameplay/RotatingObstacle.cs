using UnityEngine;

namespace SkyHop.Gameplay
{
    public class RotatingObstacle : MonoBehaviour
    {
        [SerializeField] private float rotationSpeed = 100f;

        void Update()
        {
            transform.Rotate(0, 0, rotationSpeed * Time.deltaTime);
        }
    }
}
