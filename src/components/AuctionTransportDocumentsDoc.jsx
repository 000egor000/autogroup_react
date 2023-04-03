import React, { useState, useContext, useEffect } from 'react'
import { config } from '../config.js'

import { getRequest, getRequestFile } from '../base/api-request'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import nextId from 'react-id-generator'
import PropTypes from 'prop-types'

const AuctionTransportDocumentsDoc = ({
  itemStatus,
  idItem,
  invoiceInformationId,
  // getArrayCustomer,
}) => {
  const [customerInformationArray, setCustomerInformationArray] = useState([])
  const { dispatch } = useContext(ContextApp)

  // console.log(typeof invoiceInformationId)
  useEffect(() => {
    dispatch(showLoder({ invoice: 1 }))
    getRequest(`/api/v1/order/invoice/${idItem}/info`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setCustomerInformationArray(res.invoice_information)
        dispatch(showLoder({ invoice: 0 }))
      })
      .catch((err) => {
        dispatch(showLoder({ invoice: 0 }))
      })
  }, [invoiceInformationId])

  const getFileFunc = (idInvoice) => {
    dispatch(showLoder({ getFileFunc: 1 }))
    getRequestFile(`/api/v1/order/invoice/${idInvoice}/download`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,

      'Content-Type': 'application/doc',
    })
      .then((response) => {
        const url = `${config.backRequest + '/' + response.path}`
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', response.name)
        document.body.appendChild(link)
        link.click()
        dispatch(showLoder({ getFileFunc: 0 }))
      })
      .catch((err) => dispatch(showLoder({ getFileFunc: 0 })))
  }

  return (
    <div
      className="accessUsers accessUsers--doc"
      style={{ display: itemStatus ? 'block' : 'none' }}
    >
      <div className="contentBlockTop">
        <div className="dropBlockContent dropBlockContent--doc dropBlockContent--file">
          <label>
            <h2>Документы для оплаты на аукцион</h2>
            {customerInformationArray.length > 0 &&
              customerInformationArray.map((elem, i) => (
                <a key={nextId()} onClick={() => getFileFunc(elem.id)} href="#">
                  {i + 1 + '. ' + elem.name}
                </a>
              ))}
          </label>
        </div>
      </div>
    </div>
  )
}

AuctionTransportDocumentsDoc.propTypes = {
  itemStatus: PropTypes.bool,
  idItem: PropTypes.string,
  invoiceInformationId: PropTypes.number,
}

export default AuctionTransportDocumentsDoc
