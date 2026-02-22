'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body style={{
        background: '#060a13',
        color: '#e8edf5',
        fontFamily: 'Inter, system-ui, sans-serif',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00f0ff, #b829ff, #ff2d78)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
          }}>
            SYSTEM ERROR
          </div>
          <p style={{ color: '#5a6478', marginBottom: '2rem', fontSize: '0.9rem' }}>
            {error.message || 'Beklenmeyen bir hata olustu'}
          </p>
          <button
            onClick={reset}
            style={{
              background: '#131a2b',
              color: '#00f0ff',
              border: '1px solid rgba(0,240,255,0.3)',
              padding: '10px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
