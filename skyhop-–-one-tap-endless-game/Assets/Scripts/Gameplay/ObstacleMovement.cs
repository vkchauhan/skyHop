using UnityEngine;

namespace SkyHop.Gameplay
{
    public class ObstacleMovement : MonoBehaviour
    {
        [SerializeField] private bool isMoving = false;
        [SerializeField] private float moveSpeed = 2f;
        [SerializeField] private float moveRange = 2f;

        private Vector3 startPos;

        void Start()
        {
            startPos = transform.position;
        }

        void Update()
        {
            if (isMoving)
            {
                float newY = startPos.y + Mathf.Sin(Time.time * moveSpeed) * moveRange;
                transform.position = new Vector3(transform.position.x, newY, transform.position.z);
            }
        }
    }
}
