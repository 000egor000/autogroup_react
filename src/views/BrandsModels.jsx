import React, { useState, useContext, useEffect } from 'react'

import ContextApp from '../context/contextApp'

import 'rsuite-table/dist/css/rsuite-table.css'

import 'react-toastify/dist/ReactToastify.css'
import { AddOutline, CloseOutline } from '@rsuite/icons'

import { postRequest, getRequest } from '../base/api-request'
import { showLoder } from '../reducers/actions'

const BrandsModels = (props) => {
  const [dataTypes, setDataTypes] = useState([])
  const [valueTypesSelect, setValueTypesSelect] = useState(0)
  const [dataSizeTransport, setDataSizeTransport] = useState([])
  const [valueSizeTransportSelect, setValueSizeTransportSelect] = useState(0)
  const [dataBrand, setDataBrand] = useState([])
  const [valueDataBrandSelect, setValueDataBrandSelect] = useState(0)
  const [newBrands, setNewBrands] = useState('')
  const [showBlockBrands, setShowBlockBrands] = useState(false)
  const [newModel, setNewModel] = useState('')

  const { state, dispatch } = useContext(ContextApp)
  useEffect(() => {
    dispatch(showLoder({ type: 1 }))
    getRequest('/api/v1/transport-type', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataTypes(res.transportTypes)
        setValueTypesSelect(JSON.stringify(res.transportTypes[0]))
        dispatch(showLoder({ type: 0 }))
      })
      .catch((err) => {
        setDataTypes([])
        dispatch(showLoder({ type: 0 }))
      })
  }, [])

  useEffect(() => {
    if (valueTypesSelect) {
      setDataSizeTransport(JSON.parse(valueTypesSelect).transportSizes)
      setValueSizeTransportSelect(
        JSON.parse(valueTypesSelect).transportSizes[0]['id']
      )
    }
  }, [valueTypesSelect])

  const getArray = () => {
    dispatch(showLoder({ getArray: 1 }))
    getRequest('/api/v1/transport-brand', {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataBrand(res.transportBrands)
        setValueDataBrandSelect(res.transportBrands[0]['id'])
        dispatch(showLoder({ getArray: 0 }))
      })
      .catch((err) => {
        setDataBrand([])
        dispatch(showLoder({ getArray: 0 }))
      })
  }

  useEffect(() => {
    getArray()
  }, [])

  let paramsAddBrand = {
    code: JSON.parse(valueTypesSelect).code,
    name: newBrands,
  }

  let paramsAddModel = {
    code: JSON.parse(valueTypesSelect).code,
    transport_brand_id: valueDataBrandSelect,
    transport_size_id: +valueSizeTransportSelect,
    name: newModel,
  }
  const createFormTransportBrand = (e) => {
    dispatch(showLoder({ createFormTransportBrand: 1 }))

    postRequest('/api/v1/transport-brand', paramsAddBrand)
      .then((res) => {
        state.createNotification('Успешно выполнено!', 'success')
        setNewBrands('')
        setShowBlockBrands(!showBlockBrands)
        getArray()
        dispatch(showLoder({ createFormTransportBrand: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ createFormTransportBrand: 0 }))
        state.createNotification('Проверьте веденные данные!', 'error')
      })
  }
  const createFormModel = (e) => {
    dispatch(showLoder({ createFormModel: 1 }))

    postRequest('/api/v1/transport-model', paramsAddModel)
      .then((res) => {
        if (res.status === 'success') {
          getArray()

          state.createNotification('Успешно выполнено!', 'info')

          dispatch(showLoder({ createFormModel: 0 }))
        }
      })
      .catch((err) => {
        dispatch(showLoder({ createFormModel: 0 }))
        state.createNotification('Проверьте веденные данные!', 'error')
      })
  }

  return (
    <div className="itemContainer">
      <div className="itemContainer-inner">
        <div className="top-item " style={{ paddingLeft: state.width }}>
          <div className="btnTransport"></div>
        </div>
        <div
          className="bottom-itemFooter"
          style={{ paddingLeft: state.width, color: 'black' }}
        >
          <div className="itemBrand">
            <label>
              <span>Тип тс:</span>
              <select
                value={valueTypesSelect}
                onChange={(event) => setValueTypesSelect(event.target.value)}
              >
                {dataTypes.map((elem) => {
                  return (
                    <option key={elem.id} value={JSON.stringify(elem)}>
                      {elem.name}
                    </option>
                  )
                })}
              </select>
            </label>
            <label>
              <span>Размер тс:</span>
              {dataSizeTransport ? (
                <select
                  value={valueSizeTransportSelect}
                  onChange={(event) =>
                    setValueSizeTransportSelect(event.target.value)
                  }
                >
                  {dataSizeTransport.map((elem) => {
                    return (
                      <option key={elem.id} value={elem.id}>
                        {elem.name}
                      </option>
                    )
                  })}
                </select>
              ) : (
                'нет данных!'
              )}
            </label>
            <label>
              <span>Марка:</span>
              <div className="selectCustom selectCustom--model">
                <select
                  value={valueDataBrandSelect}
                  onChange={(event) =>
                    setValueDataBrandSelect(event.target.value)
                  }
                >
                  {dataBrand.map((elem) => {
                    return (
                      <option key={elem.id} value={elem.id}>
                        {elem.name}
                      </option>
                    )
                  })}
                </select>
                <div
                  className="itemPlus"
                  onClick={() => setShowBlockBrands(!showBlockBrands)}
                >
                  {showBlockBrands ? <CloseOutline /> : <AddOutline />}
                </div>

                {showBlockBrands && (
                  <div className="newItem">
                    <input
                      type="text"
                      value={newBrands}
                      onChange={(e) => setNewBrands(e.target.value)}
                    />
                    <button
                      className="btn-success"
                      onClick={() => createFormTransportBrand()}
                    >
                      Добавить новую марку
                    </button>
                  </div>
                )}
              </div>
            </label>
            <label>
              <span>Модель:</span>

              <input
                type="text"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
              />
            </label>
            <button className="btn-success" onClick={() => createFormModel()}>
              Добавить новую модель
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BrandsModels
