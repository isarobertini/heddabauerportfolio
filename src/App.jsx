import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">

        </div>
        <div>
          <h1 className="text-3xl font-bold underline text-center"> This will be Hedda bauers website</h1>

        </div>

      </section>

      <div className="ticks"></div>

      <section id="next-steps">

      </section>
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
