import React, { useState, useEffect } from 'react'

import nextId, { setPrefix } from 'react-id-generator'

import { Modal } from 'rsuite'
import PropTypes from 'prop-types'
import { variantPayFinance } from '../const.js'
import { controlNumber } from '../helper.js'

const AuctionTransportFinanceTop = ({
  getToastSucces,
  getToastError,
  getFlagSendReq,
  financeDateArray,
  setPay_info,
  autoInfo,
}) => {
  const [yardStorageFeeTop, setYardStorageFeeTop] = useState('')
  const [latePaymentFeeTop, setLatePaymentFeeTop] = useState('')
  const [mailingFeeTop, setMailingFeeTop] = useState('')

  const [yardStorageFeeStatus, setYardStorageFeeStatus] = useState(false)
  const [latePaymentFeeStatus, setLatePaymentFeeStatus] = useState(false)
  const [mailingFeeStatus, setMailingFeeStatus] = useState(false)

  const [yardStorageFeeTopPay, setYardStorageFeeTopPay] = useState(0)
  const [latePaymentFeeTopPay, setLatePaymentFeeTopPay] = useState(0)
  const [mailingFeeTopPay, setMailingFeeTopPay] = useState(0)

  const [dateValueGenerationTop, setDateValueGenerationTop] = useState([])
  const [currentResTop, setCurrentResTop] = useState(0)
  const [isModalClose, setIsModalClose] = useState(false)
  const [statusMoney, setStatusMoney] = useState(true)
  const [statusFinanceTop, setStatusFinanceTop] = useState(false)
  const [statusClosePayFinance, setStatusClosePayFinance] = useState(false)
  const role = ['office', 'dealer', 'logist', 'finance', 'admin']
  const roleParams = JSON.parse(window.sessionStorage.getItem('role')).code
  // console.log(roleParams==role[0])

  useEffect(() => {
    if (autoInfo) {
      autoInfo.cashAccountAuction &&
        autoInfo.cashAccountAuction.length > 0 &&
        +autoInfo.cashAccountAuction[0].plus_cash > 0 &&
        setStatusMoney(false)
    }
  }, [autoInfo])

  const pay_info = {
    yardStorageFee: {
      title: yardStorageFeeTop,
      pay: yardStorageFeeTopPay,
      status: yardStorageFeeStatus,
    },
    latePaymentFee: {
      title: latePaymentFeeTop,
      pay: latePaymentFeeTopPay,
      status: latePaymentFeeStatus,
    },
    mailingFee: {
      title: mailingFeeTop,
      pay: mailingFeeTopPay,
      status: mailingFeeStatus,
    },

    dateValueGenerationTop: dateValueGenerationTop,
    statusClosePay: statusFinanceTop,
    statusClosePayFinance: statusClosePayFinance,
    currentResTop: currentResTop,
  }

  useEffect(() => {
    if (financeDateArray.length > 0) {
      if (financeDateArray.at(-1).pay_info) {
        const {
          yardStorageFee,
          latePaymentFee,
          mailingFee,
          dateValueGenerationTop,
          statusClosePay,
          statusClosePayFinance,
          currentResTop,
        } = JSON.parse(financeDateArray.at(-1).pay_info)
        if (
          JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
            'yardStorageFee'
          ) &&
          JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
            'latePaymentFee'
          ) &&
          JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
            'mailingFee'
          ) &&
          JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
            'dateValueGenerationTop'
          )
        ) {
          //Способ оплаты
          setYardStorageFeeTopPay(yardStorageFee.pay)
          setLatePaymentFeeTopPay(latePaymentFee.pay)
          setMailingFeeTopPay(mailingFee.pay)
          //Оплата
          setYardStorageFeeTop(yardStorageFee.title)
          setLatePaymentFeeTop(latePaymentFee.title)
          setMailingFeeTop(mailingFee.title)
          //Статус
          setYardStorageFeeStatus(yardStorageFee.status)
          setLatePaymentFeeStatus(latePaymentFee.status)
          setMailingFeeStatus(mailingFee.status)
          //Доп параметры
          setDateValueGenerationTop(dateValueGenerationTop)
          setCurrentResTop(currentResTop)
          setStatusFinanceTop(statusClosePay)
          setStatusClosePayFinance(statusClosePayFinance)
        }
      }
    }
    return () => {}
  }, [financeDateArray])

  useEffect(() => {
    let addSumWithInitial = 0
    const latePaymentFeeTopValue = Number(
      latePaymentFeeTopPay == 1 || latePaymentFeeTopPay == 3
        ? latePaymentFeeTop
        : 0
    )

    const mailingFeeTopPayValue = Number(
      mailingFeeTopPay == 1 || latePaymentFeeTopPay == 3 ? mailingFeeTop : 0
    )
    const yardStorageFeeTopValue = Number(
      yardStorageFeeTopPay == 1 || latePaymentFeeTopPay == 3
        ? yardStorageFeeTop
        : 0
    )

    const autoInfoValue = Number(autoInfo.price ? autoInfo.price : 0)

    const resultCount =
      latePaymentFeeTopValue +
      mailingFeeTopPayValue +
      yardStorageFeeTopValue +
      autoInfoValue

    if (dateValueGenerationTop.length > 0)
      dateValueGenerationTop.map((elem) => {
        if (elem.pay == 1 || elem.pay == 3) addSumWithInitial += +elem.value
      })

    setCurrentResTop((resultCount + addSumWithInitial).toFixed(2))
  }, [
    autoInfo.price,
    yardStorageFeeTop,
    latePaymentFeeTop,
    mailingFeeTop,
    dateValueGenerationTop,
  ])

  useEffect(
    () => setPay_info(pay_info),
    [
      yardStorageFeeTopPay,
      latePaymentFeeTopPay,
      mailingFeeTopPay,
      yardStorageFeeTop,
      latePaymentFeeTop,
      mailingFeeTop,
      dateValueGenerationTop,
      currentResTop,
    ]
  )

  let generatorArrayTop = () => {
    let container = []
    setPrefix('')
    container.push({
      id: nextId(),
      title: '',
      value: '',
      pay: 0,
      status: false,
    })
    setDateValueGenerationTop([...dateValueGenerationTop, ...container])
  }

  const generationInputTop = (val, change) => {
    let changeObject = []
    dateValueGenerationTop.map((elem) =>
      changeObject.push(
        elem.id === val.id ? { ...elem, ...change } : { ...elem }
      )
    )
    setDateValueGenerationTop(changeObject)
  }

  const topBlockPay = () => {
    return (
      <div className="payBlockCustom">
        <label>
          <span>Цена на торгах </span>
          <input
            type="text"
            placeholder="Цена на торгах "
            value={autoInfo.price}
            style={{ width: '30%' }}
            disabled
          />
        </label>

        <label>
          <span>Yard storage fee</span>
          <input
            type="text"
            placeholder="Yard storage fee"
            value={yardStorageFeeTop}
            onChange={(e) =>
              setYardStorageFeeTop(controlNumber(e.target.value))
            }
            onBlur={() =>
              getFlagSendReq({
                statusView: false,
                controlBlockTop: true,
              })
            }
            disabled={
              conrolClose() || yardStorageFeeStatus || yardStorageFeeTopPay == 0
            }
          />
          <select
            value={yardStorageFeeTopPay}
            onChange={(event) => {
              setYardStorageFeeTopPay(event.target.value)
            }}
            disabled={conrolClose() || yardStorageFeeStatus}
          >
            {variantPayFinance.map((elem, i) => {
              return (
                <option
                  key={elem.id}
                  value={elem.id}
                  disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                >
                  {elem.title}
                </option>
              )
            })}
          </select>
        </label>

        <label>
          <span>Late payment fee</span>
          <input
            type="text"
            placeholder="Late payment fee"
            value={latePaymentFeeTop}
            onChange={(e) =>
              setLatePaymentFeeTop(controlNumber(e.target.value))
            }
            onBlur={() =>
              getFlagSendReq({
                statusView: false,
                controlBlockTop: true,
              })
            }
            disabled={
              conrolClose() || latePaymentFeeStatus || latePaymentFeeTopPay == 0
            }
          />
          <select
            value={latePaymentFeeTopPay}
            onChange={(event) => setLatePaymentFeeTopPay(event.target.value)}
            disabled={conrolClose() || latePaymentFeeStatus}
          >
            {variantPayFinance.map((elem, i) => {
              return (
                <option
                  key={elem.id}
                  value={elem.id}
                  disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                >
                  {elem.title}
                </option>
              )
            })}
          </select>
        </label>
        <label>
          <span>Mailing fee</span>
          <input
            type="text"
            placeholder="Mailing fee"
            value={mailingFeeTop}
            onChange={(e) => setMailingFeeTop(controlNumber(e.target.value))}
            onBlur={() =>
              getFlagSendReq({
                statusView: false,
                controlBlockTop: true,
              })
            }
            disabled={
              conrolClose() || mailingFeeStatus || mailingFeeTopPay == 0
            }
          />
          <select
            value={mailingFeeTopPay}
            onChange={(event) => setMailingFeeTopPay(event.target.value)}
            disabled={conrolClose() || mailingFeeStatus}
          >
            {variantPayFinance.map((elem, i) => {
              return (
                <option
                  key={elem.id}
                  value={elem.id}
                  disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                >
                  {elem.title}
                </option>
              )
            })}
          </select>
        </label>
        <div className="generationBlock">
          {dateValueGenerationTop.length > 0 &&
            dateValueGenerationTop.map((elem, i) => (
              <div className="blockPay">
                <label key={elem.id}>
                  <span>
                    <input
                      type="text"
                      value={elem.title}
                      style={{ width: '60%' }}
                      onChange={(e) =>
                        elem.pay !== 0 &&
                        generationInputTop(elem, { title: e.target.value })
                      }
                      onBlur={() =>
                        getFlagSendReq({
                          statusView: false,
                          controlBlockTop: true,
                        })
                      }
                      disabled={conrolClose() || elem.status || elem.pay === 0}
                    />
                  </span>
                  <input
                    type="text"
                    value={elem.value}
                    onChange={(e) =>
                      generationInputTop(elem, {
                        value: controlNumber(e.target.value),
                      })
                    }
                    onBlur={() =>
                      getFlagSendReq({
                        statusView: false,
                        controlBlockTop: true,
                      })
                    }
                    disabled={conrolClose() || elem.status || elem.pay === 0}
                  />
                  <select
                    value={elem.pay}
                    onChange={(e) =>
                      generationInputTop(elem, { pay: e.target.value })
                    }
                    disabled={conrolClose() || elem.status}
                  >
                    {variantPayFinance.map((elem, i) => {
                      return (
                        <option
                          key={elem.id}
                          value={elem.id}
                          disabled={
                            elem.id === 0 || (elem.id === 3 && statusMoney)
                          }
                        >
                          {elem.title}
                        </option>
                      )
                    })}
                  </select>
                </label>
              </div>
            ))}
        </div>

        <button
          type="button"
          style={{
            display: conrolClose() ? 'none' : 'block',
          }}
          className="addNewInput"
          onClick={() => generatorArrayTop()}
        >
          +
        </button>
      </div>
    )
  }

  const controlParamsSend = () => {
    if (roleParams == role[3]) {
      //finance
      return {
        statusView: false,
        statusClosePayFinance: true,
        controlBlockTop: true,
      }
    } else {
      return {
        statusView: false,
        statusClosePay: true,
        controlBlockTop: true,
      }
    }
  }
  const conrolClose = () => {
    let flag = false
    if (roleParams == role[3]) {
      if (statusClosePayFinance) {
        flag = true
      }
    } else {
      if (roleParams == role[0] || roleParams == role[1]) {
        flag = true
      } else {
        if (statusFinanceTop) {
          flag = true
        }
      }
    }

    return flag
  }

  const closeAndFileEmpty = () => {
    const filterParamsFiled = dateValueGenerationTop.filter(
      (item) => item.value
    )
    setDateValueGenerationTop(filterParamsFiled)
    setIsModalClose(true)
  }

  const closeInvoice = () => {
    setStatusFinanceTop(true)
    getFlagSendReq(controlParamsSend())
    setIsModalClose(false)
  }
  const saveInvoice = () => {
    getFlagSendReq({
      statusView: false,
      clickSave: true,
      controlBlockTop: true,
    })
    getToastSucces('Информация сохранена')
  }

  const styleVisible = {
    display: roleParams == role[0] || roleParams == role[1] ? 'none' : 'flex',
  }
  const styleVisibleInput = {
    visibility: 'hidden',
  }

  return (
    <React.Fragment>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalClose}
          onClose={() => setIsModalClose(false)}
        >
          <Modal.Header>
            <Modal.Body>Вы действительно хотите закрыть?</Modal.Body>
          </Modal.Header>

          <Modal.Footer>
            <button
              className="btn-success "
              onClick={closeInvoice}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => setIsModalClose(false)}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="dropBlockContent dropBlockContent--financeTop">
        <div className="topContenet">
          <p>
            Cредства в кошельке (Дилер)
            <span>
              {autoInfo && autoInfo.cashAccountAuction
                ? ` ${autoInfo.cashAccountAuction[0].plus_cash} $`
                : `0 $`}
            </span>
          </p>
          <div className="payTitleTop">
            <p>Лот</p>
          </div>
          {topBlockPay()}
          <label>
            <span> Итого </span>
            <input
              type="text"
              placeholder="Итого"
              value={currentResTop}
              disabled
            />
            <input style={styleVisibleInput} />
          </label>
        </div>

        <div className="blockInputClose">
          <div className="financeItemGroup">
            {!conrolClose() ? (
              <React.Fragment>
                <input
                  onClick={saveInvoice}
                  type="button"
                  className="btn btn--closeInvoice"
                  value="Сохранить"
                />
                <input
                  type="button"
                  className="btn btn--closeInvoice"
                  value="Закрыть"
                  onClick={closeAndFileEmpty}
                />
              </React.Fragment>
            ) : (
              <input
                type="submit"
                style={styleVisible}
                className="btn"
                value="Закрыто"
                disabled
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

AuctionTransportFinanceTop.propTypes = {
  titleBlock: PropTypes.string,
  dataResult: PropTypes.func,
  getCurrentAucFunc: PropTypes.func,
  propsId: PropTypes.string,
  statusFunc: PropTypes.func,
  financeDateArray: PropTypes.array,

  viewBlock: PropTypes.func,
  shortInfoArray: PropTypes.object,
}

export default AuctionTransportFinanceTop
