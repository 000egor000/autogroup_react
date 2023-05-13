import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
} from './../../base/api-request'

import { Loader, Modal } from 'rsuite'

import 'react-toastify/dist/ReactToastify.css'

import {
  ArrowRightLine,
  ArrowDownLine,
  Plus,
  Check,
  Minus,
  AddOutline,
} from '@rsuite/icons'

import 'rsuite/dist/rsuite.min.css'

import ThumbUp from './../../assets/thumbUp.svg'
import ThumbDown from './../../assets/thumbDown.svg'
import ContextApp from './../../context/contextApp'
import { showLoder } from '../../reducers/actions'

import PreBidNav from '../../components/PreBidNav'
import { controlNumber } from '../../helper.js'
const PreBid = () => {
  const { title } = JSON.parse(window.sessionStorage.getItem('role'))

  const [dataTable, setDataTable] = useState([])

  const refFocusInteger = useRef()
  const [message, setMessage] = useState('')
  const { state, dispatch } = useContext(ContextApp)

  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowWin, setIsModalShowWin] = useState(false)
  const [isModalDetail, setIsModalDetail] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [isModalContr, setIsModalContr] = useState(false)
  const [isModalAdd, setIsModalAdd] = useState(false)
  //paramsModal
  const [nameAuto, setNameAuto] = useState('')
  const [lot, setLot] = useState('')
  const [price, setPrice] = useState('')
  const [priceSize, setPriceSize] = useState('')
  const [currentBid, setCurrentBid] = useState(0)

  const [showBlock, setShowBlock] = useState(false)

  const [dataFistSelect, setDataFistSelect] = useState('')
  const [fistValueSelect, setFistValueSelect] = useState(1)

  const [dropShow, setDropShow] = useState([])

  const [statusLoader, setStatusLoader] = useState(false)

  const [contrPrice, setContrPrice] = useState('')
  //
  //DetailParams
  const [idDetail, setIdDetail] = useState('')
  const [emailDetail, setEmailDetail] = useState('')
  const [cityDetail, setCityDetail] = useState('')
  const [phoneDetail, setPhoneDetail] = useState('')
  const [telegramDetail, setTelegramDetail] = useState('')

  ////helpState
  const [containerOut, setContainerOut] = useState('')
  const [idContrClick, setIdContrClick] = useState('')
  const [urlPicture, setUrlPicture] = useState('')

  const params = {
    lot: lot,
    price: price,
    auction_id: fistValueSelect,
    auto_name: nameAuto,
  }

  // Получение кол сообещений через вебсокеты (нач)
  const channel = window.Echo.channel(
    'all-info-' + JSON.parse(sessionStorage.user).id
  )
  channel.listen('.checkPreBidNotification', function (data) {
    setMessage(data)
  })
  // Получение кол сообещений через вебсокеты (кон)

  useEffect(() => {
    const messageSuccess = 'new' || 'process' || 'approval' || 'win'
    const messageFail = 'fail' || 'lose'
    messageSuccess ?? messageFail
      ? messageSuccess
        ? state.createNotification(message.message, 'success')
        : state.createNotification(message.message, 'error')
      : console.log('invalid request')

    getDataTable()

    return () => {}
  }, [message])

  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataFistSelect(res.auction)
        dispatch(showLoder({ auctions: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ auctions: 0 }))
      })
  }, [])

  useEffect(() => {
    getDataTable()
  }, [])

  const getDataTable = () => {
    dispatch(showLoder({ getDataTable: 1 }))
    getRequest(`/api/v1/pre-bid?status=${6}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataTable(res.preBids)
        dispatch(showLoder({ getDataTable: 0 }))
      })
      .catch(() => {
        setDataTable([])
        dispatch(showLoder({ getDataTable: 0 }))
      })
  }

  const createPreBid = (e) => {
    dispatch(showLoder({ createPreBid: 1 }))
    e.preventDefault()
    postRequest('/api/v1/pre-bid', params)
      .then(() => {
        setIsModalShow(false)
        getDataTable()
        closeReset()
        dispatch(showLoder({ createPreBid: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ createPreBid: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const handleShow = ({ id, max_id, read }) => {
    let filtered = dropShow.filter((e) => id === e)
    if (!read) readPrebid(max_id)

    if (filtered.length > 0) {
      let removeAccessRights = dropShow.filter((e) => e !== id)
      setDropShow(removeAccessRights)
    } else {
      setDropShow([...dropShow, id])
    }
  }

  const isChecked = (id) => {
    let filtered = dropShow.filter((e) => e === id)

    let bool = filtered.length > 0 ? true : false
    return bool
  }
  const ConfirmLot = (id, status) => {
    dispatch(showLoder({ ConfirmLot: 1 }))
    putRequest(`/api/v1/pre-bid/${id}`, {
      status_bool: status ? status : true,
    })
      .then(() => {
        getDataTable()
        dispatch(showLoder({ ConfirmLot: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ ConfirmLot: 0 }))
      })
  }
  const controlPrebid = ({
    id,
    statusValue,
    valueInput,
    maxPrice,
    buyed_price,
  }) => {
    let flagStatus = false
    let paramsWinLose = valueInput
      ? { status: statusValue, success_price: valueInput }
      : { status: statusValue, buyed_price: buyed_price }
    if (valueInput || buyed_price)
      (valueInput ? valueInput : buyed_price) <= maxPrice
        ? (flagStatus = true)
        : state.createNotification(
            `Сумма должна быть не больше ${maxPrice}`,
            'error'
          )
    else {
      flagStatus = true
    }
    if (flagStatus) {
      dispatch(showLoder({ bidConfirm: 1 }))
      putRequest(`/api/v1/pre-bid/confirm/${id}`, paramsWinLose)
        .then(() => {
          getDataTable()
          closeReset()
          dispatch(showLoder({ bidConfirm: 0 }))
        })
        .catch(() => {
          dispatch(showLoder({ bidConfirm: 0 }))
          state.createNotification('Что-то пошло не так!', 'error')
        })
    }
  }

  const controlContrPrice = (e, { id, seller_price }) => {
    dispatch(showLoder({ controlContrPrice: 1 }))
    e.preventDefault()

    putRequest(`/api/v1/pre-bid/counterbet/${id}`, {
      seller_price: seller_price,
    })
      .then(() => {
        getDataTable()
        closeReset()
        dispatch(showLoder({ controlContrPrice: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ controlContrPrice: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const editCreate = (val) => {
    setCurrentBid(val.buyed_price)
    setContainerOut(val)
    setIsModalAdd(true)
    setLot(val.lot)
  }
  const closeReset = () => {
    //params
    setLot('')

    setPrice('')
    //modal
    setShowBlock(false)
    setIsModalShow(false)
    setIsModalShowWin(false)
    setIsModalDetail(false)
    setIsModalRemove(false)
    setIsModalContr(false)
    setIsModalAdd(false)

    setContainerOut('')
    setContrPrice('')
    setIdContrClick('')
    setUrlPicture('')
    setPriceSize('')
  }

  const readPrebid = (id) => {
    dispatch(showLoder({ readPrebid: 1 }))
    putRequest(`/api/v1/pre-bid/read/${id}`)
      .then(() => {
        getDataTable()
        dispatch(showLoder({ readPrebid: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ readPrebid: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const rejectPrebid = ({ id, status }) => {
    dispatch(showLoder({ rejectPrebid: 1 }))
    putRequest(`/api/v1/pre-bid/${id}`, { status_bul: status })
      .then(() => {
        getDataTable()
        closeReset()
        dispatch(showLoder({ rejectPrebid: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ rejectPrebid: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }
  const deletePrebid = ({ id }) => {
    dispatch(showLoder({ deletePrebid: 1 }))
    deleteRequest(`/api/v1/pre-bid/${id}`)
      .then(() => {
        getDataTable()
        closeReset()
        dispatch(showLoder({ deletePrebid: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ deletePrebid: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const detailUp = (role, currentEmail) => {
    dispatch(showLoder({ detailUp: 1 }))
    getRequest(`/api/v1/${role}s`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        res[`${role}s`].map((elem) => {
          if (elem.email === currentEmail) {
            setIdDetail(elem.id)
            setEmailDetail(elem.email)
            setCityDetail(elem.city.name_ru)
            setPhoneDetail(elem.phone)
            setTelegramDetail(elem.telegram)
          }
        })
        dispatch(showLoder({ detailUp: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ detailUp: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const parseFunction = () => {
    dispatch(showLoder({ parseFunction: 1 }))
    setStatusLoader(true)
    postRequest('/api/v1/pre-bid/parsing', {
      lot: lot,
      auction_id: fistValueSelect,
    })
      .then((res) => {
        setNameAuto(res.name)
        setUrlPicture(res.picture)
        setStatusLoader(false)
        dispatch(showLoder({ parseFunction: 0 }))
      })
      .catch(() => {
        state.createNotification('Что-то пошло не так!', 'error')
        setStatusLoader(false)
        dispatch(showLoder({ parseFunction: 0 }))
      })
  }

  const createPreBidPrise = (val) => {
    dispatch(showLoder({ createPreBidPrise: 1 }))
    let paramsDeal = {
      price: val.currentPrise,
      id: val.max_id,
    }

    postRequest('/api/v1/pre-bid/deal', paramsDeal)
      .then(() => {
        getDataTable()
        closeReset()
        dispatch(showLoder({ createPreBidPrise: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ createPreBidPrise: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalAdd}
          onClose={() => {
            closeReset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Уточните размер ставки, которая сыграла</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput">
              <label>
                <span>Лот</span>
                <input
                  className=""
                  type="text"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                  placeholder="Лот"
                  disabled
                />
              </label>
              <label>
                <span>Текущая ставка</span>
                <input
                  className=""
                  type="text"
                  value={currentBid}
                  onChange={(e) => setCurrentBid(e.target.value)}
                  placeholder="Текущая ставка"
                />
              </label>

              <label className="customParse">
                <span>Предложение продавцa</span>

                <div className="groupInfoParse">
                  <input
                    type="text"
                    value={containerOut.seller_price}
                    placeholder="Предложение продавцa"
                    disabled
                  />
                  <div
                    className="helpParse"
                    onClick={(e) => setCurrentBid(containerOut.seller_price)}
                  >
                    Принять
                  </div>

                  <div
                    style={{
                      visibility: statusLoader ? 'visible' : 'hidden',
                      width: '10%',
                    }}
                  >
                    <Loader size="sm" style={{ marginLeft: '5px' }} />
                  </div>
                </div>
              </label>

              <input
                type="submit"
                className="btn-success-preBid"
                disabled={state.loader}
                style={{
                  backgroundColor: 'red',
                  borderRadius: '10px',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  marginTop: '15px',
                  outline: 'none',
                }}
                value="Подтвердить"
                onClick={() =>
                  createPreBidPrise({
                    ...containerOut,
                    currentPrise: +currentBid,
                  })
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShow}
          onClose={() => {
            setShowBlock(false)
            closeReset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Добавление Pre-bid</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput">
              <form onSubmit={createPreBid}>
                {/* <h2>Добавление Pre-bid</h2> */}
                {/* style={{ display: showBlock ? 'none' : 'block' }} */}
                <div>
                  {urlPicture && (
                    <div style={{ textAlign: 'center' }}>
                      <img
                        width="20%"
                        height="20%"
                        src={urlPicture}
                        alt="Photo"
                      />
                    </div>
                  )}

                  <label>
                    <span>Аукцион</span>
                    <select
                      className=""
                      onChange={(e) => setFistValueSelect(e.target.value)}
                      value={fistValueSelect}
                    >
                      {dataFistSelect.length > 0 &&
                        dataFistSelect.map((e, i) => (
                          <option key={e.id + i} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="customParse">
                    <span>Лот</span>

                    <div className="groupInfoParse">
                      <input
                        className=""
                        type="text"
                        value={lot}
                        onChange={(e) => setLot(e.target.value)}
                        placeholder="Лот"
                        required
                        disabled={showBlock}
                      />
                      <div
                        className="helpParse"
                        onClick={() => parseFunction()}
                      >
                        Поиск
                      </div>

                      <div
                        style={{
                          visibility: statusLoader ? 'visible' : 'hidden',
                          width: '10%',
                        }}
                      >
                        <Loader size="sm" style={{ marginLeft: '5px' }} />
                      </div>
                    </div>
                  </label>

                  <label>
                    <span>Название автомобиля</span>
                    <input
                      className=""
                      type="text"
                      value={nameAuto}
                      onChange={(e) => setNameAuto(e.target.value)}
                      placeholder="Название автомобиля"
                      // required
                    />
                  </label>
                </div>

                <label>
                  <span>Сумма</span>
                  <input
                    className=""
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(controlNumber(e.target.value))}
                    placeholder="Сумма"
                    required
                    ref={refFocusInteger}
                  />
                </label>

                <button
                  type="submit"
                  className="btn-success-preBid"
                  disabled={state.loader}
                >
                  Подтвердить
                </button>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShowWin}
          onClose={() => {
            closeReset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Уточните размер ставки, которая сыграла</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput">
              <label>
                <span>Лот</span>
                <input
                  className=""
                  type="text"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                  placeholder="Лот"
                  disabled
                />
              </label>

              <label>
                <span>Размер ставки</span>
                <input
                  className=""
                  type="text"
                  value={priceSize}
                  onChange={(e) => setPriceSize(controlNumber(e.target.value))}
                  placeholder="Размер ставки"
                  required
                />
              </label>

              <input
                type="submit"
                className="btn-success-preBid"
                disabled={state.loader}
                value="Подтвердить"
                onClick={() =>
                  controlPrebid({ ...containerOut, valueInput: +priceSize })
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalContr}
          onClose={() => {
            closeReset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Добавление контрцены</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput">
              <form>
                <label>
                  <span>Сумма</span>
                  <input
                    className=""
                    type="text"
                    value={contrPrice}
                    onChange={(e) => setContrPrice(e.target.value)}
                    placeholder="сумма"
                    required
                  />
                </label>
                <input
                  type="submit"
                  className="btn-success-preBid"
                  value="Подтвердить"
                  disabled={state.loader}
                  onClick={(event) => {
                    controlContrPrice(event, {
                      id: idContrClick,
                      seller_price: contrPrice,
                    })
                  }}
                />
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>

      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalDetail}
          onClose={() => {
            setIsModalDetail(false)
          }}
        >
          <Modal.Header>
            <Modal.Title>Детализация участника</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput">
              <label>
                <span>id</span>
                <input type="text" value={idDetail} placeholder="id" disabled />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="text"
                  value={emailDetail}
                  placeholder="Email"
                  disabled
                />
              </label>
              <label>
                <span>Город</span>
                <input
                  type="text"
                  value={cityDetail}
                  placeholder="Город"
                  disabled
                />
              </label>
              <label>
                <span>Номер телефона</span>
                <input
                  type="text"
                  value={phoneDetail}
                  placeholder="Номер телефона"
                  disabled
                />
              </label>
              <label>
                <span>Телеграмм</span>
                <input
                  type="text"
                  value={telegramDetail}
                  placeholder="Телеграмм"
                  disabled
                />
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => closeReset()}
        >
          <Modal.Header>
            <Modal.Title>Удаление/отмена </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Вы действительно хотите выполнить это действие?
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              disabled={state.loader}
              onClick={() => {
                switch (containerOut.currentClick) {
                  case 'ThumbDown':
                    controlPrebid(containerOut)
                    break
                  case 'Minus':
                    rejectPrebid(containerOut)
                    break
                  case 'TrashIcon':
                    deletePrebid(containerOut)
                    break
                  default:
                    console.log('incorrect value')
                    break
                }
              }}
              appearance="primary"
            >
              Да
            </button>
            <button
              disabled={state.loader}
              className="btn-danger"
              onClick={() => setIsModalRemove(false)}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{
            paddingLeft: state.width,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <PreBidNav id="На утверждении" />
          <div className="btnTransport">
            <input
              type="button"
              onClick={() => setIsModalShow(!isModalShow)}
              value="Добавить pre-bid"
            />
          </div>
        </div>

        <div
          className="bottom-itemFooter"
          style={{
            paddingLeft: state.width,
          }}
        >
          {dataTable.length > 0 ? (
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    <th>Дата и время</th>
                    <th>Аукцион</th>
                    <th>Лот</th>

                    <th>Название автомобиля</th>

                    <th>Финальная ставка </th>

                    <th>Предложение продавца</th>
                    <th>Статус</th>

                    <th>Действие</th>
                  </tr>
                </thead>

                {dataTable.map((e, i) => {
                  return (
                    <tbody key={e + i}>
                      <tr>
                        <td onClick={() => handleShow(e)}>
                          {isChecked(e.id) ? (
                            <ArrowRightLine />
                          ) : (
                            <ArrowDownLine />
                          )}

                          {e.updated_date}
                        </td>

                        <td onClick={() => handleShow(e)}>{e.auction_name}</td>
                        <td onClick={() => handleShow(e)}>{e.lot}</td>

                        <td onClick={() => handleShow(e)}>
                          {e.auto_name ? e.auto_name : '-'}
                        </td>

                        <td onClick={() => handleShow(e)}>
                          {e.buyed_price > 0 ? e.buyed_price + ' $' : '-'}
                        </td>

                        <td onClick={() => handleShow(e)}>
                          {e.seller_price > 0 ? e.seller_price + ' $' : '-'}
                        </td>

                        <td className="positonTd" onClick={() => handleShow(e)}>
                          <span
                            style={{
                              color:
                                e.status.id === 4 || e.status.id === 2
                                  ? 'green'
                                  : e.status.id === 5 || e.status.id === 3
                                  ? 'red'
                                  : null,
                              fontWeight:
                                e.status.id === 4 || e.status.id === 2
                                  ? '600'
                                  : e.status.id === 5 || e.status.id === 3
                                  ? '600'
                                  : null,
                            }}
                          >
                            {e.status.id !== 5 && e.successPrice
                              ? e.status.title + ' ' + e.successPrice + ' $'
                              : e.status.title}
                          </span>
                        </td>

                        <td>
                          {title === 'Администратор' && e.status.id === 1 && (
                            <button
                              className="addBid"
                              type="button"
                              onClick={() => ConfirmLot(e.max_id)}
                            >
                              <Check style={{ color: 'green' }} />
                            </button>
                          )}

                          {title !== 'Администратор' && e.seller_price > 0 && (
                            <button
                              className="addBid"
                              type="button"
                              onClick={() => editCreate(e)}
                            >
                              <Plus style={{ color: 'green' }} />
                            </button>
                          )}
                        </td>
                      </tr>
                      {isChecked(e.id) && (
                        <tr style={{ textAlighn: 'center' }}>
                          <td colSpan="20">
                            <div
                              className="dropD"
                              style={{
                                display: isChecked(e.id) ? 'block' : 'none',
                              }}
                            >
                              <React.Fragment>
                                <table key={i + e.lot + e.max_price}>
                                  <thead key={e.lot + i + e.max_price}>
                                    <tr>
                                      <th>Дата и время</th>

                                      <th>Макс. ставка</th>
                                      <th>
                                        Текущая ставка по результату торгов
                                      </th>

                                      {title === 'Администратор' && (
                                        <th>Кто создал</th>
                                      )}
                                      <th>Контр цена</th>

                                      <th>Комментарий</th>

                                      <th>Действие</th>
                                    </tr>
                                  </thead>

                                  {e.children.map((elemChild, i) => (
                                    <tbody key={elemChild + i}>
                                      <tr>
                                        <td>{elemChild.created_date}</td>

                                        <td>
                                          {elemChild.price > 0
                                            ? elemChild.price + ' $'
                                            : '-'}
                                        </td>
                                        <td>
                                          {elemChild.buyed_price
                                            ? elemChild.buyed_price + ' $'
                                            : '-'}
                                        </td>

                                        {title === 'Администратор' && (
                                          <td
                                            style={{
                                              cursor:
                                                elemChild.created_user_role !==
                                                'admin'
                                                  ? 'pointer'
                                                  : 'default',
                                            }}
                                            onClick={() => {
                                              elemChild.created_user_role !==
                                                'admin' &&
                                                setIsModalDetail(true)

                                              elemChild.created_user_role !==
                                                'admin' &&
                                                detailUp(
                                                  elemChild.created_user_role,
                                                  elemChild.created_user
                                                )
                                            }}
                                          >
                                            {elemChild.created_user}
                                          </td>
                                        )}
                                        <td>
                                          {elemChild.seller_price
                                            ? elemChild.seller_price + ' $'
                                            : '-'}
                                        </td>
                                        <td>
                                          {elemChild.comment
                                            ? elemChild.comment
                                            : '-'}
                                        </td>

                                        {e.status.id !== 1 &&
                                          e.status.id !== 3 && (
                                            <td
                                              style={{
                                                visibility:
                                                  e.status.id === 5 ||
                                                  e.status.id === 4
                                                    ? 'hidden'
                                                    : 'visible',
                                              }}
                                            >
                                              {title === 'Администратор' ? (
                                                <React.Fragment>
                                                  <button
                                                    type="button"
                                                    className="btnCustomPrise"
                                                    onClick={(event) => {
                                                      return (
                                                        <React.Fragment>
                                                          {
                                                            (setIsModalShowWin(
                                                              true
                                                            ),
                                                            setLot(e.lot),
                                                            setPriceSize(
                                                              elemChild.buyed_price
                                                            ),
                                                            setContainerOut({
                                                              id: e.max_id,
                                                              statusValue: 4,
                                                              valueInput:
                                                                priceSize,
                                                              maxPrice:
                                                                e.max_price,
                                                            }))
                                                          }
                                                        </React.Fragment>
                                                      )
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
                                                    type="submit"
                                                    className="btnCustomPrise"
                                                    onClick={(event) => {
                                                      return (
                                                        <React.Fragment>
                                                          {
                                                            (setIsModalRemove(
                                                              true
                                                            ),
                                                            setContainerOut({
                                                              id: e.max_id,
                                                              statusValue: 5,
                                                              valueInput:
                                                                priceSize,
                                                              currentClick:
                                                                'ThumbDown',
                                                            }))
                                                          }
                                                        </React.Fragment>
                                                      )
                                                    }}
                                                  >
                                                    <img
                                                      src={ThumbDown}
                                                      alt="ThumbDown"
                                                      width="15px"
                                                      height="15px"
                                                    />
                                                  </button>

                                                  {title === 'Администратор' &&
                                                    e.status.id === 6 &&
                                                    elemChild.seller_price ===
                                                      0 && (
                                                      <button
                                                        type="button"
                                                        className="btnCustomPrise"
                                                        onClick={() => {
                                                          setIdContrClick(
                                                            elemChild.id
                                                          )
                                                          setIsModalContr(true)
                                                        }}
                                                      >
                                                        <AddOutline
                                                          style={{
                                                            color: 'green',
                                                          }}
                                                        />
                                                      </button>
                                                    )}
                                                </React.Fragment>
                                              ) : (
                                                '-'
                                              )}
                                            </td>
                                          )}
                                        {title === 'Администратор' &&
                                          e.status.id === 1 && (
                                            <td>
                                              <button
                                                type="submit"
                                                className="btnCustomPrise"
                                                onClick={(event) => {
                                                  return (
                                                    <React.Fragment>
                                                      {
                                                        (setIsModalRemove(true),
                                                        setContainerOut({
                                                          id: elemChild.id,
                                                          status: false,
                                                          currentClick: 'Minus',
                                                        }))
                                                      }
                                                    </React.Fragment>
                                                  )
                                                }}
                                              >
                                                <Minus
                                                  style={{ color: 'red' }}
                                                />
                                              </button>
                                            </td>
                                          )}
                                      </tr>
                                    </tbody>
                                  ))}
                                </table>
                              </React.Fragment>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )
                })}
              </table>
            </div>
          ) : (
            'Данных нет...'
          )}
        </div>
      </div>
    </div>
  )
}
export default PreBid
