import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import { Pagination, SelectPicker, CheckPicker, Modal } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { viewPorts } from './../helper'

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
  const [selectValuePorts, setSelectValuePorts] = useState(1)
  const [selectValueAuctions, setSelectValueAuctions] = useState(1)
  const [locationsSelect, setLocationsSelect] = useState('')
  const [locationsArray, setLocationsArray] = useState([])

  const [viewControler, setViewControler] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ removeLocations: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/locations/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          toast.success('Локация успешно удален!')
          getArray()
          getPorts()
          dispatch(showLoder({ removeLocations: 0 }))
        }
      })
      .catch((err) => {
        toast.error('Что-то пошло не так!')
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
        setSelectValuePorts(res.ports[0].id)
        dispatch(showLoder({ getPorts: 0 }))
      })
      .catch((err) => {
        // toast.error('Что-то пошло не так!')

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
        // toast.error('Что-то пошло не так!')
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
        // toast.error('Что-то пошло не так!')
      })
  }

  useEffect(() => {
    if (locationsSelect) {
      dispatch(showLoder({ locationsSearch: 1 }))
      const nameLocation = locationsArray.find(
        (el) => el.id === locationsSelect
      )

      postRequest(`/api/v1/locations/search`, {
        location_name: nameLocation.name,
      })
        .then((res) => {
          setDataMaster(res.locations)
          dispatch(showLoder({ locationsSearch: 0 }))
        })
        .catch((err) => {
          setDataMaster([])
          dispatch(showLoder({ locationsSearch: 0 }))
          // toast.error('Что-то пошло не так!')
        })
    } else {
      getArray()
    }
  }, [locationsSelect])

  useEffect(() => {
    getArray()
    getAllArray()
    getPorts()
    getAuctions()
  }, [page, limit])

  const showIdLocation = (name, ports, auction_id, id, copart_name) => {
    let resIdPorts = []
    ports.map((el) => resIdPorts.push(el.id))
    setLocationCopartEditValue(copart_name ? copart_name : '')
    setLocationEditValue(name ? name : '')

    setSelectValueEditPorts(resIdPorts ? resIdPorts : '')
    setSelectValueEditAuctions(auction_id ? auction_id : '')
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
        toast.success('Локация успешно добавлена!')
        getArray()
        getPorts()
        close()

        dispatch(showLoder({ createLocation: 0 }))
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
        dispatch(showLoder({ createLocation: 0 }))
      })
  }
  const editLocation = (e) => {
    dispatch(showLoder({ editLocation: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/locations/${idEdit}`, paramsEdit)
      .then(() => {
        toast.success('Локация успешно изменена!')
        getArray()
        getPorts()
        close()
        dispatch(showLoder({ editLocation: 0 }))
      })
      .catch((err) => {
        toast.error('Проверьте веденные данные!')
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

  return (
    <div className="itemContainer">
      <ToastContainer />
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
                <span>Локация</span>
                <input
                  className=""
                  type="text"
                  value={locationEditValue}
                  onChange={(e) => setLocationEditValue(e.target.value)}
                  placeholder="Локация"
                  required
                />
              </label>

              <label>
                <span>Локация Copart</span>
                <input
                  className=""
                  type="text"
                  value={locationCopartEditValue}
                  onChange={(e) => setLocationCopartEditValue(e.target.value)}
                  placeholder="Локация Copart"
                  required
                />
              </label>
              <div className="customCheckPicker">
                <span className="titleCheckPicker">Порт</span>

                <CheckPicker
                  value={selectValueEditPorts}
                  onChange={setSelectValueEditPorts}
                  data={dataPorts.map((item) => {
                    return { label: item.name, value: item.id }
                  })}
                />
              </div>

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
                <span>Локация</span>
                <input
                  className=""
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Локация"
                  required
                />
              </label>

              <label>
                <span>Локация Copart</span>
                <input
                  className=""
                  type="text"
                  value={locationCopartValue}
                  onChange={(e) => setLocationCopartValue(e.target.value)}
                  placeholder="Локация Copart"
                  required
                />
              </label>
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
                <span className="titleCheckPicker">Порт</span>

                <CheckPicker
                  value={selectValueEditPorts}
                  onChange={setSelectValueEditPorts}
                  data={dataPorts.map((item) => {
                    return { label: item.name, value: item.id }
                  })}
                />
              </div>
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

              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{
            paddingLeft: state.width,
            justifyContent: 'space-between',
            alignItems: 'inherit',
          }}
        >
          <div
            style={{
              marginBottom: '30px',
              display: 'flex',
              flexDirection: 'column',
              visibility: locationsArray.length > 0 ? 'visible' : 'none',
            }}
          >
            <div>
              <label htmlFor="selectCustomId">Название площадки</label>
            </div>
            <div>
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
          <div className="btnTransport" style={{ marginTop: '10px' }}>
            <button
              className="btnInfo"
              onClick={() => setIsModalShow(!isModalShow)}
            >
              <span>Добавить</span>
            </button>
          </div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
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
                  <HeaderCell>Локация</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) &&
                              showIdLocation(
                                rowData.name,
                                rowData.ports,
                                rowData.auction.id,
                                rowData.id,
                                rowData.copart_name
                              )
                          }}
                        >
                          {<span>{rowData.name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Локация Copart</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) &&
                              showIdLocation(
                                rowData.name,
                                rowData.ports,
                                rowData.auction.id,
                                rowData.id,
                                rowData.copart_name
                              )
                          }}
                        >
                          {<span>{rowData.copart_name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порт</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) &&
                              showIdLocation(
                                rowData.name,
                                rowData.ports,
                                rowData.auction.id,
                                rowData.id,
                                rowData.copart_name
                              )
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
                            viewBlock(109) &&
                              showIdLocation(
                                rowData.name,
                                rowData.ports,
                                rowData.auction.id,
                                rowData.id,
                                rowData.copart_name
                              )
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
                                    showIdLocation(
                                      rowData.name,
                                      rowData.ports,
                                      rowData.auction.id,
                                      rowData.id,
                                      rowData.copart_name
                                    )
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
              {dataMaster.length >= limit ? (
                <div className="paginationBlock">
                  <Pagination
                    prev
                    next
                    // first
                    // last
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
              ) : (
                ''
              )}
            </div>
          ) : (
            'Нет локаций!'
          )}
        </div>
      </div>
    </div>
  )
}
export default Location
