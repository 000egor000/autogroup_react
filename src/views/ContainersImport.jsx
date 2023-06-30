import React, { useState, useEffect, useContext } from 'react'

import { postRequest } from '../base/api-request'

import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'

const ContainersImport = () => {
  const [newContainers, setNewContainers] = useState('')

  const [params, setParams] = useState([])

  const { state, dispatch } = useContext(ContextApp)
  useEffect(() => {
    const params = newContainers
      .replace(/[\n]+/gi, '')
      .split(';')
      .filter((el) => el && el.replace(/[\s]+/gi, ''))

    if (params.length > 0) setParams(params)
    else setParams('')
  }, [newContainers])

  const createImport = () => {
    dispatch(showLoder({ createImport: 1 }))

    postRequest(`/api/v1/containers/import`, { params })
      .then(() => {
        setNewContainers('')

        state.createNotification('Успешно выполнено!', 'success')
        dispatch(showLoder({ createImport: 0 }))
      })
      .catch((err) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ createImport: 0, status: err.status }))
      })
  }

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div className="top-item ">
          <div className="btnTransport"></div>
        </div>

        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="containeersInner">
            <div className="newContainersItems">
              <h4>Введите список контейнеров для импорта</h4>
              <textarea
                type="text"
                value={newContainers}
                placeholder="Например: MRSU3009780;MRKU2102237;TGCU5039637"
                onChange={(e) => {
                  let value = e.target.value
                  value = value.replace(/[А-Яа-я]+/gi, '')
                  return setNewContainers(value)
                }}
              />
            </div>
            {params.length > 0 && (
              <div className="newContainersItems">
                <h4>Список импортируемых контейнеров</h4>
                <ul>
                  {params.map((el, i) => (
                    <li key={el + i}>{el}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="itemGroupBtn">
            <button className="btn-primary" onClick={createImport}>
              Импортировать
            </button>
            <button className="btn-danger" onClick={() => setNewContainers('')}>
              Очистить поле
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ContainersImport
