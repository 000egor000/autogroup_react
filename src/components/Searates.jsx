import React, { useState, useContext, useEffect, memo } from 'react'

import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import { getRequest, putRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import NoData from './NoData'
import { SelectPicker } from 'rsuite'
import PropTypes from 'prop-types'

const Searates = ({ currentRates, viewBlock, dataArray }) => {
  // const [currentUrlId, setCurrentUrlId] = useState('')
  const { state, dispatch } = useContext(ContextApp)
  const [currentValue, setCurrentValue] = useState('')
  const [btnShow, setBtnShow] = useState([])
  const [seaRatesArray, showSeaRatesArray] = useState([])

  const [stateCell, setStateCell] = useState([])
  const [stateCellValue, setStateCellValue] = useState('')
  const [titleRates, setTitleRates] = useState('')

  const [dataArrayInit, setDataArrayInit] = useState([])
  const [dataSelectInit, setDataSelectInit] = useState('')
  console.log(currentRates)

  useEffect(() => {
    currentRates && getTitle(currentRates)
  }, [currentRates])

  useEffect(() => {
    !currentRates && getCarriers()
  }, [currentRates])

  const getCarriers = () => {
    dispatch(showLoder({ carriers: 1 }))
    getRequest('/api/v1/carriers', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataArrayInit(
          res.carriers.map(({ id, title }) => ({
            label: title,
            value: id,
            linkName: 'rates-fees/inland-rates?carrier_id',
            dataResName: 'inlandRates',
            nameCash: 'carriers',
          }))
        )
        const aglogisticId = res.carriers.find(
          (res) => res.code === 'aglogistic'
        )

        setDataSelectInit(aglogisticId['id'])
        dispatch(showLoder({ carriers: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')
        setDataArrayInit([])
        dispatch(showLoder({ carriers: 0, status: err.status }))
      })
  }

  const getTitle = (val) => {
    switch (val) {
      case 'aec':
        return setTitleRates('Aec: Sea Rates')
      case 'auto_universe':
        return setTitleRates('Auto Universe: Sea Rates Own')

      case 'aglogistic':
        return setTitleRates('Ag Logistic: Sea Rates')

      default:
        return ''
    }
  }

  // useEffect(() => {
  //   if (titleRates) {
  //     dispatch(showLoder({ carriers: 1 }))
  //     getRequest('/api/v1/carriers', {
  //       Authorization: `Bearer ${window.sessionStorage.getItem(
  //         'access_token'
  //       )}`,
  //     })
  //       .then((res) => {
  //         res.carriers.map(
  //           (elem) => elem.code === currentRates && setCurrentUrlId(elem.id)
  //         )
  //         dispatch(showLoder({ carriers: 0 }))
  //       })

  //       .catch((err) => {
  //       state.createNotification('Что-то пошло не так!', 'error')

  //         dispatch(showLoder({ carriers: 0 }))
  //       })
  //   }
  // }, [currentRates, titleRates])

  // useEffect(() => {
  //   if (dataArray.length > 0) {
  //     const idCarrier = dataArray.find((elem) => elem.value == currentRates)
  //     console.log(idCarrier)
  //     idCarrier && setCurrentUrlId(idCarrier.value)
  //   }
  // }, [currentRates, dataArray])

  useEffect(() => {
    dispatch(showLoder({ destinations: 1 }))
    getRequest('/api/v1/destinations', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        let result = res.destinations.map((elem) => {
          return res.destinations[0].id === elem.id
            ? { ...elem, status: true }
            : { ...elem, status: false }
        })
        setBtnShow(result)
        dispatch(showLoder({ destinations: 0 }))
      })

      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ destinations: 0, status: err.status }))
      })
  }, [])

  const chooseItem = (id) => {
    const newArr = btnShow.map((item) => {
      return item.id === id
        ? { ...item, status: true }
        : { ...item, status: false }
    })

    setBtnShow(newArr)
  }

  useEffect(() => {
    if (btnShow.length > 0) {
      let result = btnShow.filter((elem) => elem.status === true)
      setCurrentValue(result[0].id)
    }
  }, [btnShow])

  const getSeaRatesArray = () => {
    dispatch(showLoder({ getSeaRatesArray: 1 }))
    let container = []
    if ((currentValue && currentRates) || (currentValue && dataSelectInit)) {
      getRequest(
        `/api/v1/rates-fees/sea-rates?carrier_id=${
          currentRates ? currentRates : dataSelectInit
        }&destination_id=${currentValue}`,
        {
          Authorization: `Bearer ${window.sessionStorage.getItem(
            'access_token'
          )}`,
        }
      )
        .then((res) => {
          res.seaRates.map((elem) => {
            const { 'jet_ski_w/trailer': trailer, ...res } = elem

            container.push(Object.entries(res))
          })

          showSeaRatesArray(container)
          dispatch(showLoder({ getSeaRatesArray: 0 }))
        })

        .catch((err) => {
          //state.createNotification('Успешно обновлено!', 'error')
          showSeaRatesArray([])
          dispatch(showLoder({ getSeaRatesArray: 0, status: err.status }))
        })
    }
  }

  useEffect(() => {
    if (currentRates || dataSelectInit) {
      getSeaRatesArray()
    }
  }, [currentValue, currentRates, dataSelectInit])

  // const showIdLocation = (c) => {

  // 	// setNameDocEdit(title)
  // 	// setPriceDocEdit(price)
  // 	// setDescriptionDocEdit(description)
  // 	// setColorBorderEdit(color)
  // 	// setAddDescriptionDocEdit(additional)
  // 	// setIdEdit(id)
  // 	setIsModalShowEdit(true)
  // }

  // const remove = (id) => {
  // 	dispatch(show())
  // 	deleteRequest(`/api/v1/rates-fees/doc-fees/${id}`)
  // 		.then((res) => {
  // 			if (res.status === 'success') {
  //

  // 				setIsModalRemove(false)
  // 				dispatch(hide())
  // 			}
  // 		})
  // 		.catch((err) => {
  //
  // 			dispatch(hide())
  // 		})
  // }
  // const editCell = (id) => {
  // 	putRequest(`/api/v1/rates-fees/sea-rates/${id}`, { price: 2 }).then(() => getSeaRatesArray())

  // }
  const changeTableOrEdit = () => {
    dispatch(showLoder({ changeTableOrEdit: 1 }))
    putRequest(`/api/v1/rates-fees/sea-rates/${stateCell}`, {
      price: stateCellValue,
    })
      .then(() => {
        getSeaRatesArray()
        dispatch(showLoder({ changeTableOrEdit: 0 }))
      })
      .catch((err) =>
        dispatch(showLoder({ changeTableOrEdit: 0, status: err.status }))
      )
  }
  // useEffect(() => {
  // 	if (stateCellValue !== stateCellValueFist) {
  // 		dispatch(show())
  // 		putRequest(`/api/v1/rates-fees/sea-rates/${stateCell}`, { price: stateCellValue }).then(
  // 			() => {
  // 				getSeaRatesArray()
  // 				dispatch(hide())
  //
  // 			}
  // 		)
  // 	}
  // }, [stateCellValue, stateCellValueFist])

  const controlEditCell = (id, data) => {
    setStateCellValue(data)
    // stateStateCellValueFist(data)
    let filtered = stateCell.filter((e) => id == e)

    if (filtered.length > 0 || stateCell.length > 0) {
      setStateCell([])
    } else {
      setStateCell([id])
    }
  }

  const isChecked = (id) => {
    console.log(id)
    let filtered = stateCell.filter((e) => e === id)

    let bool = filtered.length > 0 ? true : false
    return bool
  }

  const controlBlock = () => {
    let bool = true

    // if (viewBlock(81) && titleRates === 'Aec: Sea Rates') {
    //   return (bool = true)
    // }

    // if (viewBlock(83) && titleRates === 'Auto Universe: Sea Rates Own') {
    //   return (bool = true)
    // }
    // if (viewBlock(85) && titleRates === 'Ag Logistic: Sea Rates') {
    //   return (bool = true)
    // }

    return bool
  }

  const styleTopItem = {
    justifyContent: dataSelectInit ? 'space-between' : 'right',
    paddingLeft: state.width,
    paddingRight: '30px',
  }

  return (
    <div className="itemContainer">
      {currentRates || dataSelectInit ? (
        <div className="itemContainer-inner">
          <div className="top-item " style={styleTopItem}>
            {/* {!currentRates && (
              <div className="btnTransport">
                <div className="customGroupSelect">
                  <SelectPicker
                    data={dataArrayInit}
                    value={dataSelectInit}
                    onChange={setDataSelectInit}
                    cleanable={false}
                  />
                </div>
              </div>
            )} */}

            <div className="groupInput">
              <div className="switcher-btn">
                {btnShow.length > 0 &&
                  btnShow.map((item) => {
                    return (
                      <span
                        key={item.id + item.status + item.id}
                        onClick={() => chooseItem(item.id)}
                        className={item.status ? 'active' : item.id}
                      >
                        {item.title}
                      </span>
                    )
                  })}
              </div>
            </div>
          </div>

          <div
            className="bottom-itemFooter"
            style={{ paddingLeft: state.width, color: 'black' }}
          >
            {seaRatesArray.length > 0 ? (
              <div className="overFlowBlock">
                <table>
                  <thead>
                    <tr>
                      <th></th>

                      {seaRatesArray[0].map((e) => {
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
                    <tr>
                      <th></th>
                      {seaRatesArray[0].map((e) => {
                        if (typeof e[1].children === 'object') {
                          if (e[1].children.price !== undefined) {
                            return <th>{null}</th>
                          } else {
                            return Object.entries(e[1].children).map((e) => (
                              <th>{e[1].count_auto_title}</th>
                            ))
                          }
                        }
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {seaRatesArray.map((e) => {
                      return (
                        <tr>
                          {e.map((e) => {
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
                            } else if (e[0] === 'port_name') {
                              return <th>{e[1]}</th>
                            }
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* <div className='paginationBlock'>
								<Pagination
									prev
									next
									// first
									// last
									ellipsis
									// boundaryLinks
									maxButtons={5}
									size='xs'
									layout={['total', 'pager']}
									total={paginationValue.total_results}
									limitOptions={[5, 10]}
									limit={limit}
									activePage={page}
									onChangePage={setPage}
									onChangeLimit={handleChangeLimit}
								/>
							</div> */}
              </div>
            ) : (
              <NoData />
            )}
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  )
}

Searates.propTypes = {
  currentRates: PropTypes.string,
  viewBlock: PropTypes.func,
}
export default memo(Searates)
