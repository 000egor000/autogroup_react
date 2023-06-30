import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  memo,
} from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import { useNavigate } from 'react-router-dom'

import { getRequest, postRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { dataView } from '../helper'
import { typeList, typeTransportation } from '../const'
import { CheckPicker } from 'rsuite'

const AgentCarrierAddProfile = () => {
  const [countryList, setCountryList] = useState([])
  const [countrySelect, setCountrySelect] = useState('')
  const [countryListDefault, setCountryListDefault] = useState([])
  const [countryItem, setCountryItem] = useState([])
  const [typeTransport, setTypeTransport] = useState([])
  const [typeTransportSelect, setTypeTransportSelect] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [messenger, setMessenger] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const [dataType, setDataType] = useState(2)

  const navigate = useNavigate()
  const [pdp, setPdp] = useState([])
  const [pd_id_add, setPd_id_add] = useState([])
  const [dataMaster, setDataMaster] = useState([])
  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    getPdp()
    getArray()
    getCountries()
  }, [])

  const params = {
    name,
    address,
    contact,
    phone,
    messenger,
    email,
    code,
    pd_id_add,
  }

  const getTypeTransport = (countryItem) => {
    let listTmp = []
    if (dataType !== 4) {
      if (countryItem.is_buyed)
        listTmp = typeTransportation.filter(({ type }) => type === 'buyed')
      else if (countryItem.is_destination) {
        listTmp = typeTransportation.filter(
          ({ type, id }) => type === 'destination' && +id !== 4
        )
      } else if (countryItem.is_buyed && countryItem.is_destination) {
        listTmp = typeTransportation.filter(
          ({ type, id }) => type === 'destination' && +id !== 4
        )
      }
    } else {
      listTmp = typeTransportation.filter(({ type }) => type === 'destination')
    }
    let data = listTmp.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
    return data.length > 0 ? data : []
  }

  useEffect(() => {
    setCountryItem(countryList.find(({ id }) => +id === +countrySelect))
  }, [countrySelect])

  useEffect(() => {
    if (countryItem) {
      let data = getTypeTransport(countryItem)
      if (+dataType !== 4) setTypeTransportSelect([])
      setTypeTransport(data.length > 0 ? data : [])
    }
  }, [countryItem, dataType])

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
        dispatch(showLoder({ getArray: 0, status: err.status }))
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
        dispatch(showLoder({ getPdp: 0, status: err.status }))
        setPdp([])
      })
  }

  const getCountries = () => {
    dispatch(showLoder({ getCountries: 1 }))
    getRequest(`/api/v1/countries?page=1&limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCountryList(res.countries)
        setCountryItem(res.countries[0])
        setCountryListDefault(res.countries)
        setCountrySelect(res.countries[0].id)
        dispatch(showLoder({ getCountries: 0 }))
      })
      .catch((err) => {
        setCountryList([])
        dispatch(showLoder({ getCountries: 0, status: err.status }))
      })
  }

  const createAgent = async (e) => {
    dispatch(showLoder({ createAgent: 1 }))
    e.preventDefault()
    // +dataType === 4 тоже есть!
    let path
    if (+dataType === 3) {
      path = 'partners'
    } else if (+dataType === 2) {
      if (typeTransportSelect.includes(1) || typeTransportSelect.includes(3)) {
        params.title = params.name
        params.type = typeTransportSelect
        params.country = countrySelect
        path = 'carriers'
      }
      if (typeTransportSelect.includes(2)) {
        params.title = params.name
        params.type = typeTransportSelect
        path = 'carters'
      }
      if (typeTransportSelect.includes(4)) {
        params.title = params.name
        params.type = typeTransportSelect
        path = 'agents'
      }
    } else {
      path = 'agents'
    }

    await postRequest(`/api/v1/${path}`, params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        navigate(-1)

        dispatch(showLoder({ createAgent: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createAgent: 0, status: err.status }))
      })
  }
  const getBlock = (dataType, typeTransport, typeTransportSelect) => {
    if (+dataType === 3 || +dataType === 2 || +dataType === 4) {
      return (
        <>
          {(+dataType === 2 || +dataType === 4) && (
            <>
              <label>
                <span>Страна</span>
                <select
                  value={countrySelect}
                  onChange={(event) => setCountrySelect(event.target.value)}
                >
                  {countryList.map((elem) => {
                    return (
                      <option key={elem.id + elem.name_ru} value={elem.id}>
                        {elem.name_ru}
                      </option>
                    )
                  })}
                </select>
              </label>

              {+dataType !== 4 && (
                <div className="selectCustom selectCustom--space">
                  <span className="titleCheckPicker">Тип перевозки</span>

                  <CheckPicker
                    value={typeTransportSelect}
                    onChange={setTypeTransportSelect}
                    data={typeTransport}
                  />
                </div>
              )}

              {typeTransportSelect.includes(2) && dataMaster.length > 0 && (
                <div className="selectCustom selectCustom--space">
                  <span className="titleCheckPicker">Порт</span>

                  <CheckPicker
                    value={pd_id_add}
                    onChange={setPd_id_add}
                    data={dataMaster}
                    required
                  />
                </div>
              )}
            </>
          )}
          <label>
            <span>Адрес регистрации</span>
            <input
              className=""
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Адрес регистрации"
            />
          </label>
          <label>
            <span>Контактное лицо</span>
            <input
              className=""
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Контактное лицо"
            />
          </label>
          <label>
            <span>Номер телефона</span>
            <input
              className=""
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Номер телефона"
            />
          </label>
          <label>
            <span>Мессенджер</span>
            <input
              className=""
              type="text"
              value={messenger}
              onChange={(e) => setMessenger(e.target.value)}
              placeholder="Мессенджер"
            />
          </label>
          <label>
            <span>E-mail</span>
            <input
              className=""
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />
          </label>
        </>
      )
    }
  }

  useEffect(() => {
    if (countryListDefault.length > 0) {
      if (+dataType === 4) {
        let res = countryListDefault.filter(
          ({ is_destination }) => is_destination
        )
        if (res.length > 0) {
          const { id } = typeTransportation.find((element) => element.id === 4)
          setCountryList(res)
          setCountrySelect(res[0]['id'])
          setTypeTransportSelect([id])
        } else {
          setCountryList([])
          setCountrySelect('')
        }
      } else {
        setCountryList(countryListDefault)
        setCountrySelect(countryListDefault[0]['id'])
      }
    }
  }, [dataType, countryListDefault])

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
                  <h2>Добавить посредника/перевозчика</h2>

                  <form onSubmit={createAgent}>
                    <label>
                      <span>Наименование компании</span>
                      <input
                        className=""
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Наименование компании"
                        required
                      />
                    </label>
                    <label>
                      <span>Тип контрагента</span>
                      <select
                        value={dataType}
                        onChange={(event) => setDataType(event.target.value)}
                      >
                        {typeList.map((elem) => {
                          return (
                            <option key={elem.id + elem.name} value={elem.id}>
                              {elem.name}
                            </option>
                          )
                        })}
                      </select>
                    </label>
                    {getBlock(dataType, typeTransport, typeTransportSelect)}

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
export default memo(AgentCarrierAddProfile)
