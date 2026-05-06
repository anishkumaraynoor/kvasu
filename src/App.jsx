import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Work from './pages/Work'
import Data from './pages/Data'
import Update from './pages/Update'
import Display from './pages/Display'


function App() {

  return (
    <>
    
    <Header></Header>
    <Routes>
      <Route path='/' element={<Work></Work>}></Route>
      <Route path='/data' element={<Data></Data>}></Route>
      <Route path='/tc' element={<Work></Work>}></Route>
      <Route path='/update' element={<Update></Update>}></Route>
      <Route path='/display' element={<Display></Display>}></Route>
      <Route path='/*' element={<Navigate to={'/'}></Navigate>} ></Route>
    </Routes>
    </>
  )
}

export default App
