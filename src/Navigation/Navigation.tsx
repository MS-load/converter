import React, { useState } from 'react'
import CurrencyOptions from '../CurrencyOptions'
import ThemeSlider from '../Theme/ThemeSlider'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Switch, Route, Link } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'
import './navStyle.css'


export default function Navigation() {
  const [value, setValue] = useState(false)

  function toggleTheme() {
    document.documentElement.classList.add("color-theme-in-transition")
    document.documentElement.setAttribute("data-theme", `${value}`)
    window.setTimeout(() => {
      document.documentElement.classList.remove("color-theme-in-transition")
    }, 1000)
  }

  const matches = useMediaQuery('(max-width:600px)')
  function openNav() {

    let Nav = document.querySelector('nav')
    if (Nav) {
      Nav.style.width = "25%"
    }
    if (Nav && matches) {
      Nav.style.width = "100%"
    }
  }

  function closeNav() {
    let Nav = document.querySelector('nav')
    if (Nav) {
      Nav.style.width = "0%"
    }
  }

  return (
    <div className='wrapper'>
      <div className='container'>
        <svg viewBox="0 0 100 80" width="40" height="40" onClick={openNav}>
          <rect width="100" height="20"></rect>
          <rect y="30" width="100" height="20"></rect>
          <rect y="60" width="100" height="20"></rect>
        </svg>
        <section>
          <p className="text">sw<span><span className="stack bouncing">.</span>
            <span className="stack">ı</span></span>tch</p>
        </section>
        <ErrorBoundary>
          <nav onClick={closeNav}>
            <a className="closebtn" onClick={closeNav}>&times;</a>
            <ul className="overlay-content">

              <li><Link to="/">Home</Link></li>
              <li><Link to="/fav">Favorite</Link></li>
              <li><Link to="/trends">Trends</Link></li>

            </ul>
          </nav>
        </ErrorBoundary>
        <ThemeSlider
          isOn={value}
          handleToggle={() => {
            setValue(!value)
            toggleTheme()
          }}
        />
      </div>

      <Switch>
        <Route path="/trends">
          <ErrorBoundary>
            <CurrencyOptions displayPage={'graph'} />
          </ErrorBoundary>
        </Route>
        <Route path="/fav">
          <ErrorBoundary>
            <CurrencyOptions displayPage={'fav'} />
          </ErrorBoundary>
        </Route>
        <Route path="/">
          <ErrorBoundary>
            <CurrencyOptions displayPage={'home'} />
          </ErrorBoundary>
        </Route>
      </Switch>

    </div >
  )

}

