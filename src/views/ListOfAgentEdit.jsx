import React, { useState, useContext, useEffect } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'
import { useParams } from 'react-router-dom'
import NoData from '../components/NoData'

import { getRequest, putRequest } from '../base/api-request'
import { useNavigate } from 'react-router-dom'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { CheckPicker } from 'rsuite'
import {
  dataView,
  controlCheck,
  controlIdPdp,
  controlIdDestination,
} from '../helper'

const ProfileOfAgents = (props) => {
  const [dataCarters, setDataCarters] = useState([])
  // const [dataMaster, setDataMaster] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()
  const [nameCarters, setNameCarters] = useState('')
  const [pdp, setPdp] = useState([])
  // const [pdpSelect, setPdpSelect] = useState([])

  // const [pdpSelectDefault, setPdpSelectDefault] = useState([])
  const [addressCarters, setAddressCarters] = useState('')
  const [contactCarters, setContactCarters] = useState('')
  const [phoneCarters, setPhoneCarters] = useState('')
  const [messengerCarters, setMessengerCarters] = useState('')
  const [emailCarters, setEmailCarters] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const params = {
    name: nameCarters,
    address: addressCarters,
    contact: contactCarters,
    phone: phoneCarters,
    messenger: messengerCarters,
    email: emailCarters,
    code: '',
  }

  useEffect(() => {
    // getPdp()
    // getArray()
  }, [])

  useEffect(() => {
    dispatch(showLoder({ agents: 1 }))
    getRequest(`/api/v1/agents`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ agents }) => {
        const findArray = agents.find((item) => item.id == id)

        if (findArray.id) {
          setDataCarters(findArray)
          fillData(findArray)
        }
        dispatch(showLoder({ agents: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ agents: 0, status: err.status }))
        setDataCarters([])
      })
  }, [])
  // useEffect(() => {
  //   if (dataCarters.id && dataCarters.destinationPlaceDestinations.length > 0) {
  //     const res = controlIdDestination(dataCarters)
  //     if (res) {
  //       setPdpSelect(res)
  //       setPdpSelectDefault(res)
  //     }
  //   }
  // }, [dataCarters])

  // useEffect(() => {
  //   if (pdpSelectDefault.length !== pdpSelect.length) {
  //     editCarters(controlCheck(pdpSelectDefault, pdpSelect))
  //     setPdpSelectDefault(pdpSelect)
  //   }
  // }, [pdpSelect])

  const fillData = (val) => {
    const { name, address, contact, phone, messenger, email } = val

    setNameCarters(name)
    setAddressCarters(address)
    setContactCarters(contact)
    setPhoneCarters(phone)
    setMessengerCarters(messenger)
    setEmailCarters(email)
  }

  const editCarters = ({ status, value }) => {
    dispatch(showLoder({ editCarters: 1 }))

    putRequest(`/api/v1/agents/${id}`, {
      ...params,
    })
      .then(() => {
        state.createNotification('Информация обновлена!', 'success')
        if (status == undefined) navigate(-1)
        dispatch(showLoder({ editCarters: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editCarters: 0, status: err.status }))
      })
  }

  // const getArray = () => {
  //   dispatch(showLoder({ getArray: 1 }))
  //   getRequest(`/api/v1/destinations?page=1&limit=1000`, {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then(({ destinations }) => {
  //       const data = destinations.map(({ id, title }) => ({
  //         label: title,
  //         value: id,
  //       }))
  //       setDataMaster(data)
  //       dispatch(showLoder({ getArray: 0 }))
  //     })
  //     .catch((err) => {
  //       setDataMaster([])
  //       dispatch(showLoder({ getArray: 0 }))
  //     })
  // }
  // const getPdp = () => {
  //   dispatch(showLoder({ getPdp: 1 }))
  //   getRequest(`/api/v1/pdp`, {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then(({ pdp }) => {
  //       const data = pdp.map(({ id, place_destination, destination }) => ({
  //         label: dataView(place_destination, destination),
  //         value: id,
  //       }))
  //       setPdp(data)
  //       dispatch(showLoder({ getPdp: 0 }))
  //     })
  //     .catch((err) => {
  //       dispatch(showLoder({ getPdp: 0 }))
  //       setPdp([])
  //     })
  // }

  return (
    <div className="itemContainer">
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
                  <h2 style={{ padding: 0 }}>Информация по {nameCarters}</h2>

                  {dataCarters.id ? (
                    <>
                      {/* {dataMaster.length > 0 && (
                        <div className="selectCustom selectCustom--space">
                          <span className="titleCheckPicker">Порты</span>

                          <CheckPicker
                            value={pdpSelect}
                            onChange={setPdpSelect}
                            data={dataMaster}
                            required
                          />
                        </div>
                      )} */}
                      <label>
                        <span>Наименование компании</span>
                        <input
                          className=""
                          type="text"
                          value={nameCarters}
                          onChange={(e) => {
                            let value = e.target.value
                            value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                            return setNameCarters(value)
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
                          value={addressCarters}
                          onChange={(e) => {
                            let value = e.target.value
                            value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                            return setAddressCarters(value)
                          }}
                          placeholder="Адрес регистрации"
                        />
                      </label>
                      <label>
                        <span>Контактное лицо</span>
                        <input
                          className=""
                          type="text"
                          value={contactCarters}
                          onChange={(e) => {
                            let value = e.target.value
                            value = value.replace(/[^A-Za-z\s]+/gi, '')
                            return setContactCarters(value)
                          }}
                          placeholder="Контактное лицо"
                        />
                      </label>
                      <label>
                        <span>Номер телефона</span>
                        <input
                          className=""
                          type="text"
                          value={phoneCarters}
                          onChange={(e) => {
                            let value = e.target.value
                            value = value.replace(/[^0-9.+,-\s]+/gi, '')
                            return setPhoneCarters(value)
                          }}
                          placeholder="Номер телефона"
                        />
                      </label>
                      <label>
                        <span>Мессенджер</span>
                        <input
                          className=""
                          type="text"
                          value={messengerCarters}
                          onChange={(e) => {
                            let value = e.target.value
                            value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                            return setMessengerCarters(value)
                          }}
                          placeholder="Мессенджер"
                        />
                      </label>
                      <label>
                        <span>E-mail</span>
                        <input
                          className=""
                          type="email"
                          value={emailCarters}
                          onChange={(e) => {
                            let value = e.target.value
                            value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                            return setEmailCarters(value)
                          }}
                          placeholder="E-mail"
                        />
                      </label>
                      <button
                        type="submit"
                        className="btn-success-preBid"
                        onClick={editCarters}
                      >
                        Обновить
                      </button>
                      {/* </form> */}
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
export default ProfileOfAgents
