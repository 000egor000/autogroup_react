import React, { useState, useEffect, useContext, memo } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { postRequest, putRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import PropTypes from 'prop-types'

import { documentsArray } from '../const.js'

const AuctionTransportDocumentsData = ({
  itemStatus,
  idItem,

  viewBlock,
  dataUserArray,
  getArrayCustomer,
}) => {
  const [dataUserSelect, setDataUserSelect] = useState(0)
  const [secondNameUser, setSecondNameUser] = useState('')
  const [nameUser, setNameUser] = useState('')
  const [numberPassport, setNumberPassport] = useState('')
  const [indefNumber, setIndefNumber] = useState('')
  const [givePassport, setGivePassport] = useState('')
  const [addressUser, setAddressUser] = useState('')
  const [dataNewId, setDataNewId] = useState('')
  // const [documentsFlag, setDocumentsFlag] = useState(documentsArray[0]['id'])
  const [documents_flag, setDocuments_flag] = useState(documentsArray[0]['id'])

  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    if (+documents_flag === 1) {
      setNumberPassport('')
      setIndefNumber('')
      getindefNumber()
      getnumberPassport()
    }
  }, [indefNumber, numberPassport, documents_flag])

  useEffect(() => {
    let filter = dataUserArray.filter(
      (elem) => elem.id === +dataUserSelect && elem.id !== 0
    )
    fillDataArray(filter)
    return () => {
      // setNameUser('')
      setSecondNameUser('')
      setNumberPassport('')
      setIndefNumber('')
      setGivePassport('')
      setAddressUser('')
    }
  }, [dataUserSelect, dataNewId, dataUserArray])
  // console.log(documentsFlag)
  let paramsCreateOrUpdate = {
    name: nameUser,
    second_name: secondNameUser,
    passport: numberPassport,
    private_number: indefNumber,
    issued: givePassport,
    address: addressUser,
    general_information_id: +idItem,
    documents_flag: +documents_flag,
  }

  useEffect(() => {
    if (dataUserArray.length > 0)
      setDataUserSelect(dataNewId ? dataNewId : dataUserArray[0]['id'])
  }, [dataNewId, dataUserArray])

  const createDocumentsData = () => {
    dispatch(showLoder({ createDocumentsData: 1 }))
    postRequest('/api/v1/order/customer', paramsCreateOrUpdate)
      .then((res) => {
        state.createNotification('Успешно создано!', 'success')
        getArrayCustomer()
        setDataNewId(res.customer_information_id)
        dispatch(showLoder({ createDocumentsData: 0 }))
      })

      .catch((err) => {
        dispatch(showLoder({ createDocumentsData: 0, status: err.status }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const updateDocumentsData = (id) => {
    dispatch(showLoder({ updateDocumentsData: 1 }))
    putRequest(`/api/v1/order/customer/${id}`, paramsCreateOrUpdate)
      .then((res) => {
        state.createNotification('Успешно обновлено!', 'success')

        setDataNewId(res.customer_information_id)
        getArrayCustomer()
        dispatch(showLoder({ updateDocumentsData: 0 }))
      })

      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ updateDocumentsData: 0, status: err.status }))
      })
  }

  let controlSendFunc = (e) => {
    e.preventDefault()
    dataUserSelect > 0
      ? updateDocumentsData(dataUserSelect)
      : createDocumentsData()
  }

  let fillDataArray = (val) => {
    if (val.length > 0) {
      val.map((elem) => {
        // setNameUser(elem.name)
        setSecondNameUser(elem.second_name)
        setNumberPassport(elem.passport)
        setIndefNumber(elem.private_number)
        setGivePassport(elem.issued)
        setAddressUser(elem.address)
      })
    } else {
      // setNameUser('')
      setSecondNameUser('')
      setNumberPassport('')
      setIndefNumber('')
      setGivePassport('')
      setAddressUser('')
    }
  }

  const getindefNumber = () => {
    if (indefNumber) {
      let currentLength = indefNumber.trim().length

      if (currentLength < 12) {
        if (currentLength < 8) {
          setIndefNumber(indefNumber.replace(/\D/g, ''))
        } else if (currentLength === 8) {
          let letters = indefNumber.substring(0, 7)

          let string = (letters += indefNumber
            .substring(7, 8)
            .replace(/[0-9А-Яа-яЁё]/g, ''))
          setIndefNumber(string)
        } else {
          let letters = indefNumber.substring(0, 8)

          let string = (letters += indefNumber
            .substring(8, 11)
            .replace(/\D/g, ''))
          setIndefNumber(string)
        }
      } else {
        if (currentLength < 14) {
          let letters = indefNumber.substring(0, 11)

          let string = (letters += indefNumber
            .substring(11, 13)
            .replace(/[0-9А-Яа-яЁё]/g, ''))
          setIndefNumber(string)
        } else if (currentLength === 14) {
          let letters = indefNumber.substring(0, 13)

          let string = (letters += indefNumber
            .substring(13, 14)
            .replace(/\D/g, ''))
          setIndefNumber(string)
        } else {
          setIndefNumber(indefNumber.substring(0, 14))
        }
      }
    }
  }

  const getnumberPassport = () => {
    if (numberPassport) {
      if (numberPassport.length > 2) {
        let letters = numberPassport.substring(0, 2)

        let string = (letters += numberPassport
          .substring(2, 9)
          .replace(/\D/g, ''))
        setNumberPassport(string)
      } else {
        setNumberPassport(numberPassport.replace(/[^A-Z]/g, ''))
      }
    }
  }
  const controlCange = () => {
    if (viewBlock(52) && dataUserSelect > 0) return true
    if (viewBlock(51) && +dataUserSelect === 0) return true
  }
  const correctinfoUsers = ({ name, second_name }) => {
    const resFilter = (val) =>
      String(val)[0].toUpperCase() + String(val).slice(1)
    if (name && second_name)
      return resFilter(name) + ' ' + resFilter(second_name)
    else if (name) return resFilter(name)
    else if (second_name) return resFilter(second_name)
    else return null
  }
  return (
    <div
      className="accessUsers  accessUsers--doc"
      style={{ display: itemStatus ? 'block' : 'none' }}
    >
      <form onSubmit={controlSendFunc}>
        <div className="contentBlockTop">
          <div className="dropBlockContent dropBlockContent--doc">
            <label>
              <span>Данные получателя/плательщика</span>

              <select
                value={dataUserSelect}
                onChange={(event) => setDataUserSelect(event.target.value)}
              >
                {dataUserArray.map((elem) => {
                  return (
                    <option key={elem.id + elem.name} value={elem.id}>
                      {correctinfoUsers(elem)}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              <span>ФИО</span>

              <input
                className=""
                type="text"
                value={secondNameUser}
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[^A-Za-z\s]/gi, '')
                  return setSecondNameUser(value)
                }}
                placeholder="ФИО"
                required
              />
            </label>
            <label>
              <span> Документ (паспорт / ВНЖ)</span>

              <select
                value={documents_flag}
                onChange={(event) => setDocuments_flag(event.target.value)}
              >
                {documentsArray.map((elem) => {
                  return (
                    <option key={elem.id + elem.title} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            </label>

            {/* <label>
              <span>Имя</span>

              <input
                type="text"
                placeholder="Имя"
                value={nameUser}
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[^A-Za-z]/gi, '')
                  return setNameUser(value)
                }}
                required={+documents_flag === 1}
              />
            </label> */}
            <label>
              <span>Номер паспорта</span>

              <input
                type="text"
                placeholder={
                  +documents_flag === 1 ? 'XX1234567' : 'Номер паспорта'
                }
                pattern={+documents_flag === 1 ? '^[A-Z]{2}[0-9]{7}$' : '*'}
                value={numberPassport}
                required
                onChange={(e) =>
                  setNumberPassport(String(e.target.value).toUpperCase())
                }
              />
            </label>

            <label>
              <span>Личный (индентификационный) номер</span>

              <input
                type="text"
                placeholder={
                  +documents_flag === 1
                    ? '1234567X123XX1'
                    : 'Личный (индентификационный) номер'
                }
                required={+documents_flag === 1}
                value={indefNumber}
                pattern={
                  +documents_flag === 1
                    ? '^[0-9]{7}[A-Z]{1}[0-9]{3}[A-Z]{2}[0-9]{1}$'
                    : '*'
                }
                onChange={(e) =>
                  setIndefNumber(String(e.target.value).toUpperCase())
                }
              />
            </label>
            <label>
              <span>Кем выдан (транскрипция)</span>

              <input
                type="text"
                placeholder="Кем выдан (транскрипция)"
                value={givePassport}
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                  return setGivePassport(value)
                }}
                required
              />
            </label>
            <label>
              <span>Адрес прописки (транскрипция)</span>

              <input
                type="text"
                placeholder="Адрес прописки (транскрипция)"
                value={addressUser}
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[^A-Za-z0-9.,-\s]+/gi, '')
                  return setAddressUser(value)
                }}
                required
              />
            </label>
            {controlCange() && (
              <input
                type="submit"
                className="btn-success-preBid btn-auto"
                value={dataUserSelect > 0 ? 'Обновить' : 'Сохранить'}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

AuctionTransportDocumentsData.propTypes = {
  idItem: PropTypes.string,
  viewBlock: PropTypes.func,
  dataUserArray: PropTypes.array,
  getArrayCustomer: PropTypes.func,
}

export default memo(AuctionTransportDocumentsData)
