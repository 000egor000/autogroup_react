import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import {Pagination, Modal, Checkbox, Whisper, Tooltip} from 'rsuite'
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
import {getDateFunc, viewDestinations, viewPorts} from "../helper";
import {Link} from "react-router-dom";

const ListOfCountries = (props) => {
  // params
  const [dataCountries, setDataCountries] = useState([])
  const [auctionArray, setAuctionArray] = useState([])

  const [name_ru, setName_ru] = useState('')
  const [idEdit, setIdEdit] = useState('')
  const [short_name_ru, setShort_name_ru] = useState('')

  const [is_buyed, setIs_buyed] = useState(0)
  const [is_destination, setIs_destination] = useState(0)

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
    deleteRequest(`/api/v1/countries/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')
          getСountries()

          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0 }))
      })
  }

  const getСountries = () => {
    dispatch(showLoder({ getСountries: 1 }))
    getRequest(`/api/v1/countries?page=${page}&limit=${limit}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataCountries(res.countries)
        setPaginationValue(res.pagination)
        dispatch(showLoder({ getСountries: 0 }))
      })
      .catch(() => dispatch(showLoder({ getСountries: 0 })))
  }
  const getAuctions = () => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAuctionArray(res.auction)

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0 }))
      })
  }
  useEffect(() => {
    getAuctions()
  }, [])

  useEffect(() => {
    getСountries()
  }, [page, limit])

  const showEditCountry = ({
    name_ru,
    short_name_ru,
    id,
    is_buyed,
    is_destination,
  }) => {
    setIsModalShowEdit(true)
    setName_ru(name_ru)
    setShort_name_ru(short_name_ru)
    setIdEdit(id)

    setIs_buyed(is_buyed)
    setIs_destination(is_destination)
  }

  const params = {
    name_ru,
    short_name_ru,
    is_buyed,
    is_destination,
  }

  const createCountry = (e) => {
    dispatch(showLoder({ createCountry: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/countries', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getСountries()

        close()
        dispatch(showLoder({ createCountry: 0 }))
      })
      .catch((e) => {
        state.createNotification('Проверьте данные!', 'error')
        dispatch(showLoder({ createCountry: 0 }))
      })
  }

  const editCountry = (e) => {
    dispatch(showLoder({ editCountry: 1 }))
    e.preventDefault()

    const isValidate = auctionArray.find((item) => item.country.id === idEdit)

    if (isValidate && !is_buyed) {
      dispatch(showLoder({ editCountry: 0 }))
      state.createNotification('Страна покупки привязана к аукциону!', 'info')
    } else {
      putRequest(`/api/v1/countries/${idEdit}`, params)
        .then(() => {
          state.createNotification('Успешно выполнено!', 'success')
          getСountries()
          setIsModalShowEdit(false)
          close()
          dispatch(showLoder({ editCountry: 0 }))
        })
        .catch((err) => {
          state.createNotification('Проверьте веденные данные!', 'error')

          dispatch(showLoder({ editCountry: 0 }))
        })
    }
  }
  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }
  const close = () => {
    setIsModalRemove(false)
    setIsModalShowEdit(false)
    setIsModalShow(false)
    setName_ru('')
    setShort_name_ru('')
    setIdEdit('')
    setIs_buyed(0)
    setIs_destination(0)
  }
  const controlToolTip = ({ data, title, limit }) =>
      String(title).length >= limit ? (
          <Whisper
              followCursor
              placement="right"
              speaker={<Tooltip>{title}</Tooltip>}
          >

          <span
              onClick={() => {
                // viewBlock(109) &&
                showEditCountry(data)
              }}
          >
              <span>
          {String(title).slice(0, limit)}</span>
        </span>
          </Whisper>
      ) : (
          <span
              onClick={() => {
                  // viewBlock(109) &&
                  showEditCountry(data)
              }}
          >
              <span>{title}</span>
        </span>
      )
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
            <Modal.Title>Удаление страны</Modal.Title>
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
            <Modal.Title>Редактировать страну</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editCountry}>
              {/* <h2>Редактировать порт назначения</h2> */}

              <label>
                <span>Страна</span>
                <input
                  className=""
                  type="text"
                  value={name_ru}
                  onChange={(e) => setName_ru(e.target.value)}
                  placeholder="Страна"
                  required
                />
              </label>
              <label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={short_name_ru}
                  onChange={(e) => setShort_name_ru(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>
              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Страна покупки</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={is_buyed}
                  checked={is_buyed}
                  onChange={(e) => {
                    setIs_buyed(!is_buyed)
                  }}
                />
              </div>
              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Страна назначения</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={is_destination}
                  checked={is_destination}
                  onChange={(e) => {
                    setIs_destination(!is_destination)
                  }}
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
          onClose={close}
        >
          <Modal.Header>
            <Modal.Title>Добавить страну</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createCountry}>
              {/* <h2>Добавить порт назначения</h2> */}

              <label>
                <span>Страна</span>
                <input
                  className=""
                  type="text"
                  value={name_ru}
                  onChange={(e) => setName_ru(e.target.value)}
                  placeholder="Страна"
                  required
                />
              </label>
              <label>
                <span>Код</span>
                <input
                  className=""
                  type="text"
                  value={short_name_ru}
                  onChange={(e) => setShort_name_ru(e.target.value)}
                  placeholder="Код"
                  required
                />
              </label>
              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Страна покупки</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={is_buyed}
                  checked={is_buyed}
                  onChange={(e) => {
                    setIs_buyed(!is_buyed)
                  }}
                />
              </div>
              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Страна назначения</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={is_destination}
                  checked={is_destination}
                  onChange={(e) => {
                    setIs_destination(!is_destination)
                  }}
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
          {dataCountries.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataCountries}
                loading={!dataCountries.length > 0}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() => {
                            // viewBlock(109) &&
                            showEditCountry(rowData)
                          }}
                        >
                          {<span>{rowData.name_ru}</span>}
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
                            showEditCountry(rowData)
                          }}
                        >
                          {<span>{rowData.short_name_ru}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна покупки</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span onClick={() => {}}>
                          <Checkbox checked={rowData.is_buyed} disabled />
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Страна назначения</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                          <span
                              onClick={() => {
                                // viewBlock(109) &&
                                // showEditCountry(rowData)
                              }}
                          >
                          <Checkbox checked={rowData.is_destination} disabled />
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порты погрузки</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return controlToolTip({
                        data: rowData,
                        title: viewPorts(rowData.ports),
                        limit: 15,
                      })
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Порты назначения</HeaderCell>
                  <Cell>
                      {(rowData, rowIndex) => {
                          return controlToolTip({
                              data: rowData,
                              title: viewDestinations(rowData.destinations),
                              limit: 15,
                          })
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
                                  showEditCountry(rowData)
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
              {dataCountries.length >= limit && (
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
export default ListOfCountries
