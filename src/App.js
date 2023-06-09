import React, { useReducer, useEffect } from 'react'
import RoutesItem from './routers/RoutesItem'
import Authorization from '../src/views/Authorization'
import ContextApp from './context/contextApp'
import reducer from './reducers/reducer'
import Loader from '../src/components/Loader'
import Сalculator from '../src/components/Сalculator'
// import { useParams } from 'react-router-dom'
import { getRequest } from './base/api-request'
import { useNavigate } from 'react-router-dom'
import { show, hide, showLoder } from './reducers/actions'

import './App.scss'
import { ToastContainer } from 'react-toastify'
import { createNotification } from './helper'
function App() {
  const firstData = {
    loading: [],
    loader: 0,
    width: '60px',
    createNotification,
    status: '',
  }

  const [state, dispatch] = useReducer(reducer, firstData)

  let navigate = useNavigate()
  const value = { state, dispatch }
  const url = document.location.pathname

  const controlPath = () => {
    if (url !== '/calculator/clients') {
      return window.sessionStorage.getItem('access_token') ? (
        <RoutesItem />
      ) : (
        <Authorization />
      )
    } else {
      return window.sessionStorage.getItem('access_token') ? (
        <RoutesItem />
      ) : (
        <Сalculator />
      )
    }
  }

  useEffect(() => {
    if (state.loading.length > 0) {
      let container = []
      state.loading.map((el) => container.push(Object.entries(el)[0][1]))

      if (container.includes(1)) dispatch(show())
      else dispatch(hide())
    }
  }, [state.loading])

  useEffect(() => {
    let time = setTimeout(() => {
      controlLoading(state.loader)
    }, 15000)

    return () => clearTimeout(time)
  }, [state.loader])

  useEffect(() => {
    if (+state.status) window.sessionStorage.clear() // Проверка на актуальность токена
  }, [state.status])

  const controlLoading = (val) => {
    if (val) {
      dispatch(hide())
      createNotification(
        'Много времени на загрузку, загрузчик отменен, продолжайте работу!',
        'info'
      )
    }
  }

  const userInfo = ({ role, user, client, access_rights }) => {
    window.sessionStorage.setItem('role', JSON.stringify(role))
    window.sessionStorage.setItem('user', JSON.stringify(user))
    window.sessionStorage.setItem('client', JSON.stringify(client))
    window.sessionStorage.setItem(
      'access_rights',
      JSON.stringify(access_rights)
    )

    navigate('/')
  }

  const logInTokens = (val) => {
    dispatch(showLoder({ logInTokens: 1 }))
    getRequest('/api/v1/user/information', {
      Authorization: `Bearer ${val}`,
    })
      .then((res) => {
        userInfo(res)
        window.sessionStorage.setItem('access_token', val)
        dispatch(showLoder({ logInTokens: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ logInTokens: 0, status: err.status }))
        navigate('/')
      })
  }

  useEffect(() => {
    if (url.split('/')[1] === 'auth_data') logInTokens(url.split('/')[2])
  }, [url])

  return (
    <ContextApp.Provider value={value}>
      <div className="App">
        <ToastContainer />
        {state.loader ? <Loader /> : null}
        {controlPath()}
      </div>
    </ContextApp.Provider>
  )
}

export default App
