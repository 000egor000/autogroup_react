import React, { useState, useContext, useEffect } from 'react'
import ContextApp from '../context/contextApp'

import { showLoder } from '../reducers/actions'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Modal } from 'rsuite'
import { postRequest, getRequest, putRequest } from '../base/api-request'
import { typeLevel, InitialValueRatesFree } from '../const.js'

const FreeRates = () => {
  const { state, dispatch } = useContext(ContextApp)
  const [isModalShow, setIsModalShow] = useState(false)
  const [dataFreeArray, setDataFreeArray] = useState([])
  const [paramsValue, setParamsValue] = useState(InitialValueRatesFree)
  const [dataArray, setDataArray] = useState([
    { title: 'Класс А', data: [] },
    { title: 'Класс B', data: [] },
    { title: 'Класс C', data: [] },
  ])

  useEffect(() => {
    getPicturesFunc()
  }, [])

  const editPrace = ({ id, sum }) => {
    dispatch(showLoder({ editPrace: 1 }))
    putRequest(`/api/v1/rates-fees/ag-fees/${id}`, { sum: sum })
      .then((res) => {
        getPicturesFunc()
        // toast.success('Цена изменена! ')
        dispatch(showLoder({ editPrace: 0 }))
      })
      .catch((err) => {
        toast.error('Что-то пошло не так!')
        dispatch(showLoder({ editPrace: 0 }))
      })
  }

  const createRatesFree = (e) => {
    dispatch(showLoder({ createRatesFree: 1 }))
    e.preventDefault()

    postRequest('/api/v1/rates-fees/ag-fees', paramsValue)
      .then((res) => {
        getPicturesFunc()
        close()
        toast.success('Успешно создано!')
        dispatch(showLoder({ createRatesFree: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ createRatesFree: 0 }))
        toast.error('Что-то пошло не так!')
      })
  }

  const getPicturesFunc = () => {
    dispatch(showLoder({ getPicturesFunc: 1 }))
    getRequest('/api/v1/rates-fees/ag-fees', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataFreeArray(res.ag_fee)

        dispatch(showLoder({ getPicturesFunc: 0 }))
      })
      .catch(() => {
        dispatch(showLoder({ getPicturesFunc: 0 }))
      })
  }

  const close = () => {
    setIsModalShow(false)
    setParamsValue(InitialValueRatesFree)
  }

  useEffect(() => {
    if (dataFreeArray.length > 0) {
      let one = []
      let two = []
      let three = []
      dataFreeArray.map((el) => {
        switch (+el.type_level.id) {
          case 1:
            // return dataArray[0].data.push(el)
            return one.push(el)
          case 2:
            return two.push(el)
          case 3:
            return three.push(el)

          default:
            return null
        }
      })
      return setDataArray([
        { title: 'Класс А', data: one },
        { title: 'Класс B', data: two },
        { title: 'Класс C', data: three },
      ])
    }
    return () => setDataArray([])
  }, [dataFreeArray])

  const controlType = () => {
    const onChangeCustom = ({ id, content }) => {
      const newData = dataFreeArray.map((el) => {
        if (el.id === id) return { ...el, sum: +content }
        else return el
      })
      return setDataFreeArray(newData)
    }

    const componentItem = ({ data, title }) => {
      return (
        <div className="dropBlockContent">
          <h4 className="titleInfo">{title}</h4>
          {data.length > 0
            ? data.map((el, i) => {
                return (
                  <ul className="blockItem" key={el.id}>
                    <li>{i + 1 + '.'}</li>
                    <li>от</li>
                    <li>{el.order_from}</li>
                    <li>до</li>
                    <li>{el.order_to}</li>
                    <li>
                      <input
                        value={el.sum}
                        onBlur={() => editPrace({ id: el.id, sum: el.sum })}
                        onChange={(e) => {
                          onChangeCustom({ id: el.id, content: e.target.value })
                        }}
                      />
                    </li>
                    <li>{el.date_from}</li>
                    <li>{el.date_to}</li>
                  </ul>
                )
              })
            : 'Нет данных!'}
        </div>
      )
    }

    return dataArray.map((el) => (
      <React.Fragment key={el.title}>{componentItem(el)}</React.Fragment>
    ))
  }
  const changeInput = (val) => setParamsValue({ ...paramsValue, ...val })

  return (
    <div className="itemContainer">
      <ToastContainer />
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalShow}
          onClose={() => close()}
        >
          <Modal.Header>
            <Modal.Title>Добавить rates</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={createRatesFree}>
              <div className="blockItem">
                <span> Тип класса</span>

                <label>
                  <select
                    value={paramsValue.type_level_id}
                    onChange={(e) =>
                      changeInput({ type_level_id: e.target.value })
                    }
                  >
                    {typeLevel.map((elem, i) => (
                      <option key={elem.id} value={elem.id}>
                        {elem.title}
                      </option>
                    ))}
                  </select>
                </label>

                <span> Количество от</span>

                <label>
                  <input
                    value={paramsValue.order_from}
                    type="number"
                    onChange={(e) =>
                      changeInput({ order_from: e.target.value })
                    }
                  />
                </label>

                <span>Количество до</span>
                <label>
                  <input
                    type="number"
                    value={paramsValue.order_to}
                    onChange={(e) => changeInput({ order_to: e.target.value })}
                    required
                  />
                </label>
                <span>цена</span>
                <label>
                  <input
                    type="number"
                    value={paramsValue.sum}
                    onChange={(e) => changeInput({ sum: e.target.value })}
                    required
                  />
                </label>
                <span>Дата от</span>
                <label>
                  <input
                    type="date"
                    value={paramsValue.date_from}
                    onChange={(e) => changeInput({ date_from: e.target.value })}
                    required
                  />
                </label>
                <span>Дата до</span>
                <label>
                  <input
                    type="date"
                    value={paramsValue.date_to}
                    onChange={(e) => changeInput({ date_to: e.target.value })}
                    required
                  />
                </label>
              </div>
              <button type="submit" className="btn-success-preBid">
                Подтвердить
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="itemContainer-inner">
        <div
          className="top-item"
          style={{ paddingLeft: state.width, justifyContent: 'right' }}
        >
          <div className="btnTransport" style={{ marginTop: '10px' }}>
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
          <div className="blockShowOrHide">
            <div
              className="dropBlock--inner"
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              {controlType(dataFreeArray)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreeRates
