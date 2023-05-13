import React, { useState, useEffect, useContext, memo } from 'react'

import 'react-toastify/dist/ReactToastify.css'
import { Attachment, CheckOutline } from '@rsuite/icons'
import { getRequest, postRequestFile } from '../base/api-request'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import PropTypes from 'prop-types'

const AuctionTransportDropsAnotherDoc = ({
  itemStatus,
  propsId,
  viewBlockProp,
}) => {
  const [describe, setDescribe] = useState('')
  const [fileGive, setFileGive] = useState('')
  const [fileName, setFileName] = useState('')
  const [showIcon, setShowIcon] = useState(false)
  const [dropInfoArray, setDropInfoArray] = useState([])
  const { state, dispatch } = useContext(ContextApp)
  const formData = new FormData()
  formData.append('description', describe)
  formData.append('general_information_id', propsId)
  formData.append('file', fileGive)

  useEffect(() => {
    getInfoArrayFunc()
  }, [])

  const getInfoArrayFunc = () => {
    dispatch(showLoder({ getInfoArrayFunc: 1 }))
    getRequest(`/api/v1/order/drops/${propsId}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDropInfoArray(res.drops_information)
        dispatch(showLoder({ getInfoArrayFunc: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getInfoArrayFunc: 0 }))
      })
  }
  let controlFile = (e) => {
    if (e.target.files[0]) {
      setShowIcon(true)
      setFileGive(e.target.files[0])
      setFileName(e.target.files[0].name)
      state.createNotification('Успешно выполнено!', 'success')
    }
  }

  const createDropFunc = (e) => {
    e.preventDefault()
    dispatch(showLoder({ createDropFunc: 1 }))
    if (fileGive) {
      postRequestFile('/api/v1/order/drops', formData)
        .then((res) => {
          state.createNotification('Успешно создано!', 'success')
          setDescribe('')
          setFileName('')
          setShowIcon(false)
          getInfoArrayFunc()
          dispatch(showLoder({ createDropFunc: 0 }))
        })
        .catch(() => {
          state.createNotification('Что-то пошло не так!', 'error')
          dispatch(showLoder({ createDropFunc: 0 }))
        })
    } else {
      state.createNotification('Прикрепите файл!', 'error')
      dispatch(showLoder({ createDropFunc: 0 }))
    }
  }

  return (
    <div
      className="accessUsers  accessUsers--doc"
      style={{
        display: itemStatus ? 'block' : 'none',
      }}
    >
      <div className="contentBlockTop">
        <div className="dropBlockContent dropBlockContent--doc">
          <form onSubmit={createDropFunc}>
            <label>
              <span>Описание</span>

              <input
                type="text"
                placeholder="Описание"
                value={describe}
                onChange={(e) => setDescribe(e.target.value)}
                required
              />
            </label>

            <label>
              <span className="customPosition" style={{ backgraund: 'red' }}>
                <p>Прикрепить файл</p>
                <label htmlFor="ava" style={{ cursor: 'pointer' }}>
                  {showIcon ? (
                    <CheckOutline style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <Attachment style={{ width: '20px', height: '20px' }} />
                  )}
                </label>
              </span>
              <input
                value={fileName && fileName}
                disabled
                placeholder="Название файла"
              />

              <input
                id="ava"
                name="ava"
                style={{ display: 'none' }}
                type="file"
                onChange={controlFile}
              />
            </label>
            <label>
              <span>Другие документы</span>
            </label>

            {dropInfoArray.map((elem, i) => (
              <React.Fragment key={elem.description + i}>
                <label>
                  <span style={{ fontWeight: '500' }}>
                    {i + 1 + '. ' + elem.description}
                  </span>
                  <button type="button" className="btn-drops">
                    Подтвердить
                  </button>
                </label>
              </React.Fragment>
            ))}
            {viewBlockProp(57) && (
              <input
                type="submit"
                className="btn-success-preBid btn-auto"
                value="Сохранить"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

AuctionTransportDropsAnotherDoc.propTypes = {
  itemStatus: PropTypes.bool,
  propsId: PropTypes.number,
  viewBlock: PropTypes.func,
}
export default memo(AuctionTransportDropsAnotherDoc)
