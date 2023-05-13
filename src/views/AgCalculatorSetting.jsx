import React, { useState, useContext, useEffect } from 'react'

import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from '../base/api-request'
import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'
import { toast, ToastContainer } from 'react-toastify'

import { Modal } from 'rsuite'
import { Edit, Trash } from '@rsuite/icons'

const AgCalculatorSetting = () => {
  const { state, dispatch } = useContext(ContextApp)
  const [settingArray, setSettingArray] = useState([])
  const [newSettingTitle, setNewSettingTitle] = useState('')
  const [settingValueCustom, setSettingValueCustom] = useState(0)
  const [settingNameCustom, setSettingNameCustom] = useState('')
  const [settingIdCustom, setSettingIdCustom] = useState(0)
  const [newSettingValue, setNewSettingValue] = useState(0)
  const [isModalShowEdit, setIsModalShowEdit] = useState(false)
  const [isModalShow, setIsModalShow] = useState(false)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [itemIsRemove, setItemIsRemove] = useState('')

  const remove = (id) => {
    setIsModalRemove(false)
    dispatch(showLoder({ remove: 1 }))
    deleteRequest(`/api/v1/server-setting/${id}`)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Настройка удалена!', 'success')
          getInfo()
          dispatch(showLoder({ remove: 0 }))
        }
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ remove: 0 }))
      })
  }
  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = () => {
    dispatch(showLoder({ getInfo: 1 }))
    getRequest('/api/v1/server-setting?group=ag_calculator', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        if (res.settings) {
          setSettingArray(res.settings)
        }
        dispatch(showLoder({ getInfo: 0 }))
      })
      .catch((err) => {
        setSettingArray([])
        dispatch(showLoder({ getInfo: 0 }))
      })
  }

  let paramsEdit = {
    title: settingNameCustom,
    value: settingValueCustom,
    group: 'ag_calculator',
  }
  const setSettingValue = (e) => {
    e.preventDefault()
    dispatch(showLoder({ setSettingValue: 1 }))
    setIsModalShowEdit(false)
    putRequest(`/api/v1/server-setting/${settingIdCustom}`, paramsEdit)
      .then((res) => {
        getInfo()

        state.createNotification('Успешно обновлено!', 'success')
        dispatch(showLoder({ setSettingValue: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ setSettingValue: 0 }))
      })
  }

  let params = {
    title: newSettingTitle,
    value: newSettingValue,
    group: 'ag_calculator',
  }
  const createSettingValue = (e) => {
    e.preventDefault()
    dispatch(showLoder({ createSettingValue: 1 }))
    setIsModalShow(false)
    postRequest(`/api/v1/server-setting`, params)
      .then(() => {
        state.createNotification('Успешно добавлено!', 'success')
        getInfo()
        dispatch(showLoder({ createSettingValue: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ createSettingValue: 0 }))
      })
  }

  const close = () => {
    setIsModalShow(false)
    setIsModalRemove(false)
    setIsModalShowEdit(false)
  }

  const showIdSetting = (id, name, value) => {
    setSettingValueCustom(value)
    setSettingNameCustom(name)
    setSettingIdCustom(id)
    setIsModalShowEdit(!isModalShowEdit)
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
            <Modal.Title>Удаление настройки</Modal.Title>
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
            <Modal.Title>Редактировать настройку</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={setSettingValue}>
              <label>
                <span>Название</span>
                <input
                  className=""
                  type="text"
                  value={settingNameCustom}
                  onChange={(e) => setSettingNameCustom(e.target.value)}
                  placeholder="Название"
                  required
                />
              </label>

              <label>
                <span>Значение</span>
                <input
                  className=""
                  type="number"
                  value={settingValueCustom}
                  onChange={(e) => setSettingValueCustom(e.target.value)}
                  placeholder="Значение"
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
          open={isModalShow}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить настройку</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createSettingValue}>
              <label>
                <span>Название настройки</span>
                <input
                  className=""
                  type="text"
                  value={newSettingTitle}
                  onChange={(e) => setNewSettingTitle(e.target.value)}
                  placeholder="Название настройки"
                  required
                />
              </label>

              <label>
                <span>Значение</span>
                <input
                  className=""
                  type="number"
                  value={newSettingValue}
                  onChange={(e) => setNewSettingValue(e.target.value)}
                  placeholder="Значение"
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
            {/* <h1 className='titleInfo'>Общие настройки</h1> */}
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
          {settingArray.length > 0 ? (
            <div className="contentBlockTop">
              <div className="blockShowOrHide">
                <div className="dropBlock--inner">
                  <div className="dropBlockContent" style={{ width: '100%' }}>
                    <div>
                      {settingArray.map((elem) => {
                        return (
                          <div key={elem.id} style={{ display: 'flex' }}>
                            <label>
                              <span>{elem.title}</span>

                              <input
                                type="number"
                                placeholder={elem.title + ':'}
                                value={elem.value}
                                disabled
                              />
                            </label>
                            <div
                              className="Dropdown"
                              style={{ margin: '10px 0' }}
                            >
                              <div className="DropdownShow">
                                <button
                                  onClick={() => {
                                    showIdSetting(
                                      elem.id,
                                      elem.title,
                                      elem.value
                                    )
                                  }}
                                >
                                  <Edit />
                                </button>

                                <button
                                  onClick={() => {
                                    setItemIsRemove(elem.id)
                                    setIsModalRemove(true)
                                  }}
                                >
                                  <Trash />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            'Нет данных!'
          )}
        </div>
      </div>
    </div>
  )
}
export default AgCalculatorSetting
