import React, { useState, useContext, useEffect } from 'react'

import { Pagination, SelectPicker } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { getRequest, putRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import PropTypes from 'prop-types'
import NoData from './NoData'
import { dataViewInland } from '../helper'

const Inlandrates = ({ currentRates, viewBlock, dataArray }) => {
  const { state, dispatch } = useContext(ContextApp)
  const [inlandRatesArray, showInlandRatesArray] = useState([])

  const partsLimit = [20, 40, 80]

  const [paginationValue, setPaginationValue] = useState([])
  const [stateCell, setStateCell] = useState([])
  const [stateCellValue, setStateCellValue] = useState('')
  const [titleRates, setTitleRates] = useState('')
  const [limit, setLimit] = useState(300)
  const [page, setPage] = useState(1)
  // const [currentUrlId, setCurrentUrlId] = useState('')
  const [locationsSelect, setLocationsSelect] = useState('')
  const [locationsArray, setLocationsArray] = useState([])

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
  //       // toast.error('Что-то пошло не так!')
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
  //         // toast.error('Что-то пошло не так!')
  //       })
  //   }
  // }, [locationsArray, currentUrlId])
  // console.log(locationsArray)
  // console.log(currentUrlId)

  useEffect(() => {
    if (currentRates && !locationsArray.length > 0) {
      getlocationsArray()
    }
  }, [currentRates, currentRates])

  const getlocationsArray = () => {
    dispatch(showLoder({ calculator: 1 }))
    getRequest(`/api/v1/locations-calculator?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setLocationsArray(res.locations)
        dispatch(showLoder({ calculator: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ calculator: 0 }))
        setLocationsArray([])
        // toast.error('Что-то пошло не так!')
      })
  }

  const getInlandRatesArray = () => {
    dispatch(showLoder({ getInlandRatesArray: 1 }))
    let container = []
    let url
    const findObj = dataArray.find((item) => item.value === currentRates)

    const { linkName, value, dataResName } = findObj

    url = `/api/v1/${linkName}=${value}&page=${page}&limit=${limit}`
    if (locationsSelect)
      url = `/api/v1/${linkName}=${value}&page=${1}&limit=${limit}&location_id=${locationsSelect}`
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
        // toast.error('Что-то пошло не так!')
        dispatch(showLoder({ getInlandRatesArray: 0 }))
      })
  }

  useEffect(
    () => currentRates && getInlandRatesArray(),
    [page, limit, currentRates, locationsSelect, titleRates]
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
      .catch(() => dispatch(showLoder({ changeTableOrEdit: 0 })))
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

  return (
    <div className="itemContainer">
      <ToastContainer />
      {currentRates && inlandRatesArray.length > 0 ? (
        <>
          <div className="itemContainer-inner">
            <div className="top-item " style={{ paddingLeft: state.width }}>
              <div
                className="btnTransport"
                style={{ justifyContent: 'space-between', marginRight: '20px' }}
              >
                <div
                  style={{
                    marginBottom: '30px',
                    visibility: locationsArray.length > 0 ? 'visible' : 'none',
                  }}
                  className="searchGroup groupInput-auto"
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="selectCustomId">Название площадки</label>

                    <SelectPicker
                      id="selectCustomId"
                      data={locationsArray}
                      valueKey="id"
                      labelKey="name"
                      value={locationsSelect}
                      onChange={setLocationsSelect}
                      placeholder="Выберите площадку"
                      loading={!locationsArray.length}
                    />
                  </div>
                </div>
              </div>
            </div>

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
                    </tr>
                  </thead>
                  <tbody>
                    {inlandRatesArray.map((item) => {
                      return (
                        <tr>
                          {dataArray[0]['dataResName'] ===
                            'inlandRatesCarters' && (
                            <td>{controlDirect(item)}</td>
                          )}

                          {item.map((e) => {
                            if (typeof e[1].children === 'object') {
                              if (e[1].children.price !== undefined) {
                                return (
                                  <td
                                    onClick={() =>
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
                                        style={{
                                          maxWidth: '100%',
                                          width: '50px',
                                          height: 'auto',
                                        }}
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
                                return Object.entries(e[1].children).map(
                                  (e) => (
                                    <td
                                      onClick={() =>
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
                                          onClick={(e) => {
                                            e.stopPropagation()
                                          }}
                                          onBlur={() => changeTableOrEdit()}
                                          style={{
                                            maxWidth: '100%',
                                            width: '50px',
                                            height: 'auto',
                                          }}
                                        />
                                      ) : (
                                        e[1].price
                                      )}
                                    </td>
                                  )
                                )
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

                            // dataVew(place_destination, destination)
                            // if (
                            //   .includes(
                            //     'place_destinations_name'
                            //   )
                            // ) {
                            //   alert(1)
                            //   // return <th>{dataVew(e[1])}</th>
                            // }
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <div
                  className="paginationBlock"
                  style={{
                    display:
                      inlandRatesArray.length > limit / 15 ? 'flex' : 'none',
                  }}
                >
                  <Pagination
                    prev
                    next
                    ellipsis
                    maxButtons={5}
                    size="xs"
                    layout={['total', 'pager', 'limit']}
                    total={paginationValue.total_results}
                    limitOptions={partsLimit}
                    limit={limit / 15}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <NoData />
      )}
    </div>
  )
}

Inlandrates.propTypes = {
  currentRates: PropTypes.string,
  viewBlock: PropTypes.func,
}
export default Inlandrates
