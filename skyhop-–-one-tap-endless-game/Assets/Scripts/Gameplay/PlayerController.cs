using UnityEngine;
using System;

namespace SkyHop.Gameplay
{
    [RequireComponent(typeof(Rigidbody2D))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Settings")]
        [SerializeField] private float jumpForce = 5f;
        [SerializeField] private float forwardSpeed = 2f;
        
        private Rigidbody2D rb;
        private bool isDead = false;

        public static event Action OnPlayerJump;
        public static event Action OnPlayerDeath;
        public static event Action OnCoinCollected;

        void Awake()
        {
            rb = GetComponent<Rigidbody2D>();
        }

        void Update()
        {
            if (isDead) return;

            // Handle Jump Input (Touch or Mouse Click)
            if (Input.GetMouseButtonDown(0))
            {
                Jump();
            }

            // Constant forward movement
            transform.Translate(Vector3.right * forwardSpeed * Time.deltaTime);
        }

        private void Jump()
        {
            rb.linearVelocity = Vector2.up * jumpForce;
            OnPlayerJump?.Invoke();
        }

        private void OnTriggerEnter2D(Collider2D collision)
        {
            if (collision.CompareTag("Obstacle"))
            {
                Die();
            }
            else if (collision.CompareTag("Coin"))
            {
                OnCoinCollected?.Invoke();
                Destroy(collision.gameObject);
            }
        }

        private void Die()
        {
            if (isDead) return;
            isDead = true;
            rb.linearVelocity = Vector2.zero;
            rb.simulated = false;
            OnPlayerDeath?.Invoke();
        }

        public void Revive()
        {
            isDead = false;
            rb.simulated = true;
            transform.position += Vector3.up * 2f; // Move up slightly to avoid immediate re-collision
        }
    }
}
