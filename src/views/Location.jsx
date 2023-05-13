import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import { Pagination, SelectPicker, CheckPicker, Modal } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

// import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { viewPorts } from './../helper'
import NoData from './../components/NoData'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const Location = (props) => {
  const [dataMaster, setDataMaster] = useState([])
  const [dataMasterInitial, setDataMasterInitial] = useState([])
  const [dataPorts, setDataPorts] = useState([])
  const [dataAuctions, setDataAuctions] = useState([])
  const partsLimit = [20, 50, 100]

  const [locationEditValue, setLocationEditValue] = useState('')
  const [locationCopartEditValue, setLocationCopartEditValue] = useState('')
  const [locationCopartValue, setLocationCopartValue] = useState('')

  const [selectValueEditPorts, setSelectValueEditPorts] = useState([])
  const [selectValueEditAuctions, setSelectValueEditAuctions] = useState('')
  const [idEdit, setIdEdit] = useState('')

  const [paginationValue, setPaginationValue] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [locationValue, setLocationValue] = useState('')
  const [selectValuePorts, setSelectValuePorts] = useState([])
  const [selectValueAuctions, setSelectValueAuctions] = useState(1)
  const [locationsSelect, setLocationsSelect] = useState('')
  const [portSearch, setPortSearch] = useState('')
  const [locationsArray, setLocationsArray] = useState([])

  const [viewControler, setViewControler] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')
  // const [flag, setflag] = useState(false)

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ removeLocations: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/locations/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')

          getArray()
          getPorts()
          dispatch(showLoder({ removeLocations: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ removeLocations: 0 }))
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
        dispatch(showLoder({ getPorts: 0 }))
      })
  }

  const getAuctions = () => {
    dispatch(showLoder({ getAuctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataAuctions(res.auction)
        setSelectValueAuctions(res.auction[0].id)
        dispatch(showLoder({ getAuctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getAuctions: 0 }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/locations?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.locations)
        setDataMasterInitial(res.locations)
        setPaginationValue(res.pagination)
        setLoadingShow(false)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ getArray: 0 }))
      })
  }
  const getAllArray = () => {
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
        dispatch(showLoder({ getAllArray: 0 }))
      })
  }

  // useEffect(() => {
  //   getSearchlocations()
  // }, [locationsSelect, portSearch, page])

  const getSearchlocations = () => {
    dispatch(showLoder({ locationsSearch: 1 }))
    let nameLocation = locationsArray.find((el) => el.id === locationsSelect)

    postRequest(`/api/v1/locations/search?page=${page}`, {
      location_id: nameLocation ? nameLocation.id : null,
      port_id: portSearch,
    })
      .then((res) => {
        setDataMaster(res.locations)
        setDataMasterInitial(res.locations)
        setPaginationValue(res.pagination)
        dispatch(showLoder({ locationsSearch: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ locationsSearch: 0 }))
      })
  }
  // Фильтр на странице (фронт)
  // useEffect(() => {
  //   if (portSearch) {
  //     const filterArr = dataMasterInitial.filter(
  //       (items) => +items.ports[0]['id'] === +portSearch
  //     )
  //     return setDataMaster(filterArr.length > 0 ? filterArr : [])
  //   } else {
  //     setDataMaster(dataMasterInitial)
  //   }
  // }, [portSearch])

  useEffect(() => {
    getAllArray()
    getPorts()
    getAuctions()
    getArray()
  }, [])

  useEffect(() => {
    if (locationsSelect || portSearch) {
      getSearchlocations()
    } else {
      getArray()
    }
  }, [locationsSelect, portSearch, page, limit])

  useEffect(() => {
    setPage(1)
  }, [locationsSelect, portSearch])

  const showIdLocation = ({ name, ports, auction, id, copart_name }) => {
    let resIdPorts = []
    ports.map((el) => resIdPorts.push(el.id))
    setLocationCopartEditValue(copart_name ? copart_name : '')
    setLocationEditValue(name ? name : '')

    setSelectValueEditPorts(resIdPorts ? resIdPorts : '')
    setSelectValueEditAuctions(auction.id ? auction.id : '')
    setIdEdit(id ? id : '')
    setIsModalShowEdit(!isModalShowEdit)
  }

  let params = {
    name: locationValue,
    port_id: selectValuePorts,
    auction_id: selectValueAuctions,
    copart_name: locationCopartValue,
  }

  let paramsEdit = {
    name: locationEditValue,
    port_id: selectValueEditPorts,
    auction_id: selectValueEditAuctions,
    copart_name: locationCopartEditValue,
  }

  const createLocation = (e) => {
    dispatch(showLoder({ createLocation: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/locations', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getArray()
        getPorts()
        close()

        dispatch(showLoder({ createLocation: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createLocation: 0 }))
      })
  }
  const editLocation = (e) => {
    dispatch(showLoder({ editLocation: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/locations/${idEdit}`, paramsEdit)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getArray()
        getPorts()
        close()
        dispatch(showLoder({ editLocation: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')

        dispatch(showLoder({ editLocation: 0 }))
      })
  }
  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }
  const close = () => {
    setIsModalRemove(false)
    setIsModalShowEdit(false)
    setIsModalShow(false)
    setLocationValue('')
    setLocationCopartValue('')
    setSelectValueEditPorts([])
  }

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  let controlRoleView = () => {
    if (
      Object.keys(
        JSON.parse(window.sessionStorage.getItem('access_rights'))
      ).includes('location')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).location.access_rights

      setViewControler(initialValue)
    }
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  const styleTopItem = {
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: `10px 10px 0 ${state.width}`,
  }
  const styleBottomItemFooter = { paddingLeft: state.width, color: 'black' }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Удаление локации</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите удалить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => remove(itemIsRemove)}
              appearance="primary"
            >
              Да
            </button>
            <button
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
          open={isModalShowEdit}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Редактировать локацию</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editLocation}>
              {/* <h2>Редактировать локацию</h2> */}
              <label>
                <span>Аукцион</span>
                <select
                  value={selectValueEditAuctions}
                  onChange={(event) =>
                    setSelectValueEditAuctions(event.target.value)
                  }
                >
                  {dataAuctions.map((elem) => {
                    return (
                      <option key={elem.id} value={elem.id}>
                        {elem.name}
                      </option>
                    )
                  })}
                </select>
              </label>
              <label>
                <span>Локация страны покупки</span>
                <input
                  className=""
                  type="text"
                  value={locationEditValue}
                  onChange={(e) => setLocationEditValue(e.target.value)}
                  placeholder="Локация страны покупки"
                  required
                />
              </label>
              {locationEditValue && (
                <label>
                  <span>Локация аукциона</span>
                  <input
                    className=""
                    type="text"
                    value={locationCopartEditValue}
                    onChange={(e) => setLocationCopartEditValue(e.target.value)}
                    placeholder="Локация аукциона"
                    required
                  />
                </label>
              )}

              <div className="customCheckPicker">
                <span className="titleCheckPicker">Порт погрузки</span>

                <CheckPicker
                  value={selectValueEditPorts}
                  onChange={setSelectValueEditPorts}
                  data={dataPorts.map((item) => {
                    return { label: item.name, value: item.id }
                  })}
                />
              </div>

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
          open={isModalShow}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить локацию</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createLocation}>
              {/* <h2>Добавить локацию</h2> */}
              <label>
                <span>Аукцион</span>
                <select
                  value={selectValueAuctions}
                  onChange={(event) =>
                    setSelectValueAuctions(event.target.value)
                  }
                >
                  {dataAuctions.map((elem) => {
                    return (
                      <option key={elem.id} value={elem.id}>
                        {elem.name}
                      </option>
                    )
                  })}
                </select>
              </label>
              <label>
                <span>Локация страны покупки</span>
                <input
                  className=""
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Локация страны покупки"
                  required
                />
              </label>
              {locationValue && (
                <label>
                  <span>Локация аукциона</span>
                  <input
                    className=""
                    type="text"
                    value={locationCopartValue}
                    onChange={(e) => setLocationCopartValue(e.target.value)}
                    placeholder="Локация аукциона"
                    required
                  />
                </label>
              )}

              {/* <label>
								<span>Порт</span>
								<select
									value={selectValuePorts}
									onChange={(event) => setSelectValuePorts(event.target.value)}
								>
									{dataPorts.map((elem) => {
										return (
											<option key={elem.id} value={elem.id}>
												{elem.name}
											</option>
										)
									})}
								</select>
							</label> */}

              <div className="customCheckPicker">
                <span className="titleCheckPicker">Порт погрузки</span>

                <CheckPicker
                  value={selectValuePorts}
                  onChange={setSelectValuePorts}
                  data={dataPorts.map((item) => {
                    return { label: item.name, value: item.id }
                  })}
                />
              </div>

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      <div className="itemContainer-inner">
        <div className="top-item " style={styleTopItem}>
          <div className="groupSearch">
            <div className="customCheckPicker">
              {/* <label htmlFor="selectCustomId">Название площадки</label> */}
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
            <div className="customCheckPicker">
              {/* <label htmlFor="selectCustomId">Порт</label> */}

              <SelectPicker
                id="selectCustomId"
                data={dataPorts}
                valueKey="id"
                labelKey="name"
                value={portSearch}
                onChange={setPortSearch}
                placeholder="Выберите порт"
                loading={!dataPorts.length}
              />
            </div>
          </div>
          <div className="btnTransport">
            <button
              className="btnInfo"
              onClick={() => setIsModalShow(!isModalShow)}
            >
              <span>Добавить</span>
            </button>
          </div>
        </div>
        <div className="bottom-itemFooter" style={styleBottomItemFooter}>
          {dataMaster.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataMaster}
                loading={loadingShow}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Локация страны покупки</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          {<span>{rowData.name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Локация аукциона</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          {<span>{rowData.copart_name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порт погрузки</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          {viewPorts(rowData.ports)}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Аукцион</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          {rowData.auction.name}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" flexGrow={1}>
                  <HeaderCell>Действие</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <div className="Dropdown">
                            <div className="DropdownShow">
                              {viewBlock(109) && (
                                <button
                                  onClick={() => {
                                    showIdLocation(rowData)
                                  }}
                                >
                                  <Edit />
                                </button>
                              )}
                              {viewBlock(110) && (
                                <button
                                  onClick={() => {
                                    // remove(rowData.id)
                                    setItemIsRemove(rowData.id)
                                    setIsModalRemove(true)
                                  }}
                                >
                                  <Trash />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
              </Table>
              {dataMaster.length > 0 && (
                <div className="paginationBlock">
                  <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    // boundaryLinks
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
              )}
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default Location
