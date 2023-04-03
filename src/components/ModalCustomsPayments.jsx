import React, { useEffect, useState } from 'react'
import 'rsuite/dist/rsuite.min.css'

import { Close } from '@rsuite/icons'
import PropTypes from 'prop-types'
import {
  dataYearOld,
  dataTypeEngine,
  customsDutyRatesYearOld,
} from '../const.js'
const ModalCustomsPayments = ({
  isVisible = false,
  onClose,
  customsPayProps,
}) => {
  const keydownHandler = ({ key }) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
      default:
    }
  }

  const [dataYearOldSelect, setDataYearOldSelect] = useState(
    dataYearOld[0]['id']
  )

  const [dataTypeEngineSelect, setDataTypeEngineSelect] = useState(
    dataTypeEngine[0]
  )

  const [containerInsurance, setContainerInsurance] = useState(false)
  const [customsPrivilege, setCustomsPrivilege] = useState(false)
  const [priseAuto, setPriseAuto] = useState('')
  const [volumeAuto, setVolumeAuto] = useState('')

  const [customsClearance, setCustomsClearance] = useState(0)
  const [flatRate, setFlatRate] = useState({ prise: 0 })
  const [recyclingCollection, setRecyclingCollection] = useState(0)
  const [allPriseCustoms, setAllPriseCustoms] = useState(0)
  const [currentExchangeRate, setCurrentExchangeRate] = useState({})
  const [nds, setNds] = useState(0)

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => document.removeEventListener('keydown', keydownHandler)
  })

  useEffect(() => {
    if (+dataTypeEngineSelect === 2) setVolumeAuto(1)
    if (!priseAuto) setNds('')
  }, [dataTypeEngineSelect, priseAuto])

  //: USD_ID==431,EUR?ID==451

  useEffect(() => {
    fetch('https://www.nbrb.by/API/ExRates/Rates?Periodicity=0')
      .then(function (response) {
        return response.json()
      })
      .then((data) => {
        const USD = 431
        const EUR = 451
        let newObjNow = new Object()

        data.map((el) => {
          if (+el.Cur_ID === USD) {
            newObjNow['USD'] = el.Cur_OfficialRate
          }
          if (+el.Cur_ID === EUR) {
            newObjNow['EUR'] = el.Cur_OfficialRate
          }
        })

        setCurrentExchangeRate(newObjNow)
      })
  }, [])

  const getCurrencyTransfer = (val) => {
    const blrTransfer = val * currentExchangeRate.EUR
    const usdTransfer = blrTransfer / currentExchangeRate.USD
    return usdTransfer
  }
  const getNds = () => {
    return setNds((+priseAuto * 0.2).toFixed(2))
  }

  useEffect(() => {
    if (priseAuto) {
      if (volumeAuto || +dataTypeEngineSelect === 2) {
        getInsurance()
        setCustomsClearance(45)
        getDisposal()
        getNds()
      } else {
        setCustomsClearance(0)
        setFlatRate({ prise: 0 })
        setRecyclingCollection(0)
      }
    } else {
      setCustomsClearance(0)
      setFlatRate({ prise: 0 })
      setRecyclingCollection(0)
    }
  }, [
    priseAuto,
    volumeAuto,
    dataTypeEngineSelect,
    dataYearOldSelect,
    currentExchangeRate,
  ])

  // Утилизация
  const getDisposal = () => {
    const disposal = [544.5, 816.7, 1225.1]
    let logic = 1 / +currentExchangeRate.USD
    switch (+dataYearOldSelect) {
      case 1:
        return setRecyclingCollection((disposal[0] * logic).toFixed(2))
      case 2:
      case 3:
        return setRecyclingCollection((disposal[1] * logic).toFixed(2))
      case 4:
        return setRecyclingCollection((disposal[2] * logic).toFixed(2))

      default:
        return setRecyclingCollection(0)
    }
  }

  const getInsurance = () => {
    switch (+dataYearOldSelect) {
      case 1:
        return customsDutyRatesYearOld[0].rates.map((elChaild) => {
          let priseInterval = elChaild.prise.split('-')
          if (+dataTypeEngineSelect !== 2) {
            if (
              getCurrencyTransfer(+priseInterval[0] * 1000) <= +priseAuto &&
              +priseAuto <= getCurrencyTransfer(+priseInterval[1] * 1000)
            ) {
              if (+priseAuto <= getCurrencyTransfer(+elChaild.rate * 1000)) {
                return setFlatRate({
                  prise: Number(
                    getCurrencyTransfer(+elChaild.rate * 1000) *
                      (volumeAuto / 1000)
                  ).toFixed(2),
                  interestel: elChaild.rate + 'euro',
                })
              }

              return setFlatRate({
                prise: Number(+priseAuto * (elChaild.interest / 100)).toFixed(
                  2
                ),
                interestel: elChaild.interest + '%',
              })
            }
          } else {
            return setFlatRate({
              prise: Number(+priseAuto / 6.66666667).toFixed(2),
              interestel: '-',
            })
          }
        })

      case 2:
        return customsDutyRatesYearOld[1].rates.map((elChaild) => {
          let priseInterval = elChaild.volume.split('-')
          if (+dataTypeEngineSelect !== 2) {
            if (
              +volumeAuto / 1000 >= priseInterval[0] &&
              +volumeAuto / 1000 <= priseInterval[1]
            ) {
              return setFlatRate({
                prise: Number(
                  (+volumeAuto / 1000) *
                    getCurrencyTransfer(+elChaild.rate * 1000)
                ).toFixed(2),
                interestel: elChaild.rate + 'euro',
              })
            }
          } else {
            return setFlatRate({
              prise: Number(+priseAuto / 6.66666667).toFixed(2),
              interestel: '-',
            })
          }
        })

      case 3:
      case 4:
        return customsDutyRatesYearOld[2].rates.map((elChaild) => {
          let priseInterval = elChaild.volume.split('-')
          if (+dataTypeEngineSelect !== 2) {
            if (
              +volumeAuto / 1000 >= priseInterval[0] &&
              +volumeAuto / 1000 <= priseInterval[1]
            ) {
              return setFlatRate({
                prise: Number(
                  (+volumeAuto / 1000) *
                    getCurrencyTransfer(+elChaild.rate * 1000)
                ).toFixed(2),
                interestel: elChaild.rate + 'euro',
              })
            }
          } else {
            return setFlatRate({
              prise: Number(+priseAuto / 6.66666667).toFixed(2),
              interestel: '-',
            })
          }
        })

      default:
        break
    }
  }

  //Таможенная льгота
  //Страховка контейнера
  useEffect(() => {
    let ndsCurren =
      +dataYearOldSelect === 3 || +dataYearOldSelect === 4 ? nds : 0

    let resInitial =
      Number(customsClearance) +
      Number(flatRate.prise) +
      Number(recyclingCollection) +
      Number(ndsCurren)

    if (priseAuto && volumeAuto) {
      let resSumPrivilege = resInitial / 2
      let resSumInsurance = Number(resInitial) + Number(priseAuto) * 0.012

      if (customsPrivilege) {
        return getFillData(
          containerInsurance ? resSumInsurance / 2 : resSumPrivilege
        )
      } else if (containerInsurance) {
        return getFillData(
          customsPrivilege ? resSumInsurance / 2 : resSumInsurance
        )
      }

      getFillData(resInitial)
    }

    return () => {
      getFillData(0)
    }
  }, [
    customsClearance,
    recyclingCollection,
    customsPrivilege,
    priseAuto,
    volumeAuto,
    containerInsurance,
    flatRate,
  ])

  const getFillData = (val) => {
    setAllPriseCustoms(val.toFixed(2))
    customsPayProps(val.toFixed(2))
  }

  return !isVisible ? null : (
    <div
      className="modalCustomBlock modalCustomBlock--payments"
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-close" onClick={onClose}>
            <Close />
          </span>
        </div>
        <div className="modal-body">
          <div className="modal-content">
            <div className="itemInnerModal">
              <div className="blockContentModalPayments">
                <div className="dropBlockPayments">
                  <h3>Расчёт таможенных платежей</h3>

                  <label>
                    <span>Стоимость авто с учётом актуального сбора</span>

                    <input
                      type="text"
                      // disabled={}
                      value={priseAuto}
                      onChange={(e) => {
                        setPriseAuto(e.target.value)
                      }}
                    />
                  </label>

                  <label>
                    <span>Возраст автомобиля</span>

                    {dataYearOld.length > 0 ? (
                      <select
                        value={dataYearOldSelect}
                        onChange={(event) =>
                          setDataYearOldSelect(event.target.value)
                        }
                      >
                        {dataYearOld.map((elem) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.title}
                            </option>
                          )
                        })}
                      </select>
                    ) : (
                      'Нет данных!'
                    )}
                  </label>
                  <label>
                    <span>Тип двигателя</span>

                    {dataTypeEngine.length > 0 ? (
                      <select
                        value={dataTypeEngineSelect}
                        onChange={(event) =>
                          setDataTypeEngineSelect(event.target.value)
                        }
                      >
                        {dataTypeEngine.map((elem) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.title}
                            </option>
                          )
                        })}
                      </select>
                    ) : (
                      'Нет данных!'
                    )}
                  </label>
                  {+dataTypeEngineSelect !== 2 && (
                    <label>
                      <span>Объём двигателя, см куб.</span>

                      <input
                        type="text"
                        value={volumeAuto}
                        onChange={(e) => {
                          setVolumeAuto(e.target.value)
                        }}
                      />
                    </label>
                  )}

                  <label>
                    <span style={{ fontWeight: 400 }}>
                      Страховка контейнера
                    </span>

                    <input
                      type="checkbox"
                      value={containerInsurance}
                      onChange={(e) => {
                        setContainerInsurance(!containerInsurance)
                      }}
                    />
                  </label>
                  <label>
                    <span style={{ fontWeight: 400 }}>Таможенная льгота</span>

                    <input
                      type="checkbox"
                      value={customsPrivilege}
                      onChange={(e) => {
                        setCustomsPrivilege(!customsPrivilege)
                      }}
                    />
                  </label>
                </div>
                <div className="dropBlockPayments">
                  <h3>Таможенные платежи (ЕТС)</h3>

                  <label>
                    <span>Таможенное оформление</span>
                    <span>
                      {customsClearance ? customsClearance + '$' : 0 + '$'}
                    </span>
                  </label>
                  <label style={{ color: 'blue' }}>
                    <span>ставка</span>
                    <span>{flatRate ? flatRate.interestel : '-'}</span>
                  </label>
                  <label>
                    <span>Единая ставка</span>
                    <span>{flatRate ? flatRate.prise + '$' : 0 + '$'}</span>
                  </label>
                  {+dataTypeEngineSelect === 2 &&
                    (+dataYearOldSelect === 3 || +dataYearOldSelect === 4) && (
                      <label>
                        <span>НДС</span>
                        <span>{nds ? nds + '$' : 0 + '$'}</span>
                      </label>
                    )}

                  <label>
                    <span>Утилизационный сбор</span>
                    <span>
                      {recyclingCollection
                        ? recyclingCollection + '$'
                        : 0 + '$'}
                    </span>
                  </label>

                  <label>
                    <span>Итого</span>
                    <span>{allPriseCustoms + '$'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ModalCustomsPayments.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  customsPayProps: PropTypes.func,
}

export default ModalCustomsPayments
