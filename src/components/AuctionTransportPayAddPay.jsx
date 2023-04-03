import React, { useState, useContext, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Attachment, CheckOutline } from '@rsuite/icons/'

import { getRequest, postRequestFile } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

import PropTypes from 'prop-types'

import { payUserArray, variantPayArray, bankTransitArray } from '../const.js'
import { controlNumber, getDateFunc } from '../helper.js'

const AuctionTransportPayAddPay = ({
  itemStatus,
  propsId,
  getPaymentArray,
  financeDateArray,
  dataArrayProp,
  dataInfo,
  viewBlockProp,
  carrierArray,
  credentialsArray,
  auctionArray,
}) => {
  const [dataUserArray, setDataUserArray] = useState([])
  const [dataUserPay, setDataUserPay] = useState('')
  const [dataUserSelect, setDataUserSelect] = useState(null)
  const [payUsersSelect, setPayUserSelect] = useState(payUserArray[0].id)

  const [bankTransitSelect, setBankTransitSelect] = useState(
    bankTransitArray[0].id
  )

  const [partnersArray, setPartnersArray] = useState([])
  const [partnersSelect, setPartnersSelect] = useState(0)
  const [link, setlink] = useState('')

  const [variantPaySelect, setVariantPaySelect] = useState(
    variantPayArray[1].id
  )
  const [dateValue, setDateValue] = useState('')
  const [sum, setSum] = useState(0)
  const [sumAll, setSumAll] = useState(0)
  const [sumArray, setSumArray] = useState('')

  const [joinArray, setJoinArray] = useState([])

  const [recipientPaySelect, setRecipientPaySelect] = useState(0)
  const [codePayArray, setCodePayArray] = useState([])
  const [codePaySelect, setCodePaySelect] = useState(0)
  const [flagChange, setFlagChange] = useState(0)
  const [defaultAuc, setDefaultAuc] = useState('')
  const [defaultBuyerCode, setDefaultBuyerCode] = useState('')
  const [defaultСarrier_id, setDefaultСarrier_id] = useState('')

  // const { id } = useParams()
  // console.log(
  //   propsId
  //   // dataArrayProp
  // )

  // const [recipientPayArray, setRecipientPayArray] = useState(
  //   auctionArray.length > 0 ? auctionArray : []
  // )
  // const [carriersArray, setCarriersArray] = useState(
  //   carrierArray.length > 0 ? carrierArray : []
  // )

  // const [credentialsArray, setCredentialsArray] = useState({})
  const [transportArray, setTransportArray] = useState([])

  const [fileGive, setFileGive] = useState('')
  const [fileName, setFileName] = useState('')
  const [showIcon, setShowIcon] = useState(false)

  const { dispatch } = useContext(ContextApp)
  const refFocus = useRef()
  let { title } = JSON.parse(window.sessionStorage.getItem('role'))
  const [comment, setComment] = useState('')
  const [other_company_name, setOther_company_name] = useState('')
  const formData = new FormData()

  useEffect(() => {
    dispatch(showLoder({ customer: 1 }))
    getRequest(`/api/v1/order/customer/${propsId}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataUserArray(
          [{ id: null, name: 'Выбрать из списка' }].concat(
            res.customer_information
          )
        )
        setDataUserSelect(
          [{ id: null, name: 'Выбрать из списка' }].concat(
            res.customer_information
          )[0]['id']
        )
        dispatch(showLoder({ customer: 0 }))
      })
      .catch((err) => {
        setDataUserArray([{ id: null, name: 'Выбрать из списка' }])
        setDataUserSelect([{ id: null, name: 'Выбрать из списка' }][0]['id'])
        dispatch(showLoder({ customer: 0 }))
      })
  }, [])
  // useEffect(() => {
  //   dispatch(show())
  //   getRequest(`/api/v1/credentials?limit=${500}`, {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setCredentialsArray(res.credentials)
  //       dispatch(hide())
  //     })
  //     .catch((err) => {
  //       dispatch(hide())
  //     })
  // }, [])

  // useEffect(() => {
  //   dispatch(show())
  //   getRequest('/api/v1/auctions', {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setRecipientPayArray(res.auction)
  //       dispatch(hide())
  //     })
  //     .catch((err) => {
  //       dispatch(hide())
  //     })
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
    if (auctionArray.length > 0 && carrierArray.length > 0) {
      setJoinArray(auctionArray.concat(carrierArray))
      setRecipientPaySelect(
        JSON.stringify(auctionArray.concat(carrierArray)[0])
      )
    }
  }, [auctionArray, carrierArray])

  useEffect(() => {
    if (dataArrayProp && dataInfo) {
      setTransportArray(dataArrayProp)

      setSumArray(dataInfo.price)
    }
    if (joinArray.length > 0 && dataInfo.auction) {
      let findObject = joinArray.find((el) => +el.id === +dataInfo.auction.id)
      let findObj = dataArrayProp.find((el) => +el.id === +propsId)
      if (findObj) {
        setDefaultAuc(findObj.auction.name)
        setDefaultBuyerCode(
          findObj.auction.name +
            ' ' +
            findObj.credential.company_name +
            ' ' +
            findObj.credential.buyerCode
        )

        setDefaultСarrier_id(
          findObj.financeInformation && findObj.financeInformation.carrier
            ? findObj.financeInformation.carrier.title
            : '-'
        )
      }

      if (findObject) setRecipientPaySelect(JSON.stringify(findObject))
    }

    return () => {}
  }, [dataArrayProp, dataInfo, joinArray])

  useEffect(() => {
    dispatch(showLoder({ partners: 1 }))
    const defaultVal = [{ id: 0, name: 'Выбрать из посредников' }]

    getRequest(`/api/v1/partners`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setPartnersArray(defaultVal.concat(res.partners))
        if (res) {
          setPartnersSelect(res.partners[0]['id'])
        } else {
          setPartnersSelect(defaultVal[0]['id'])
        }

        dispatch(showLoder({ partners: 0 }))
      })

      .catch((err) => {
        setPartnersArray([{ id: 0, name: 'Выбрать из посредников' }])
        setPartnersSelect([{ id: 0, name: 'Выбрать из посредников' }][0]['id'])
        dispatch(showLoder({ partners: 0 }))
      })
  }, [])

  useEffect(() => {
    let codeArrayFist = []

    if (credentialsArray[JSON.parse(recipientPaySelect).code]) {
      let filterArrayUsers = credentialsArray[
        JSON.parse(recipientPaySelect).code
      ].filter((elem) => elem.users.length > 0)
      let userIdArrayFilter = transportArray.filter(
        (elem) => elem.id == propsId
      )

      userIdArrayFilter.length > 0 &&
        filterArrayUsers.map((elem) =>
          elem.users.map((elemChaild) =>
            elem.auction_name == JSON.parse(recipientPaySelect).name &&
            elemChaild.user_id == userIdArrayFilter[0].buyer_user.id
              ? codeArrayFist.push({
                  titleItem:
                    elem.auction_name + '-' + elem.login + '-' + elem.buyerCode,
                  credential_id: elem.id,
                  cash: +elemChaild.CashAccountAuction.cash,
                  plus_cash: +elemChaild.CashAccountAuction.plus_cash,
                })
              : null
          )
        )

      setCodePayArray(codeArrayFist)

      codeArrayFist.map((elem) => setCodePaySelect(elem['credential_id']))
    }
  }, [recipientPaySelect, credentialsArray, transportArray])

  let controlFile = (e) => {
    if (e.target.files[0]) {
      setShowIcon(true)
      setFileGive(e.target.files[0])
      setFileName(e.target.files[0].name)
      toast.success('Файл прикреплен!')
    }
  }

  useEffect(() => setDateValue(getDateFunc()), [])

  useEffect(
    () =>
      +payUsersSelect === 1 ? setBankTransitSelect(1) : setBankTransitSelect(0),

    [payUsersSelect]
  )

  // useEffect(
  //   () =>
  //     +bankTransitSelect === 1 ? setPayUserSelect(1) : setPayUserSelect(0),

  //   [bankTransitSelect]
  // )

  // useEffect(() => {
  //   if (+payUsersSelect === 0) setBankTransitSelect(0)
  //   if (+payUsersSelect === 1) setBankTransitSelect(1)
  // }, [, bankTransitSelect])

  useEffect(() => {
    // if (+payUsersSelect === 0) setBankTransitSelect('0')
    // if (+payUsersSelect === 1) setBankTransitSelect('1')
    // else setBankTransitSelect(1)
    if (+bankTransitSelect === 0 || +bankTransitSelect === 1)
      setPartnersSelect(0)
    if (joinArray.length > 0) {
      if (+payUsersSelect === 0)
        setRecipientPaySelect(JSON.stringify(joinArray[0]))

      if (+payUsersSelect === 1)
        setRecipientPaySelect(JSON.stringify(joinArray[2]))
    }
  }, [variantPaySelect, payUsersSelect, joinArray])

  // const getDateFunc = () => {
  //   let date = new Date()
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return setDateValue(year + '-' + mouthRes + '-' + dayRes)
  // }

  const viewBlock = () => {
    return JSON.parse(recipientPaySelect).code == 'iaai' ||
      JSON.parse(recipientPaySelect).code == 'copart' ||
      JSON.parse(recipientPaySelect).code == 'default'
      ? true
      : false
  }

  formData.append('general_information_id', propsId)
  formData.append(
    'customer_information_id',
    !flagChange ? dataUserSelect : null
  )
  formData.append(
    'file',
    +variantPaySelect !== 0 && +variantPaySelect !== 4 ? fileGive : null
  )
  formData.append('buyed_price', sum)
  formData.append('buyed_price_date', dateValue)
  formData.append('payment_by', payUsersSelect)
  formData.append('payment_type', variantPaySelect)
  formData.append('transfer_bank', bankTransitSelect)
  formData.append(
    'auction_id',
    viewBlock()
      ? recipientPaySelect
        ? JSON.parse(recipientPaySelect).id
        : null
      : null
  )
  formData.append(
    'credential_id',
    viewBlock()
      ? recipientPaySelect && JSON.parse(recipientPaySelect).id
        ? codePaySelect
        : null
      : null
  )

  //
  formData.append(
    'carrier_id',
    viewBlock() ? null : JSON.parse(recipientPaySelect).id
  )
  formData.append('partner_id', partnersSelect ? partnersSelect : null)
  formData.append('comment', comment)
  formData.append('other_company_name', other_company_name)
  formData.append('link', +variantPaySelect === 3 ? link : null)
  formData.append(
    'customer_information_custom',
    flagChange ? dataUserPay : null
  )

  // const paramsCreate = [
  //   { general_information_id: propsId },
  //   { customer_information_id: dataUserSelect },
  //   { file: fileGive },
  //   { buyed_price: sum },
  //   { buyed_price_date: dateValue },
  //   { payment_by: payUsersSelect },
  //   { payment_type: variantPaySelect },
  //   { transfer_bank: bankTransitSelect },
  //   {
  //     auction_id: viewBlock()
  //       ? !partnersSelect && recipientPaySelect
  //         ? JSON.parse(recipientPaySelect).id
  //         : null
  //       : null,
  //   },
  //   {
  //     credential_id: viewBlock()
  //       ? !partnersSelect &&
  //         recipientPaySelect &&
  //         JSON.parse(recipientPaySelect).id
  //         ? codePaySelect
  //         : null
  //       : null,
  //   },
  //   { carrier_id: viewBlock() ? null : JSON.parse(recipientPaySelect).id },
  //   { partner_id: partnersSelect ? partnersSelect : null },
  //   { comment: comment },
  //   { other_company_name: other_company_name },
  //   { link: link },
  // ]

  const createPay = (e) => {
    dispatch(showLoder({ createPay: 1 }))
    e && e.preventDefault()

    //преобразуем в formData + null -ненужным полям(valueKey)!
    // paramsCreate.map(
    //   (el) =>
    //     formData.append(
    //       Object.keys(el)[0],
    //       valueKey(+variantPaySelect, +bankTransitSelect).includes(
    //         Object.keys(el)[0]
    //       )
    //         ? el[Object.keys(el)]
    //         : null
    //     )

    // formData.append(Object.keys(el)[0], el[Object.keys(el)])
    // )

    // if (fileGive) {
    // if (+dataUserSelect !== 0) {
    postRequestFile('/api/v1/order/payment', formData)
      .then((res) => {
        toast.success('Успешно создано!')
        // closefield()
        getPaymentArray()
        dispatch(showLoder({ createPay: 0 }))
      })
      .catch(() => {
        toast.error('Что-то пошло не так!')
        dispatch(showLoder({ createPay: 0 }))
      })
    // }
    //  else {
    //   toast.error('Данные получателя/плательщика не выбраны!')
    //   // refFocus.current.focus()
    //   // refFocus.current.style.outline = 'none'
    //   // refFocus.current.style.border = 'solid'
    //   // refFocus.current.style.borderWidth = '1px'
    //   // refFocus.current.style.borderColor = 'red'
    //   dispatch(hide())
    // }
    // }
    // else {
    //   toast.error('Прикрепите файл!')
    //   dispatch(hide())
    // }
  }

  // useEffect(() => {
  //   if (+dataUserSelect !== 0) {
  //     return refFocus.current.style.borderColor === 'red'
  //       ? (refFocus.current.style.borderColor = 'green')
  //       : null
  //   } else {
  //     refFocus.current.style.borderColor = '#dfdfe3'
  //   }
  // }, [dataUserSelect])

  // if (+variantPaySelect === 1) setBankTransitSelect(1)
  useEffect(() => {
    if (+variantPaySelect === 1) setBankTransitSelect(0)
  }, [variantPaySelect])

  useEffect(() => {
    // if (+variantPaySelect === 1) setBankTransitSelect(1)
    if (+variantPaySelect === 0) {
      if (codePaySelect && codePayArray.length > 0) {
        const { plus_cash, cash } = codePayArray.find(
          (el) => +el.credential_id === +codePaySelect
        )
        if (plus_cash || cash) {
          setSumAll(plus_cash)

          if (Math.abs(cash) >= plus_cash) setSum(Math.abs(plus_cash))
          else if (Math.abs(cash) < plus_cash) setSum(Math.abs(plus_cash))
        }
      }
    } else {
      setSum(
        +payUsersSelect === 0
          ? sumArray
            ? sumArray
            : 0
          : financeDateArray.length > 0
          ? +financeDateArray[0].ag_price
          : 0
      )
    }
  }, [payUsersSelect, sumArray, financeDateArray, variantPaySelect])

  useEffect(() => {
    if (codePayArray.length > 0) {
      codePayArray.map((el) => {
        if (+el.credential_id === +dataInfo.credential.id) {
          setCodePaySelect(el.credential_id)
        }
      })
    }
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

  const controlBlockVariant = (val) => {
    switch (+val) {
      case 0:
        return (
          <React.Fragment>
            <label>
              <span>Дата</span>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                max="2999-12-31"
                required
              />
            </label>
            {sumAll > 0 ? (
              <React.Fragment>
                <label>
                  <span>Сумма</span>

                  <input
                    type="text"
                    value={sum}
                    onChange={(e) => {
                      let { plus_cash, cash } = codePayArray.find(
                        (el) => el.credential_id === codePaySelect
                      )
                      if (plus_cash >= e.target.value)
                        setSum(controlNumber(e.target.value))
                      // else if (cash > e.target.value)
                      //   setSum(controlNumber(e.target.value))
                    }}
                    required
                  />
                </label>
                <label>
                  <span>Сумма на кошельке</span>
                  <input type="text" value={sumAll} required disabled />
                </label>
                {bankTransitSelect != 2 && payUsersSelect == '0' && (
                  <label>
                    <span>Buyer Code</span>
                    <input value={defaultBuyerCode} disabled />
                  </label>
                )}
              </React.Fragment>
            ) : (
              <span style={{ color: 'red' }}>
                К сожалению средства на данном кошельке отсутствуют. Просим
                выбрать другой способ оплаты
              </span>
            )}
          </React.Fragment>
        )
      case 1:
        return (
          <React.Fragment>
            <label>
              <span>Оплата в пользу</span>
              <select
                value={bankTransitSelect}
                onChange={(event) => setBankTransitSelect(event.target.value)}
              >
                {bankTransitArray.map((elem, i) => {
                  return (
                    <option key={elem.id + i} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              <span>Посредник</span>
              <select
                value={partnersSelect}
                onChange={(event) => setPartnersSelect(event.target.value)}
              >
                {partnersArray.map((elem, i) => {
                  return (
                    <option key={elem.id + i} value={elem.id}>
                      {elem.name}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              <span>Дата</span>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                max="2999-12-31"
                required
              />
            </label>
            <label>
              <span>Сумма</span>
              <input
                type="text"
                value={sum}
                onChange={(e) => {
                  if (e.target.value <= 999999.99)
                    setSum(controlNumber(e.target.value))
                }}
                required
              />
            </label>

            {+bankTransitSelect === 0 && (
              <label>
                <span>Аукцион</span>

                <input value={defaultAuc} disabled />
              </label>
            )}

            <React.Fragment>
              {+bankTransitSelect === 1 && (
                <label>
                  <span>Получатель платежа</span>
                  <input value={defaultСarrier_id} type="text" disabled />
                </label>
              )}

              {+bankTransitSelect === 0 && (
                <label>
                  <span>Buyer Code</span>

                  <input value={defaultBuyerCode} disabled />
                </label>
              )}
            </React.Fragment>

            <label>
              <span className="customPosition">
                <p>Подтверждение оплаты</p>
                <label htmlFor="ava" style={{ cursor: 'pointer' }}>
                  {showIcon ? <CheckOutline /> : <Attachment />}
                </label>
              </span>
              <input
                value={fileName && fileName}
                disabled
                placeholder="Название файла"
              />

              <input
                id="ava"
                name="ava"
                style={{ display: 'none' }}
                type="file"
                onChange={controlFile}
              />
            </label>
          </React.Fragment>
        )

      case 2:
        return (
          <React.Fragment>
            <label>
              <span>Оплата в пользу</span>
              <select
                value={bankTransitSelect}
                onChange={(event) => setBankTransitSelect(event.target.value)}
              >
                {bankTransitArray.map((elem, i) => {
                  return (
                    <option key={elem.id + i} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            </label>

            {bankTransitSelect != 2 && payUsersSelect == '0' && (
              <label>
                <span>Buyer Code</span>

                <input value={defaultBuyerCode} disabled />
              </label>
            )}
            <label>
              <span>Наименование компании</span>
              <input
                type="text"
                value={other_company_name}
                onChange={(e) => setOther_company_name(e.target.value)}
                placeholder="Наименование компании"
                required
              />
            </label>

            <label>
              <span>Дата</span>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                max="2999-12-31"
                required
              />
            </label>
            <label>
              <span>Сумма</span>
              <input
                type="text"
                value={sum}
                onChange={(e) => {
                  if (e.target.value <= 999999.99)
                    setSum(controlNumber(e.target.value))
                }}
                required
              />
            </label>

            <label>
              <span className="customPosition">
                <p>Подтверждение оплаты</p>
                <label htmlFor="ava" style={{ cursor: 'pointer' }}>
                  {showIcon ? <CheckOutline /> : <Attachment />}
                </label>
              </span>
              <input
                value={fileName ? fileName : ''}
                disabled
                placeholder="Название файла"
              />

              <input
                id="ava"
                name="ava"
                style={{ display: 'none' }}
                type="file"
                onChange={controlFile}
              />
            </label>
          </React.Fragment>
        )

      case 3:
        return (
          <React.Fragment>
            <label>
              <span>Оплата в пользу</span>
              <select
                value={bankTransitSelect}
                onChange={(event) => setBankTransitSelect(event.target.value)}
              >
                {bankTransitArray.map((elem, i) => {
                  return (
                    <option key={elem.id + i} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            </label>
            {bankTransitSelect == 2 && (
              <label>
                <span>Уточняем</span>
                <select
                  value={partnersSelect}
                  onChange={(event) => setPartnersSelect(event.target.value)}
                >
                  {partnersArray.map((elem, i) => {
                    return (
                      <option key={elem.id + i} value={elem.id}>
                        {elem.name}
                      </option>
                    )
                  })}
                </select>
              </label>
            )}
            {bankTransitSelect != 2 && payUsersSelect == '0' && (
              <label>
                <span>Buyer Code</span>

                <input value={defaultBuyerCode} disabled />
              </label>
            )}

            <label>
              <span>Дата</span>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                max="2999-12-31"
                required
              />
            </label>
            <label>
              <span>Сумма</span>
              <input
                type="text"
                value={sum}
                onChange={(e) => {
                  if (e.target.value <= 999999.99)
                    setSum(controlNumber(e.target.value))
                }}
                required
              />
            </label>
            <label>
              <span>Ссылка на операцию</span>
              <input
                type="text"
                value={link}
                placeholder="Ссылка на операцию"
                onChange={(e) => setlink(e.target.value)}
                required
              />
            </label>

            <label>
              <span className="customPosition">
                <p>Подтверждение оплаты</p>
                <label htmlFor="ava" style={{ cursor: 'pointer' }}>
                  {showIcon ? <CheckOutline /> : <Attachment />}
                </label>
              </span>
              <input
                value={fileName && fileName}
                disabled
                placeholder="Название файла"
              />

              <input
                id="ava"
                name="ava"
                style={{ display: 'none' }}
                type="file"
                onChange={controlFile}
              />
            </label>
          </React.Fragment>
        )

      case 4:
        return (
          <React.Fragment>
            <label>
              <span>Сумма</span>
              <input
                type="text"
                value={sum}
                onChange={(e) => {
                  if (e.target.value <= 999999.99)
                    setSum(controlNumber(e.target.value))
                }}
                required
              />
            </label>
            <label>
              <span>Дата</span>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                max="2999-12-31"
                required
              />
            </label>
          </React.Fragment>
        )

      default:
        break
    }
  }

  return (
    <div
      className="accessUsers accessUsers--doc"
      style={{
        display: itemStatus ? 'block' : 'none',
      }}
    >
      <ToastContainer />
      <div className="contentBlockTop">
        <div className="dropBlockContent dropBlockContent--doc">
          <form onSubmit={createPay}>
            <label>
              <span>Оплата за</span>
              <select
                value={payUsersSelect}
                onChange={(event) => setPayUserSelect(event.target.value)}
              >
                {payUserArray.map((elem, i) => {
                  return (
                    <option key={elem.id + i} value={elem.id}>
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              <span>Способ оплаты</span>
              <select
                value={variantPaySelect}
                onChange={(event) => setVariantPaySelect(event.target.value)}
              >
                {variantPayArray.map((elem, i) => {
                  if (elem.title === 'Иная форма') {
                    return (
                      (title === 'Администратор' ||
                        title === 'Мастер финансов') && (
                        <option key={elem.id + i} value={elem.id}>
                          {elem.title}
                        </option>
                      )
                    )
                  } else {
                    return (
                      <option key={elem.id + i} value={elem.id}>
                        {elem.title}
                      </option>
                    )
                  }
                })}
              </select>
            </label>

            {+variantPaySelect === 1 && (
              <div className="selectCustom selectCustom--space">
                <label htmlFor="dataUser">
                  <span> Данные получателя/плательщика</span>
                </label>
                <input
                  value={dataUserPay}
                  placeholder="Данные получателя/плательщика"
                  onChange={(e) => {
                    let value = e.target.value
                    value = value.replace(/[^A-Za-z\s]+/gi, '')

                    setFlagChange(1)
                    setDataUserPay(value)
                  }}
                  id="dataUser"
                  type="text"
                />

                <div
                  className="helpGroupInput"
                  style={{
                    display: dataUserArray.length > 1 ? 'block' : 'none',
                    marginLeft: '10px',
                    width: '20px',
                  }}
                >
                  <select
                    value={dataUserSelect}
                    onChange={(event) => {
                      setDataUserSelect(event.target.value)
                      let info = dataUserArray.find(
                        (el) => +event.target.value == +el.id
                      )

                      info && setDataUserPay(correctinfoUsers(info))
                      setFlagChange(0)
                    }}
                    ref={refFocus}
                  >
                    {dataUserArray.map((elem) => {
                      return (
                        <option key={elem.id + elem.name} value={elem.id}>
                          {correctinfoUsers(elem)}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            )}

            {controlBlockVariant(variantPaySelect)}
            <label
              style={{
                display:
                  +variantPaySelect === 0 && sumAll <= 0 ? 'none' : 'flex',
              }}
            >
              <span>Комментарий</span>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий"
              />
            </label>

            {viewBlockProp(54) && (
              <input
                style={{
                  display:
                    +variantPaySelect === 0 && sumAll <= 0 ? 'none' : 'block',
                }}
                type="submit"
                className="btn-success-preBid btn-auto"
                value="Сохранить"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

AuctionTransportPayAddPay.propTypes = {
  itemStatus: PropTypes.bool,
  propsId: PropTypes.string,
  getPaymentArray: PropTypes.func,
  financeDateArray: PropTypes.array,
  dataArrayProp: PropTypes.array,
  dataInfo: PropTypes.object,
  viewBlockProp: PropTypes.func,
}
export default AuctionTransportPayAddPay
