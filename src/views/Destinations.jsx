import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import { Pagination, SelectPicker, CheckPicker, Modal } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'
import {viewDestinations} from './../helper'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const Destinations = (props) => {
  const [dataMaster, setDataMaster] = useState([])
  const [dataPlaceDestinations, setDataPlaceDestinations] = useState([])
  const partsLimit = [20, 50, 100]

  const [locationEditValue, setLocationEditValue] = useState('')
  const [locationCodeEditValue, setLocationCodeEditValue] = useState('')
  const [dataCountries, setDataCountries] = useState([])
  const [countrySelect, setCountrySelect] = useState(0)

  const [
    selectValueEditPlaceDestinations,
    setSelectValueEditPlaceDestinations,
  ] = useState([])
  const [idEdit, setIdEdit] = useState('')

  const [paginationValue, setPaginationValue] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [locationValue, setLocationValue] = useState('')
  const [locationValueCode, setLocationValueCode] = useState('')
  const [selectValuePlaceDestinations, setSelectValuePlaceDestinations] =
    useState(1)
  const [destinationsSelect, setDestinationsSelect] = useState('')
  const [destinationsArray, setDestinationsArray] = useState([])

  const [viewControler, setViewControler] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ removeDestinations: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/destinations/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удален!', 'success')
          getArray()
          getCountries()
          getPlaceDestinations()
          dispatch(showLoder({ removeDestinations: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ removeDestinations: 0 }))
      })
  }

  const getCountries = () => {
    dispatch(showLoder({ offices: 1 }))
    getRequest('/api/v1/countries', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
        .then((res) => {

          setDataCountries(res.countries)

          setCountrySelect(JSON.stringify(res.countries[0]))
          dispatch(showLoder({ offices: 0 }))
        })
        .catch(() => dispatch(showLoder({ offices: 0 })))
  }
  const getPlaceDestinations = () => {
    dispatch(showLoder({ getPlaceDestinations: 1 }))
    getRequest('/api/v1/place-destinations', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPlaceDestinations(res.placeDestinations)
        setSelectValuePlaceDestinations(res.placeDestinations[0].id)
        dispatch(showLoder({ getPlaceDestinations: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')

        dispatch(showLoder({ getPlaceDestinations: 0 }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/destinations?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.destinations)
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
    getRequest(`/api/v1/destinations?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDestinationsArray(res.destinations)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setDestinationsArray([])
        dispatch(showLoder({ getAllArray: 0 }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  useEffect(() => {
    if (destinationsSelect) {
      dispatch(showLoder({ destinationsSearch: 1 }))
      const nameLocation = destinationsArray.find(
        (el) => el.id === destinationsSelect
      )

      postRequest(`/api/v1/destinations/search`, {
        location_name: nameLocation.title,
      })
        .then((res) => {
          setDataMaster(res.destinations)
          dispatch(showLoder({ destinationsSearch: 0 }))
        })
        .catch((err) => {
          setDataMaster([])
          dispatch(showLoder({ destinationsSearch: 0 }))
          //state.createNotification('Успешно обновлено!', 'error')
        })
    } else {
      getArray()
      getCountries()
    }
  }, [destinationsSelect])

  useEffect(() => {
    getArray()
    getCountries()
    getAllArray()
    getPlaceDestinations()
  }, [page, limit])

  const showIdLocation = (name, code, placeDestinations, id, country) => {
    let resIdPlaceDestinations = []
    if (placeDestinations !== null)
      placeDestinations.map((el) => resIdPlaceDestinations.push(el.id))
    setLocationEditValue(name ? name : '')
    setLocationCodeEditValue(code ? code : '')

    setSelectValueEditPlaceDestinations(
      resIdPlaceDestinations ? resIdPlaceDestinations : ''
    )
    setIdEdit(id ? id : '')
    setIsModalShowEdit(!isModalShowEdit)
  }

  let params = {
    title: locationValue,
    // code: locationValueCode,
    place_destination_id: selectValueEditPlaceDestinations,
    country_id: JSON.parse(countrySelect).id,
  }

  let paramsEdit = {
    title: locationEditValue,
    // code: locationCodeEditValue,
    place_destination_id: selectValueEditPlaceDestinations,
    country_id: JSON.parse(countrySelect).id,
  }

  const createLocation = (e) => {
    dispatch(showLoder({ createLocation: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/destinations', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getArray()
        getCountries()
        getPlaceDestinations()
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
    putRequest(`/api/v1/destinations/${idEdit}`, paramsEdit)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')

        getArray()
        getCountries()
        getPlaceDestinations()
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
    setLocationValueCode('')
    setSelectValueEditPlaceDestinations([])
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
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Удаление порта назначения</Modal.Title>
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
            <Modal.Title>Редактировать порт назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editLocation}>
              {/* <h2>Редактировать порт назначения</h2> */}

              <label>
                <span>Порт назначения</span>
                <input
                  className=""
                  type="text"
                  value={locationEditValue}
                  onChange={(e) => setLocationEditValue(e.target.value)}
                  placeholder="Порт назначения"
                  required
                />
              </label>
              {/*<label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={locationCodeEditValue}
                  onChange={(e) => setLocationCodeEditValue(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>*/}
              <div className="customCheckPicker">
                <span className="titleCheckPicker">Место назначения</span>

                <CheckPicker
                  value={selectValueEditPlaceDestinations}
                  onChange={setSelectValueEditPlaceDestinations}
                  data={dataPlaceDestinations.map((item) => {
                    return { label: item.title, value: item.id }
                  })}
                />
              </div>
              <label>
                <span>Страна</span>
                {dataCountries.length > 0 ? (
                    <select
                        value={countrySelect}
                        onChange={(event) => setCountrySelect(event.target.value)}
                    >
                      {dataCountries.map((elem) => {
                        return (
                            <option
                                key={elem.id + elem.name_ru}
                                value={JSON.stringify(elem)}
                            >
                              {elem.name_ru}
                            </option>
                        )
                      })}
                    </select>
                ) : (
                    <span>Нет данных!</span>
                )}
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
            <Modal.Title>Добавить порт назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createLocation}>
              {/* <h2>Добавить порт назначения</h2> */}

              <label>
                <span>Порт назначения</span>
                <input
                  className=""
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Порт назначения"
                  required
                />
              </label>
              {/*<label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={locationValueCode}
                  onChange={(e) => setLocationValueCode(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>*/}

              <div className="customCheckPicker">
                <span className="titleCheckPicker">Место назначения</span>

                <CheckPicker
                  value={selectValueEditPlaceDestinations}
                  onChange={setSelectValueEditPlaceDestinations}
                  data={dataPlaceDestinations.map((item) => {
                    return { label: item.title, value: item.id }
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
              visibility: destinationsArray.length > 0 ? 'visible' : 'none',
            }}
          >
            <div>
              <label htmlFor="selectCustomId">Название площадки</label>
            </div>
            <div>
              <SelectPicker
                id="selectCustomId"
                data={destinationsArray}
                valueKey="id"
                labelKey="title"
                value={destinationsSelect}
                onChange={setDestinationsSelect}
                placeholder="Выберите площадку"
                loading={!destinationsArray.length}
              />
            </div>
          </div>
          {/*<div className="btnTransport" style={{ marginTop: '10px' }}>
            <button
              className="btnInfo"
              onClick={() => setIsModalShow(!isModalShow)}
            >
              <span>Добавить</span>
            </button>
          </div>*/}
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
                  <HeaderCell>Порт назначения</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) &&
                              showIdLocation(
                                rowData.title,
                                rowData.code,
                                rowData.place_destinations,
                                rowData.id
                              )
                          }}
                        >
                          {<span>{rowData.title}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Место назначения</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) &&
                              showIdLocation(
                                rowData.title,
                                rowData.code,
                                rowData.place_destinations,
                                rowData.id
                              )
                          }}
                        >
                          {viewDestinations(rowData.place_destinations)}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (<span>{rowData.country.name_ru}</span>
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
                                      rowData.title,
                                      rowData.code,
                                      rowData.place_destinations,
                                      rowData.id,
                                      rowData.country
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
            'Нет портов назначения!'
          )}
        </div>
      </div>
    </div>
  )
}
export default Destinations
