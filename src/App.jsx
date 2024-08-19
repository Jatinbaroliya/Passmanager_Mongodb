import { useState } from 'react' 
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'

function App() { 

  return (
    <>
        <Navbar/> 
        <div className='min-h-[83vh] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]'>
        <Manager/>
        </div>
        <Footer/>
    </>
  )
}

export default App