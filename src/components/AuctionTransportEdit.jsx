import React, { useState, useContext, useEffect, memo } from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { useParams } from 'react-router-dom'
import { getRequest, putRequest } from '../base/api-request'

import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'
// import InfoOutlineIcon from '@rsuite/icons/InfoOutline'
import PropTypes from 'prop-types'
import { getDateFunc } from '../helper.js'

const AuctionTransportEdit = ({
  dataProps,
  viewBlock,
  getDataInfo,
  getShortInfo,
  destinationsArray,
  // getStatusShippingText,
  carrierArray,
  // statusShippingText,
  getInfoAec,
  fillContainer,
  notificationTitle,
  clickGetDataInfoStatus,
  setClickGetDataInfoStatus,
}) => {
  const [admissionStock, setAdmissionStock] = useState('')

  const [numberContainer, setNumberContainer] = useState('')
  const [sealineArray, setSealineArray] = useState([])
  const [sealineSelect, setSealineSelect] = useState('')
  const [dateLoading, setDateLoading] = useState('')
  const [linkCurrent, setLinkCurrent] = useState('')
  // const [statusShipping, setStatusShipping] = useState('')
  // const [statusShippingText, setStatusShippingText] = useState('')

  const [dateValueGeneration, setDateValueGeneration] = useState([])
  const [datePay, setDatePay] = useState('')
  const [dateToday, setDateToday] = useState('')

  // const [destinationsArray, setDestinationsArray] = useState([])
  const { id, idShipping } = useParams()
  const { dispatch, state } = useContext(ContextApp)

  const [date_buy, setDate_buy] = useState('')
  const [lot_payment, setLot_payment] = useState('')
  const [call_auction, setCall_auction] = useState('')
  const [lot_send, setLot_send] = useState('')
  const [documents_received, setDocuments_received] = useState('')
  const [shipping_usa, setShipping_usa] = useState('')
  const [arrival_end, setArrival_end] = useState('')
  const [carrierSelect, setCarrierSelect] = useState('')
  // const [flagStatusValue, setFlagStatusValue] = useState(true)
  const [financeDateArray, setFinanceDateArray] = useState([])
  const [statusCarrier, setStatusCarrier] = useState(false)

  const pathCurrent = window.location.pathname

  const controlDisabled = () => {
    let bool = false

    if (pathCurrent.split('/')[1] === 'archiveTransport') bool = true
    if (pathCurrent.split('/')[1] === 'removedTransport') bool = true
    return bool
  }

  useEffect(() => {
    if (carrierArray.length > 0) setCarrierSelect(carrierArray[0].id)
  }, [carrierArray])

  useEffect(() => {
    if (financeDateArray.length > 0) {
      if (JSON.parse(financeDateArray.at(-1).usa_finance).statusFinance) {
        setCarrierSelect(financeDateArray.at(-1).carrier_id)
        setStatusCarrier(true)
      }
    }
  }, [financeDateArray])

  useEffect(() => {
    dispatch(showLoder({ financeInfo: 1 }))
    getRequest(`/api/v1/order/finance/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinanceDateArray(res.finance_information)
        dispatch(showLoder({ financeInfo: 0 }))
      })
      .catch((err) => {
        setFinanceDateArray([])
        dispatch(showLoder({ financeInfo: 0 }))
      })
  }, [])

  useEffect(() => {
    if (dataProps.length > 0) {
      fillDataArray(dataProps)
    }
  }, [dataProps])

  useEffect(() => {
    dispatch(showLoder({ sealines: 1 }))
    getRequest('/api/v1/sea-lines', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setSealineArray([{ id: 0, title: '-' }].concat(res.seaLines))
        // setSealineSelect(res.seaLines[0]['id'])
        dispatch(showLoder({ sealines: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ sealines: 0 }))
      })
  }, [])

  useEffect(() => setDateToday(getDateFunc()), [])

  useEffect(() => {
    getDateValueGeneration()
    return () => {
      setDateValueGeneration([])
    }
  }, [dataProps, destinationsArray])

  useEffect(() => {
    getDatePay()
    return () => {
      setDatePay('')
    }
  }, [dateLoading])

  useEffect(() => {
    if (numberContainer) {
      if (numberContainer.length > 4) {
        let letters = numberContainer.substring(0, 4)

        let string = (letters += numberContainer
          .substring(4, 11)
          .replace(/\D/g, ''))
        setNumberContainer(string)
      } else {
        setNumberContainer(numberContainer.replace(/[0-9]/g, ''))
      }
    }
    return () => setNumberContainer('')
  }, [numberContainer])

  const getDateValueGeneration = () => {
    if (dataProps.length > 0) {
      let container = []
      let changeObject = []
      let filterResult = dataProps.filter((elem) => elem.id === +idShipping)
      destinationsArray.map((elem) =>
        container.push({ ...elem, change: dateToday })
      )

      dataProps.length > 0 &&
        container.map((elem) =>
          filterResult.map((elemChaild) =>
            JSON.parse(elemChaild.date_city).map(
              (elemChaildCurrent) =>
                elem.id === elemChaildCurrent.destination_id &&
                changeObject.push({ ...elem, change: elemChaildCurrent.date })
            )
          )
        )

      setDateValueGeneration(dataProps.length > 0 ? changeObject : container)
    }
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

  let fillDataArray = (val) => {
    let filterResult = val.filter((elem) => elem.id === +idShipping)
    if (filterResult.length > 0) {
      filterResult.map(
        ({
          number_container,
          date_arrival,
          date_pay,
          arrival_warehouse,
          sea_line_id,
          date_buy,
          lot_payment,
          call_auction,
          lot_send,
          documents_received,
          shipping_usa,
          arrival_end,
          carrier,
        }) => {
          setNumberContainer(number_container ? number_container : '')
          setDateLoading(date_arrival ? date_arrival : '')
          setDatePay(date_pay ? date_pay : '')
          setAdmissionStock(arrival_warehouse ? arrival_warehouse : '')

          setSealineSelect(
            sea_line_id
              ? sea_line_id
              : sealineArray.length > 0
              ? sealineArray[0]['id']
              : ''
          )
          getLinkCurrent(sea_line_id ? sea_line_id : '')
          setDate_buy(date_buy ? date_buy : '')
          setLot_payment(lot_payment ? lot_payment : '')
          setCall_auction(call_auction ? call_auction : '')
          setLot_send(lot_send ? lot_send : '')
          setDocuments_received(documents_received ? documents_received : '')
          setShipping_usa(shipping_usa ? shipping_usa : '')
          setArrival_end(arrival_end ? arrival_end : '')
          setCarrierSelect(
            carrier
              ? carrier.id
              : carrierArray.length > 0
              ? carrierArray[0].id
              : ''
          )
        }
      )
    }
  }
  const getLinkCurrent = (valId) => {
    let find = sealineArray.find((el) => +el.id === +valId)
    setLinkCurrent(typeof find === 'object' ? find.url : '')
  }
  // const getDateFunc = () => {
  //   let date = new Date()
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return setDateToday(year + '-' + mouthRes + '-' + dayRes)
  // }

  const generationInput = (val, change) => {
    let changeObject = []
    dateValueGeneration.map((elem) =>
      changeObject.push(
        elem.id === val.id ? { ...elem, change: change } : { ...elem }
      )
    )
    setDateValueGeneration(changeObject)
  }

  const getDateJson = () => {
    let container = []
    dateValueGeneration.map((elem) =>
      container.push({ destination_id: elem.id, date: elem.change })
    )

    return JSON.stringify(container)
  }

  let paramsEdit = {
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

  const editAuctionAuto = (e) => {
    dispatch(showLoder({ editAuctionAuto: 1 }))
    e.preventDefault()

    putRequest(`/api/v1/order/shipping/${+idShipping}`, paramsEdit)
      .then((res) => {
        getDataInfo()
        getShortInfo()

        state.createNotification('Информация обновлена!', 'success')
        dispatch(showLoder({ editAuctionAuto: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ editAuctionAuto: 0 }))
      })
  }

  useEffect(() => {
    if (fillContainer.status && clickGetDataInfoStatus)
      setFillContainerArray(fillContainer)
  }, [fillContainer])

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
    // notification,
  }) => {
    setDocuments_received(documents_received ? documents_received : '')
    setNumberContainer(number_container ? number_container : '')
    setDateLoading(date_arrival ? date_arrival : '')
    setDatePay(date_pay ? date_pay : '')
    setAdmissionStock(arrival_warehouse ? arrival_warehouse : '')
    setSealineSelect(sea_line_id ? sea_line_id : '')

    getLinkCurrent(sea_line_id ? sea_line_id : '')

    setDate_buy(date_buy ? date_buy : '')
    setLot_payment(lot_payment ? lot_payment : '')
    setCall_auction(call_auction ? call_auction : '')

    setLot_send(lot_send ? lot_send : '')

    setDocuments_received(documents_received ? documents_received : '')
    setShipping_usa(shipping_usa ? shipping_usa : '')
    setArrival_end(arrival_end ? arrival_end : '')
    // setStatusShipping(notification ? notification.name : '')
  }

  return (
    <div className="itemShipping">
      <form onSubmit={editAuctionAuto}>
        <h2>Транспорт</h2>
        <label>
          <span>Статус перевозки</span>
          <p style={{ display: notificationTitle ? 'block' : 'none' }}>
            {notificationTitle}
          </p>
        </label>
        <label>
          <span>Перевозчик</span>

          <select
            value={carrierSelect}
            onChange={(event) => setCarrierSelect(event.target.value)}
            disabled={
              (viewBlock(46) && !viewBlock(45)) ||
              controlDisabled() ||
              statusCarrier
            }
          >
            {carrierArray.map((elem, i) => (
              <option key={elem.id} value={elem.id}>
                {elem.title}
              </option>
            ))}
          </select>
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
            disabled={(viewBlock(46) && !viewBlock(45)) || controlDisabled()}
          />
        </label>

        <label>
          <span>Морская линия</span>
          {viewBlock(46) && !viewBlock(45) ? (
            <input value="-" readOnly />
          ) : (
            <select
              value={sealineSelect}
              onChange={(event) => setSealineSelect(event.target.value)}
              disabled={(viewBlock(46) && !viewBlock(45)) || controlDisabled()}
            >
              {sealineArray.map((elem, i) => {
                return (
                  <option key={elem.id} value={elem.id}>
                    {elem.title}
                  </option>
                )
              })}
            </select>
          )}
        </label>

        {linkCurrent !== '-' ? (
          <label>
            <span> Ссылка для отслеживания</span>
            <a
              href={linkCurrent}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                outline: 'none',
                color: 'inherit',
              }}
            >
              {linkCurrent}
            </a>
          </label>
        ) : (
          ''
        )}

        {/* date_buy */}
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
            disabled={!viewBlock(44) || controlDisabled()}
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
            disabled={!viewBlock(44) || controlDisabled()}
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
            disabled={!viewBlock(44) || controlDisabled()}
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
            disabled={!viewBlock(44) || controlDisabled()}
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
            disabled={!viewBlock(44) || controlDisabled()}
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
            disabled={!viewBlock(44) || controlDisabled()}
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
            disabled={(viewBlock(46) && !viewBlock(45)) || controlDisabled()}
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
            disabled={(viewBlock(46) && !viewBlock(45)) || controlDisabled()}
          />
        </label>
        {dateValueGeneration.map((elem, i) => {
          return (
            <label key={elem + i}>
              <span>{elem.title + ' (предв)'}</span>

              <input
                type="date"
                value={elem.change}
                onChange={(e) => generationInput(elem, e.target.value)}
                min={dateLoading}
                max="2999-12-31"
                disabled={
                  (viewBlock(46) && !viewBlock(45)) || controlDisabled()
                }
              />
            </label>
          )
        })}

        {/* <label>
        <span> Дата оплаты за доставку</span>
        <input
          type="date"
          value={datePay}
          onChange={(e) => setDatePay(e.target.value)}
          min={dateLoading}
          max="2999-12-31"
          disabled={(viewBlock(46) && !viewBlock(45)) || controlDisabled()}
        />
      </label> */}

        {(!viewBlock(46) || viewBlock(45)) && (
          <div
            className="groupBtn"
            style={{ display: controlDisabled() ? 'none' : 'flex' }}
          >
            <input
              type="submit"
              className="btn-success-preBid btn-auto"
              value={+idShipping ? 'Обновить' : 'Сохранить'}
            />
            {+idShipping && (
              <button
                type="button"
                className="btn-success-preBid btn-auto"
                onClick={() => {
                  setClickGetDataInfoStatus(true)
                  getInfoAec()
                }}
              >
                Получение информации из AEC
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
AuctionTransportEdit.propTypes = {
  dataProps: PropTypes.array,
  viewBlock: PropTypes.func,
  getDataInfo: PropTypes.func,
  getShortInfo: PropTypes.func,
}

export default memo(AuctionTransportEdit)
