'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '500px',
      }}>
        <div style={{
          fontSize: '6rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          opacity: 0.8,
        }}>
          404
        </div>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}>
          Twibix
        </div>
        <div style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: 0.9,
          lineHeight: 1.6,
        }}>
          Oops! The page you&apos;re looking for doesn&apos;t exist.<br />
          Don&apos;t worry, we&apos;ll get you back to timing your solves!
        </div>
        <div style={{
          fontSize: '1rem',
          opacity: 0.7,
          marginBottom: '2rem',
        }}>
          Redirecting to the timer in{' '}
          <span style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FFD700',
          }}>
            {countdown}
          </span>{' '}
          seconds...
        </div>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            marginTop: '1rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Go to Timer Now
        </a>
      </div>
    </div>
  );
}
