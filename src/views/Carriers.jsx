import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'
import { Edit, Trash } from '@rsuite/icons'

import 'rsuite-table/dist/css/rsuite-table.css'
import { Modal } from 'rsuite'

import 'react-toastify/dist/ReactToastify.css'

import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

const Carriers = (props) => {
  const [dataPartners, setDataPartners] = useState([])

  const [idEdit, setIdEdit] = useState('')
  const [isModalShowAdd, setIsModalShowAdd] = useState(false)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [nameAgent, setNameAgent] = useState('')
  const [viewControler, setViewControler] = useState([])

  const { state, dispatch } = useContext(ContextApp)

  const remove = (id) => {
    dispatch(showLoder({ remove: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/carriers/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удален!', 'success')
          getArray()

          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0 }))
      })
  }

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/carriers`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPartners(res.carriers)

        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataPartners([])
        dispatch(showLoder({ getArray: 0 }))
      })
  }

  useEffect(() => {
    getArray()
  }, [])

  const showIdLocation = (id, name, code) => {
    setIdEdit(id)
    setNameAgent(name)

    setIsModalShowEdit(!isModalShowEdit)
  }

  let params = {
    title: nameAgent,
    code: 'test',
  }

  const createAgent = (e) => {
    dispatch(showLoder({ createAgent: 1 }))
    e.preventDefault()
    setIsModalShowAdd(false)
    postRequest('/api/v1/carriers', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')

        getArray()
        close()

        // setLocationValue('')
        dispatch(showLoder({ createAgent: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createAgent: 0 }))
      })
  }
  const editAgent = (e) => {
    dispatch(showLoder({ editAgent: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)

    putRequest(`/api/v1/carriers/${idEdit}`, params)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getArray()
        close()

        dispatch(showLoder({ editAgent: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editAgent: 0 }))
      })
  }
  // const handleChangeLimit = (dataKey) => {
  // 	setPage(1)
  // 	setLimit(dataKey)
  // }
  const close = () => {
    setNameAgent('')
    setIdEdit('')

    setIsModalShowAdd(false)
    setIsModalShowEdit(false)
    setIsModalRemove(false)
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
      ).includes('carrier')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).carrier.access_rights

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
            <Modal.Title>Удаление перевозчика</Modal.Title>
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
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Редактировать перевозчика</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editAgent}>
              <label>
                <span>Название</span>
                <input
                  className=""
                  type="text"
                  value={nameAgent}
                  onChange={(e) => setNameAgent(e.target.value)}
                  placeholder="Название"
                  required
                />
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
          open={isModalShowAdd}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить перевозчика</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createAgent}>
              <label>
                <span>Название</span>
                <input
                  className=""
                  type="text"
                  value={nameAgent}
                  onChange={(e) => setNameAgent(e.target.value)}
                  placeholder="Название"
                  required
                />
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
          style={{ paddingLeft: state.width, justifyContent: 'right' }}
        >
          <div className="btnTransport">
            {/* <h1 className='titleInfo'>Посредники</h1> */}
            {viewBlock(111) && (
              <button
                className="btnInfo"
                onClick={() => setIsModalShowAdd(!isModalShowAdd)}
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
                  <HeaderCell>Перевозчики</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span
                          onClick={() =>
                            viewBlock(112) &&
                            showIdLocation(rowData.id, rowData.title)
                          }
                        >
                          {<span>{rowData.title}</span>}
                        </span>
                      )
                    }}
                  </Cell>
                </Column>

                {(viewBlock(112) || viewBlock(113)) && (
                  <Column align="center" flexGrow={1}>
                    <HeaderCell>Действие</HeaderCell>
                    <Cell>
                      {(rowData, rowIndex) => {
                        return (
                          <div>
                            <div className="Dropdown">
                              <div className="DropdownShow">
                                {viewBlock(112) && (
                                  <button
                                    onClick={() =>
                                      showIdLocation(
                                        rowData.id,
                                        rowData.title,
                                        rowData.code
                                      )
                                    }
                                  >
                                    <Edit />
                                  </button>
                                )}

                                {viewBlock(113) && (
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
export default Carriers
