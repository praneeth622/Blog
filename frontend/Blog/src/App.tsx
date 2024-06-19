import { BrowserRouter,Route,Routes } from 'react-router-dom'
import signIn from './pages/signIn'
import signUp from './pages/signUp'
import blog from './pages/blog'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' Component={signIn} />
        <Route path='/signup' Component={signUp} />
        <Route path='/blog' Component={blog} />
      </Routes>
    </BrowserRouter>
  )
}

export default App