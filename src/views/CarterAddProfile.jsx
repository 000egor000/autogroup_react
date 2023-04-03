import React, { useState, useContext, useEffect } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useNavigate } from 'react-router-dom'

import { postRequest, getRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { CheckPicker } from 'rsuite'
import { dataView } from '../helper'

const CarterAddProfile = (props) => {
  const [nameСarter, setNameСarter] = useState('')
  const [addressСarter, setAddressСarter] = useState('')
  const [contactСarter, setContactСarter] = useState('')
  const [pdp, setPdp] = useState([])
  const [pdpSelect, setPdpSelect] = useState([])
  const [phoneСarter, setPhoneСarter] = useState('')
  const [messengerСarter, setMessengerСarter] = useState('')
  const [emailСarter, setEmailСarter] = useState('')
  const navigate = useNavigate()
  const { state, dispatch } = useContext(ContextApp)

  const params = {
    name: nameСarter,
    address: addressСarter,
    contact: contactСarter,
    phone: phoneСarter,
    messenger: messengerСarter,
    email: emailСarter,
    code: '',
    pd_id_add: pdpSelect,
  }
  useEffect(() => {
    getPdp()
  }, [])

  const createСarter = (e) => {
    dispatch(showLoder({ createСarter: 1 }))
    e.preventDefault()

    postRequest('/api/v1/carters', params)
      .then(() => {
        toast.success('Перевозчик успешно добавлен!')
        navigate(-1)

        dispatch(showLoder({ createСarter: 0 }))
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
        dispatch(showLoder({ createСarter: 0 }))
      })
  }

  const getPdp = () => {
    dispatch(showLoder({ getPdp: 1 }))
    getRequest(`/api/v1/pdp`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ pdp }) => {
        const data = pdp.map(({ id, place_destination, destination }) => ({
          label: dataView(place_destination, destination),
          value: id,
        }))
        setPdp(data)
        dispatch(showLoder({ getPdp: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getPdp: 0 }))
        setPdp([])
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
                  <h2>Добавить перевозчика</h2>

                  <form onSubmit={createСarter}>
                    {pdp.length > 0 && (
                      <div className="selectCustom selectCustom--space">
                        <span className="titleCheckPicker">
                          Название связей
                        </span>

                        <CheckPicker
                          value={pdpSelect}
                          onChange={setPdpSelect}
                          data={pdp}
                          required
                        />
                      </div>
                    )}

                    <label>
                      <span>Наименование компании</span>
                      <input
                        className=""
                        type="text"
                        value={nameСarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setNameСarter(value)
                        }}
                        placeholder="Наименование компании"
                        required
                      />
                    </label>
                    <label>
                      <span>Адрес регистрации</span>
                      <input
                        className=""
                        type="text"
                        value={addressСarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setAddressСarter(value)
                        }}
                        placeholder="Адрес регистрации"
                        required
                      />
                    </label>
                    <label>
                      <span>Контактное лицо</span>
                      <input
                        className=""
                        type="text"
                        value={contactСarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z\s]+/gi, '')
                          return setContactСarter(value)
                        }}
                        placeholder="Контактное лицо"
                        required
                      />
                    </label>
                    <label>
                      <span>Номер телефона</span>
                      <input
                        className=""
                        type="text"
                        value={phoneСarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^0-9.+,-\s]+/gi, '')
                          return setPhoneСarter(value)
                        }}
                        placeholder="Номер телефона"
                        required
                      />
                    </label>
                    <label>
                      <span>Мессенджер</span>
                      <input
                        className=""
                        type="text"
                        value={messengerСarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setMessengerСarter(value)
                        }}
                        placeholder="Мессенджер"
                        required
                      />
                    </label>
                    <label>
                      <span>E-mail</span>
                      <input
                        className=""
                        type="text"
                        value={emailСarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setEmailСarter(value)
                        }}
                        placeholder="E-mail"
                        required
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
export default CarterAddProfile
