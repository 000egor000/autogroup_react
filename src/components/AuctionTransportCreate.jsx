import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { postRequest, getRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp'
import { getDateFunc } from '../helper.js'
import PropTypes from 'prop-types'

const AuctionTransportCreate = ({
  getDataInfo,
  getShortInfo,
  carrierArray,
  fillContainer,
}) => {
  const { id } = useParams()
  const [admissionStock, setAdmissionStock] = useState('')

  const [numberContainer, setNumberContainer] = useState('')
  const [sealineArray, setSealineArray] = useState([])
  const [sealineSelect, setSealineSelect] = useState('')
  const [dateLoading, setDateLoading] = useState('')

  const [dateValueGeneration, setDateValueGeneration] = useState([])
  const [datePay, setDatePay] = useState('')
  const [dateToday, setDateToday] = useState('')

  const [viewControler, setViewControler] = useState([])

  const [date_buy, setDate_buy] = useState('')
  const [lot_payment, setLot_payment] = useState('')
  const [call_auction, setCall_auction] = useState('')
  const [lot_send, setLot_send] = useState('')
  const [documents_received, setDocuments_received] = useState('')
  const [shipping_usa, setShipping_usa] = useState('')
  const [arrival_end, setArrival_end] = useState('')
  const pathCurrent = window.location.pathname
  const [statusShipping, setStatusShipping] = useState('')
  const [financeDateArray, setFinanceDateArray] = useState([])
  const [statusCarrier, setStatusCarrier] = useState(false)

  const [carrierSelect, setCarrierSelect] = useState('')

  const navigate = useNavigate()
  const { dispatch, state } = useContext(ContextApp)

  // useEffect(() => {
  //   if (carrierArray.length > 0) setCarrierSelect(carrierArray[0].id)
  // }, [carrierArray])

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  useEffect(() => {
    if (financeDateArray.length > 0) {
      if (JSON.parse(financeDateArray.at(-1).usa_finance).statusFinance) {
        setCarrierSelect(financeDateArray.at(-1).carrier_id)
        setStatusCarrier(true)
      }
    } else if (carrierArray.length > 0) {
      setCarrierSelect(carrierArray[0].id)
    }
  }, [financeDateArray, carrierArray])

  useEffect(() => {
    dispatch(showLoder({ financeId: 1 }))
    getRequest(`/api/v1/order/finance/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinanceDateArray(res.finance_information)
        dispatch(showLoder({ financeId: 0 }))
      })
      .catch((err) => {
        setFinanceDateArray([])
        dispatch(showLoder({ financeId: 0 }))
      })
  }, [])

  useEffect(() => {
    if (fillContainer.status) setFillContainerArray(fillContainer)
  }, [fillContainer])

  useEffect(() => {
    dispatch(showLoder({ seaLines: 1 }))
    getRequest('/api/v1/sea-lines', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setSealineArray(res.seaLines)

        setSealineSelect(res.seaLines[0]['id'])
        dispatch(showLoder({ seaLines: 0 }))
      })
      .catch((err) => {
        toast.error('Что-то пошло не так!')
        dispatch(showLoder({ seaLines: 0 }))
      })
  }, [])

  useEffect(() => {
    getDatePay()
    return () => {
      setDatePay('')
    }
  }, [dateLoading])

  useEffect(() => {
    getNumberContainer()
    setDateToday(getDateFunc())

    return () => {
      setNumberContainer('')
      setDateToday('')
    }
  }, [numberContainer])

  const viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  const controlRoleView = () => {
    if (
      Object.keys(
        JSON.parse(window.sessionStorage.getItem('access_rights'))
      ).includes('auto')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).auto.access_rights

      setViewControler(initialValue)
    }
  }

  const controlDisabled = () => {
    let bool = false

    if (!viewBlock(44)) bool = true
    if (
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
    )
      bool = true

    return bool
  }

  const setFillContainerArray = ({
    arrival_warehouse,
    documents_received,
    number_container,
    sea_line_id,
    date_arrival,
    date_pay,
    date_city,
    date_buy,
    lot_payment,
    call_auction,
    lot_send,
    shipping_usa,
    arrival_end,
    notification,
    carrier,
  }) => {
    setDocuments_received(documents_received ? documents_received : '')
    setNumberContainer(number_container ? number_container : '')
    setDateLoading(date_arrival ? date_arrival : '')
    setDatePay(date_pay ? date_pay : '')
    setAdmissionStock(arrival_warehouse ? arrival_warehouse : '')
    setSealineSelect(sea_line_id ? sea_line_id : sealineArray[0].id)
    carrier && setCarrierSelect(carrier.id)

    // getLinkCurrent(sea_line_id ? sea_line_id : '')

    setDate_buy(date_buy ? date_buy : '')
    setLot_payment(lot_payment ? lot_payment : '')
    setCall_auction(call_auction ? call_auction : '')

    setLot_send(lot_send ? lot_send : '')

    setDocuments_received(documents_received ? documents_received : '')
    setShipping_usa(shipping_usa ? shipping_usa : '')
    setArrival_end(arrival_end ? arrival_end : '')

    setStatusShipping(notification ? notification.name : '')
    // setStatusShippingText(notification ? notification.text : '')
    // getStatusShippingText(notification ? notification.text : '')

    // dispatch(hide())
  }

  const getDatePay = () => {
    if (dateLoading) {
      let currentValueDate = new Date(dateLoading)

      let res = new Date(
        currentValueDate.getFullYear(),
        currentValueDate.getMonth(),
        currentValueDate.getDate() + 7
      )

      let year = res.getFullYear()
      let mouthRes =
        res.getMonth() + 1 <= 9
          ? '0' + (res.getMonth() + 1)
          : res.getMonth() + 1
      let dayRes = res.getDate() <= 9 ? '0' + res.getDate() : res.getDate()
      setDatePay(year + '-' + mouthRes + '-' + dayRes)
    }
  }

  const getNumberContainer = () => {
    if (numberContainer.length > 4) {
      let letters = numberContainer.substring(0, 4)

      let string = (letters += numberContainer
        .substring(4, 11)
        .replace(/\D/g, ''))
      setNumberContainer(string)
    } else {
      setNumberContainer(numberContainer.replace(/[0-9А-ЯЁё]/g, ''))
    }
  }

  // const getDateValueGeneration = (val) => {
  //   let container = []

  //   destinationsArray.map((elem) =>
  //     val
  //       ? val.map(
  //           (el) =>
  //             elem.id === el.destination_id &&
  //             container.push({
  //               ...elem,
  //               change: el.date === null ? '' : el.date,
  //             })
  //         )
  //       : container.push({ ...elem, change: '' })
  //   )
  //   return setDateValueGeneration(container)
  // }

  // const getDateFunc = () => {
  //   let date = new Date()
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return setDateToday(year + '-' + mouthRes + '-' + dayRes)
  // }

  const getDateJson = () => {
    let container = []
    dateValueGeneration.map((elem) =>
      container.push({ destination_id: elem.id, date: elem.change })
    )

    return JSON.stringify(container)
  }

  const generationInput = (val, change) => {
    let changeObject = []
    dateValueGeneration.map((elem) =>
      changeObject.push(
        elem.id === val.id ? { ...elem, change: change } : { ...elem }
      )
    )
    setDateValueGeneration(changeObject)
  }

  let paramsCreate = {
    general_information_id: id,

    number_container: numberContainer,

    date_arrival: dateLoading,
    date_city: getDateJson(),
    date_pay: datePay,
    arrival_warehouse: admissionStock,
    sea_line_id: sealineSelect,
    carrier_id: +carrierSelect,

    date_buy,
    lot_payment,
    call_auction,
    lot_send,
    documents_received,
    shipping_usa,
    arrival_end,
  }

  const createAuctionAuto = (e) => {
    e.preventDefault()
    if (+sealineSelect !== 1) {
      dispatch(showLoder({ shippingCreate: 1 }))
      postRequest('/api/v1/order/shipping', paramsCreate)
        .then((res) => {
          toast.success('Успешно создано!')
          navigate(
            `/auction-transport/edit/${id}/editTransport/${res.shipping_information_id}`
          )
          getDataInfo()
          getShortInfo()
          dispatch(showLoder({ shippingCreate: 0 }))
        })
        .catch((err) => {
          toast.error('Что-то пошло не так!')
          dispatch(showLoder({ shippingCreate: 0 }))
        })
    } else {
      toast.info('Выберете морскую линию!')
    }
  }

  return (
    <div className="itemShipping">
      <form onSubmit={createAuctionAuto}>
        <ToastContainer />
        <h2>Транспорт</h2>

        <label>
          <span>Статус перевозки</span>
          <p style={{ display: statusShipping ? 'block' : 'none' }}>
            {statusShipping}
          </p>
        </label>

        <label>
          <span>Перевозчик</span>
          {(viewBlock(46) && !viewBlock(45)) || controlDisabled() ? (
            <input value="-" disabled />
          ) : (
            <select
              value={carrierSelect}
              onChange={(event) => setCarrierSelect(event.target.value)}
              disabled={controlDisabled() || statusCarrier}
            >
              {carrierArray.map((elem, i) => (
                <option key={elem.id} value={elem.id}>
                  {elem.title}
                </option>
              ))}
            </select>
          )}
        </label>

        <label>
          <span>Номер контенера</span>
          <input
            type="text"
            placeholder="ABCD1234567"
            pattern="^[A-Z]{4}[0-9]{7}$"
            value={numberContainer}
            onChange={(e) =>
              setNumberContainer(String(e.target.value).toUpperCase())
            }
            min={date_buy}
            disabled={controlDisabled()}
          />
        </label>

        <label>
          <span>Морская линия</span>
          {controlDisabled() ? (
            <input value="-" disabled />
          ) : (
            <select
              value={sealineSelect}
              onChange={(event) => setSealineSelect(event.target.value)}
              disabled={controlDisabled()}
            >
              {sealineArray.map((elem, i) => (
                <option key={elem.id} value={elem.id}>
                  {elem.title}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* data_buy */}
        <label>
          <span> Дата покупки </span>
          <input
            type="date"
            value={date_buy}
            onChange={(e) => setDate_buy(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled
          />
        </label>
        {/* lot_payment  */}
        <label>
          <span> Оплата за лот получена</span>
          <input
            type="date"
            value={lot_payment}
            onChange={(e) => setLot_payment(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>

        {/* call_auction  */}
        <label>
          <span> Дата вывоза с аукциона</span>
          <input
            type="date"
            value={call_auction}
            onChange={(e) => setCall_auction(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>
        {/* lot_send  */}
        <label>
          <span> Лот доставлен в порт отправления</span>
          <input
            type="date"
            value={lot_send}
            onChange={(e) => setLot_send(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>
        {/* documents_get */}
        <label>
          <span>Документы получены</span>
          <input
            type="date"
            value={documents_received}
            onChange={(e) => setDocuments_received(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>
        {/* shipping_usa */}
        <label>
          <span> Отправка из США</span>
          <input
            type="date"
            value={shipping_usa}
            onChange={(e) => setShipping_usa(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>
        {/* arrival_end */}
        <label>
          <span> Прибытие в порт назначения</span>
          <input
            type="date"
            value={arrival_end}
            onChange={(e) => setArrival_end(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>

        <label>
          <span>Поступление на склад</span>
          <input
            type="date"
            value={admissionStock}
            onChange={(e) => setAdmissionStock(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>

        <label>
          <span>Дата погрузки</span>
          <input
            type="date"
            value={dateLoading}
            onChange={(e) => setDateLoading(e.target.value)}
            min={date_buy}
            max="2999-12-31"
            disabled={controlDisabled()}
          />
        </label>
        {dateValueGeneration.map((elem, i) => (
          <label key={elem.title + i}>
            <span>{elem.title + ' (предв)'}</span>

            <input
              type="date"
              value={elem.change}
              onChange={(e) => generationInput(elem, e.target.value)}
              min={dateLoading}
              max="2999-12-31"
              disabled={controlDisabled()}
            />
          </label>
        ))}

        {/* <label>
      <span> Дата оплаты за доставку</span>
      <input
        type="date"
        value={datePay}
        onChange={(e) => setDatePay(e.target.value)}
        min={dateLoading}
        max="2999-12-31"
        disabled={controlDisabled()}
      />
    </label> */}
        {!controlDisabled() && (
          <input
            type="submit"
            className="btn-success-preBid btn-auto"
            value="Сохранить"
          />
        )}
      </form>
    </div>
  )
}

AuctionTransportCreate.propTypes = {
  getDataInfo: PropTypes.func,
  getShortInfo: PropTypes.func,
}

export default AuctionTransportCreate
