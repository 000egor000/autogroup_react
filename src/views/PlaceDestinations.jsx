import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import { Pagination, SelectPicker, CheckPicker, Modal } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'
import { viewDestinations } from './../helper'
import NoData from '../components/NoData'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const PlaceDestinations = (props) => {
  const [dataMaster, setDataMaster] = useState([])
  const [dataPlaceDestinations, setDataPlaceDestinations] = useState([])
  const partsLimit = [20, 50, 100]

  // const [locationEditValue, setLocationEditValue] = useState('')

  // const [
  //   selectValueEditPlaceDestinations,
  //   setSelectValueEditPlaceDestinations,
  // ] = useState([])
  const [idEdit, setIdEdit] = useState('')

  const [paginationValue, setPaginationValue] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [locationValue, setLocationValue] = useState('')

  const [selectValuePlaceDestinations, setSelectValuePlaceDestinations] =
    useState([])
  const [destinationsSelect, setDestinationsSelect] = useState('')
  const [destinationsArray, setDestinationsArray] = useState([])
  const [dataCountries, setDataCountries] = useState([])
  const [dataCountriesValue, setDataCountriesValue] = useState('')
  const [viewControler, setViewControler] = useState([])

  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [itemIsRemove, setItemIsRemove] = useState('')

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ removeDestinations: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/place-destinations/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')
          getArray()
          getPlaceDestinations()
          dispatch(showLoder({ removeDestinations: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ removeDestinations: 0 }))
      })
  }

  const getPlaceDestinations = () => {
    dispatch(showLoder({ getPlaceDestinations: 1 }))
    getRequest('/api/v1/destinations', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPlaceDestinations(res.destinations)
        // setSelectValuePlaceDestinations(res.destinations[0].id)
        dispatch(showLoder({ getPlaceDestinations: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')

        dispatch(showLoder({ getPlaceDestinations: 0 }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/place-destinations?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.placeDestinations)
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
    getRequest(`/api/v1/place-destinations?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDestinationsArray(res.placeDestinations)
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

      postRequest(`/api/v1/place-destinations/search`, {
        location_name: nameLocation.title,
      })
        .then((res) => {
          setDataMaster(res.placeDestinations)
          dispatch(showLoder({ destinationsSearch: 0 }))
        })
        .catch((err) => {
          setDataMaster([])
          dispatch(showLoder({ destinationsSearch: 0 }))
          //state.createNotification('Успешно обновлено!', 'error')
        })
    } else {
      getArray()
    }
  }, [destinationsSelect])

  useEffect(() => {
    dispatch(showLoder({ getСountries: 1 }))
    getRequest(`/api/v1/countries?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataCountries(res.countries)

        dispatch(showLoder({ getСountries: 0 }))
      })
      .catch(() => dispatch(showLoder({ getСountries: 0 })))
  }, [])

  useEffect(() => {
    getArray()
    getAllArray()
    getPlaceDestinations()
  }, [page, limit])

  const showIdLocation = ({ title, destinations, id, country }) => {
    let resIdPlaceDestinations = []
    if (!!destinations)
      destinations.map((el) => resIdPlaceDestinations.push(el.id))
    setLocationValue(title ? title : '')

    setSelectValuePlaceDestinations(
      resIdPlaceDestinations.length > 0 ? resIdPlaceDestinations : []
    )
    setIdEdit(id ? id : '')
    setIsModalShowEdit(!isModalShowEdit)
    setDataCountriesValue(country.id)
  }

  let params = {
    title: locationValue,
    // code: locationValueCode,
    destination_id: selectValuePlaceDestinations,
    country_id: dataCountriesValue,
  }

  // let paramsEdit = {
  //   title: locationEditValue,
  //   // code: locationCodeEditValue,
  //   destination_id: selectValueEditPlaceDestinations,
  //   country_id: dataCountriesValue,
  // }

  const createLocation = (e) => {
    dispatch(showLoder({ createLocation: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/place-destinations', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getArray()
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
    putRequest(`/api/v1/place-destinations/${idEdit}`, params)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getArray()
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
    setSelectValuePlaceDestinations([])
    setDataCountriesValue('')
    // setLocationEditValue('')
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
            <Modal.Title>Удаление места назначения</Modal.Title>
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
            <Modal.Title>Редактировать место назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editLocation}>
              {/* <h2>Редактировать порт назначения</h2> */}

              <label>
                <span>Место назначения</span>
                <input
                  className=""
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Место назначения"
                  required
                />
              </label>

              <div className="customCheckPicker">
                <span className="titleCheckPicker">Страна</span>

                <SelectPicker
                  data={dataCountries}
                  valueKey="id"
                  labelKey="name_ru"
                  value={dataCountriesValue}
                  onChange={setDataCountriesValue}
                  placeholder="Страна"
                />
              </div>
              <div className="customCheckPicker">
                <span className="titleCheckPicker">Порт назначения</span>

                <CheckPicker
                  value={selectValuePlaceDestinations}
                  onChange={setSelectValuePlaceDestinations}
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
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShow}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить место назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createLocation}>
              {/* <h2>Добавить порт назначения</h2> */}

              <label>
                <span>Место назначения</span>
                <input
                  className=""
                  type="text"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="Место назначения"
                  required
                />
              </label>
              <div className="customCheckPicker">
                <span className="titleCheckPicker">Страна</span>

                <SelectPicker
                  data={dataCountries}
                  valueKey="id"
                  labelKey="name_ru"
                  value={dataCountriesValue}
                  onChange={setDataCountriesValue}
                  placeholder="Страна"
                />
              </div>

              <div className="customCheckPicker">
                <span className="titleCheckPicker">Порт назначения</span>

                <CheckPicker
                  value={selectValuePlaceDestinations}
                  onChange={setSelectValuePlaceDestinations}
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
                  <HeaderCell>Место назначения</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          {<span>{rowData.title}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          <span>{rowData.country.name_ru}</span>
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порт назначения</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            viewBlock(109) && showIdLocation(rowData)
                          }}
                        >
                          {viewDestinations(rowData.destinations)}
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
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default PlaceDestinations
