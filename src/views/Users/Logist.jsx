import React, { useState, useContext, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import 'rsuite-table/dist/css/rsuite-table.css'

import { Modal, Pagination, Tooltip, Whisper } from 'rsuite'

import 'react-toastify/dist/ReactToastify.css'

import { Edit, Trash, CloseOutline, CheckOutline, Exit } from '@rsuite/icons'

import { postRequest, getRequest, deleteRequest } from '../../base/api-request'
import ContextApp from '../../context/contextApp'
import { showLoder } from '../../reducers/actions'

const Logist = () => {
  const [dataMaster, setDataMaster] = useState([])
  const [paginationValue, setPaginationValue] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [itemIsRemove, setItemIsRemove] = useState('')
  const [viewControler, setViewControler] = useState([])
  const [showActive, setShowActive] = useState(false)
  const [idUser, setIdUser] = useState('')
  let navigate = useNavigate()

  const { state, dispatch } = useContext(ContextApp)
  let { title } = JSON.parse(window.sessionStorage.getItem('role'))
  let { email } = JSON.parse(window.sessionStorage.getItem('user'))

  const remove = (id) => {
    setOpen(false)
    dispatch(showLoder({ remove: 1 }))
    deleteRequest(`/api/v1/logists/${id}`)
      .then((res) => {
        state.createNotification('Пользователь успешно удален!', 'success')

        getArray()
        dispatch(showLoder({ remove: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0 }))
      })
  }

  useEffect(() => {
    getArray()
  }, [page])

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/logists?page=${page}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        if (title === 'Мастер перевозки') {
          setDataMaster(res.logists.filter((el) => el.email !== email))
          setPaginationValue(res.pagination - 1)
        } else {
          setDataMaster(res.logists)
          setPaginationValue(res.pagination)
        }

        setLoadingShow(false)
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ getArray: 0 }))
      })
  }

  const setAuth = (userId) => {
    dispatch(showLoder({ setAuth: 1 }))
    postRequest(`/api/v1/user/re-login/${userId}`)
      .then((responseInfo) => {
        sessionStorage.clear()
        const data = responseInfo?.information
        const token = responseInfo?.token

        window.sessionStorage.setItem('token_type', token.token_type)
        window.sessionStorage.setItem('expires_in', token.expires_in)
        window.sessionStorage.setItem('refresh_token', token.refreshToken)
        window.sessionStorage.setItem('access_token', token.accessToken)
        document.cookie = `access_token = ${token.accessToken};`

        window.sessionStorage.setItem('role', JSON.stringify(data.role))
        window.sessionStorage.setItem('user', JSON.stringify(data.user))
        window.sessionStorage.setItem('client', JSON.stringify(data.client))
        window.sessionStorage.setItem(
          'access_rights',
          JSON.stringify(data.access_rights)
        )
        navigate('/')

        dispatch(showLoder({ setAuth: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ setAuth: 0 }))
        state.createNotification('Ошибка при попытке авторизации!', 'error')
      })
  }
  const activationOrUnactivation = (id) => {
    dispatch(showLoder({ active: 1 }))
    postRequest('/api/v1/user/active', { user_id: id })
      .then((res) => {
        getArray()

        state.createNotification('Успешно активирован!', 'success')
        close()
        dispatch(showLoder({ active: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ active: 0 }))
        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  const close = () => {
    setOpen(false)
    setShowActive(false)
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
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
      ).includes('logist')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).logist.access_rights

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
          open={open}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Удаление пользователя</Modal.Title>
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
              onClick={() => close()}
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
          open={showActive}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Активация/деактивация пользователя</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите совершить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => activationOrUnactivation(idUser)}
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
        <div
          className="top-item "
          style={{ paddingLeft: state.width, justifyContent: 'right' }}
        >
          <div className="btnTransport">
            {/* <h1 className='titleInfo'>Пользователи: мастер перевозки</h1> */}
            {viewBlock(76) && (
              <button className="btnInfo">
                <Link to={'/logist/create'}>Добавить мастера перевозки</Link>
              </button>
            )}
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
                  <HeaderCell>Имя Фамилия</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <Link
                            to={viewBlock(77) && `/logist/${rowData.id}/edit`}
                          >
                            <span>
                              {rowData.name_ru + ' ' + rowData.second_name_ru}
                            </span>
                          </Link>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" flexGrow={1}>
                  <HeaderCell>Телефон</HeaderCell>

                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <Link
                            to={viewBlock(77) && `/logist/${rowData.id}/edit`}
                          >
                            <span>{rowData.phone}</span>
                          </Link>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>

                <Column align="center" flexGrow={1}>
                  <HeaderCell>Telegram</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <Link
                            to={viewBlock(77) && `/logist/${rowData.id}/edit`}
                          >
                            <span>{rowData.telegram}</span>
                          </Link>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" flexGrow={1}>
                  <HeaderCell>Email</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <div>
                          <Link
                            to={viewBlock(77) && `/logist/${rowData.id}/edit`}
                          >
                            <span>{rowData.email}</span>
                          </Link>
                        </div>
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
                              {JSON.parse(window.sessionStorage.getItem('role'))
                                .code === 'admin' && (
                                <Whisper
                                  followCursor
                                  placement="left"
                                  speaker={<Tooltip>Авторизоваться</Tooltip>}
                                >
                                  <button
                                    onClick={() => {
                                      // remove(rowData.id)
                                      setAuth(rowData.user_id)
                                      // setOpen(true)
                                    }}
                                  >
                                    <Exit />
                                  </button>
                                </Whisper>
                              )}
                              {viewBlock(77) && (
                                <Whisper
                                  followCursor
                                  placement="left"
                                  speaker={<Tooltip>Редактирование</Tooltip>}
                                >
                                  <button>
                                    <Link to={`/logist/${rowData.id}/edit`}>
                                      <Edit />
                                    </Link>
                                  </button>
                                </Whisper>
                              )}

                              {viewBlock(78) && (
                                <Whisper
                                  followCursor
                                  placement="left"
                                  speaker={<Tooltip>Удаление</Tooltip>}
                                >
                                  <button
                                    onClick={() => {
                                      setItemIsRemove(rowData.id)
                                      setOpen(true)
                                      // remove(rowData.id)
                                    }}
                                  >
                                    <Trash />
                                  </button>
                                </Whisper>
                              )}

                              <Whisper
                                followCursor
                                placement="left"
                                speaker={
                                  <Tooltip>
                                    {rowData.active
                                      ? 'Деактивировать'
                                      : 'Активировать'}
                                  </Tooltip>
                                }
                              >
                                <button
                                  onClick={() => {
                                    setIdUser(rowData.user_id)
                                    setShowActive(true)
                                  }}
                                >
                                  {rowData.active ? (
                                    <CloseOutline />
                                  ) : (
                                    <CheckOutline />
                                  )}
                                </button>
                              </Whisper>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
              </Table>

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
                  layout={['total', 'pager']}
                  total={paginationValue.total_results}
                  limitOptions={[5, 10]}
                  limit={limit}
                  activePage={page}
                  onChangePage={setPage}
                  onChangeLimit={handleChangeLimit}
                />
              </div>
            </div>
          ) : (
            'Нет пользователей!'
          )}
        </div>
      </div>
    </div>
  )
}
export default Logist
