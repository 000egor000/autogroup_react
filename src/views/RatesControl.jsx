import React, { useState, useEffect } from 'react'

import Searates from '../components/Searates'
import Inlandrates from '../components/Inlandrates'
import Docfess from '../components/Docfess'
import FreeRates from '../components/FreeRates'
import { useParams } from 'react-router-dom'

const RatesControl = ({ nameRates, currentRates, dataArray }) => {
  const pathUrl = document.location.pathname.split('/')
  const [viewControler, setViewControler] = useState([])
  const { nameRatesLink } = useParams()

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  let controlRoleView = () => {
    if (
      Object.keys(
        JSON.parse(window.sessionStorage.getItem('access_rights'))
      ).includes('fee_rates')
    ) {
      let initialValue = JSON.parse(
        window.sessionStorage.getItem('access_rights')
      ).fee_rates.access_rights

      setViewControler(initialValue)
    }
  }

  let viewBlock = (id) => {
    let bool = false
    viewControler.forEach((el) => (el.id === id ? (bool = true) : false))
    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  const viewComponents = (currentUrl) => {
    switch (currentUrl) {
      case 'inlandrates':
        return (
          <Inlandrates
            currentRates={currentRates}
            viewBlock={viewBlock}
            dataArray={dataArray}
          />
        )
      case 'searatesconsolidation':
        return (
          <Searates
            currentRates={currentRates}
            viewBlock={viewBlock}
            dataArray={dataArray}
          />
        )
      case 'docfees':
        return (
          <Docfess
            currentRates={currentRates}
            viewBlock={viewBlock}
            dataArray={dataArray}
          />
        )

      case 'fee_rates':
        return <FreeRates currentRates={currentRates} viewBlock={viewBlock} />
      default:
        switch (nameRatesLink) {
          case 'fee_rates':
            return (
              <FreeRates currentRates={nameRatesLink} viewBlock={viewBlock} />
            )
          case 'searatesconsolidation':
            return <Searates viewBlock={viewBlock} dataArray={dataArray} />

          default:
            return console.log('incorrect value')
        }
    }
  }

  return <div className="dropBlock--inner">{viewComponents(nameRates)}</div>
}
export default RatesControl
