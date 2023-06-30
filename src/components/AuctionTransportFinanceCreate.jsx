import React, { useState, useEffect, useContext, memo } from 'react'
import { useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import nextId, { setPrefix } from 'react-id-generator'
import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'

import { putRequest, getRequest, postRequest } from '../base/api-request'
import AuctionTransportFinance from './AuctionTransportFinance'
import AuctionTransportFinanceDrop from './AuctionTransportFinanceDrop'
import AuctionTransportFinanceTop from './AuctionTransportFinanceTop'

import PropTypes from 'prop-types'
// import { arrayPort } from '../const.js'

const AuctionTransportFinanceCreate = ({
  viewBlock,
  shortInfoArray,
  carrierArray,
  // priceСarrier,

  // viewAgFree,
}) => {
  const [resultAec, setResultAec] = useState(0)
  const [resultAecDrop, setResultAecDrop] = useState(0)
  const [resultAg, setResultAg] = useState(0)
  const [resultAgDrop, setResultAgDrop] = useState(0)
  const [getCurrentAuc, setGetCurrentAuc] = useState('')
  const [financeDateArray, setFinanceDateArray] = useState([])
  const [statusBlockOrInvoice, setStatusBlockOrInvoice] = useState(false)
  const [statusDrop, setStatusDrop] = useState(false)
  const [statusDropTrue, setStatusDropTrue] = useState(false)
  const [controlParamsClear, setControlParamsClear] = useState(true)
  const [pay_info, setPay_info] = useState([])
  const [flagSendReq, setFlagSendReq] = useState(false)
  const [autoInfo, setAutoInfo] = useState({})
  const [dataPriseObject, setDataPriseObject] = useState({})

  const [costsDestinationsArray, setCostsDestinationsArray] = useState([])
  const [costsPurchasePointsArray, setCostsPurchasePointsArray] = useState([])
  const [costsDestinationsPortsArray, setCostsDestinationsPortsArray] =
    useState([])
  const [costsLoadingPortArray, setCostsLoadingPortArray] = useState([])
  const [dataCarters, setDataCarters] = useState([])
  const [dataPorts, setDataPorts] = useState([])
  const [agentArray, setAgentArray] = useState([])

  const { dispatch } = useContext(ContextApp)

  const leftItem = 'AEC balance'
  const rightItem = 'AG Logist'
  const { id } = useParams()
  const pathCurrent = window.location.pathname
  const initialValue = [
    {
      dataArray: [
        {
          ag_finance: [],
          status: false,
        },
        {
          usa_finance: [],
          status: false,
        },
      ],
      status: false,
      id: nextId(),
    },
  ]

  useEffect(() => {
    if (
      financeDateArray.length > 0 &&
      financeDateArray[0].usa_finance !== null &&
      financeDateArray[0].ag_finance !== null &&
      Object.keys(JSON.parse(financeDateArray[0].usa_finance)).includes(
        'statusFinance'
      ) &&
      Object.keys(JSON.parse(financeDateArray[0].ag_finance)).includes(
        'statusFinance'
      )
    ) {
      viewBlockDrop()
      checkControl()
    }
  }, [financeDateArray, statusDrop])
  // useState(() => {
  //   priceСarrier((+resultAg + resultAgDrop).toFixed(2))
  // }, [resultAg, resultAgDrop])

  useEffect(() => {
    dispatch(showLoder({ auto: 1 }))
    getRequest(`/api/v1/order/transport-auto/${id}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAutoInfo(res)
        dispatch(showLoder({ auto: 0 }))
      })

      .catch((err) => {
        dispatch(showLoder({ auto: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])
  useEffect(() => {
    dispatch(showLoder({ destinations: 1 }))
    getRequest(`/api/v1/agents?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setAgentArray(res.agents)
        dispatch(showLoder({ destinations: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ destinations: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }, [])

  const controlArray = (id) => {
    const { place_destination_id, destination_id } = autoInfo
    switch (id) {
      case 1:
        return carrierArray

      case 2:
        return dataCarters.filter(({ destinationPlaceDestinations }) =>
          destinationPlaceDestinations.find(
            (el) => el.place_destination_id == place_destination_id
          )
        )

      case 3:
        return agentArray

      case 4:
        return carrierArray

      default:
        break
    }
  }

  const getStartInfo = (val) => {
    dispatch(showLoder({ info: 1 }))
    postRequest(`/api/v1/order/finance/start-info`, {
      general_information_id: id,
      carrier_id: val,
    })
      .then((res) => {
        setDataPriseObject(res)
        // setAgFee(res.agFee)
        dispatch(showLoder({ info: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ info: 0, status: err.status }))
      })
  }

  const dataResultAec = (resAec) => {
    setResultAec(resultAecDrop + resAec ? resAec : 0)
  }
  const dataResultAecDrop = (resAec) => {
    setResultAecDrop(resAec ? resAec : 0)
  }

  const dataResultAg = (resAg) => {
    setResultAg(resAg ? resAg : 0)
  }
  const dataResultAgDrop = (resAec) => {
    setResultAgDrop(resAec ? resAec : 0)
  }

  const getCurrentAucFunc = (val) => {
    setGetCurrentAuc(val)
  }
  const statusFunc = (val) => {
    setStatusBlockOrInvoice(val)
  }

  useEffect(() => {
    getFinanceArray()
  }, [])

  const getFinanceArray = () => {
    dispatch(showLoder({ infoId: 1 }))
    getRequest(`/api/v1/order/finance/${id}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setFinanceDateArray(res.finance_information)

        setStatusDrop(false)
        dispatch(showLoder({ infoId: 0 }))
      })
      .catch((err) => {
        setFinanceDateArray([])
        dispatch(showLoder({ infoId: 0, status: err.status }))
      })
  }

  const checkControl = () => {
    let filterWithStatusFalse = Object.keys(
      JSON.parse(financeDateArray[0].usa_finance)
    ).includes('children')
      ? JSON.parse(financeDateArray[0].usa_finance).children.filter(
          (elem) => elem.status === false
        )
      : []

    setStatusDropTrue(!filterWithStatusFalse.length > 0 ? false : true)
  }

  const viewBlockDrop = () => {
    let filterWithStatusTrue = Object.keys(
      JSON.parse(financeDateArray[0].usa_finance)
    ).includes('children')
      ? JSON.parse(financeDateArray[0].usa_finance).children.filter(
          (elem) => elem.status === true
        )
      : []
    let filterWithStatusFalse = Object.keys(
      JSON.parse(financeDateArray[0].usa_finance)
    ).includes('children')
      ? JSON.parse(financeDateArray[0].usa_finance).children.filter(
          (elem) => elem.status === false
        )
      : []

    return (
      <React.Fragment>
        {filterWithStatusTrue.length > 0 ? (
          <AuctionTransportFinanceDrop
            carrierArray={carrierArray}
            initialValue={filterWithStatusTrue}
            financeDateArray={financeDateArray}
            dataCarters={dataCarters}
            getFinanceArray={getFinanceArray}
            dataResultAecDrop={dataResultAecDrop}
            dataResultAgDrop={dataResultAgDrop}
            viewBlock={viewBlock}
            titleBlock={leftItem}
            controlParamsClear={controlParamsClear}
            controlDataSelect={controlDataSelect}
            dataPorts={dataPorts}
            controlArray={controlArray}
          />
        ) : null}

        {filterWithStatusFalse.length > 0 ? (
          <AuctionTransportFinanceDrop
            carrierArray={carrierArray}
            dataCarters={dataCarters}
            initialValue={filterWithStatusFalse}
            financeDateArray={financeDateArray}
            getFinanceArray={getFinanceArray}
            dataResultAecDrop={dataResultAecDrop}
            dataResultAgDrop={dataResultAgDrop}
            viewBlock={viewBlock}
            titleBlock={rightItem}
            controlParamsClear={controlParamsClear}
            controlDataSelect={controlDataSelect}
            dataPorts={dataPorts}
            controlArray={controlArray}
          />
        ) : null}

        {filterWithStatusTrue.length === 0 &&
          filterWithStatusFalse.length === 0 &&
          statusDrop && (
            <AuctionTransportFinanceDrop
              carrierArray={carrierArray}
              dataCarters={dataCarters}
              initialValue={initialValue}
              financeDateArray={financeDateArray}
              getFinanceArray={getFinanceArray}
              controlDataSelect={controlDataSelect}
              dataResultAecDrop={dataResultAecDrop}
              viewBlock={viewBlock}
              titleBlock={leftItem}
              controlParamsClear={controlParamsClear}
              dataPorts={dataPorts}
              controlArray={controlArray}
            />
          )}
      </React.Fragment>
    )
  }

  useEffect(() => {
    getAllArrayDestination()
    getAllArrayPurchase()
    getAllArrayDestinationPorts()
    getAllArrayLoadingPort()
    getAllPorts()

    getAllCarters()
  }, [])
  const getAllArrayDestination = () => {
    dispatch(showLoder({ getAllArray: 1 }))
    getRequest(`/api/v1/costs/destination?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterDataArray = res.CostDestinations.filter(
          (item) => item.active
        )

        setCostsDestinationsArray(filterDataArray)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setCostsDestinationsArray([])
        dispatch(showLoder({ getAllArray: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }
  const getAllArrayPurchase = () => {
    dispatch(showLoder({ getAllArray: 1 }))
    getRequest(`/api/v1/costs/purchase-point?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterDataArray = res.CostPurchasePoints.filter(
          (item) => item.active
        )
        // const resultAll = [{ id: 0, title: 'Выбрать из существующих' }].concat(
        //   filterDataArray ? filterDataArray : []
        // )
        setCostsPurchasePointsArray(filterDataArray)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setCostsPurchasePointsArray([])
        dispatch(showLoder({ getAllArray: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  const getAllCarters = () => {
    dispatch(showLoder({ getAllCarters: 1 }))
    getRequest(`/api/v1/carters`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ carters }) => {
        setDataCarters(carters)

        dispatch(showLoder({ getAllCarters: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ getAllCarters: 0, status: err.status }))
        setDataCarters([])
      })
  }
  const getAllArrayDestinationPorts = () => {
    dispatch(showLoder({ getAllArrayDestinationPorts: 1 }))
    getRequest(`/api/v1/costs/destination-port?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterDataArray = res.CostDestinationPorts.filter(
          (item) => item.active
        )
        setCostsDestinationsPortsArray(filterDataArray)
        dispatch(showLoder({ getAllArrayDestinationPorts: 0 }))
      })
      .catch((err) => {
        setCostsDestinationsPortsArray([])
        dispatch(
          showLoder({ getAllArrayDestinationPorts: 0, status: err.status })
        )
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }
  const getAllArrayLoadingPort = () => {
    dispatch(showLoder({ getAllArray: 1 }))
    getRequest(`/api/v1/costs/loading-port?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        const filterDataArray = res.CostLoadingPorts.filter(
          (item) => item.active
        )
        setCostsLoadingPortArray(filterDataArray)
        dispatch(showLoder({ getAllArray: 0 }))
      })
      .catch((err) => {
        setCostsLoadingPortArray([])
        dispatch(showLoder({ getAllArray: 0, status: err.status }))
        //state.createNotification('Успешно обновлено!', 'error')
      })
  }

  const getAllPorts = () => {
    dispatch(showLoder({ getPorts: 1 }))
    getRequest(`/api/v1/ports?limit=1000`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataPorts(res.ports)

        dispatch(showLoder({ getPorts: 0 }))
      })
      .catch((err) => {
        //state.createNotification('Успешно обновлено!', 'error')

        dispatch(showLoder({ getPorts: 0, status: err.status }))
      })
  }

  const controlDataSelect = (idValue) => {
    switch (idValue) {
      case 1:
        return costsPurchasePointsArray
      case 2:
        return costsDestinationsArray
      case 3:
        return costsDestinationsPortsArray
      case 4:
        return costsLoadingPortArray
      default:
        return costsDestinationsArray
    }
  }

  const createDropInvoice = () => {
    setStatusDrop(true)
    setPrefix('')
    let paramsCreate
    if (
      !Object.keys(JSON.parse(financeDateArray.at(-1).usa_finance)).includes(
        'children'
      )
    ) {
      paramsCreate = {
        usa_finance: JSON.stringify({
          ...JSON.parse(financeDateArray.at(-1).usa_finance),
          children: initialValue,
        }),
      }
    } else {
      paramsCreate = {
        usa_finance: JSON.stringify({
          ...JSON.parse(financeDateArray.at(-1).usa_finance),

          children: [
            ...JSON.parse(financeDateArray.at(-1).usa_finance).children,
            ...initialValue,
          ],
        }),
      }
    }

    let controlParams = {
      ...financeDateArray.at(-1),
      status_finance_confirm: false,
      status_finance_cash_confirm: false,
      ...paramsCreate,
    }

    createDropInvoiceRequest(controlParams)
  }

  const createDropInvoiceRequest = (params) => {
    dispatch(showLoder({ createDropInvoiceRequest: 1 }))
    putRequest(`/api/v1/order/finance/${financeDateArray.at(-1).id}`, params)
      .then((res) => {
        getFinanceArray()
        dispatch(showLoder({ createDropInvoiceRequest: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ createDropInvoiceRequest: 0, status: err.status }))
      })
  }
  const controlRoleView = () => {
    let bollean = true
    if (
      pathCurrent.split('/')[1] === 'archiveTransport' ||
      pathCurrent.split('/')[1] === 'removedTransport'
    )
      bollean = false

    return bollean
  }
  const [carrierSelectProp, setCarrierSelectProp] = useState('')

  return (
    <div className="innerFinance">
      <AuctionTransportFinanceTop
        getFlagSendReq={setFlagSendReq}
        dataResult={dataResultAec}
        getCurrentAucFunc={getCurrentAucFunc}
        propsId={id}
        financeDateArray={financeDateArray}
        getFinanceArray={getFinanceArray}
        statusFunc={statusFunc}
        viewBlock={viewBlock}
        shortInfoArray={shortInfoArray}
        carrierArray={carrierArray}
        dataCarters={dataCarters}
        setPay_info={setPay_info}
        autoInfo={autoInfo}
        dataPorts={dataPorts}
      />

      <div className="itemFinance">
        <AuctionTransportFinance
          dataPriseObject={dataPriseObject}
          getStartInfo={getStartInfo}
          flagSendReq={flagSendReq}
          titleBlock={leftItem}
          dataResult={dataResultAec}
          getCurrentAucFunc={getCurrentAucFunc}
          propsId={id}
          financeDateArray={financeDateArray}
          getFinanceArray={getFinanceArray}
          statusFunc={statusFunc}
          viewBlock={viewBlock}
          shortInfoArray={shortInfoArray}
          carrierArray={carrierArray}
          dataCarters={dataCarters}
          pay_info={pay_info}
          controlDataSelect={controlDataSelect}
          dataPorts={dataPorts}
          autoInfo={autoInfo}
          controlArray={controlArray}
          carrierSelectProp={carrierSelectProp}
          setCarrierSelectProp={setCarrierSelectProp}
        />
        <AuctionTransportFinance
          dataPriseObject={dataPriseObject}
          pay_info={pay_info}
          getStartInfo={getStartInfo}
          titleBlock={rightItem}
          dataResult={dataResultAg}
          getCurrentAucFunc={getCurrentAucFunc}
          propsId={id}
          financeDateArray={financeDateArray}
          getFinanceArray={getFinanceArray}
          statusFunc={statusFunc}
          viewBlock={viewBlock}
          shortInfoArray={shortInfoArray}
          carrierArray={carrierArray}
          dataCarters={dataCarters}
          controlDataSelect={controlDataSelect}
          dataPorts={dataPorts}
          autoInfo={autoInfo}
          controlArray={controlArray}
          carrierSelectProp={carrierSelectProp}
          setCarrierSelectProp={setCarrierSelectProp}
        />
      </div>

      <div>
        {financeDateArray.length > 0 &&
          financeDateArray[0].usa_finance !== null &&
          financeDateArray[0].ag_finance !== null &&
          Object.keys(JSON.parse(financeDateArray[0].usa_finance)).includes(
            'statusFinance'
          ) &&
          Object.keys(JSON.parse(financeDateArray[0].ag_finance)).includes(
            'statusFinance'
          ) &&
          viewBlockDrop()}

        <div
          className="positionClose"
          style={{
            display: controlRoleView() ? 'block' : 'none',
          }}
        >
          {statusBlockOrInvoice && viewBlock(50) && (
            <input
              type="submit"
              style={{
                display: statusDrop || statusDropTrue ? 'none' : 'block',
              }}
              className="btn btn-green"
              value="Открыть новый инвойс"
              onClick={() => {
                setControlParamsClear(false)
                createDropInvoice()
              }}
            />
          )}
        </div>

        {JSON.parse(window.sessionStorage.getItem('role')).code === 'finance' ||
        JSON.parse(window.sessionStorage.getItem('role')).code === 'admin' ? (
          <div className="dropBlockContent">
            <label>
              <span>Итого перевозка ({getCurrentAuc})</span>
              <input
                type="text"
                placeholder="Итого перевозка (АЕС)"
                value={(+resultAec + resultAecDrop).toFixed(2)}
                disabled
              />
            </label>
            <label>
              <span>Итого перевозка (AG Logist)</span>
              <input
                type="text"
                placeholder="Итого перевозка (АГ)"
                value={(+resultAg + resultAgDrop).toFixed(2)}
                disabled
              />
            </label>

            <label>
              <span>Результат по сделке</span>
              <input
                type="text"
                placeholder="Результат по сделке"
                value={(
                  Number(+resultAg + resultAgDrop) -
                  Number(+resultAec + resultAecDrop)
                ).toFixed(2)}
                disabled
              />
            </label>

            <label>
              <span>Результат по контейнеру</span>
              <input
                type="text"
                placeholder="Результат по контейнеру"
                value="0"
                disabled
              />
            </label>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
AuctionTransportFinanceCreate.propTypes = {
  viewBlock: PropTypes.func,
  shortInfoArray: PropTypes.object,
}

export default memo(AuctionTransportFinanceCreate)
