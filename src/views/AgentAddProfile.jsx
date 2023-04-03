import React, { useState, useContext } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useNavigate } from 'react-router-dom'

import { postRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const AgentAddProfile = (props) => {
  const [nameAgent, setNameAgent] = useState('')
  const [addressAgent, setAddressAgent] = useState('')
  const [contactAgent, setContactAgent] = useState('')
  const [phoneAgent, setPhoneAgent] = useState('')
  const [messengerAgent, setMessengerAgent] = useState('')
  const [emailAgent, setEmailAgent] = useState('')
  const navigate = useNavigate()
  const { state, dispatch } = useContext(ContextApp)

  const params = {
    name: nameAgent,
    address: addressAgent,
    contact: contactAgent,
    phone: phoneAgent,
    messenger: messengerAgent,
    email: emailAgent,
    code: '',
  }

  const createAgent = (e) => {
    dispatch(showLoder({ createAgent: 1 }))
    e.preventDefault()

    postRequest('/api/v1/partners', params)
      .then(() => {
        toast.success('Посредник успешно добавлен!')
        navigate(-1)

        dispatch(showLoder({ createAgent: 0 }))
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
        dispatch(showLoder({ createAgent: 0 }))
      })
  }

  return (
    <div className="itemContainer itemContainer--agentAdd">
      <ToastContainer />
      <div className="itemContainer-inner">
        <div
          className="top-item"
          style={{
            paddingLeft: state.width,
          }}
        >
          <div className="btnTransport"></div>
        </div>
        <div className="bottom-itemFooter" style={{ paddingLeft: state.width }}>
          <div className="blockShowOrHide">
            <div className="dropBlock--inner">
              <div className="contentBlockTop">
                <div className="dropBlockContent">
                  <h2>Добавить посредника</h2>

                  <form onSubmit={createAgent}>
                    <label>
                      <span>Наименование компании</span>
                      <input
                        className=""
                        type="text"
                        value={nameAgent}
                        onChange={(e) => setNameAgent(e.target.value)}
                        placeholder="Наименование компании"
                        required
                      />
                    </label>
                    <label>
                      <span>Адрес регистрации</span>
                      <input
                        className=""
                        type="text"
                        value={addressAgent}
                        onChange={(e) => setAddressAgent(e.target.value)}
                        placeholder="Адрес регистрации"
                      />
                    </label>
                    <label>
                      <span>Контактное лицо</span>
                      <input
                        className=""
                        type="text"
                        value={contactAgent}
                        onChange={(e) => setContactAgent(e.target.value)}
                        placeholder="Контактное лицо"
                      />
                    </label>
                    <label>
                      <span>Номер телефона</span>
                      <input
                        className=""
                        type="text"
                        value={phoneAgent}
                        onChange={(e) => setPhoneAgent(e.target.value)}
                        placeholder="Номер телефона"
                      />
                    </label>
                    <label>
                      <span>Мессенджер</span>
                      <input
                        className=""
                        type="text"
                        value={messengerAgent}
                        onChange={(e) => setMessengerAgent(e.target.value)}
                        placeholder="Мессенджер"
                      />
                    </label>
                    <label>
                      <span>E-mail</span>
                      <input
                        className=""
                        type="text"
                        value={emailAgent}
                        onChange={(e) => setEmailAgent(e.target.value)}
                        placeholder="E-mail"
                      />
                    </label>
                    <button type="submit" className="btn-success-preBid">
                      Сохранить
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AgentAddProfile
