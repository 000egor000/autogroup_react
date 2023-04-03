import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import nextId, { setPrefix } from 'react-id-generator'
import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'
import { ToastContainer, toast } from 'react-toastify'
import { putRequest, getRequest, postRequest } from '../base/api-request'
import AuctionTransportFinance from './AuctionTransportFinance'
import AuctionTransportFinanceDrop from './AuctionTransportFinanceDrop'
import AuctionTransportFinanceTop from './AuctionTransportFinanceTop'

import PropTypes from 'prop-types'

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
  const getToastSucces = (val) => toast.success(val)
  const getToastError = (val) => toast.error(val)

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
        dispatch(showLoder({ auto: 0 }))
        // toast.error('Что-то пошло не так!')
      })
  }, [])

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
        dispatch(showLoder({ info: 0 }))
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
        dispatch(showLoder({ infoId: 0 }))
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
            getToastSucces={getToastSucces}
            getToastError={getToastError}
            initialValue={filterWithStatusTrue}
            financeDateArray={financeDateArray}
            getFinanceArray={getFinanceArray}
            dataResultAecDrop={dataResultAecDrop}
            dataResultAgDrop={dataResultAgDrop}
            viewBlock={viewBlock}
            titleBlock={leftItem}
            controlParamsClear={controlParamsClear}
          />
        ) : null}

        {filterWithStatusFalse.length > 0 ? (
          <AuctionTransportFinanceDrop
            carrierArray={carrierArray}
            getToastSucces={getToastSucces}
            getToastError={getToastError}
            initialValue={filterWithStatusFalse}
            financeDateArray={financeDateArray}
            getFinanceArray={getFinanceArray}
            dataResultAecDrop={dataResultAecDrop}
            dataResultAgDrop={dataResultAgDrop}
            viewBlock={viewBlock}
            titleBlock={rightItem}
            controlParamsClear={controlParamsClear}
          />
        ) : null}

        {filterWithStatusTrue.length === 0 &&
          filterWithStatusFalse.length === 0 &&
          statusDrop && (
            <AuctionTransportFinanceDrop
              carrierArray={carrierArray}
              getToastSucces={getToastSucces}
              getToastError={getToastError}
              initialValue={initialValue}
              financeDateArray={financeDateArray}
              getFinanceArray={getFinanceArray}
              dataResultAecDrop={dataResultAecDrop}
              viewBlock={viewBlock}
              titleBlock={leftItem}
              controlParamsClear={controlParamsClear}
            />
          )}
      </React.Fragment>
    )
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
      .catch(() => {
        dispatch(showLoder({ createDropInvoiceRequest: 0 }))
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

  return (
    <div className="innerFinance">
      <ToastContainer />
      <AuctionTransportFinanceTop
        getToastSucces={getToastSucces}
        getToastError={getToastError}
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
        setPay_info={setPay_info}
        autoInfo={autoInfo}
      />

      <div className="itemFinance">
        <AuctionTransportFinance
          getToastSucces={getToastSucces}
          getToastError={getToastError}
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
          pay_info={pay_info}
        />
        <AuctionTransportFinance
          getToastSucces={getToastSucces}
          getToastError={getToastError}
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

export default AuctionTransportFinanceCreate
