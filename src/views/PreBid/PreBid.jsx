import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
} from '../../base/api-request'

import { Loader, Modal } from 'rsuite'

import 'react-toastify/dist/ReactToastify.css'

import {
  ArrowRightLine,
  ArrowDownLine,
  Plus,
  Check,
  Minus,
  Trash,
  RemindRound,
  AddOutline,
} from '@rsuite/icons'

import PreBidNav from '../../components/PreBidNav'

import 'rsuite/dist/rsuite.min.css'

import ThumbUp from '../../assets/thumbUp.svg'
import ThumbDown from './../../assets/thumbDown.svg'
import ContextApp from './../../context/contextApp'
import { showLoder } from '../../reducers/actions'
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
  const [isModalPrisePredid, setIsModalPrisePredid] = useState(false)
  //paramsModal
  const [lot, setLot] = useState('')
  const [price, setPrice] = useState('')
  const [priceSize, setPriceSize] = useState('')

  const [showBlock, setShowBlock] = useState(false)
  const [statusLoader, setStatusLoader] = useState(false)

  const [dataFistSelect, setDataFistSelect] = useState('')
  const [fistValueSelect, setFistValueSelect] = useState(1)

  const [dropShow, setDropShow] = useState([])

  const [priceSizePrebit, setPriceSizePrebit] = useState('')

  const [contrPrice, setContrPrice] = useState('')
  const [nameAuto, setNameAuto] = useState('')
  const [urlPicture, setUrlPicture] = useState('')

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

  const params = {
    lot: lot,
    price: price,
    auction_id: fistValueSelect,
    picture: urlPicture,
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
      .catch((err) => {
        dispatch(showLoder({ auctions: 0, status: err.status }))
      })
  }, [])

  useEffect(() => {
    getDataTable()
  }, [])

  const getDataTable = () => {
    dispatch(showLoder({ getDataTable: 1 }))
    getRequest('/api/v1/pre-bid', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataTable(res.preBids)
        dispatch(showLoder({ getDataTable: 0 }))
      })
      .catch((err) => {
        setDataTable([])
        dispatch(showLoder({ getDataTable: 0, status: err.status }))
      })
  }

  const createPreBid = (e) => {
    dispatch(showLoder({ createPreBid: 1 }))
    e.preventDefault()
    closeReset()

    postRequest('/api/v1/pre-bid', params)
      .then(() => {
        getDataTable()
        dispatch(showLoder({ createPreBid: 0 }))
      })
      .catch((err) => {
        setIsModalShow(true)
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ createPreBid: 0, status: err.status }))
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
      .catch((err) => {
        dispatch(showLoder({ ConfirmLot: 0, status: err.status }))
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
      dispatch(showLoder({ confirm: 1 }))
      putRequest(`/api/v1/pre-bid/confirm/${id}`, paramsWinLose)
        .then(() => {
          getDataTable()
          closeReset()
          dispatch(showLoder({ confirm: 0 }))
        })
        .catch((err) => {
          dispatch(showLoder({ confirm: 0, status: err.status }))
          state.createNotification('Что-то пошло не так!', 'error')
        })
    }
  }

  const controlContrPrice = ({ id, seller_price }) => {
    dispatch(showLoder({ controlContrPrice: 1 }))
    closeReset()
    putRequest(`/api/v1/pre-bid/counterbet/${id}`, {
      seller_price: seller_price,
    })
      .then(() => {
        getDataTable()
        dispatch(showLoder({ controlContrPrice: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ controlContrPrice: 0, status: err.status }))
        setIsModalContr(true)
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const editCreate = (val) => {
    setShowBlock(true)
    setIsModalShow(true)
    setPrice('')
    setLot(val.lot)
    setNameAuto(val.auto_name)

    setFistValueSelect(val.auction_name === 'Copart' ? 1 : 2)
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
    setIsModalPrisePredid(false)
    //
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
        dispatch(showLoder({ readPrebid: 0 }))
        getDataTable()
      })
      .catch((err) => {
        dispatch(showLoder({ readPrebid: 0, status: err.status }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const rejectPrebid = ({ id, status }) => {
    dispatch(showLoder({ rejectPrebid: 1 }))
    closeReset()
    putRequest(`/api/v1/pre-bid/${id}`, { status_bool: status })
      .then(() => {
        dispatch(showLoder({ rejectPrebid: 0 }))
        getDataTable()
      })
      .catch((err) => {
        dispatch(showLoder({ rejectPrebid: 0, status: err.status }))
        setIsModalRemove(true)
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }
  const deletePrebid = ({ id }) => {
    dispatch(showLoder({ deletePrebid: 1 }))
    closeReset()
    deleteRequest(`/api/v1/pre-bid/${id}`)
      .then(() => {
        dispatch(showLoder({ deletePrebid: 0 }))
        getDataTable()
      })
      .catch((err) => {
        dispatch(showLoder({ deletePrebid: 0, status: err.status }))
        setIsModalRemove(true)
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
      .catch((err) => dispatch(showLoder({ detailUp: 0, status: err.status })))
  }

  const parseFunction = () => {
    dispatch(showLoder({ parseFunction: 1 }))
    setStatusLoader(true)

    postRequest('/api/v1/pre-bid/parsing', {
      lot: lot,
      auction_id: fistValueSelect,
    })
      .then((res) => {
        // setYearSelect(res.year)
        setNameAuto(res.name)
        setUrlPicture(res.picture)
        setStatusLoader(false)
        dispatch(showLoder({ parseFunction: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        setStatusLoader(false)
        dispatch(showLoder({ parseFunction: 0, status: err.status }))
      })
  }

  return (
    <div className="itemContainer">
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

                <div style={{ display: showBlock ? 'none' : 'block' }}>
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
                // style={{
                // 	backgroundColor: 'red',
                // 	borderRadius: '10px',
                // 	color: '#fff',
                // 	cursor: 'pointer',
                // 	padding: '5px 10px',
                // 	marginTop: '15px',
                // 	outline: 'none',
                // }}
                value="Подтвердить"
                disabled={state.loader}
                onClick={() =>
                  controlPrebid({ ...containerOut, valueInput: priceSize })
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
              <label>
                <span>Сумма</span>
                <input
                  className=""
                  type="text"
                  value={contrPrice}
                  onChange={(e) => setContrPrice(controlNumber(e.target.value))}
                  placeholder="сумма"
                  required
                />
              </label>
              <input
                type="submit"
                className="btn-success-preBid"
                // style={{
                // 	backgroundColor: 'red',
                // 	borderRadius: '10px',
                // 	color: '#fff',
                // 	cursor: 'pointer',
                // 	padding: '5px 10px',
                // 	marginTop: '15px',
                // 	outline: 'none',
                // }}
                value="Подтвердить"
                disabled={state.loader}
                onClick={() => {
                  controlContrPrice({
                    id: idContrClick,
                    seller_price: contrPrice,
                  })
                }}
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
                  case 'Trash':
                    deletePrebid(containerOut)
                    break
                  default:
                    // console.log('incorrect value')
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

      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalPrisePredid}
          onClose={() => {
            closeReset()
          }}
        >
          <Modal.Header>
            <Modal.Title>Уточните сумму, которая сыграла</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="groupInput">
              <label>
                <span>Cумма</span>
                <input
                  className=""
                  type="text"
                  value={priceSizePrebit}
                  onChange={(e) =>
                    setPriceSizePrebit(controlNumber(e.target.value))
                  }
                  placeholder="сумма"
                  required
                />
              </label>

              <input
                type="submit"
                disabled={state.loader}
                className="btn-success-preBid"
                value="Подтвердить"
                onClick={() =>
                  controlPrebid({
                    ...containerOut,
                    buyed_price: priceSizePrebit,
                  })
                }
                //сумма
              />
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
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
          <PreBidNav id="Текущая" />
          <div className="btnTransport">
            {/* <h1 className='titleInfo'>Pre-bid</h1> */}
            <input
              type="button"
              onClick={() => {
                setIsModalShow(!isModalShow)
                setNameAuto('')
              }}
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
              <table style={{ borderRadius: '10px' }}>
                <thead>
                  <tr>
                    <th>Дата и время</th>
                    <th>Аукцион</th>
                    <th>Лот</th>
                    <th>Название автомобиля</th>

                    {title === 'Администратор' && (
                      <th>Cтавка 1 (предмаксимальная ставка)</th>
                    )}

                    {title === 'Администратор' ? (
                      <th>Cтавка 2 (максимальная ставка)</th>
                    ) : (
                      <th>Cтавка </th>
                    )}
                    <th>Статус</th>

                    <th>Действие</th>
                    <th></th>
                  </tr>
                </thead>

                {dataTable.map((e, i) => {
                  // console.log(e)
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

                        <td onClick={() => handleShow(e)}>{e.auto_name}</td>

                        {title === 'Администратор' && (
                          <td onClick={() => handleShow(e)}>
                            {e.prev_max_price && e.active_user > 1
                              ? e.prev_max_price + ' $'
                              : '-'}
                          </td>
                        )}

                        <td
                          style={{
                            border: e.read !== true && '2px solid red',
                          }}
                          onClick={() => handleShow(e)}
                        >
                          {e.max_price > 0 ? e.max_price + ' $' : '-'}
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
                          {title === 'Администратор' && e.status.id === 1 ? (
                            <button
                              className="addBid"
                              type="button"
                              onClick={() => ConfirmLot(e.max_id)}
                            >
                              <Check style={{ color: 'green' }} />
                            </button>
                          ) : (
                            ''
                          )}

                          {title !== 'Администратор' &&
                            e.status.id !== 4 &&
                            e.status.id !== 5 && (
                              <button
                                className="addBid addBid-mod"
                                type="button"
                                onClick={() => editCreate(e)}
                              >
                                <Plus style={{ color: 'green' }} />
                              </button>
                            )}
                        </td>

                        <td>
                          <div
                            className="indicatorView"
                            style={{
                              background: e.read === true ? '#dddddd' : 'red',
                            }}
                          ></div>
                        </td>
                      </tr>
                      {isChecked(e.id) && (
                        <tr className="positonTr">
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

                                      <th>Сумма</th>
                                      {title === 'Администратор' && (
                                        <th>Кто создал</th>
                                      )}

                                      <th>Комментарий</th>

                                      <th>Действие</th>
                                    </tr>
                                  </thead>

                                  {e.children.map((elemChild, i) => (
                                    <tbody key={elemChild + i}>
                                      <tr>
                                        <td>{elemChild.created_date}</td>

                                        <td
                                          style={{
                                            border:
                                              e.read !== true &&
                                              '2px solid red',
                                          }}
                                        >
                                          {elemChild.price > 0
                                            ? elemChild.price + ' $'
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
                                          {elemChild.comment
                                            ? elemChild.comment
                                            : '-'}
                                        </td>

                                        {title === 'Администратор' &&
                                          e.status.id !== 1 &&
                                          e.status.id !== 3 && (
                                            <td
                                              style={{
                                                display:
                                                  e.status.id === 5 ||
                                                  e.status.id === 4
                                                    ? 'none'
                                                    : 'flex',
                                              }}
                                            >
                                              {e.max_price ===
                                              elemChild.price ? (
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

                                                  {e.status.id !== 6 ? (
                                                    <button
                                                      className="btnCustomPrise"
                                                      type="button"
                                                      onClick={(event) => {
                                                        return (
                                                          setIsModalPrisePredid(
                                                            true
                                                          ),
                                                          setPriceSizePrebit(
                                                            ''
                                                          ),
                                                          setContainerOut({
                                                            id: e.max_id,
                                                            statusValue: 6,
                                                            maxPrice:
                                                              e.max_price,
                                                          })
                                                        )
                                                      }}
                                                    >
                                                      <RemindRound
                                                        style={{
                                                          color: 'yellow',
                                                        }}
                                                      />
                                                    </button>
                                                  ) : (
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
                                        {title !== 'Администратор' && (
                                          <td
                                            style={{
                                              display:
                                                e.status.id === 5 ||
                                                e.status.id === 4
                                                  ? 'none'
                                                  : 'flex',
                                            }}
                                          >
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
                                                        currentClick: 'Trash',
                                                      }))
                                                    }
                                                  </React.Fragment>
                                                )
                                              }}
                                            >
                                              <Trash style={{ color: 'red' }} />
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
