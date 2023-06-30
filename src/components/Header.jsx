import React, { useState, useEffect, useContext, memo } from 'react'

import 'react-toastify/dist/ReactToastify.css'
import ContextApp from '../context/contextApp'
// import NoticeTransport from '../components/NoticeTransport'

import { showLoder } from '../reducers/actions'
import { Badge, Animation, Modal } from 'rsuite'

import { Link, useNavigate } from 'react-router-dom'
import { Off, Notice, Email, Member } from '@rsuite/icons'

import { postRequest } from '../base/api-request'
import Logo from '../assets/logo.png'
import logoUsers from '../assets/logoUsers.png'
import { titleCurrentLink } from '../helper.js'

const Header = ({ showDrop, setShowDrop }) => {
  const { id, name_ru, second_name_ru } = JSON.parse(
    window.sessionStorage.getItem('client')
  )
  const { title } = JSON.parse(window.sessionStorage.getItem('role'))
  const { email } = JSON.parse(window.sessionStorage.getItem('user'))
  const { notificationCount } = JSON.parse(
    window.sessionStorage.getItem('user')
  )

  const [message, setMessage] = useState('')
  const { state, dispatch } = useContext(ContextApp)

  const [placement, setPlacement] = useState('right')
  const pathname = window.location.pathname
  let navigate = useNavigate()

  // Получение кол сообещений через вебсокеты (нач)
  var channel = window.Echo.channel(
    'user-info-' + JSON.parse(sessionStorage.user).id
  )
  channel.listen('.userNotification', function (data) {
    setMessage(data)
  })

  useEffect(() => {
    if (message.status === 'success' || message.status === 'process')
      state.createNotification(message.message, 'success')
    else if (message.status === 'fail')
      state.createNotification(message.message, 'error')
    else if (message.status === 'info')
      state.createNotification(message.message, 'info')
  }, [message])

  useEffect(() => setShowDrop(false), [pathname])

  const goToBackLink = () => {
    dispatch(showLoder({ goToBackLink: 1 }))

    postRequest('/api/v1/user/logout')
      .then(() => {
        navigate('/')
        window.sessionStorage.clear()
        window.location.reload()
        dispatch(showLoder({ goToBackLink: 0 }))
      })
      .catch((err) =>
        dispatch(showLoder({ goToBackLink: 0, status: err.status }))
      )
  }

  const clickReset = () => {
    setShowDrop(!showDrop)
  }

  const clickProfile = () => {
    clickReset()
    navigate(`/profileUser/${id ? id : 'admin'}`)
  }
  const clickNotice = () => {
    navigate(`/noticeTransport/${id ? id : 'admin'}`)
  }

  const clickBack = () => {
    clickReset()
    goToBackLink()
  }
  const handleToggle = (placement) => {
    return (e) => {
      e.stopPropagation()
      clickReset()
      setPlacement(placement)
    }
  }

  const stylePanel = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#fff',
    zIndex: 100,
  }

  const ViewInfo = () => {
    return `${title ? title : ''} ${name_ru ? name_ru : ''} ${
      second_name_ru ? second_name_ru : ''
    } ${email ? email : ''} `
  }

  const Panel = React.forwardRef(({ ...props }, ref) => (
    <div className="panelItem" {...props} ref={ref} style={stylePanel}>
      <div className="bottomItem">
        <div className="itemElement">
          <h6>ПОЛЬЗОВАТЕЛЬ</h6>
        </div>

        <div
          className="itemElement"
          style={{ borderBottom: '1px solid #e9ecef' }}
        >
          <label onClick={clickProfile}>
            <Member />
            <p>Профиль пользователя</p>
          </label>
          {/* <label onClick={clickNotice}>
            <Notice />
            <div className="infoCount">
              <p>Уведомление</p>

              <div className="flashItem">
                <span>{notificationCount}</span>
              </div>
            </div>
          </label> */}
        </div>
        <div className="itemElement">
          <div className="goToBack">
            <label onClick={clickBack}>
              <Off />
              <button>Выход</button>
            </label>
          </div>
        </div>
      </div>
    </div>
  ))

  return (
    <div className="headerItem">
      <div className="header-inner">
        <div className="itemLeft">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div>
          <h4>{titleCurrentLink(pathname)}</h4>
        </div>
        <div className="itemRight">
          <div className="topItem">
            <div
              className={
                notificationCount > 0
                  ? 'notificationUser--note'
                  : 'notificationUser'
              }
              onClick={clickNotice}
            >
              <Badge content={notificationCount}>
                <Notice />
              </Badge>
            </div>
            <p>{ViewInfo()}</p>

            <div className="LogoUser" onClick={handleToggle('top')}>
              <img src={logoUsers} alt="LogoUser" />
            </div>
          </div>
          <div onMouseLeave={clickReset}>
            <Animation.Slide
              unmountOnExit
              transitionAppear
              timeout={300}
              in={showDrop}
              placement={placement}
            >
              {(props, ref) => <Panel {...props} ref={ref} />}
            </Animation.Slide>
          </div>
        </div>
      </div>
    </div>
  )
}
export default memo(Header)
