import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import { AuthProvider } from '../AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <div>
            <h1>Social Network</h1>
            <p>Dags att börja bygga!</p>
          </div>
          <RegisterPage />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App