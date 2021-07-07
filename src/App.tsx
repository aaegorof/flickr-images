import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import ImageList from './components/ImageList/ImageList'
import './styles/common.scss'
import AppHeader from './components/AppHeader/AppHeader'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom'
import ImageEdges from './components/ImageEdges/ImageEdges'
import ImageEdge from "./components/ImageEdges/ImageEdges";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppHeader />
        <div className="container">
          <Switch>
            <Route path="/" exact render={ () => <Link to={'images'}>Search for images</Link>} />
            <Route path="/images" children={<ImageList />} />
            <Route path="/edge/:id" exact children={<ImageEdges />} />
          </Switch>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
