import React, { useState, useContext, useEffect } from 'react'

import { Reload, Trash } from '@rsuite/icons'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import 'rsuite-table/dist/css/rsuite-table.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from 'rsuite'

import { postRequest, getRequest } from '../../base/api-request'
import ContextApp from '../../context/contextApp'
import { showLoder } from '../../reducers/actions'

const Archive = () => {
  const [dataMaster, setDataMaster] = useState([])
  const [valueSelect, setValueSelect] = useState(0)
  // const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)

  const { state, dispatch } = useContext(ContextApp)
  const [open, setOpen] = useState(false)
  const [itemIsRemove, setItemIsRemove] = useState('')
  const [viewControler, setViewControler] = useState([])

  const reloadUser = (user, id) => {
    setOpen(false)
    dispatch(showLoder({ reloadUser: 1 }))
    postRequest(`/api/v1/${user}s/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          toast.success('Пользователь успешно возвращен!')
          getArray(user)
          dispatch(showLoder({ reloadUser: 0 }))
        }
      })
      .catch((err) => {
        toast.error('Что-то пошло не так!')
        dispatch(showLoder({ reloadUser: 0 }))
      })
  }

  useEffect(() => {
    getArray()
  }, [page])

  const getArray = (user) => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest(`/api/v1/user/archive?page=${page}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataMaster(res.users)
        // setPaginationValue(res.pagination)

        // Object.entries(res.users).filter((elem) => console.log(elem[0]))
        if (user) {
          let resultFist = Object.entries(res.users).filter(
            (elem) => elem[0] === user
          )
          let resultSecond = Object.entries(res.users).filter(
            (elem) => elem[0] === Object.keys(res.users)[1]
          )

          if (resultFist.length > 0) {
            setValueSelect(
              JSON.stringify({
                nameGroup: resultFist[0][0],
                nameGroupRemove: resultFist[0][1],
              })
            )
          } else {
            setValueSelect(
              JSON.stringify({
                nameGroup: resultSecond[0][0],
                nameGroupRemove: resultSecond[0][1],
              })
            )
          }
        } else {
          setValueSelect(
            JSON.stringify({
              nameGroup: Object.entries(res.users)[0][0],
              nameGroupRemove: Object.entries(res.users)[0][1],
            })
          )
        }
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataMaster([])
        dispatch(showLoder({ getArray: 0 }))
      })
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
      ).includes('archive')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).archive.access_rights

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
          open={open}
          onClose={() => setOpen(false)}
        >
          <Modal.Header>
            <Modal.Title>Возвратить пользователя</Modal.Title>
          </Modal.Header>

          <Modal.Body>Вы действительно хотите возвратить?</Modal.Body>
          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() => reloadUser(itemIsRemove.user, itemIsRemove.id)}
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => setOpen(false)}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="btnTransport">
            <div className="btnTransportLeft">
              {/* <h1 className='titleInfo'>Пользователи: в архиве</h1> */}
            </div>
          </div>
        </div>

        <div className="bottom-itemFooter" style={{ paddingLeft: state.width }}>
          <div className="masterCreate--inner">
            <div className="rights-setting">
              <select
                value={valueSelect}
                onChange={(event) => setValueSelect(event.target.value)}
              >
                {Object.entries(dataMaster).map((elem) => {
                  return (
                    <option
                      key={elem.id + elem}
                      value={JSON.stringify({
                        nameGroup: elem[0],
                        nameGroupRemove: elem[1],
                      })}
                    >
                      {elem[0] === 'master'
                        ? 'Мастер'
                        : elem[0] === 'dealer'
                        ? 'Дилер'
                        : elem[0] === 'finance'
                        ? 'Финансы'
                        : elem[0] === 'office'
                        ? 'Офис'
                        : elem[0] === 'logist'
                        ? 'Логист'
                        : elem[0] === 'sub_user'
                        ? 'Субпользователь'
                        : null}
                    </option>
                  )
                })}
              </select>
              <div
                className="rights-setting-data"
                style={{ flexDirection: 'column' }}
              >
                {valueSelect ? (
                  <React.Fragment>
                    <div
                      className="Table"
                      style={{ position: 'relative', top: '-10px' }}
                    >
                      <Table
                        autoHeight
                        cellBordered={true}
                        hover={true}
                        bordered={true}
                        data={JSON.parse(valueSelect).nameGroupRemove}
                      >
                        <Column align="center" flexGrow={1}>
                          <HeaderCell>Имя Фамилия</HeaderCell>

                          <Cell>
                            {(rowData, rowIndex) => {
                              return (
                                <div>
                                  <span>
                                    {rowData.name_ru +
                                      ' ' +
                                      rowData.second_name_ru}
                                  </span>
                                </div>
                              )
                            }}
                          </Cell>
                        </Column>
                        <Column align="center" fixed flexGrow={1}>
                          <HeaderCell>Логин/Email</HeaderCell>
                          <Cell>
                            {(rowData, rowIndex) => {
                              return (
                                <div>
                                  <span>{rowData.email}</span>
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
                                      <button
                                        onClick={() => {
                                          // remove(rowData.id)
                                          setItemIsRemove({
                                            user: JSON.parse(valueSelect)
                                              .nameGroup,
                                            id: rowData.id,
                                          })
                                          setOpen(true)
                                        }}
                                      >
                                        <Reload />
                                      </button>
                                      {viewBlock(91) && (
                                        <button>
                                          {/* () => remove(rowData.id) */}
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
                  </React.Fragment>
                ) : (
                  <span>Нет пользователей!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Archive
