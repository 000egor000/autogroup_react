import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import { Pagination, Modal } from 'rsuite'
import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'

import NoData from '../components/NoData'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const PortOfLoading = (props) => {
  // params
  const [dataPorts, setDataPorts] = useState([])
  const [name, setName] = useState('')
  const [idEdit, setIdEdit] = useState('')
  const [code, setCode] = useState('')
  const [dataCountries, setDataCountries] = useState([])
  const [countrySelect, setCountrySelect] = useState(0)
  // pagination

  const [paginationValue, setPaginationValue] = useState([])
  const partsLimit = [20, 50, 100]
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)

  // modal
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)

  // const [viewControler, setViewControler] = useState([])

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ remove: 1 }))
    setIsModalRemove(false)
    deleteRequest(`/api/v1/ports/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')
          getPorts()
          getCountries()
          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0 }))
      })
  }
  const getCountries = () => {
    dispatch(showLoder({ offices: 1 }))
    getRequest('/api/v1/countries', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
        .then((res) => {
          const filterAray = res.countries.filter((item) => item.is_buyed)

          setDataCountries(res.countries)

          setCountrySelect(JSON.stringify(res.countries[0]))
          dispatch(showLoder({ offices: 0 }))
        })
        .catch(() => dispatch(showLoder({ offices: 0 })))
  }
  const getPorts = () => {
    dispatch(showLoder({ getPorts: 1 }))
    getRequest(`/api/v1/ports?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPorts(res.ports)
        setPaginationValue(res.pagination)

        dispatch(showLoder({ getPorts: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')

        dispatch(showLoder({ getPorts: 0 }))
      })
  }

  useEffect(() => {
    getPorts()
    getCountries()
  }, [page, limit])

  const showEditPort = ({ name, code, id, country }) => {
    setIsModalShowEdit(true)
    setName(name)
    setCode(code)
    setIdEdit(id)
    console.log(country)
    setCountrySelect(JSON.stringify(country))
    console.log(countrySelect)
    console.log(countrySelect)
  }
console.log(countrySelect)
  const params = {
    name,
    code,
    country_id: JSON.parse(countrySelect).id,
  }

  const createPorts = (e) => {
    dispatch(showLoder({ createLocation: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/ports', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getPorts()
        getCountries()
        close()
        dispatch(showLoder({ createLocation: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте данные!', 'error')
        dispatch(showLoder({ createLocation: 0 }))
      })
  }
  const editPorts = (e) => {
    dispatch(showLoder({ editPorts: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/ports/${idEdit}`, params)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getPorts()
        getCountries()
        close()
        dispatch(showLoder({ editPorts: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editPorts: 0 }))
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
    setName('')
    setCode('')
    setIdEdit('')
  }

  // useEffect(
  //   () =>
  //     window.sessionStorage.getItem('access_rights') !== 'null' &&
  //     controlRoleView(),
  //   [window.sessionStorage.getItem('access_rights')]
  // )

  // let controlRoleView = () => {
  //   if (
  //     Object.keys(
  //       JSON.parse(window.sessionStorage.getItem('access_rights'))
  //     ).includes('location')
  //   ) {
  //     let initialValue = JSON.parse(
  //       window.sessionStorage.getItem('access_rights')
  //     ).location.access_rights

  //     setViewControler(initialValue)
  //   }
  // }

  // let viewBlock = (id) => {
  //   let bool = false
  //   viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
  //   return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
  //     ? true
  //     : bool
  // }
  const styleTopItem = {
    paddingLeft: state.width,
    justifyContent: 'right',
    alignItems: 'inherit',
    marginRight: '10px',
  }
  const styleBottomItemFooter = {
    paddingLeft: state.width,
    color: 'black',
  }

  return (
    <div className="itemContainer">
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalRemove}
          onClose={close}
        >
          <Modal.Header>
            <Modal.Title>Удаление порта погрузки</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите удалить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => remove(idEdit)}
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
          onClose={close}
        >
          <Modal.Header>
            <Modal.Title>Редактировать порт назначения</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editPorts}>
              {/* <h2>Редактировать порт назначения</h2> */}

              <label>
                <span>Порт погрузки</span>
                <input
                  className=""
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Порт погрузки"
                  required
                />
              </label>
              <label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>
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
          onClose={close}
        >
          <Modal.Header>
            <Modal.Title>Добавить порт погрузки</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createPorts}>
              {/* <h2>Добавить порт назначения</h2> */}

              <label>
                <span>Порт погрузки</span>
                <input
                  className=""
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Порт погрузки"
                  required
                />
              </label>
              <label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>
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

      <div className="itemContainer-inner">
        <div className="top-item " style={styleTopItem}>
          <div className="btnTransport">
            {/*<button
              className="btnInfo"
              onClick={() => setIsModalShow(!isModalShow)}
            >
              <span>Добавить</span>
            </button>*/}
          </div>
        </div>
        <div className="bottom-itemFooter" style={styleBottomItemFooter}>
          {dataPorts.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataPorts}
                loading={!dataPorts.length > 0}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порт погрузки</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            // viewBlock(109) &&
                            showEditPort(rowData)
                          }}
                        >
                          {<span>{rowData.name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Код</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            // viewBlock(109) &&
                            showEditPort(rowData)
                          }}
                        >
                          {<span>{rowData.code}</span>}
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
                  <HeaderCell>Действия</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <div className="Dropdown">
                            <div className="DropdownShow">
                              {/* {viewBlock(109) && ( */}
                              <button
                                onClick={() => {
                                  showEditPort(rowData)
                                }}
                              >
                                <Edit />
                              </button>
                              {/* // )} */}
                              {/* {viewBlock(110) && ( */}
                              <button
                                onClick={() => {
                                  setIdEdit(rowData.id)
                                  setIsModalRemove(true)
                                }}
                              >
                                <Trash />
                              </button>
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
              </Table>
              {dataPorts.length >= limit && (
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
export default PortOfLoading
