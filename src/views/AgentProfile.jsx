import React, { useState, useContext, useEffect } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams } from 'react-router-dom'
import NoData from '../components/NoData'

import { getRequest, putRequest } from '../base/api-request'
import { useNavigate } from 'react-router-dom'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const AgentProfile = (props) => {
  const [dataPartners, setDataPartners] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()
  const [nameAgent, setNameAgent] = useState('')
  const [addressAgent, setAddressAgent] = useState('')
  const [contactAgent, setContactAgent] = useState('')
  const [phoneAgent, setPhoneAgent] = useState('')
  const [messengerAgent, setMessengerAgent] = useState('')
  const [emailAgent, setEmailAgent] = useState('')

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

  const editAgent = (e) => {
    dispatch(showLoder({ editAgent: 1 }))
    e.preventDefault()

    putRequest(`/api/v1/partners/${id}`, params)
      .then(() => {
        toast.success('Информация обновлена!')
        navigate(-1)
        dispatch(showLoder({ editAgent: 0 }))
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
        dispatch(showLoder({ editAgent: 0 }))
      })
  }

  useEffect(() => {
    dispatch(showLoder({ partners: 1 }))
    getRequest(`/api/v1/partners`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ partners }) => {
        const findArray = partners.find((item) => item.id == id)
        if (findArray.id) {
          setDataPartners(findArray)
          fillData(findArray)
          dispatch(showLoder({ partners: 0 }))
        }
      })
      .catch((err) => {
        dispatch(showLoder({ partners: 0 }))
        setDataPartners([])
      })
  }, [])

  const fillData = (val) => {
    const { name, address, contact, phone, messenger, email } = val

    setNameAgent(name)
    setAddressAgent(address)
    setContactAgent(contact)
    setPhoneAgent(phone)
    setMessengerAgent(messenger)
    setEmailAgent(email)
  }

  return (
    <div className="itemContainer">
      <ToastContainer />
      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{
            paddingLeft: state.width,
            justifyContent: 'space-between',
            alignItems: 'inherit',
          }}
        >
          <div className="btnTransport"></div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="blockShowOrHide">
            <div className="dropBlock--inner">
              <div className="contentBlockTop">
                <div className="dropBlockContent">
                  <h2 style={{ padding: 0 }}>Информация по {nameAgent}</h2>

                  {dataPartners.id ? (
                    <>
                      <form onSubmit={editAgent}>
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
                          Обновить
                        </button>
                      </form>
                    </>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AgentProfile
