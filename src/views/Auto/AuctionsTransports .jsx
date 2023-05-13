import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import 'rsuite-table/dist/css/rsuite-table.css'
import 'react-toastify/dist/ReactToastify.css'
import { Edit, Trash, MoveUp, Dragable, Menu } from '@rsuite/icons'
import NoData from '../../components/NoData'
import {
  CheckPicker,
  Modal,
  Tooltip,
  Whisper,
  Pagination,
  Animation,
} from 'rsuite'

import { showLoder } from '../../reducers/actions'
import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../../base/api-request'
import ContextApp from '../../context/contextApp'
import AutoIconStatus from '../../components/AutoIconStatus'

import {
  defaultSetting,
  initialValueIdSetting,
  dataInfoArchive,
} from '../../const'

import {
  valuePosition,
  dataResultPriseContainer,
  getDestinationsFunc,
  statusValue,
  getDateFunc,
  dataResultPriseLot,
} from '../../helper'

const AuctionsTransports = () => {
  //paramsSearch
  const [vin, setVin] = useState('')
  const [secondName, setSecondName] = useState('')
  const [lot, setLot] = useState('')
  const [portsSelectSearch, setPortsSelectSearch] = useState(0)
  const [portsArraySearch, setPortsArraySearch] = useState([])
  const [auctionArraySearch, setAuctionArraySearch] = useState([])
  const [auctionSelect, setAuctionSelect] = useState(0)
  const [regionArraySearch, setRegionArraySearch] = useState([])
  const [regionSelectSearch, setRegionSelectSearch] = useState('')
  const [statusFinance, setStatusFinance] = useState(false)
  let [fistInfo, setFistInfo] = useState(dataInfoArchive)

  const partsLimit = [20, 50, 100]

  const [checkControlData, setCheckControlData] = useState(defaultSetting)
  const [checkControlTable, setCheckControlTable] = useState(
    initialValueIdSetting
  )
  const [email, setEmail] = useState('')
  const [buyer, setBuyer] = useState('')
  const [totalResultsDismantled, setTotalResultsDismantled] = useState(0)
  const { state, dispatch } = useContext(ContextApp)
  const [transportArray, setTransportArray] = useState([])
  const [paginationValue, setPaginationValue] = useState([])
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')
  const [itemIsReload, setItemIsReload] = useState('')

  const [showBlockDrop, setShowBlockDrop] = useState(false)

  const [openReload, setOpenReload] = useState(false)
  const [openRestore, setOpenRestore] = useState(false)
  const [itemIsRestoreAuto, setItemIsRestoreAuto] = useState('')

  const [open, setOpen] = useState(false)
  const [klaipedaArray, setKlaipedaArray] = useState([])
  const [viewControler, setViewControler] = useState([])

  const [dataCurrnetClick, setDataCurrnetClick] = useState({})

  const [statusSearch, setStatusSearch] = useState(false)
  const pathCurrent = window.location.pathname
  const [pathUrl, setPathUrl] = useState('')
  const [statusOrdersArray, setStatusOrdersArray] = useState([])
  const [statusOrdersSelect, setStatusOrdersSelect] = useState('')
  // const [openInArchive, setOpenInArchive] = useState(false)
  // const [itemIsInArchive, setItemIsInArchive] = useState('')

  // const [placement, setPlacement] = useState('right')

  useEffect(() => {
    pathUrl && getArray()
  }, [page, pathUrl, limit])

  useEffect(() => {
    switch (pathCurrent) {
      case '/archiveTransport':
        setPathUrl('/api/v1/order/transport-auto/in-archive')
        chooseItem('Архив')
        break
      case '/removedTransport':
        setPathUrl('/api/v1/order/transport-auto/in-delete')
        chooseItem('Удаленные')
        break

      case '/auctions-transportsNotAll':
        setPathUrl('/api/v1/order/transport-auto?status_order_id=1')
        chooseItem('Неразобранные автомобили')
        break

      case '/auctions-inSale':
        setPathUrl('/api/v1/order/transport-auto?status_order_id=4')
        chooseItem('Неразобранные автомобили')
        break

      default:
        setPathUrl('/api/v1/order/transport-auto')
        chooseItem('Автомобили в продаже')
        break
    }
  }, [pathCurrent])

  useEffect(() => {
    dispatch(showLoder({ ports: 1 }))
    getRequest('/api/v1/ports', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        // setPortsArray(res.ports)
        setPortsArraySearch([{ id: 0, name: 'Порт' }].concat(res.ports))
        setPortsSelectSearch(
          [{ id: 0, name: 'Порт' }].concat(res.ports)[0]['id']
        )
        dispatch(showLoder({ ports: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ ports: 0 }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ destinations: 1 }))
    getRequest('/api/v1/destinations', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        // setDestinationsArraySearch(res.destinations)
        setKlaipedaArray(
          ...res.destinations.filter((elem) => elem.title === 'Клайпеда')
        )
        dispatch(showLoder({ destinations: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ destinations: 0 }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArraySearch(
          [{ id: 0, name: 'Аукцион' }].concat(
            res.auction.filter((el) => +el.id !== 3)
          )
        )
        setAuctionSelect(
          [{ id: 0, name: 'Аукцион' }].concat(
            res.auction.filter((el) => +el.id !== 3)
          )[0]['id']
        )
        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ auctions: 0 }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ cities: 1 }))
    getRequest('/api/v1/cities', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setRegionArraySearch([{ id: 0, name_ru: 'Регион' }].concat(res.cities))
        setRegionSelectSearch(
          [{ id: 0, name_ru: 'Регион' }].concat(res.auction)[0]['id']
        )
        dispatch(showLoder({ cities: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ cities: 0 }))
      })
  }, [])
  useEffect(() => {
    dispatch(showLoder({ dismantled: 1 }))
    getRequest('/api/v1/order/transport-auto/not-dismantled', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setTotalResultsDismantled(res.countAuto)
        dispatch(showLoder({ dismantled: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ dismantled: 0 }))
      })
  }, [])

  useEffect(() => {
    dispatch(showLoder({ getDelete: 1 }))
    getRequest('/api/v1/order/status/status-order/get-delete', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setStatusOrdersArray(res.StatusOrders)
        setStatusOrdersSelect(res.StatusOrders[0].id)
        // setTotalResultsDismantled(res.countAuto)
        dispatch(showLoder({ getDelete: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ getDelete: 0 }))
      })
  }, [])

  useEffect(() => {
    statusSearch && searchFunction({ indicator: true })
  }, [portsSelectSearch, auctionSelect, regionSelectSearch])

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )
  useEffect(() => {
    document.addEventListener('keydown', searchFunction)
    return () => {
      document.removeEventListener('keydown', searchFunction)
    }
  })

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    setShowBlockDrop(false)
    reset()

    getRequest(
      `${pathUrl}${
        pathUrl === '/api/v1/order/transport-auto?status_order_id=1' ||
        pathUrl === '/api/v1/order/transport-auto?status_order_id=4'
          ? '&'
          : '?'
      }page=${page}&limit=${limit}`,
      {
        Authorization: `Bearer ${window.sessionStorage.getItem(
          'access_token'
        )}`,
      }
    )
      .then((res) => {
        setTransportArray(res.general_information)
        setPaginationValue(res.pagination)

        // setTotalResults(res.pagination.total_results)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch(() => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ getArray: 0 }))
        setTransportArray([])
        setPaginationValue([])
      })
  }

  const chooseItem = (id) => {
    let newArr = dataInfoArchive.map((item) =>
      item.id === id ? { ...item, status: true } : { ...item, status: false }
    )
    setFistInfo(newArr)
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  let paramsSerch = {
    search: {
      city_id: regionSelectSearch,
      vin: vin,
      lot: lot,
      auction_id: auctionSelect,
      port_id: portsSelectSearch,
      email: email,
      second_name: secondName,
      buyer: buyer,
      status_order_id: statusValue(pathCurrent),
    },
  }

  const searchRequest = () => {
    dispatch(showLoder({ searchRequest: 1 }))
    postRequest(
      `/api/v1/order/transport-auto${
        pathCurrent === '/removedTransport' ? '/search-delete' : '/search'
      }`,
      paramsSerch
    )
      .then((res) => {
        setTransportArray(res.general_information)
        dispatch(showLoder({ searchRequest: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ searchRequest: 0 }))
        setTransportArray([])
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  const searchFunction = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      searchRequest()
    } else if (e.indicator === true) {
      searchRequest()
    }
  }

  let controlRoleView = () => {
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

  const controlUrl = (val) => {
    if (pathCurrent === '/auctions-transportsNotAll') {
      return val.status_shipping.id && val.id && val.shippingInformation
        ? viewBlock(43) &&
            `/auction-transportNotAll/edit/${val.id}/editTransport/${val.shippingInformation.id}`
        : viewBlock(43) && `/auction-transportNotAll/edit/${val.id}`
    } else if (pathCurrent === '/archiveTransport') {
      return val.status_shipping.id && val.id && val.shippingInformation
        ? viewBlock(43) &&
            `/archiveTransport/edit/${val.id}/editTransport/${val.shippingInformation.id}`
        : viewBlock(43) && `/archiveTransport/edit/${val.id}`
    } else if (pathCurrent === '/removedTransport') {
      return '/removedTransport'
    } else {
      return val.status_shipping.id && val.id && val.shippingInformation
        ? viewBlock(43) &&
            `/auction-transport/edit/${val.id}/editTransport/${val.shippingInformation.id}`
        : viewBlock(43) && `/auction-transport/edit/${val.id}`
    }
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  //для обрезки текста в таблице, до limit* символов

  const controlToolTip = ({ data, title, limit }) =>
    String(title).length >= limit ? (
      <Whisper
        followCursor
        placement="right"
        speaker={<Tooltip>{title}</Tooltip>}
      >
        <Link
          to={controlUrl(data)}
          onClick={() => sessionStorage.removeItem('curLink')}
        >
          {String(title).slice(0, limit)}
        </Link>
      </Whisper>
    ) : (
      <div>
        <Link
          to={controlUrl(data)}
          onClick={() => sessionStorage.removeItem('curLink')}
        >
          <span>{title}</span>
        </Link>
      </div>
    )

  //Настройка таблицы

  const changeSettingFunc = () => {
    setCheckControlData(
      !statusFinance
        ? checkControlData.slice(0, 6).concat([
            { id: 18, name: 'Оплата за лот' },
            { id: 19, name: 'Оплата за контейнер' },
          ])
        : defaultSetting
    )
    setCheckControlTable(
      !statusFinance
        ? checkControlTable.slice(0, 6).concat([18, 19])
        : initialValueIdSetting
    )

    setStatusFinance(!statusFinance)
  }

  const controlBlock = (val) => {
    switch (val.id) {
      case 'Удаленные':
        return (
          <Link to={val.link} onClick={() => chooseItem(val.id)}>
            <div className="noteContainer">
              <button className={val.status ? 'btn btn--active' : 'btn '}>
                {val.id}
              </button>
            </div>
          </Link>
        )

      default:
        return (
          <Link to={val.link} onClick={() => chooseItem(val.id)}>
            <button className={val.status ? 'btn btn--active' : 'btn '}>
              {val.id}
            </button>
          </Link>
        )
    }
  }

  const controlDisabled = () => {
    let bool = false

    if (pathCurrent.split('/')[1] === 'archiveTransport') bool = true
    if (pathCurrent.split('/')[1] === 'removedTransport') bool = true
    return bool
  }

  const restoreTransport = (id) => {
    dispatch(showLoder({ restoreTransport: 1 }))
    setOpen(false)
    setShowBlockDrop(!showBlockDrop)
    postRequest(`/api/v1/order/transport-auto/restore/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно возвращено!', 'success')

          getArray()
          close()
          dispatch(showLoder({ restoreTransport: 0 }))
        }
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ restoreTransport: 0 }))
      })
  }

  const reloadTransport = (id) => {
    dispatch(showLoder({ reloadTransport: 1 }))
    setOpen(false)
    setShowBlockDrop(!showBlockDrop)

    putRequest(`/api/v1/order/transport-auto/updateDismantled/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно возвращено!', 'success')
          getArray()
          close()
          dispatch(showLoder({ reloadTransport: 0 }))
        }
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ reloadTransport: 0 }))
      })
  }

  const remove = (id, status) => {
    dispatch(showLoder({ removeStatus: 1 }))
    setOpen(false)
    setShowBlockDrop(!showBlockDrop)

    deleteRequest(
      `/api/v1/order/transport-auto/${id}?status_order_id=${status}`
    )
      .then((res) => {
        state.createNotification('Успешно удалено!', 'success')
        getArray()
        dispatch(showLoder({ removeStatus: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        dispatch(showLoder({ removeStatus: 0 }))
      })
  }

  const close = () => {
    setOpen(false)
    setOpenReload(false)
    setOpenRestore(false)
    // setOpenInArchive(false)
  }
  const reset = () => {
    setVin('')
    setSecondName('')
    setLot('')
    setEmail('')
    setBuyer('')

    setPortsSelectSearch([])
    setAuctionSelect([])
    setRegionSelectSearch([])
  }

  // PanelFunc

  const reversShowBlockDrop = () => {
    setShowBlockDrop(!showBlockDrop)
  }

  const editBlockDrop = () => {
    sessionStorage.removeItem('curLink')
    reversShowBlockDrop()
  }
  const trashBlockDrop = () => {
    setItemIsRemove(dataCurrnetClick.data.id)
    setOpen(true)
    reversShowBlockDrop()
  }
  const moveUpBlockDrop = () => {
    setItemIsReload(dataCurrnetClick.data.id)
    setOpenReload(true)
    reversShowBlockDrop()
  }

  const dragableBlockDrop = () => {
    setItemIsRestoreAuto(dataCurrnetClick.data.id)
    setOpenRestore(true)
    reversShowBlockDrop()
  }
  //

  // const stylePanel = {
  //   position: 'absolute',
  //   top: '10px',
  //   right: '10px',
  //   color: '#fff',
  //   zIndex: 100,
  // }

  const styleBottomItemDrop = {
    width: '250px',
    top: valuePosition(+dataCurrnetClick.index, pathCurrent),
    display:
      (viewBlock(41) && !controlDisabled()) ||
      (viewBlock(42) && pathCurrent !== '/removedTransport') ||
      pathCurrent === '/archiveTransport' ||
      pathCurrent === '/removedTransport'
        ? 'block'
        : 'none',
  }
  // const styleEdit = {
  //   display: 'flex',
  //   color: 'inherit',
  //   textDecoration: 'none',
  // }

  // const styleItemElement = { borderBottom: '1px solid #e9ecef' }

  const viewPanelBlock = (pathCurrent) => {
    if (pathCurrent !== '/removedTransport') {
      return (
        viewBlock(42) && (
          <div className="itemElement">
            <label>
              <button onClick={trashBlockDrop}>
                <Trash />
              </button>
              <p>Удаление авто</p>
            </label>
          </div>
        )
      )
    } else if (pathCurrent === '/archiveTransport') {
      return (
        <div className="itemElement">
          <label>
            <button onClick={moveUpBlockDrop}>
              <MoveUp />
            </button>
            <p>Убрать из архива</p>
          </label>
        </div>
      )
    } else if (pathCurrent === '/removedTransport') {
      return (
        <div className="itemElement">
          <label>
            <button onClick={dragableBlockDrop}>
              <Dragable />
            </button>
            <p>Убрать из удаленных</p>
          </label>
        </div>
      )
    }
  }

  const Panel = React.forwardRef(({ ...props }, ref) => (
    <div {...props} ref={ref} className="stylePanel">
      {dataCurrnetClick && (
        <div
          className="bottomItem bottomItem--drop"
          style={styleBottomItemDrop}
          onMouseLeave={reversShowBlockDrop}
        >
          <div className="itemElement">
            <h6>Действие</h6>
          </div>

          {viewBlock(41) && !controlDisabled() && (
            <div className="itemElement">
              <label>
                <Link
                  to={controlUrl(dataCurrnetClick.data)}
                  onClick={editBlockDrop}
                  className="styleEdits"
                >
                  <button>
                    <Edit />
                  </button>
                  <p>Редактирование авто</p>
                </Link>
              </label>
            </div>
          )}
          {viewPanelBlock(pathCurrent)}
        </div>
      )}
    </div>
  ))

  return (
    <div className="itemContainer itemContainer--auctionsTransports">
      <div className="itemContainer-inner">
        <Animation.Slide
          unmountOnExit
          transitionAppear
          timeout={300}
          in={showBlockDrop}
          placement={'bottom'}
        >
          {(props, ref) => <Panel {...props} ref={ref} />}
        </Animation.Slide>

        <div className="modal-container">
          <Modal
            backdrop={'static'}
            keyboard={false}
            open={open}
            onClose={() => close()}
          >
            <Modal.Header>
              <Modal.Title>Удаление авто</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="dropBlockContent ">
                <label>
                  <span> Причина удаления ТС</span>
                  <select
                    value={statusOrdersSelect}
                    onChange={(event) =>
                      setStatusOrdersSelect(event.target.value)
                    }
                    required
                  >
                    {statusOrdersArray.map((elem, i) => (
                      <option key={elem.id} value={elem.id}>
                        {elem.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                className="btn-success "
                onClick={() => remove(itemIsRemove, statusOrdersSelect)}
                appearance="primary"
              >
                Да
              </button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="modal-container">
          <Modal
            backdrop={'static'}
            keyboard={false}
            open={openReload}
            onClose={() => close()}
          >
            <Modal.Header>
              <Modal.Title> Убрать из архива</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              Вы действительно хотите выполнить это действие?
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn-success "
                onClick={() => reloadTransport(itemIsReload)}
                appearance="primary"
              >
                Да
              </button>
              <button
                className="btn-danger"
                onClick={() => setOpenReload(false)}
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
            open={openRestore}
            onClose={() => close()}
          >
            <Modal.Header>
              <Modal.Title> Убрать из удаленных</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              Вы действительно хотите выполнить это действие?
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn-success "
                onClick={() => restoreTransport(itemIsRestoreAuto)}
                appearance="primary"
              >
                Да
              </button>
              <button
                className="btn-danger"
                onClick={() => setOpenRestore(false)}
                appearance="subtle"
              >
                Нет
              </button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="top-item" style={{ paddingLeft: state.width }}>
          <div>
            {controlDisabled() && (
              <div className="groupInput groupInput-containers">
                {fistInfo.map((e) => (
                  <React.Fragment key={e.id}>{controlBlock(e)}</React.Fragment>
                ))}
              </div>
            )}

            <div className="searchGroup groupInput groupInput-auto">
              <form onSubmit={searchFunction} className="formCus">
                <label>
                  <input
                    className=""
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    placeholder="VIN"
                  />
                </label>

                <label>
                  <input
                    className=""
                    type="text"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                    placeholder="Фамилия"
                  />
                </label>

                <label>
                  <input
                    className=""
                    type="text"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    placeholder="Лот"
                  />
                </label>

                <label>
                  <select
                    onChange={(e) => {
                      setStatusSearch(true)
                      setPortsSelectSearch(e.target.value)
                    }}
                    value={portsSelectSearch}
                  >
                    {portsArraySearch.length > 0 &&
                      portsArraySearch.map((e, i) => (
                        <option key={e.id + i} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  <select
                    onChange={(e) => {
                      setStatusSearch(true)
                      setAuctionSelect(e.target.value)
                    }}
                    value={auctionSelect}
                  >
                    {auctionArraySearch.length > 0 &&
                      auctionArraySearch.map((e, i) => (
                        <option key={e.id + i} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  <select
                    onChange={(e) => {
                      setStatusSearch(true)
                      setRegionSelectSearch(e.target.value)
                    }}
                    value={regionSelectSearch}
                  >
                    {regionArraySearch.length > 0 &&
                      regionArraySearch.map((e, i) => (
                        <option key={e.id + i} value={e.id}>
                          {e.name_ru}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  <input
                    className=""
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </label>

                <label>
                  <input
                    className=""
                    type="text"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    placeholder="Buyer"
                  />
                </label>
              </form>
            </div>
          </div>

          <div className="btnTransport">
            <div
              className="blockInput"
              style={{
                marginRight: pathCurrent === '/' ? '20px' : '120px',
              }}
            >
              {!controlDisabled() && transportArray.length > 0 && (
                <Whisper
                  followCursor
                  placement="left"
                  speaker={
                    <Tooltip>
                      {!statusFinance ? 'Активировать' : 'Деактивировать'}
                    </Tooltip>
                  }
                >
                  <button
                    className="btnInfo"
                    style={{ background: statusFinance ? 'green' : 'red' }}
                    onClick={() => changeSettingFunc()}
                  >
                    Финансы
                  </button>
                </Whisper>
              )}
              {transportArray.length > 0 && checkControlTable.length > 0 && (
                <div className="btnGroup btnGroup--custom">
                  <CheckPicker
                    value={checkControlTable}
                    onChange={setCheckControlTable}
                    disabledItemValues={[18, 19]}
                    data={checkControlData.map((item) => {
                      return { label: item.name, value: item.id }
                    })}
                  />
                </div>
              )}

              {!controlDisabled() && (
                <React.Fragment>
                  {viewBlock(40) &&
                    pathCurrent !== '/auctions-transportsNotAll' &&
                    pathCurrent !== '/auctions-inSale' && (
                      <Link
                        to={'/auction-transport/create'}
                        onClick={() => sessionStorage.removeItem('curLink')}
                        className="btnInfo"
                      >
                        Добавить
                      </Link>
                    )}

                  {totalResultsDismantled > 0 && (
                    <Whisper
                      followCursor
                      placement="left"
                      speaker={<Tooltip>Неразобранные автомобили</Tooltip>}
                    >
                      <Link to="/auctions-transportsNotAll" className="btnInfo">
                        {totalResultsDismantled}
                      </Link>
                    </Whisper>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        <div className="bottom-itemFooter" style={{ paddingLeft: state.width }}>
          {transportArray.length > 0 && checkControlTable.length > 0 ? (
            <React.Fragment>
              <div className="Table">
                <Table
                  autoHeight
                  cellBordered={true}
                  hover={true}
                  bordered={true}
                  data={transportArray}

                  // wordWrap={true}
                >
                  {checkControlTable.includes(1) && (
                    <Column align="left" width={20}>
                      <HeaderCell></HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <div>
                              <span
                                className="indicatorInfo"
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  background: 'rgb(221, 221, 221)',
                                  borderRadius: '50%',
                                }}
                              ></span>
                            </div>
                          )
                        }}
                      </Cell>
                    </Column>
                  )}
                  {checkControlTable.includes(2) && (
                    <Column
                      align="center"
                      flexGrow={0.7}
                      style={{
                        display: checkControlTable.includes(2)
                          ? 'block'
                          : 'none',
                      }}
                    >
                      <HeaderCell>Дата</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return controlToolTip({
                            data: rowData,
                            title: getDateFunc(rowData.created_at),
                            limit: 20,
                          })
                        }}
                      </Cell>
                    </Column>
                  )}
                  {checkControlTable.includes(3) && (
                    <Column
                      align="left"
                      style={{ justifyContent: 'left' }}
                      flexGrow={1}
                    >
                      <HeaderCell>Марка/Модель</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return controlToolTip({
                            data: rowData,
                            title: rowData.transport_name,
                            limit: 15,
                          })
                        }}
                      </Cell>
                    </Column>
                  )}

                  {checkControlTable.includes(4) && (
                    <Column align="center" flexGrow={0.5}>
                      <HeaderCell>VIN</HeaderCell>

                      <Cell>
                        {(rowData, rowIndex) => {
                          return controlToolTip({
                            data: rowData,
                            title: rowData.vin.slice(11),
                            limit: 15,
                          })
                        }}
                      </Cell>
                    </Column>
                  )}

                  {checkControlTable.includes(5) && (
                    <Column align="center" flexGrow={0.7}>
                      <HeaderCell>Тип</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return controlToolTip({
                            data: rowData,
                            title: rowData.buyer_role.title,
                            limit: 10,
                          })
                        }}
                      </Cell>
                    </Column>
                  )}

                  {checkControlTable.includes(6) && (
                    <Column
                      align="left"
                      style={{ justifyContent: 'left' }}
                      flexGrow={1}
                    >
                      <HeaderCell>Имя Фамилия</HeaderCell>

                      <Cell>
                        {(rowData, rowIndex) => {
                          return controlToolTip({
                            data: rowData,
                            title:
                              rowData.user[0].name_ru +
                              ' ' +
                              rowData.user[0].second_name_ru,
                            limit: 15,
                          })
                        }}
                      </Cell>
                    </Column>
                  )}

                  {!statusFinance ? (
                    <React.Fragment>
                      {checkControlTable.includes(7) && (
                        <Column align="center" flexGrow={0.7}>
                          <HeaderCell>Город</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: rowData.destination.title,
                                limit: 15,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}

                      {checkControlTable.includes(8) && (
                        <Column align="center" flexGrow={0.5}>
                          <HeaderCell>Аукцион</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: rowData.auction.name,
                                limit: 10,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(9) && (
                        <Column align="center" flexGrow={0.5}>
                          <HeaderCell>Buyer</HeaderCell>
                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: rowData.credential.buyerCode,
                                limit: 10,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(10) && (
                        <Column align="center" flexGrow={0.7}>
                          <HeaderCell>Лот</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: rowData.lot,
                                limit: 15,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(11) && (
                        <Column align="center" flexGrow={0.7}>
                          <HeaderCell>Порт</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: rowData.port.code,
                                limit: 15,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(12) && (
                        <Column align="center" flexGrow={0.7}>
                          <HeaderCell>Оплата</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: (
                                  <div className="GroupImg">
                                    <AutoIconStatus
                                      data={{
                                        title: 'auto',
                                        status: +rowData.status_finance.id,
                                      }}
                                    />
                                    <AutoIconStatus
                                      data={{
                                        title: 'container',
                                        status: +rowData.status_shipping.id,
                                      }}
                                    />
                                  </div>
                                ),
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(13) && (
                        <Column align="center" flexGrow={1}>
                          <HeaderCell>№ контейнера</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: rowData.shippingInformation
                                  ? rowData.shippingInformation.number_container
                                  : '',
                                limit: 15,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(14) && (
                        <Column align="center" flexGrow={0.5}>
                          <HeaderCell>POD date</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title:
                                  rowData.shippingInformation !== null &&
                                  rowData.shippingInformation.hasOwnProperty(
                                    'date_city'
                                  )
                                    ? getDestinationsFunc(
                                        JSON.parse(
                                          rowData.shippingInformation.date_city
                                        ),
                                        klaipedaArray
                                      )
                                    : '',
                                limit: 20,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}

                      {checkControlTable.includes(15) && (
                        <Column align="center" flexGrow={1}>
                          <HeaderCell>
                            Дата поступления <br />в порт
                          </HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title:
                                  rowData.shippingInformation !== null &&
                                  rowData.shippingInformation.hasOwnProperty(
                                    'arrival_warehouse'
                                  ) &&
                                  rowData.shippingInformation
                                    .arrival_warehouse !== null ? (
                                    getDateFunc(
                                      rowData.shippingInformation
                                        .arrival_warehouse
                                    )
                                  ) : (
                                    <span>-</span>
                                  ),
                                limit: 20,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                      {checkControlTable.includes(16) && (
                        <Column align="center" flexGrow={0.6}>
                          <HeaderCell>
                            Наличие <br />
                            документов
                          </HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title:
                                  rowData.shippingInformation !== null &&
                                  rowData.shippingInformation.hasOwnProperty(
                                    'documents_received'
                                  ) &&
                                  rowData.shippingInformation
                                    .documents_received === 1 ? (
                                    <span>Да</span>
                                  ) : (
                                    <span>Нет</span>
                                  ),
                                limit: 20,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}

                      {checkControlTable.includes(17) && (
                        <Column align="center" flexGrow={0.9} treeCol>
                          <HeaderCell>Действие</HeaderCell>
                          <Cell>
                            {(rowData, rowIndex) => {
                              return (
                                <div
                                  className="menuDrop"
                                  style={{
                                    color:
                                      dataCurrnetClick.data &&
                                      dataCurrnetClick.data.id &&
                                      showBlockDrop &&
                                      rowData.id === dataCurrnetClick.data.id
                                        ? 'green'
                                        : 'inherit',
                                  }}
                                  onClick={(e) => {
                                    setDataCurrnetClick({
                                      data: rowData,
                                      index: e.target
                                        .closest('div[aria-rowindex]')
                                        .getAttribute('aria-rowindex'),
                                    })
                                    setShowBlockDrop(!showBlockDrop)
                                  }}
                                >
                                  <Menu />
                                </div>
                              )
                            }}
                          </Cell>
                        </Column>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {checkControlTable.includes(18) && (
                        <Column align="center" flexGrow={0.5}>
                          <HeaderCell>Оплата за лот</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: dataResultPriseLot(rowData),
                                limit: 20,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}

                      {checkControlTable.includes(19) && (
                        <Column align="center" flexGrow={0.5} treeCol>
                          <HeaderCell>Оплата за контейнер</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return controlToolTip({
                                data: rowData,
                                title: dataResultPriseContainer(rowData),
                                limit: 20,
                              })
                            }}
                          </Cell>
                        </Column>
                      )}
                    </React.Fragment>
                  )}
                </Table>

                <div className="paginationBlock">
                  <Pagination
                    prev
                    next
                    ellipsis
                    maxButtons={5}
                    size="xs"
                    layout={['total', 'pager', 'limit']}
                    total={paginationValue.total_results}
                    limitOptions={partsLimit}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                  />
                </div>
              </div>
            </React.Fragment>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default AuctionsTransports
