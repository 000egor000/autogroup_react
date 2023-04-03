import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import Echo from 'laravel-echo'
import { BrowserRouter } from 'react-router-dom'
import { config } from './config.js'

window.Pusher = require('pusher-js')
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: config.echo_key,
  cluster: 'mt1',
  forceTLS: true,
  authEndpoint: '/broadcasting/auth',
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()
