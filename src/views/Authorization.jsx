import React, { useState, useContext } from 'react'

import HeaderImg from '../assets/header-img.png'
// import Flash from '../assets/1521077.svg'
import { postRequest, getRequest } from '../base/api-request'
import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'

import 'react-toastify/dist/ReactToastify.css'
import { Modal } from 'rsuite'
import { Visible, Unvisible } from '@rsuite/icons'

const Authorization = (props) => {
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')
  const [visible, setVisible] = React.useState(false)
  const [showUserOn, setShowUserOn] = React.useState(false)
  const { state, dispatch } = useContext(ContextApp)

  let params = {
    username,
    password,
  }

  const userInfo = ({ role, user, client, access_rights }) => {
    window.sessionStorage.setItem('role', JSON.stringify(role))
    window.sessionStorage.setItem('user', JSON.stringify(user))
    window.sessionStorage.setItem('client', JSON.stringify(client))
    window.sessionStorage.setItem(
      'access_rights',
      JSON.stringify(access_rights)
    )
    window.location.reload()
  }

  const logInTokens = ({
    token_type,
    expires_in,
    refresh_token,
    access_token,
  }) => {
    dispatch(showLoder({ logInTokens: 1 }))
    window.sessionStorage.setItem('token_type', token_type)
    window.sessionStorage.setItem('expires_in', expires_in)
    window.sessionStorage.setItem('refresh_token', refresh_token)
    window.sessionStorage.setItem('access_token', access_token)
    document.cookie = `access_token = ${access_token};`

    getRequest('/api/v1/user/information', {
      Authorization: `Bearer ${access_token}`,
    }).then((res) => {
      if (+res.user.active === 0) {
        window.sessionStorage.clear()
        setShowUserOn(true)
        dispatch(showLoder({ logInTokens: 0 }))
      } else {
        userInfo(res)
        dispatch(showLoder({ logInTokens: 0 }))
      }
    })
  }

  const authorizationForm = (e) => {
    dispatch(showLoder({ authorizationForm: 1 }))
    e.preventDefault()
    postRequest('/api/v1/user/login', params)
      .then((res) => {
        dispatch(showLoder({ authorizationForm: 0 }))
        logInTokens(res)
      })
      .catch((err) => {
        state.createNotification(
          'Ошибка доступа, проверьте ввод данных!',
          'error'
        )
        dispatch(showLoder({ authorizationForm: 0, status: err.status }))
      })
  }

  return (
    <div className="authorization">
      <div className="modal-container ">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={showUserOn}
          onClose={() => setShowUserOn(false)}
          style={{ top: '15%' }}
          // classPrefix='customMod'
        >
          <Modal.Header>
            <Modal.Title> Уведомление по пользователю</Modal.Title>
          </Modal.Header>

          <Modal.Body>Пользователь заблокирован!</Modal.Body>
        </Modal>
      </div>
      <div className="authorization-inner">
        <div className="leftItem">
          <form onSubmit={authorizationForm}>
            <h1>Добро пожаловать!</h1>
            <h2>Заполните данные для входа</h2>

            <input
              className=""
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Логин или email"
              required
            />
            <div style={{ position: 'relative' }}>
              <input
                className=""
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
              />

              <button
                onClick={() => setVisible(!visible)}
                type="button"
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '25px',
                  background: 'none',
                }}
              >
                {visible ? (
                  <Visible width="1.5em" height="1.5em" />
                ) : (
                  <Unvisible width="1.5em" height="1.5em" />
                )}
              </button>
            </div>

            <button type="submit" className="btn-auth">
              Войти
            </button>
          </form>
        </div>
        <div className="rightItem ">
          <img src={HeaderImg} alt="HeaderImg" />
        </div>
      </div>
    </div>
  )
}
export default Authorization
