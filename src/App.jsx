import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import AddStock from './pages/AddStock'
import Navigation from './components/Navigation'
import Navbar from './components/Navbar'
import BarcodeScanner from './components/Scanner/BarcodeScanner'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-stock" element={<AddStock />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductForm />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  )
}

export default App
