import React, { useState, useContext, useEffect, memo } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import {
  getRequest,
  putRequest,
  deleteRequest,
  postRequest,
} from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import PropTypes from 'prop-types'
import NoData from './NoData'
import { dataViewInland } from '../helper'
import { Trash, Reload } from '@rsuite/icons'
import { Pagination, Tooltip, Whisper, Modal, SelectPicker } from 'rsuite'

const Inlandrates = ({ currentRates, viewBlock, dataArray }) => {
  const { state, dispatch } = useContext(ContextApp)
  const [inlandRatesArray, showInlandRatesArray] = useState([])

  const partsLimit = [24, 48, 80]

  const [paginationValue, setPaginationValue] = useState([])
  const [stateCell, setStateCell] = useState([])
  const [stateCellValue, setStateCellValue] = useState('')
  const [titleRates, setTitleRates] = useState('')
  const [limit, setLimit] = useState(300)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [itemIsRemove, setItemIsRemove] = useState({ active: false, pd_id: '' })

  const [locationsArray, setLocationsArray] = useState([])
  const [locationsSelect, setLocationsSelect] = useState('')

  const [dataPorts, setDataPorts] = useState([])
  const [portSearch, setPortSearch] = useState('')

  const [auctionArray, setAuctionArray] = useState([])
  const [auctionsSelect, setAuctionsSelect] = useState(0)

  // const [portSearch, setPortSearch] = useState('')

  // const [currentUrlId, setCurrentUrlId] = useState('')
  // const [locationsSelect, setLocationsSelect] = useState('')
  // const [locationsArray, setLocationsArray] = useState([])

  // useEffect(() => {
  //   if (currentRates) {
  //     getTitle(currentRates)
  //   }
  // }, [currentRates, titleRates])

  // useEffect(() => {
  //   if (dataArray.length > 0) {
  //     const idCarrier = dataArray.find((elem) => elem.value == currentRates)

  //     idCarrier && setCurrentUrlId(idCarrier.id)
  //   }
  // }, [page, currentRates, dataArray])

  // const getTitle = (val) => {
  //   switch (val) {
  //     case 'aec':
  //       return setTitleRates('Aec: Inland Rates')
  //     case 'auto_universe':
  //       return setTitleRates('Auto Universe: Inland Rates')
  //     case 'aglogistic':
  //       return setTitleRates('Ag Logistic: Inland Rates')
  //     default:
  //       return ''
  //   }
  // }

  // const getAllArray = () => {
  //   dispatch(show())
  //   getRequest(`/api/v1/locations-calculator?limit=1000`, {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setLocationsArray(res.locations)
  //       dispatch(hide())
  //     })
  //     .catch((err) => {
  //       dispatch(hide())
  //       setLocationsArray([])
  //       //state.createNotification('Успешно обновлено!', 'error')
  //     })
  // }

  // useEffect(() => {
  //   if (!locationsArray.length > 0 && currentUrlId) {
  //     dispatch(showLoder({ calculator: 1 }))
  //     getRequest(`/api/v1/locations-calculator?limit=1000`, {
  //       Authorization: `Bearer ${window.sessionStorage.getItem(
  //         'access_token'
  //       )}`,
  //     })
  //       .then((res) => {
  //         setLocationsArray(res.locations)
  //         dispatch(showLoder({ calculator: 0 }))
  //       })
  //       .catch((err) => {
  //         dispatch(showLoder({ calculator: 0 }))
  //         setLocationsArray([])
  //         //state.createNotification('Успешно обновлено!', 'error')
  //       })
  //   }
  // }, [locationsArray, currentUrlId])
  // console.log(locationsArray)
  // console.log(currentUrlId)

  // useEffect(() => {
  //   if (currentRates && !locationsArray.length > 0) {
  //     getlocationsArray()
  //   }
  // }, [currentRates, currentRates])

  // const getlocationsArray = () => {
  //   dispatch(showLoder({ calculator: 1 }))
  //   getRequest(`/api/v1/locations-calculator?limit=1000`, {
  //     Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
  //   })
  //     .then((res) => {
  //       setLocationsArray(res.locations)
  //       dispatch(showLoder({ calculator: 0 }))
  //     })
  //     .catch((err) => {
  //       dispatch(showLoder({ calculator: 0 }))
  //       setLocationsArray([])
  //       //state.createNotification('Успешно обновлено!', 'error')
  //     })
  // }

  const getInlandRatesArray = () => {
    dispatch(showLoder({ getInlandRatesArray: 1 }))
    let container = []
    let url
    const findObj = dataArray.find((item) => item.value === currentRates)

    const { linkName, value, dataResName } = findObj

    url = `/api/v1/${linkName}=${value}&page=${page}&limit=${limit}`
    if (locationsSelect || portSearch || auctionsSelect) {
      url += `${locationsSelect ? '&location_id=' + locationsSelect : ''}${
        portSearch ? '&port_id=' + portSearch : ''
      }${auctionsSelect ? '&auction_id=' + auctionsSelect : ''}`
    }

    getRequest(url, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        res[dataResName].map((elem) => container.push(Object.entries(elem)))

        setPaginationValue(res.pagination)
        showInlandRatesArray(container)
        dispatch(showLoder({ getInlandRatesArray: 0 }))
      })

      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        showInlandRatesArray([])
        dispatch(showLoder({ getInlandRatesArray: 0, status: err.status }))
      })
  }

  useEffect(
    () => currentRates && getInlandRatesArray(),
    [page, limit, currentRates, titleRates]
  )

  const changeTableOrEdit = () => {
    const findObj = dataArray.find((item) => item.value === currentRates)
    const { linkName } = findObj

    dispatch(showLoder({ changeTableOrEdit: 1 }))
    putRequest(`/api/v1/${linkName.split('?')[0]}/${stateCell}`, {
      price: stateCellValue,
    })
      .then(() => {
        getInlandRatesArray()
        dispatch(showLoder({ changeTableOrEdit: 0 }))
      })
      .catch((err) =>
        dispatch(showLoder({ changeTableOrEdit: 0, status: err.status }))
      )
  }

  const controlEditCell = (id, data) => {
    setStateCellValue(data)

    let filtered = stateCell.filter((e) => id == e)

    if (filtered.length > 0 || stateCell.length > 0) {
      setStateCell([])
    } else {
      setStateCell([id])
    }
  }

  const isChecked = (id) => {
    let filtered = stateCell.filter((e) => e === id)
    let bool = filtered.length > 0 ? true : false
    return bool
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey * 15)
  }

  const controlBlock = () => {
    return true
    // let bool = false
    // if (viewBlock(81) && titleRates === 'Aec: Inland Rates') {
    //   return (bool = true)
    // }
    // if (viewBlock(83) && titleRates === 'Auto Universe: Inland Rates') {
    //   return (bool = true)
    // }
    // if (viewBlock(85) && titleRates === 'Ag Logistic: Inland Rates') {
    //   return (bool = true)
    // }
    // return bool
  }

  const controlDirect = (arr) => {
    let res = {}
    for (const iterator of arr) {
      if (iterator[0] == 'place_destinations_name') {
        res.place_destinations_name = iterator[1]
      } else if (iterator[0] == 'destination_name') {
        res.destination_name = iterator[1]
      }
    }

    if (res) {
      const { destination_name, place_destinations_name } = res

      return dataViewInland(place_destinations_name, destination_name)
    }
  }
  const close = () => {
    setItemIsRemove({ active: false, id: '' })
    setOpen(false)
  }

  const removeAndRestore = ({ active, pd_id }) => {
    dispatch(showLoder({ remove: 1 }))
    postRequest(
      `/api/v1/rates-fees/${active ? 'restore' : 'remove'}-inland-rate`,
      {
        carter_id: currentRates,
        pd_id,
      }
    )
      .then((res) => {
        close()
        getInlandRatesArray()
        state.createNotification('Цена успешно изменена!', 'success')

        dispatch(showLoder({ remove: 0 }))
      })
      .catch((err) => {
        close()

        state.createNotification(`Что-то пошло не так!`, 'error')
        dispatch(showLoder({ remove: 0, status: err.status }))
      })
  }

  useEffect(() => {
    getPorts()
    getAllLocations()
    getArrayAuctions()
  }, [])

  useEffect(() => {
    getInlandRatesArray()
  }, [locationsSelect, portSearch, auctionsSelect, page, limit])

  const getAllLocations = () => {
    dispatch(showLoder({ getAllArray: 1 }))
    getRequest(`/api/v1/locations?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setLocationsArray(res.locations)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setLocationsArray([])
        dispatch(showLoder({ getAllArray: 0, status: err.status }))
      })
  }
  const getPorts = () => {
    dispatch(showLoder({ getPorts: 1 }))
    getRequest('/api/v1/ports', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPorts(res.ports)
        // setSelectValuePorts(res.ports[0].id)
        dispatch(showLoder({ getPorts: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getPorts: 0, status: err.status }))
      })
  }
  const getArrayAuctions = () => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArray(res.auction.filter((el) => +el.id !== 3))

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0, status: err.status }))
      })
  }

  // const getSearchInlandRates = () => {
  //   dispatch(showLoder({ locationsSearch: 1 }))
  //   let nameLocation = locationsArray.find((el) => el.id === locationsSelect)

  //   postRequest(`/api/v1/rates-fees/inland-rates/search?page=${page}`, {
  //     location_id: nameLocation ? nameLocation.id : null,
  //     port_id: portSearch,
  //   })
  //     .then((res) => {
  //       setPaginationValue(res.pagination)
  //       showInlandRatesArray(res)
  //       dispatch(showLoder({ locationsSearch: 0 }))
  //     })
  //     .catch((err) => {
  //       showInlandRatesArray([])
  //       dispatch(showLoder({ locationsSearch: 0 }))
  //     })
  // }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={open}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>
              {itemIsRemove.active ? 'Восстановление' : 'Удаление'} цены
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Вы действительно хотите выполнить это действие?
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => removeAndRestore(itemIsRemove)}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => close()}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="groupSearch">
            <div className="customCheckPicker">
              {/* <label htmlFor="selectCustomId">Название площадки</label> */}
              <SelectPicker
                data={locationsArray}
                valueKey="id"
                labelKey="name"
                value={locationsSelect}
                onChange={setLocationsSelect}
                placeholder="Выберите площадку"
                loading={!locationsArray.length}
              />
            </div>
            <div className="customCheckPicker">
              {/* <label htmlFor="selectCustomId">Порт</label> */}

              <SelectPicker
                data={dataPorts}
                valueKey="id"
                labelKey="name"
                value={portSearch}
                onChange={setPortSearch}
                placeholder="Выберите порт"
                loading={!dataPorts.length}
              />
            </div>
            <div className="customCheckPicker">
              <SelectPicker
                data={auctionArray}
                valueKey="id"
                labelKey="name"
                value={auctionsSelect}
                onChange={setAuctionsSelect}
                placeholder="Выберите аукцион"
                loading={!auctionArray.length}
              />
            </div>
          </div>
          <div
            className="btnTransport"
            style={{ justifyContent: 'space-between', marginRight: '20px' }}
          ></div>
        </div>
        {currentRates && inlandRatesArray.length > 0 ? (
          <div
            className="bottom-itemFooter"
            style={{ paddingLeft: state.width, color: 'black' }}
          >
            <div className="overFlowBlock">
              <table>
                <thead>
                  <tr>
                    {dataArray[0]['dataResName'] !== 'inlandRatesCarters' ? (
                      <>
                        <th>Location</th>
                        <th>Port</th>
                        <th>Auction</th>
                      </>
                    ) : (
                      <th>Место назначение</th>
                    )}

                    {inlandRatesArray[0].map((e) => {
                      if (typeof e[1].children === 'object') {
                        if (e[1].children.price !== undefined) {
                          return <th>{e[1].size_name}</th>
                        } else {
                          return (
                            <React.Fragment>
                              <th colSpan={e.length}>{e[1].size_name}</th>
                            </React.Fragment>
                          )
                        }
                      }
                    })}
                    {dataArray[0].nameCash == 'carter' && <th>Действия</th>}
                  </tr>
                </thead>
                <tbody>
                  {inlandRatesArray.map((item) => {
                    let pd_id
                    let active

                    return (
                      <tr>
                        {dataArray[0]['dataResName'] ===
                          'inlandRatesCarters' && (
                          <td>{controlDirect(item)}</td>
                        )}
                        {item.map((e) => {
                          if (e[0] === 'pd_id') pd_id = e[1]
                          if (e[0] === 'active') active = e[1]

                          if (typeof e[1].children === 'object') {
                            if (e[1].children.price !== undefined) {
                              return (
                                <td
                                  style={{
                                    backgroundColor: active
                                      ? '#f5f5f5'
                                      : '#fff',
                                  }}
                                  onClick={() =>
                                    !active &&
                                    controlBlock() &&
                                    controlEditCell(
                                      e[1].children.id,
                                      e[1].children.price
                                    )
                                  }
                                >
                                  {isChecked(e[1].children.id) ? (
                                    <input
                                      className="customInputChange"
                                      value={stateCellValue}
                                      onChange={(e) =>
                                        setStateCellValue(e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      onBlur={() => changeTableOrEdit()}
                                    />
                                  ) : (
                                    e[1].children.price
                                  )}
                                </td>
                              )
                            } else {
                              return Object.entries(e[1].children).map((e) => (
                                <td
                                  onClick={() =>
                                    !active &&
                                    controlBlock() &&
                                    controlEditCell(e[1].id, e[1].price)
                                  }
                                >
                                  {isChecked(e[1].id) ? (
                                    <input
                                      className="customInputChange"
                                      value={stateCellValue}
                                      onChange={(e) =>
                                        setStateCellValue(e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      onBlur={() => changeTableOrEdit()}
                                    />
                                  ) : (
                                    e[1].price
                                  )}
                                </td>
                              ))
                            }
                          }
                          if (e[0] === 'location_name') {
                            return <th>{e[1]}</th>
                          }
                          if (e[0] === 'port_code') {
                            return <th>{e[1]}</th>
                          }
                          if (e[0] === 'auction_name') {
                            return <th>{e[1]}</th>
                          }
                        })}

                        {pd_id && (
                          <td>
                            <Whisper
                              followCursor
                              placement="left"
                              speaker={
                                <Tooltip>
                                  {active ? 'Восстановить' : 'Удалить'}
                                </Tooltip>
                              }
                            >
                              <span
                                onClick={() => {
                                  setItemIsRemove({ active, pd_id })
                                  setOpen(true)
                                }}
                              >
                                {active ? <Reload /> : <Trash />}
                              </span>
                            </Whisper>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="paginationBlock paginationBlock--hidden">
                <Pagination
                  prev
                  next
                  ellipsis
                  maxButtons={5}
                  size="xs"
                  layout={['total', 'pager', 'limit']}
                  total={paginationValue.total_results / 15}
                  limitOptions={partsLimit}
                  limit={limit / 15}
                  activePage={page}
                  onChangePage={setPage}
                  onChangeLimit={handleChangeLimit}
                />
              </div>
            </div>
          </div>
        ) : (
          <NoData />
        )}
      </div>
    </div>
  )
}

Inlandrates.propTypes = {
  currentRates: PropTypes.string,
  viewBlock: PropTypes.func,
}
export default memo(Inlandrates)
