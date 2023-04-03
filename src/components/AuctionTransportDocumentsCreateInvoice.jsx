import React, { useState, useContext, useEffect, useRef } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp'

import { postRequest, getRequest } from '../base/api-request'
import PropTypes from 'prop-types'

import { formInvoiceArray } from '../const.js'
import { controlNumber } from '../helper.js'

const AuctionTransportDocumentsCreateInvoice = ({
  itemStatus,
  idItem,
  invoiceId,
  priseAutoProps,
  dataUserArray,
  getArrayCustomer,
  carrierArray,
  credentialsArray,
  dataInfo,
  auctionArray,
}) => {
  const [formInvoiceSelect, setFormInvoiceSelect] = useState('')

  const [recipientPayArray, setRecipientPayArray] = useState([])
  const [recipientPaySelect, setRecipientPaySelect] = useState(0)
  // const [recipientPaySelectDefault, setRecipientPaySelectDefault] = useState(0)
  const [priceInvoice, setPriceInvoice] = useState('')
  const [codePayArray, setCodePayArray] = useState([])
  const [financeDateArray, setFinanceDateArray] = useState([])
  const [codePaySelect, setCodePaySelect] = useState(0)
  const [numberLot, setNumberLot] = useState('')
  const [vin, setVin] = useState('')

  const [dataUserSelect, setDataUserSelect] = useState(0)

  const [carriersArray, setCarriersArray] = useState([])
  const [joinArray, setJoinArray] = useState([])
  const [transportArray, setTransportArray] = useState([])

  const [currentValue, setCurrentValue] = useState(0)

  const { dispatch } = useContext(ContextApp)
  const refFocus = useRef()

  useEffect(() => {
    if (formInvoiceArray.length > 0)
      setFormInvoiceSelect(formInvoiceArray[0].id)
  }, [formInvoiceArray])
  useEffect(() => {
    if (auctionArray.length > 0) setRecipientPayArray(auctionArray)
  }, [auctionArray])

  useEffect(() => {
    if (carrierArray.length > 0) setCarriersArray(carrierArray)
  }, [carrierArray])

  useEffect(() => {
    if (dataInfo && joinArray.length > 0) {
      const { lot, vin, auction_id } = dataInfo
      const findObject = joinArray.find((el) => +el.id === +auction_id)
      setNumberLot(lot)
      setVin(vin)
      findObject && setCurrentValue(findObject)
      findObject && setRecipientPaySelect(JSON.stringify(findObject))
    }
  }, [dataInfo, joinArray])

  useEffect(() => {
    if (recipientPaySelect && currentValue) {
      if (JSON.parse(recipientPaySelect).code !== currentValue.code) {
        setVin('')
        setNumberLot('')
      } else {
        setNumberLot(dataInfo.lot)
        setVin(dataInfo.vin)
      }
    }
  }, [recipientPaySelect, dataInfo, currentValue])

  // const changeRecipient = (val) => {
  // 	setRecipientPaySelect(val)

  // 	if (JSON.parse(recipientPaySelectDefault).code !== JSON.parse(val).code) {
  // 		setVin('')
  // 		setNumberLot('')
  // 	} else {
  // 		setNumberLot(dataInfo.lot)
  // 		setVin(dataInfo.vin)
  // 	}
  // }

  // useEffect(() => {
  //   dispatch(show())
  //   getRequest('/api/v1/auctions', {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setRecipientPayArray(res.auction)
  //       dispatch(hide())
  //     })
  //     .catch((err) => dispatch(hide()))
  // }, [])

  // useEffect(() => {
  //   carrierArray.length > 0 && setCarriersArray(carrierArray)
  // dispatch(show())
  // getRequest(`/api/v1/carriers`, {
  //   Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  // })
  //   .then((res) => {
  //     setCarriersArray(res.carriers)
  //     dispatch(hide())
  //   })
  //   .catch((err) => {
  //     dispatch(hide())
  //   })
  // }, [carrierArray])

  useEffect(() => {
    if (recipientPayArray.length > 0 && carriersArray.length > 0) {
      setJoinArray(recipientPayArray.concat(carriersArray))
      setRecipientPaySelect(
        JSON.stringify(recipientPayArray.concat(carriersArray)[0])
      )
      // setRecipientPaySelectDefault(
      //   JSON.stringify(recipientPayArray.concat(carriersArray)[0])
      // )
    }

    return () => {
      setJoinArray([])
      setRecipientPaySelect(0)
      // setRecipientPaySelectDefault(0)
    }
  }, [recipientPayArray, carriersArray])

  // useEffect(() => {
  //   dispatch(show())
  //   getRequest(`/api/v1/credentials?limit=${500}`, {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setCredentialsArray(res.credentials)
  //       dispatch(hide())
  //     })
  //     .catch((err) => dispatch(hide()))
  // }, [])

  useEffect(() => {
    dispatch(showLoder({ auto: 1 }))
    getRequest(`/api/v1/order/transport-auto?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const findVin = res.general_information.find(
          (el) => +el.id === +idItem
        ).vin
        setVin(findVin ? findVin : '')

        setTransportArray(res.general_information)
        dispatch(showLoder({ auto: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ auto: 0 }))
      })
  }, [])

  useEffect(() => {
    getPayArray()
    return () => {
      setCodePayArray([])
      setCodePaySelect(0)
    }
  }, [recipientPaySelect, credentialsArray, transportArray])

  useEffect(() => {
    if (
      JSON.stringify(carriersArray[0]) &&
      JSON.stringify(recipientPayArray[0])
    )
      +formInvoiceSelect === 2
        ? setRecipientPaySelect(JSON.stringify(carriersArray[0]))
        : setRecipientPaySelect(JSON.stringify(recipientPayArray[0]))
    return () => {
      setRecipientPaySelect(0)
    }
  }, [formInvoiceSelect, recipientPayArray, carriersArray])

  useEffect(() => {
    getPriseInvoice()
  }, [formInvoiceSelect, dataInfo, priseAutoProps])

  useEffect(() => {
    controlStyle()
    return () => {}
  }, [vin])

  useEffect(() => {
    dispatch(showLoder({ info: 1 }))
    getRequest(`/api/v1/order/finance/${idItem}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinanceDateArray(res.finance_information)
        dispatch(showLoder({ info: 0 }))
      })
      .catch((err) => {
        setFinanceDateArray([])
        dispatch(showLoder({ info: 0 }))
      })
  }, [])

  const getPriseInvoice = () => {
    switch (+formInvoiceSelect) {
      case 1:
        setPriceInvoice(dataInfo.price ? dataInfo.price : '')
        break
      case 2:
        setPriceInvoice(priseAutoProps ? priseAutoProps : '')
        break
      case 3:
        setPriceInvoice('')
        break

      default:
        setPriceInvoice('')
        break
    }
  }

  const getPayArray = () => {
    let codeArrayFist = []

    if (credentialsArray[JSON.parse(recipientPaySelect).code]) {
      let filterArrayUsers = credentialsArray[
        JSON.parse(recipientPaySelect).code
      ].filter((elem) => elem.users.length > 0)
      let userIdArrayFilter = transportArray.filter((elem) => elem.id == idItem)

      userIdArrayFilter.length > 0 &&
        filterArrayUsers.map((elem) =>
          elem.users.map((elemChaild) =>
            elem.auction_name == JSON.parse(recipientPaySelect).name &&
            elemChaild.user_id == userIdArrayFilter[0].buyer_user.id
              ? codeArrayFist.push({
                  titleItem:
                    elem.auction_name + '-' + elem.login + '-' + elem.buyerCode,
                  credential_id: elem.id,
                })
              : null
          )
        )

      setCodePayArray(codeArrayFist)
      codeArrayFist.map((elem) => setCodePaySelect(elem['credential_id']))
    }
  }

  const viewBlock = () => {
    return JSON.parse(recipientPaySelect).code == 'iaai' ||
      JSON.parse(recipientPaySelect).code == 'copart'
      ? true
      : false
  }

  let paramsCreate = {
    lot: numberLot,
    vin: vin,
    general_information_id: idItem,
    auction_id: viewBlock()
      ? recipientPaySelect && JSON.parse(recipientPaySelect).id
      : null,
    price: priceInvoice,
    customer_information_id: +dataUserSelect,
    carrier_id: viewBlock() ? null : JSON.parse(recipientPaySelect).id,
    credential_id: viewBlock() ? +codePaySelect : null,
  }

  const createDocumentsInvoice = (e) => {
    e.preventDefault()
    if (+dataUserSelect !== 0) {
      if (vin.length === 17) {
        dispatch(showLoder({ createDocumentsInvoice: 1 }))
        postRequest('/api/v1/order/invoice', paramsCreate)
          .then((res) => {
            invoiceId(res.invoice_information_id)
            getArrayCustomer()
            closefield()
            toast.success('Успешно создано!')
            dispatch(showLoder({ createDocumentsInvoice: 0 }))
          })
          .catch(() => {
            dispatch(showLoder({ createDocumentsInvoice: 0 }))
            toast.error('Что-то пошло не так!')
          })
      } else {
        toast.error(
          `Неверное количество символов (${vin.length}) vin(Должно быть равное 17)`
        )
      }
    } else {
      toast.error('Данные получателя/плательщика не выбраны!')
    }
  }

  const closefield = () => {
    setNumberLot('')
    setVin('')
    setPriceInvoice('')
    setRecipientPaySelect(
      JSON.stringify(recipientPayArray.concat(carriersArray)[0])
    )
    setDataUserSelect(dataUserArray[0]['id'])
  }

  // const verification = (val) => {
  // 	dispatch(show())

  // 	postRequest('/api/v1/order/transport-auto/verification', { vin: val })
  // 		.then((res) => {
  // 			refFocus.current.style.outline = 'none'
  // 			refFocus.current.style.border = 'solid'
  // 			refFocus.current.style.borderWidth = '1px'
  // 			refFocus.current.style.borderColor = 'green'

  // 			dispatch(hide())
  // 		})
  // 		.catch((err) => {
  // 			toast.error('Данный VIN существует в системе!')
  // 			refFocus.current.style.outline = 'none'
  // 			refFocus.current.style.border = 'solid'
  // 			refFocus.current.style.borderWidth = '1px'
  // 			refFocus.current.style.borderColor = 'red'

  // 			dispatch(hide())
  // 		})
  // }

  const controlStyle = () =>
    !refFocus.current.value
      ? (refFocus.current.style.borderColor = '#dfdfe3')
      : null

  const controlCreateInvoice = () => {
    if (+formInvoiceSelect === 2) {
      return (
        financeDateArray.length > 0 &&
        financeDateArray[0].usa_finance !== null &&
        financeDateArray[0].ag_finance !== null &&
        Object.keys(JSON.parse(financeDateArray[0].usa_finance)).includes(
          'statusFinance'
        ) &&
        Object.keys(JSON.parse(financeDateArray[0].ag_finance)).includes(
          'statusFinance'
        )
      )
    } else {
      return true
    }
  }

  useEffect(() => {
    if (codePayArray.length > 0) {
      codePayArray.map((el) => {
        if (+el.credential_id === +dataInfo.credential_id) {
          setCodePaySelect(el.credential_id)
        }
      })
    }
    return () => setCodePaySelect('')
  }, [codePayArray, dataInfo])

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
      className="accessUsers accessUsers--doc"
      style={{ display: itemStatus ? 'block' : 'none' }}
    >
      <ToastContainer />
      <form onSubmit={createDocumentsInvoice}>
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
              <span>Сформировать инвойс для</span>

              <select
                value={formInvoiceSelect}
                onChange={(event) => setFormInvoiceSelect(event.target.value)}
              >
                {formInvoiceArray.map((elem) => {
                  return (
                    <option key={elem.id + elem.value} value={elem.id}>
                      {elem.value}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              <span>Получатель платежа</span>

              <select
                value={recipientPaySelect}
                onChange={(event) => setRecipientPaySelect(event.target.value)}
              >
                {joinArray.map((elem) => {
                  return (
                    <option
                      key={elem.name ? elem.name : elem.title}
                      value={JSON.stringify(elem)}
                    >
                      {elem.name ? elem.name : elem.title}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              <span>Цена для инвойса</span>

              <input
                type="text"
                placeholder="Цена для инвойса"
                value={priceInvoice}
                onChange={(e) => setPriceInvoice(controlNumber(e.target.value))}
                required
              />
            </label>

            {viewBlock() && (
              <React.Fragment>
                <label>
                  <span>Код покупателя</span>

                  <select
                    value={codePaySelect}
                    onChange={(event) => setCodePaySelect(event.target.value)}
                  >
                    {codePayArray.map((elem) => {
                      return (
                        <option
                          key={elem.credential_id}
                          value={elem.credential_id}
                        >
                          {elem.titleItem}
                        </option>
                      )
                    })}
                  </select>
                </label>

                <label>
                  <span>Номер лота</span>

                  <input
                    type="text"
                    placeholder="Номер лота"
                    value={numberLot}
                    onChange={(e) => setNumberLot(e.target.value)}
                    required
                  />
                </label>
              </React.Fragment>
            )}

            <label>
              <span>Vin</span>

              <input
                type="text"
                placeholder="Vin"
                value={vin}
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[^A-Za-z0-9]/gi, '').toUpperCase()
                  return value.length <= 17 && setVin(value)
                }}
                // onBlur={(e) => verification(e.target.value)}
                required
                ref={refFocus}
              />
            </label>

            {controlCreateInvoice() ? (
              <input
                type="submit"
                className="btn-success-preBid btn-auto"
                value="Сформировать инвойс"
              />
            ) : (
              <span
                style={{ fontSize: '14px', fontWeight: '300', color: 'red' }}
              >
                * Затраты не сверены и не закрыты фин отделом
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

AuctionTransportDocumentsCreateInvoice.propTypes = {
  itemStatus: PropTypes.bool,
  idItem: PropTypes.string,
  invoiceId: PropTypes.func,
  priseAutoProps: PropTypes.number,
  dataUserArray: PropTypes.array,
  getArrayCustomer: PropTypes.func,
  dataInfo: PropTypes.any,
}
export default AuctionTransportDocumentsCreateInvoice
