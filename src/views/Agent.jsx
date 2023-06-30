import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import 'rsuite-table/dist/css/rsuite-table.css'
import { Modal } from 'rsuite'

import 'react-toastify/dist/ReactToastify.css'

import { getRequest, deleteRequest } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

import { useNavigate } from 'react-router-dom'
const Agent = () => {
  const [dataPartners, setDataPartners] = useState([])

  const [idEdit, setIdEdit] = useState('')
  const navigate = useNavigate()

  const [isModalRemove, setIsModalRemove] = useState(false)

  const [viewControler, setViewControler] = useState([])

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    setIsModalRemove(false)
    dispatch(showLoder({ remove: 1 }))

    deleteRequest(`/api/v1/partners/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('успешно удалено!', 'success')
          getArray()

          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0, status: err.status }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/partners`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPartners(res.partners)

        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getArray: 0, status: err.status }))
        setDataPartners([])
      })
  }

  useEffect(() => {
    getArray()
  }, [])

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  const controlRoleView = () => {
    if (
      Object.keys(
        JSON.parse(window.sessionStorage.getItem('access_rights'))
      ).includes('partners')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).partners.access_rights

      setViewControler(initialValue)
    }
  }

  const viewBlock = (id) => {
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
          onClose={() => setIsModalRemove(false)}
        >
          <Modal.Header>
            <Modal.Title>Удаление партнера</Modal.Title>
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

      <div className="itemContainer-inner">
        <div
          className="top-item "
          style={{ paddingLeft: state.width, justifyContent: 'right' }}
        >
          <div className="btnTransport">
            {viewBlock(101) && (
              <button
                className="btnInfo"
                onClick={() => navigate('/agentAddProfile')}
              >
                <span>Добавить</span>
              </button>
            )}
          </div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          {dataPartners.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={dataPartners}
              >
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Наименование компании</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(102) &&
                            navigate(`/agentProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.name}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Адрес регистрации</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(102) &&
                            navigate(`/agentProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.address}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Контактное лицо</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(102) &&
                            navigate(`/agentProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.contact}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Номер телефона</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(102) &&
                            navigate(`/agentProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.phone}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>Мессенджер</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(102) &&
                            navigate(`/agentProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.messenger}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={1}>
                  <HeaderCell>E-mail</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(102) &&
                            navigate(`/agentProfile/${rowData.id}`)
                          }
                        >
                          {<span>{rowData.email}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                {(viewBlock(102) || viewBlock(103)) && (
                  <Column align="center" flexGrow={1}>
                    <HeaderCell>Действие</HeaderCell>
                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <div>
                            <div className="Dropdown">
                              <div className="DropdownShow">
                                {viewBlock(102) && (
                                  <button
                                    onClick={() =>
                                      navigate(`/agentProfile/${rowData.id}`)
                                    }
                                  >
                                    <Edit />
                                  </button>
                                )}

                                {viewBlock(103) && (
                                  <button
                                    onClick={() => {
                                      setIdEdit(rowData.id)
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
                )}
              </Table>
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
            'Нет данных!'
          )}
        </div>
      </div>
    </div>
  )
}
export default Agent
