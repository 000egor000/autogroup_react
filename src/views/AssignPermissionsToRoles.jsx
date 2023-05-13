import React, { useState, useContext, useEffect } from 'react'

import { getRequest, putRequest } from '../base/api-request'
import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'

import 'react-toastify/dist/ReactToastify.css'

const AssignPermissionsToRoles = (props) => {
  const [allId, setAllId] = useState([])
  // const [allIdFist, setAllIdFist] = useState([])
  const [statusInitialValue, setStatusInitialValue] = useState(true)

  const [allIdCheck, setAllIdCheck] = useState(false)
  const [dataAccessRights, setDataAccessRights] = useState([])
  const [accessRights, setAccessRights] = useState([])
  const [dataSelect, setDataSelect] = useState([])
  const [valueSelect, setValueSelect] = useState(0)
  const [viewControler, setViewControler] = useState([])

  const { state, dispatch } = useContext(ContextApp)

  const params = {
    code: JSON.parse(valueSelect).code,
    title: JSON.parse(valueSelect).title,
    access_rights: accessRights,
  }

  useEffect(() => {
    dispatch(showLoder({ access: 1 }))
    let AllId = []
    getRequest('/api/v1/access-rights', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        Object.entries(res.access_rights).map((elem) => {
          elem[1]['access_rights'].map((elemChaild) => {
            AllId.push(elemChaild['id'])
          })
        })
        setDataAccessRights(Object.entries(res.access_rights))
        setAllId(AllId)
        dispatch(showLoder({ access: 0 }))
      })
      .catch(() => dispatch(showLoder({ access: 0 })))
  }, [valueSelect])

  useEffect(() => {
    controlViewAccessRights()
  }, [valueSelect])

  const controlViewAccessRights = () => {
    if (JSON.parse(valueSelect).access_rights) {
      let count = []
      for (
        let index = 0;
        index < Object.keys(JSON.parse(valueSelect).access_rights).length;
        index++
      ) {
        JSON.parse(valueSelect).access_rights[
          Object.keys(JSON.parse(valueSelect).access_rights)[index]
        ].access_rights.map((elem) => count.push(elem.id))
      }

      // setAllIdFist(count)
      setAccessRights(count)
    } else {
      setAccessRights([])
      // setAllIdFist([])
    }
  }

  useEffect(() => {
    dispatch(showLoder({ role: 1 }))
    getRequest('/api/v1/user-role', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataSelect(res.userRole)
        dispatch(showLoder({ role: 0 }))
      })
      .catch(() => dispatch(showLoder({ role: 0 })))
  }, [])

  const handleAccessRights = (id) => {
    let filtered = accessRights.filter((e) => id == e)

    if (filtered.length > 0) {
      let removeAccessRights = accessRights.filter((e) => e !== id)
      setAccessRights(removeAccessRights)
    } else {
      setAccessRights([...accessRights, id])
    }
  }

  const isChecked = (id) => {
    let filtered = accessRights.filter((e) => e === id)

    let bool = filtered.length > 0 ? true : false
    return bool
  }

  const allCheckOn = () => {
    setAccessRights(allId)
    setAllIdCheck(true)
  }
  const allCheckOff = () => {
    setAccessRights([])
    setAllIdCheck(false)
  }

  const allCheckStart = () => {
    allCheckOff()
    controlViewAccessRights()
  }

  const allCheckFinish = () => {
    dispatch(showLoder({ allCheckFinish: 1 }))

    putRequest(`/api/v1/user-role/${JSON.parse(valueSelect).id}`, params)
      .then((res) => {
        if (res.status === 'success') {
          state.createNotification('Успешно выполнено!', 'info')
          setStatusInitialValue(false)
          dispatch(showLoder({ allCheckFinish: 0 }))
        }
      })
      .catch((err) => {
        dispatch(showLoder({ allCheckFinish: 0 }))
        state.createNotification('Проверьте веденные данные!', 'error')
      })
  }
  const controlCheck = (id) => {
    return allIdCheck ? allIdCheck : isChecked(id)
  }

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
      ).includes('assign_permissions')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).assign_permissions.access_rights

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
      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="btnTransport">
            <div className="btnTransportLeft"></div>
          </div>
        </div>

        <div className="bottom-itemFooter" style={{ paddingLeft: state.width }}>
          <div className="masterCreate--inner">
            <div className="rights-setting">
              <select
                value={valueSelect.title}
                onChange={(event) => setValueSelect(event.target.value)}
              >
                {dataSelect.map((elem) => {
                  return (
                    <option
                      key={JSON.stringify(elem.id)}
                      value={JSON.stringify({
                        id: elem.id,
                        code: elem.code,
                        title: elem.title,
                        access_rights: elem.access_rights,
                      })}
                    >
                      {elem.title}
                    </option>
                  )
                })}
              </select>
              {valueSelect === 0 || JSON.parse(valueSelect).code === 'admin' ? (
                <p className="titleAdmin">
                  <span>Для администратора все права включены </span>
                  автоматическое разрешение на все права
                </p>
              ) : (
                <React.Fragment>
                  <div className="groupBtnSetting">
                    {statusInitialValue && (
                      <span
                        className="btn-start"
                        onClick={() => allCheckStart()}
                      >
                        Начальные данные
                      </span>
                    )}

                    <span className="btn-primary" onClick={() => allCheckOn()}>
                      Выделить все
                    </span>
                    <span className="btn-danger" onClick={() => allCheckOff()}>
                      Убрать все
                    </span>
                    {viewBlock(59) && (
                      <span
                        className="btn-success"
                        onClick={() => allCheckFinish()}
                      >
                        Назначить права
                      </span>
                    )}
                  </div>
                  <div className="rights-setting-data">
                    {dataAccessRights.length > 0 &&
                      dataAccessRights.map((elemItem) => {
                        return (
                          <div
                            className="ItemMain"
                            key={elemItem[1]['group_title']}
                          >
                            <span>{elemItem[1]['group_title']}</span>

                            {elemItem[1]['access_rights'].map((elemChild) => (
                              <div
                                className="itemSetting"
                                key={elemChild['id']}
                              >
                                <label>
                                  <input
                                    checked={controlCheck(+elemChild['id'])}
                                    value={elemChild['id']}
                                    type="checkbox"
                                    onChange={(e) => {
                                      handleAccessRights(+e.target.value)
                                    }}
                                  />
                                  <span>{elemChild['title']}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AssignPermissionsToRoles
