import React, { useState, useContext, useEffect, memo } from 'react'
import { useParams } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Modal } from 'rsuite'

import { putRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import ThumbUp from '../assets/thumbUp.svg'
import ThumbDown from '../assets/thumbDown.svg'
import { Toggle } from 'rsuite'
import { Check, Close } from '@rsuite/icons'
import { getDateFunc } from '../helper.js'
import PropTypes from 'prop-types'

import { variantPayArray } from '../const.js'

const AuctionTransportPayTable = ({
  dataArray,
  getPaymentArray,
  viewBlockProp,
}) => {
  const { id } = useParams()

  const [dataPayArray, setDataPayArray] = useState([])

  const [isModalShowAdd, setIsModalShowAdd] = useState(false)

  const [isModalShowBack, setIsModalShowBack] = useState(false)
  const [dataCurrentClick, setDataCurrentClick] = useState([])

  const [dateParams, setDateParams] = useState('')
  const [dataConfirmPrice, setDataConfirmPrice] = useState('')
  const [commentValue, setCommentValue] = useState('')
  const [currentValueToggleFist, setCurrentValueToggleFist] = useState(false)

  const { state, dispatch } = useContext(ContextApp)

  useEffect(() => {
    if (dataArray.length > 0) return setDataPayArray(dataArray)
  }, [dataArray])

  useEffect(() => {
    setDateParams(getDateFunc())
  }, [isModalShowAdd, isModalShowBack])

  let paramsPay = {
    confirm_price_date: dateParams,
    comment: commentValue,
    general_information_id: +id,
  }

  const priceUpdate = (e) => {
    e.preventDefault()

    // isModalShowBack
    let controlParams = {
      ...paramsPay,
      ...{
        status: dataCurrentClick.status,
        confirm_price: +dataConfirmPrice,
      },
    }

    const validateParams = +dataCurrentClick.price_send >= +dataConfirmPrice

    const paymentSend = () => {
      if (validateParams) {
        dispatch(showLoder({ priceUpdate: 1 }))
        putRequest(
          `/api/v1/order/payment/${dataCurrentClick.idObj}`,
          controlParams
        )
          .then((res) => {
            state.createNotification('Успешно выполнено!', 'success')
            getPaymentArray()
            clearFunc()
            dispatch(showLoder({ priceUpdate: 0 }))
          })
          .catch(() => {
            state.createNotification('Что-то пошло не так!', 'error')
            clearFunc()
            dispatch(showLoder({ priceUpdate: 0 }))
          })
      } else {
        state.createNotification(
          `Сумма зачисления не может превышать сумму отправки!`,
          'error'
        )
      }
    }

    if (isModalShowAdd) {
      if (currentValueToggleFist) {
        paymentSend()
      } else {
        state.createNotification(`Подтвердите сумму зачисления!`, 'error')
      }
    } else {
      paymentSend()
    }
  }

  const clearFunc = () => {
    setDateParams('')
    setCommentValue('')
    setDataCurrentClick('')
    setIsModalShowAdd(false)
    setIsModalShowBack(false)
    setDataConfirmPrice('')
  }

  // const getDateFunc = () => {
  //   let date = new Date()
  //   let year = String(date.toLocaleDateString()).split('.')[2]
  //   let mouthRes = String(date.toLocaleDateString()).split('.')[1]
  //   let dayRes = String(date.toLocaleDateString()).split('.')[0]
  //   return setDateParams(year + '-' + mouthRes + '-' + dayRes)
  // }

  // const changeStateFunc = (id, data) => {
  //   let filterData = dataArray.filter((el) => el.id == id)[0]
  //   let indexArray = dataArray.indexOf(filterData)
  //   let changePrise = { ...filterData, confirm_price: data }

  //   let copy = Object.assign([], dataArray)
  //   copy[indexArray] = changePrise

  //   return setDataPayArray(copy)
  // }

  const getDestinationsFunc = (val) =>
    val.split(' ')[0].split('-').reverse().join('-')

  const getVariantPay = (val) => {
    const findValue = variantPayArray.find((el) => +el.id === +val)
    return findValue ? findValue.title : ''
  }

  const controlCommets = ({ comment, link }) =>
    `${comment ?? false ? String(comment + (link ? ', ' : '')) : ''}${
      link ?? false ? link : ''
    }`

  return (
    <div className="blockInfoPrice">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShowAdd}
          onClose={() => {
            clearFunc()
          }}
        >
          <Modal.Header>
            <Modal.Title>Вы действительно хотите зачислить?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={priceUpdate}>
              <label>
                <span>
                  Дата зачисление <br />
                  (пример даты: 01.01.1970)
                </span>
                <input
                  className=""
                  type="date"
                  value={dateParams}
                  onChange={(e) => setDateParams(e.target.value)}
                  placeholder="пример даты: 01.01.1970"
                  required
                />
              </label>

              {viewBlockProp(55) ? (
                <React.Fragment>
                  <label>
                    <span>Сумма зачислена</span>
                    <input
                      // className='customInputChange'
                      value={dataConfirmPrice}
                      onChange={(e) => setDataConfirmPrice(e.target.value)}
                      // style={{
                      //     width: '100%',
                      //     height: '100%',
                      //     margin: '0',
                      //     border: '0',
                      //     boxShadow: '4px 4px 4px #f7fafc, 4px 4px 4px rgb(54 54 212 / 6%)',
                      // }}
                    />
                  </label>
                  <Toggle
                    style={{ width: '120px', marginLeft: '20px' }}
                    checkedChildren={<Check />}
                    unCheckedChildren={<Close />}
                    onChange={(value) => {
                      setCurrentValueToggleFist(value)
                    }}
                  />
                </React.Fragment>
              ) : (
                ''
              )}
              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShowBack}
          onClose={() => {
            clearFunc()
          }}
        >
          <Modal.Header>
            <Modal.Title>Вы действительно хотите вернуть?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={priceUpdate}>
              <label>
                <span>
                  Дата возврата <br />
                  (пример даты: 01.01.1970)
                </span>
                <input
                  className=""
                  type="date"
                  value={dateParams}
                  onChange={(e) => setDateParams(e.target.value)}
                  placeholder="пример даты: 01.01.1970"
                  required
                />
              </label>
              <label>
                <span>Комментарий</span>
                <textarea
                  style={{
                    width: ' 60%',
                    fontSize: '12px',
                    padding: '5px',
                    border: '1px solid #dfdfe3',
                    borderRadius: '0.375rem',
                  }}
                  className=""
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  placeholder="пример: передумал..."
                />
              </label>

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      {dataPayArray.length > 0 && (
        <div className="Table" style={{ top: 0, marginTop: '10px' }}>
          <Table
            autoHeight
            cellBordered={true}
            hover={true}
            bordered={true}
            data={dataPayArray}
          >
            <Column align="center" fixed flexGrow={0.5}>
              <HeaderCell>Дата</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return (
                    <span>{getDestinationsFunc(rowData.buyed_price_date)}</span>
                  )
                }}
              </Cell>
            </Column>
            <Column align="center" fixed flexGrow={0.5}>
              <HeaderCell>Сумма отправлена</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return <span>{rowData.buyed_price}</span>
                }}
              </Cell>
            </Column>
            <Column align="center" fixed flexGrow={0.5}>
              <HeaderCell>Сумма зачислена</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return (
                    <span>
                      {rowData.confirm_price ? rowData.confirm_price : 0}
                    </span>
                  )
                }}
              </Cell>
            </Column>
            <Column align="center" fixed flexGrow={0.5}>
              <HeaderCell>Способ оплаты</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return <span>{getVariantPay(rowData.payment_type)}</span>
                }}
              </Cell>
            </Column>
            <Column align="center" fixed flexGrow={0.5}>
              <HeaderCell>Кошелек</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return <span>{rowData.cash_account.name}</span>
                }}
              </Cell>
            </Column>
            <Column align="center" fixed flexGrow={1}>
              <HeaderCell>Статус</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return <span>{rowData.statusText}</span>
                }}
              </Cell>
            </Column>
            <Column align="center" fixed flexGrow={1}>
              <HeaderCell>Комментарий</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  return <span>{controlCommets(rowData)}</span>
                }}
              </Cell>
            </Column>
            {JSON.parse(window.sessionStorage.getItem('role')).code ===
              'finance' &&
              viewBlockProp(55) && (
                <Column align="center" flexGrow={0.5}>
                  <HeaderCell>Действие</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          {rowData.status == 0 && (
                            <div className="Dropdown">
                              <div className="DropdownShow">
                                <button
                                  onClick={() => {
                                    setIsModalShowAdd(true)
                                    setDataCurrentClick({
                                      idObj: +rowData.id,
                                      price: +rowData.confirm_price,
                                      price_send: +rowData.buyed_price,
                                      status: true,
                                    })
                                  }}
                                >
                                  <img
                                    src={ThumbUp}
                                    alt="ThumbUp"
                                    width="15px"
                                    height="15px"
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setIsModalShowBack(true)
                                    setDataCurrentClick({
                                      idObj: +rowData.id,
                                      price: +rowData.confirm_price,

                                      status: false,
                                    })
                                  }}
                                >
                                  <img
                                    src={ThumbDown}
                                    alt="ThumbUp"
                                    width="15px"
                                    height="15px"
                                  />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
              )}
          </Table>
        </div>
      )}
    </div>
  )
}

AuctionTransportPayTable.propTypes = {
  getPaymentArray: PropTypes.func,
  dataArray: PropTypes.array,
  viewBlockProp: PropTypes.func,
}

export default memo(AuctionTransportPayTable)
