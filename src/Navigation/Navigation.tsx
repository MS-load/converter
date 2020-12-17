import React from 'react'
import CurrencyOptions from '../CurrencyOptions'
import ThemeSlider from '../Theme/ThemeSlider'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Switch, Route, Link } from 'react-router-dom'
import './navStyle.css'


export default function Navigation() {

  const matches = useMediaQuery('(max-width:600px)')

  function openNav() {
    let nav = document.querySelector('nav')
    if (!nav) {
      return
    }
    if (nav && matches) {
      return nav.style.width = "100%"
    }
    return nav.style.width = "25%"
  }

  function closeNav() {
    let nav = document.querySelector('nav')
    if (!nav) {
      return
    }
    return nav.style.width = "0%"
  }

  return (
    <div className='wrapper'>
      <div className='container'>
        <svg viewBox="0 0 100 80" width="40" height="40" onClick={openNav}>
          <rect width="100" height="20" />
          <rect y="30" width="100" height="20" />
          <rect y="60" width="100" height="20" />
        </svg>
        <section>
          <p className="text">sw<span><span className="stack bouncing">.</span>
            <span className="stack">ı</span></span>tch</p>
        </section>
        <nav onClick={closeNav}>
          <span className="closebtn" onClick={closeNav}>&times;</span>
          <ul className="overlay-content">

            <li><Link to="/">Home</Link></li>
            <li><Link to="/fav">Favorite</Link></li>
            <li><Link to="/trends">Trends</Link></li>

          </ul>
        </nav>
        <ThemeSlider />
      </div>

      <Switch>
        <Route path="/trends">
          <CurrencyOptions displayPage={'graph'} />
        </Route>
        <Route path="/fav">
          <CurrencyOptions displayPage={'fav'} />
        </Route>
        <Route path="/">
          <CurrencyOptions displayPage={'home'} />
        </Route>
      </Switch>

    </div >
  )

}

