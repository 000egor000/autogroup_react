import React, { useState, useContext, useEffect } from 'react'

import { Table, Column, HeaderCell, Cell } from 'rsuite-table'

import 'rsuite-table/dist/css/rsuite-table.css'

import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import NoData from '../components/NoData'
import { Edit, Trash } from '@rsuite/icons'
import { toast, ToastContainer } from 'react-toastify'
import { Modal, SelectPicker, Checkbox } from 'rsuite'

const ListOfAuctions = () => {
  const { state, dispatch } = useContext(ContextApp)
  const [countrySelect, setCountrySelect] = useState('')
  const [dataCountries, setDataCountries] = useState([])
  const [auctionArray, seAuctionArray] = useState([])
  const [idEdit, setIdEdit] = useState('')
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [itemIsRemove, setItemIsRemove] = useState('')
  const [is_default, setIs_default] = useState(0)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [auctionName, setAuctionName] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    dispatch(showLoder({ countries: 1 }))
    getRequest('/api/v1/countries', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterAray = res.countries.filter((item) => item.is_buyed)
        setDataCountries(filterAray)
        dispatch(showLoder({ countries: 0 }))
      })
      .catch((err) => dispatch(showLoder({ countries: 0, status: err.status })))
  }, [])

  const remove = (id) => {
    dispatch(showLoder({ removaAuction: 1 }))
    setIsModalRemove(false)

    deleteRequest(`/api/v1/auctions/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно удалено!', 'success')
          getArray()
          dispatch(showLoder({ removaAuction: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ removaAuction: 0, status: err.status }))
      })
  }
  const getArray = () => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        seAuctionArray(res.auction)

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0, status: err.status }))
      })
  }
  useEffect(() => {
    dispatch(showLoder({ auctions: 1 }))
    getRequest('/api/v1/auctions', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        seAuctionArray(res.auction)

        dispatch(showLoder({ auctions: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ auctions: 0, status: err.status }))
      })
  }, [])

  let params = {
    name: auctionName,
    country_id: countrySelect,
    code,
    is_default: is_default ? 1 : 0,
  }

  const createAuction = (e) => {
    dispatch(showLoder({ createAuction: 1 }))
    e.preventDefault()
    setIsModalShow(false)
    postRequest('/api/v1/auctions', params)
      .then(() => {
        state.createNotification('Успешно выполнено!', 'success')
        getArray()
        close()

        dispatch(showLoder({ createAuction: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ createAuction: 0, status: err.status }))
      })
  }
  const editAuction = (e) => {
    dispatch(showLoder({ editAuction: 1 }))
    e.preventDefault()
    setIsModalShowEdit(false)
    putRequest(`/api/v1/auctions/${idEdit}`, params)
      .then(() => {
        state.createNotification('Успешно изменено!', 'success')
        getArray()
        close()
        dispatch(showLoder({ editAuction: 0 }))
      })
      .catch((err) => {
        state.createNotification('Проверьте веденные данные!', 'error')
        dispatch(showLoder({ editAuction: 0, status: err.status }))
      })
  }
  const close = () => {
    setIsModalRemove(false)
    setIsModalShowEdit(false)
    setIsModalShow(false)
    setAuctionName('')
    setCode('')
    setIs_default(0)
  }
  const showIdAuction = ({ name, id, country_id, code, is_default }) => {
    setAuctionName(name ? name : '')
    setCountrySelect(country_id)
    setCode(code)

    setIdEdit(id ? id : '')
    setIsModalShowEdit(!isModalShowEdit)
    setIs_default(is_default)
  }
  const styleTopItem = {
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: `10px 60px 0 ${state.width}`,
  }
  const styleBottomItemFooter = {
    paddingLeft: state.width,
    color: 'black',
    marginTop: '15px',
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
            <Modal.Title>Удаление аукциона </Modal.Title>
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
            <Modal.Title>Редактировать аукцион</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={editAuction}>
              <label>
                <span>Аукцион </span>
                <input
                  className=""
                  type="text"
                  value={auctionName}
                  onChange={(e) => setAuctionName(e.target.value)}
                  placeholder="Аукцион"
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
              {dataCountries.length > 0 ? (
                <div className="customCheckPicker">
                  <span className="titleCheckPicker">Страна</span>

                  <SelectPicker
                    id="selectCustomId"
                    data={dataCountries}
                    valueKey="id"
                    labelKey="name_ru"
                    value={countrySelect}
                    onChange={setCountrySelect}
                    placeholder="Выберите страну"
                    loading={!dataCountries.length}
                    style={{ width: '60%' }}
                    required
                  />
                </div>
              ) : (
                'Нет данных'
              )}
              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Значение по умолчанию</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={is_default}
                  checked={is_default}
                  onChange={(e) => {
                    setIs_default(!is_default)
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
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить аукцион</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createAuction}>
              <label>
                <span>Аукцион</span>
                <input
                  className=""
                  type="text"
                  value={auctionName}
                  onChange={(e) => setAuctionName(e.target.value)}
                  placeholder="Аукцион"
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
              {dataCountries.length > 0 ? (
                <div className="customCheckPicker">
                  <span className="titleCheckPicker">Страна</span>

                  <SelectPicker
                    id="selectCustomId"
                    data={dataCountries}
                    valueKey="id"
                    labelKey="name_ru"
                    value={countrySelect}
                    onChange={setCountrySelect}
                    placeholder="Выберите страну"
                    loading={!dataCountries.length}
                    style={{ width: '60%' }}
                    required
                  />
                </div>
              ) : (
                'Нет данных'
              )}
              <div className="customCheckbox">
                <label htmlFor="valDef">
                  <span>Значение по умолчанию</span>
                </label>
                <Checkbox
                  id="valDef"
                  value={is_default}
                  checked={is_default}
                  onChange={(e) => {
                    setIs_default(!is_default)
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
          {auctionArray.length > 0 ? (
            <div className="Table">
              <Table
                autoHeight
                cellBordered={true}
                hover={true}
                bordered={true}
                data={auctionArray}
              >
                <Column align="center" fixed width={100}>
                  <HeaderCell>По умолчанию</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return (
                        <span>
                          <Checkbox
                            id="valDef"
                            checked={rowData.is_default}
                            disabled
                          />
                        </span>
                      )
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed>
                  <HeaderCell></HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return <span>{rowIndex + 1}</span>
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={0.5}>
                  <HeaderCell>Аукцион</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return <span>{rowData.name}</span>
                    }}
                  </Cell>
                </Column>
                <Column align="center" fixed flexGrow={0.5}>
                  <HeaderCell>Код</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return <span>{rowData.code}</span>
                    }}
                  </Cell>
                </Column>

                <Column align="center" fixed flexGrow={0.5}>
                  <HeaderCell>Страна</HeaderCell>
                  <Cell>
                    {(rowData, rowIndex) => {
                      return <span>{rowData.country.name_ru}</span>
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
                                  showIdAuction(rowData)
                                }}
                              >
                                <Edit />
                              </button>
                              <button
                                onClick={() => {
                                  // remove(rowData.id)
                                  setItemIsRemove(rowData.id)
                                  setIsModalRemove(true)
                                }}
                              >
                                <Trash />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </Cell>
                </Column>
              </Table>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </div>
  )
}
export default ListOfAuctions
