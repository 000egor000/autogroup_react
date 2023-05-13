import React, { useState, useContext, useEffect } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import { useNavigate } from 'react-router-dom'

import { postRequest, getRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { CheckPicker } from 'rsuite'
import { dataView } from '../helper'

const CarterAddProfile = (props) => {
  const [nameCarter, setNameCarter] = useState('')
    const [dataMaster, setDataMaster] = useState([])
  const [addressCarter, setAddressCarter] = useState('')
  const [contactCarter, setContactCarter] = useState('')
  const [pdp, setPdp] = useState([])
  const [pdpSelect, setPdpSelect] = useState([])
  const [phoneCarter, setPhoneCarter] = useState('')
  const [messengerCarter, setMessengerCarter] = useState('')
  const [emailCarter, setEmailCarter] = useState('')
  const navigate = useNavigate()
  const { state, dispatch } = useContext(ContextApp)

  const params = {
    name: nameCarter,
    address: addressCarter,
    contact: contactCarter,
    phone: phoneCarter,
    messenger: messengerCarter,
    email: emailCarter,
    code: '',
    pd_id_add: pdpSelect,
  }
  useEffect(() => {
    getPdp()
      getArray()
  }, [])

  const createCarter = (e) => {
    dispatch(showLoder({ createCarter: 1 }))
    e.preventDefault()

    postRequest('/api/v1/carters', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')

        navigate(-1)

        dispatch(showLoder({ createCarter: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createCarter: 0 }))
      })
  }

    const getArray = () => {
        dispatch(showLoder({ getArray: 1 }))
        getRequest(`/api/v1/destinations?page=1&limit=1000`, {
            Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
        })
            .then(({ destinations }) => {
                const data = destinations.map(({ id, title }) => ({
                    label: title,
                    value: id,
                }))
                setDataMaster(data)
                dispatch(showLoder({ getArray: 0 }))
            })
            .catch((err) => {
                setDataMaster([])
                dispatch(showLoder({ getArray: 0 }))
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

                  <form onSubmit={createCarter}>
                    {dataMaster.length > 0 && (
                      <div className="selectCustom selectCustom--space">
                        <span className="titleCheckPicker">
                          Порт
                        </span>

                        <CheckPicker
                          value={pdpSelect}
                          onChange={setPdpSelect}
                          data={dataMaster}
                          required
                        />
                      </div>
                    )}

                    <label>
                      <span>Наименование компании</span>
                      <input
                        className=""
                        type="text"
                        value={nameCarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setNameCarter(value)
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
                        value={addressCarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setAddressCarter(value)
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
                        value={contactCarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z\s]+/gi, '')
                          return setContactCarter(value)
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
                        value={phoneCarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^0-9.+,-\s]+/gi, '')
                          return setPhoneCarter(value)
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
                        value={messengerCarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setMessengerCarter(value)
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
                        value={emailCarter}
                        onChange={(e) => {
                          let value = e.target.value
                          value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                          return setEmailCarter(value)
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
