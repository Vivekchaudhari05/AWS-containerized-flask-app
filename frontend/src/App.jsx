import './App.css'
import useHealth from './hooks/useHealth'

function App() {
  const { status, loading, error, checkHealth } = useHealth()

  return (
    <div className="app">
      <header className="navbar">
        <h1>ContainerCloud</h1>
        <span className="status">
          <span className="status-dot"></span>
          Application Dashboard
        </span>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <p className="eyebrow">DOCKER + AWS ECS</p>
          <h2>Welcome to ContainerCloud</h2>
          <p>
            Monitor your application and explore your containerized
            deployment journey.
          </p>
        </section>

        <section className="cards">
          <article className="card">
            <span className="card-icon">⚛️</span>
            <h3>React Frontend</h3>
            <p>Your user interface is running.</p>
            <span className="badge">Running</span>
          </article>

          <article className="card">
            <span className="card-icon">🐍</span>
            <h3>Flask Backend</h3>
            <p>
              Status: {loading ? 'Checking...' : status}
            </p>
            <span className={`badge ${error ? 'pending' : ''}`}>
              {loading
                ? 'Checking'
                : error
                  ? 'Disconnected'
                  : status}
            </span>
            <button className="health-button" onClick={checkHealth}>
              Check backend
            </button>
          </article>

          <article className="card">
            <span className="card-icon">🐳</span>
            <h3>Docker</h3>
            <p>
              Frontend and backend are containerized using Docker
              and packaged as deployable images.
            </p>
            <span className="badge">Containerized</span>
          </article>

          <article className="card">
            <span className="card-icon">☁️</span>
            <h3>Amazon ECS</h3>
            <p>
              Containers are deployed on AWS ECS using Fargate
              and exposed through an Application Load Balancer.
            </p>
            <span className="badge">Deployed</span>
          </article>
        </section>

        <footer>
          ContainerCloud · React + Flask + Docker + AWS
        </footer>
      </main>
    </div>
  )
}

export default App
