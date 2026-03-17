import { Link } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          FitTrack
        </Link>
        <span style={styles.tagline}>Controle de peso e IMC</span>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: 'var(--text)',
    textDecoration: 'none',
  },
  logo:hover: {
    color: 'var(--accent)',
    textDecoration: 'none',
  },
  tagline: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  main: {
    flex: 1,
    padding: '1.5rem',
    maxWidth: 900,
    margin: '0 auto',
    width: '100%',
  },
}
