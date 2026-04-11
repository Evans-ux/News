'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '60px 40px',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            animation: 'pulse 2s infinite',
          }}
        >
          404
        </div>

        <h2
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px',
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '40px',
            lineHeight: '1.6',
          }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/News"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '14px 40px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 5px 20px rgba(102, 126, 234, 0.3)',
            cursor: 'pointer',
            
          }}
          
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.3)';
          }}
        >
          ← Return Home
        </Link>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    </div>
  );
}