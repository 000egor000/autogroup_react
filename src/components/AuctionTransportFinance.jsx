import React, { useState, useEffect, useContext, memo } from 'react'
import { postRequest, putRequest } from '../base/api-request'

import nextId, { setPrefix } from 'react-id-generator'
// import { More } from '@rsuite/icons'

import {
  Modal,
  // Animation,
  Dropdown,
  // SelectPicker,
  Whisper,
  Tooltip,
} from 'rsuite'

import PropTypes from 'prop-types'

import ContextApp from '../context/contextApp.js'

import { showLoder } from '../reducers/actions'

import {
  addSelectArray,
  //  btnShow,
  arrayPort,
  dataAdd,
} from '../const.js'
import { controlNumber, controlTitle } from '../helper.js'

const AuctionTransportFinance = ({
  flagSendReq,
  dataPriseObject,
  getStartInfo,
  titleBlock,
  dataResult,
  getCurrentAucFunc,
  propsId,
  statusFunc,
  financeDateArray,
  getFinanceArray,
  viewBlock,
  shortInfoArray,
  carrierArray,
  pay_info,
  controlDataSelect,
  dataCarters,
  dataPorts,
  autoInfo,
  controlArray,
}) => {
  const [statusFinance, setStatusFinance] = useState(false)

  const [addSelectStorage, setAddSelectStorage] = useState(addSelectArray[0].id)
  const [addSelectLate, setAddSelectLate] = useState(addSelectArray[0].id)
  const [addSelectMailing, setAddSelectMailing] = useState(addSelectArray[0].id)
  const [accessRights, setAccessRights] = useState([])
  const [dateValueGeneration, setDateValueGeneration] = useState([])
  // const [dateValueGenerationTop, setDateValueGenerationTop] = useState([])

  const [docFeeCarrier, setDocFeeCarrier] = useState('')
  const [agFeeCarrier, setAgFeeCarrier] = useState('')
  const [bySeaCarrier, setBySeaCarrier] = useState('')
  const [byLandCarrier, setByLandCarrier] = useState('')

  // const [carrierArray, setCarrierArray] = useState([])
  const [carrierSelect, setCarrierSelect] = useState('')
  const [byLand, setByLand] = useState(0)
  const [bySea, setBySea] = useState(0)
  const [DocFee, setDocFee] = useState(0)
  const [unloading, setUnloading] = useState('')
  const [addThree, setAddThree] = useState('')
  const [InterTradeAccount, setInterTradeAccount] = useState('')
  const [preBid, setPreBid] = useState('')
  const [storageFee, setStorageFee] = useState('')
  const [byClient, setByClient] = useState('')
  const [byAg, setByAg] = useState('')
  const [speedCall, setSpeedCall] = useState('')
  const [latePaymentFee, setLatePaymentFee] = useState('')
  const [mailingFee, setMailingFee] = useState('')
  const [evFee, setEvFee] = useState('')
  const [currentRes, setCurrentRes] = useState('')
  const [agFee, setAgFee] = useState(0)
  // const [showDrop, setShowDrop] = useState(false)
  // const [placement, setPlacement] = useState('right')
  // const [getCurrentAuc, setGetCurrentAuc] = useState('')
  const [isModalClose, setIsModalClose] = useState(false)
  const [isModalFillContainer, setIsModalFillContainer] = useState(false)
  const [countAdditionalPay, setCountAdditionalPay] = useState(0)
  // const [dataPriseObject, setDataPriseObject] = useState('')

  // const statusRole = viewBlock(49) && !viewBlock(50)
  const { state, dispatch } = useContext(ContextApp)
  const role = ['office', 'dealer', 'logist']
  const roleParams = JSON.parse(window.sessionStorage.getItem('role')).code

  const pathCurrent = window.location.pathname

  const addDesabled = () => roleParams === role[0] || roleParams === role[1]

  useEffect(() => {
    let addSumWithInitial = 0
    const countArray = [
      byLand,
      bySea,
      DocFee,
      agFee !== '-' && agFee,
      unloading,
      addThree,
      InterTradeAccount,
      preBid,
      storageFee,
      speedCall,
      latePaymentFee,
      mailingFee,
      evFee,
    ]
    const sumWithInitial = countArray.reduce(
      (previousValue, currentValue) =>
        Number(previousValue) + Number(currentValue)
    )
    if (dateValueGeneration.length > 0)
      dateValueGeneration.map((elem) => (addSumWithInitial += +elem.value))

    setCurrentRes(
      (sumWithInitial + addSumWithInitial + countAdditionalPay).toFixed(2)
    )

    return () => {
      setCurrentRes('')
    }
  }, [
    byLand,
    bySea,
    DocFee,
    unloading,
    addThree,
    InterTradeAccount,
    preBid,
    storageFee,
    byClient,
    byAg,
    speedCall,
    latePaymentFee,
    mailingFee,
    evFee,
    dateValueGeneration,
    agFee,
    countAdditionalPay,
  ])

  useEffect(() => {
    let count = 0
    if (financeDateArray.length > 0 && financeDateArray.at(-1).pay_info) {
      const {
        yardStorageFee,
        latePaymentFee,
        mailingFee,
        dateValueGenerationTop,
      } = JSON.parse(financeDateArray.at(-1).pay_info)

      if (
        JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
          'yardStorageFee'
        ) &&
        JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
          'latePaymentFee'
        ) &&
        JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
          'mailingFee'
        ) &&
        JSON.parse(financeDateArray.at(-1).pay_info).hasOwnProperty(
          'dateValueGenerationTop'
        )
      ) {
        if (yardStorageFee.title && yardStorageFee.pay == 2) {
          count += +yardStorageFee.title
        }
        if (latePaymentFee.title && latePaymentFee.pay == 2) {
          count += +latePaymentFee.title
        }
        if (mailingFee.title && mailingFee.pay == 2) {
          count += +mailingFee.title
        }
        if (dateValueGenerationTop.length > 0) {
          dateValueGenerationTop.map((elem) => {
            if (elem.pay == 2) {
              count += +elem.value
            }
          })
        }
      }
    }

    setCountAdditionalPay(+count)
  }, [financeDateArray])

  useEffect(() => {
    if (carrierArray.length > 0 && currentRes) {
      dataResult(currentRes)
    }
    return () => dataResult('')
  }, [currentRes, carrierArray])

  useEffect(() => {
    if (carrierArray.length > 0) {
      let filterData = carrierArray.filter((elem) => +elem.id == +carrierSelect)

      if (filterData.length > 0) {
        // setGetCurrentAuc(filterData[0]['title'])
        getCurrentAucFunc(filterData[0]['title'])
      }
    }
    return () => {
      // setGetCurrentAuc('')
      getCurrentAucFunc('')
    }
  }, [carrierSelect, carrierArray])

  useEffect(() => {
    setByClient(storageFee - byAg)
    return setByClient('')
  }, [byClient, byAg, storageFee])

  useEffect(() => {
    if (carrierSelect && titleBlock !== 'AG Logist') {
      getStartInfo(carrierSelect)
    }
  }, [carrierSelect])

  useEffect(() => {
    if (carrierArray.length > 0) controlPrise()
    return () => {
      setByLand(0)
      setBySea(0)
      setDocFee(0)
      setAgFee(0)
    }
  }, [carrierSelect, dataPriseObject, carrierArray, titleBlock])

  const controlPrise = () => {
    if (titleBlock !== 'AG Logist') {
      if (
        (bySea || byLand || DocFee) &&
        financeDateArray.length > 0 &&
        +financeDateArray.at(-1).carrier_id === +carrierSelect
      ) {
        if (financeDateArray.at(-1).usa_finance) {
          const {
            byLand,
            bySea,
            DocFee,
            byLandCarrier,
            bySeaCarrier,
            docFeeCarrier,
          } = JSON.parse(financeDateArray.at(-1).usa_finance)

          setByLand(byLand ? byLand : 0)
          setBySea(bySea ? bySea : 0)
          setDocFee(DocFee ? DocFee : 0)

          setByLandCarrier(byLandCarrier ? byLandCarrier : carrierArray[0].id)
          setBySeaCarrier(bySeaCarrier ? bySeaCarrier : carrierArray[0].id)
          setDocFeeCarrier(docFeeCarrier ? docFeeCarrier : carrierArray[0].id)
        }
      } else {
        setByLand(
          dataPriseObject.inlandPriceAec ? dataPriseObject.inlandPriceAec : 0
        )
        setBySea(dataPriseObject.seaPriceAec ? dataPriseObject.seaPriceAec : 0)
        setDocFee(dataPriseObject.docPriceAec ? dataPriseObject.docPriceAec : 0)

        setByLandCarrier(carrierArray[0].id)
        setBySeaCarrier(carrierArray[0].id)
        setDocFeeCarrier(carrierArray[0].id)
      }
    } else {
      if ((bySea || byLand || DocFee || agFee) && financeDateArray.length > 0) {
        if (financeDateArray.at(-1).ag_finance) {
          const {
            byLand,
            bySea,
            DocFee,
            agFee,
            byLandCarrier,
            bySeaCarrier,
            docFeeCarrier,
            agFeeCarrier,
          } = JSON.parse(financeDateArray.at(-1).ag_finance)

          setByLand(byLand ? byLand : 0)
          setBySea(bySea ? bySea : 0)
          setDocFee(DocFee ? DocFee : 0)
          setAgFee(agFee ? agFee : 0)

          setByLandCarrier(byLandCarrier ? byLandCarrier : carrierArray[0].id)
          setBySeaCarrier(bySeaCarrier ? bySeaCarrier : carrierArray[0].id)
          setDocFeeCarrier(docFeeCarrier ? docFeeCarrier : carrierArray[0].id)
          setAgFeeCarrier(agFeeCarrier ? agFeeCarrier : carrierArray[0].id)
        }
      } else {
        setByLand(
          dataPriseObject.inlandPriceAg ? dataPriseObject.inlandPriceAg : 0
        )
        setBySea(dataPriseObject.seaPriceAg ? dataPriseObject.seaPriceAg : 0)
        setDocFee(dataPriseObject.docPriceAg ? dataPriseObject.docPriceAg : 0)

        setByLandCarrier(carrierArray[0].id)
        setBySeaCarrier(carrierArray[0].id)
        setDocFeeCarrier(carrierArray[0].id)

        if (dataPriseObject.agFee !== '-') {
          setAgFee(dataPriseObject.agFee ? dataPriseObject.agFee : 0)
          setAgFeeCarrier(carrierArray[0].id)
        }
      }
    }
  }

  useEffect(() => {
    let res = carrierSelect
    if (titleBlock !== 'AG Logist') {
      if (dataPriseObject.code) {
        if (dataPriseObject.carrier) {
          res = dataPriseObject.carrier.id
        }
      }
    }

    setCarrierSelect(res)
  }, [dataPriseObject, titleBlock])

  useEffect(() => {
    let res = carrierSelect
    if (titleBlock !== 'AG Logist') {
      if (financeDateArray.length > 0) {
        res = financeDateArray.at(-1).carrier_id
      } else if (carrierArray.length > 0) {
        res = carrierArray[0].id
      }
    }

    setCarrierSelect(res)
  }, [carrierArray, financeDateArray])

  useEffect(() => {
    if (financeDateArray.length > 0) {
      if (financeDateArray.at(-1).usa_finance) {
        financeDateArray.map((elem) => {
          let result =
            elem.usa_finance && titleBlock !== 'AG Logist'
              ? JSON.parse(elem.usa_finance)
              : JSON.parse(elem.ag_finance)

          if (result != null) {
            // setCarrierSelect(elem.carrier_id)
            result.byLand && setByLand(result.byLand)
            result.bySea && setBySea(result.bySea)
            result.DocFee && setDocFee(result.DocFee)

            result.speedCall && setSpeedCall(result.speedCall)
            result.unloading && setUnloading(result.unloading)
            result.addThree && setAddThree(result.addThree)
            result.InterTradeAccount &&
              setInterTradeAccount(result.InterTradeAccount)
            result.preBid && setPreBid(result.preBid)
            result.storageFee && setStorageFee(result.storageFee)
            result.addSelectStorage &&
              setAddSelectStorage(result.addSelectStorage)
            result.byClient && setByClient(result.byClient)
            result.byAg && setByAg(result.byAg)
            result.latePaymentFee && setLatePaymentFee(result.latePaymentFee)
            result.addSelectLate && setAddSelectLate(result.addSelectLate)
            result.ailingFee && setMailingFee(result.ailingFee)
            result.addSelectMailing &&
              setAddSelectMailing(result.addSelectMailing)
            result.evFee && setEvFee(result.evFee)

            result.dateValueGeneration &&
              setDateValueGeneration(result.dateValueGeneration)

            result.accessRights && setAccessRights(result.accessRights)
            result.resultPrice && setCurrentRes(result.resultPrice)
          } else {
          }
        })
      }
      if (financeDateArray.at(-1).ag_finance) {
        financeDateArray.map((elem) => {
          let result =
            elem.ag_finance && titleBlock === 'AG Logist'
              ? JSON.parse(elem.ag_finance)
              : JSON.parse(elem.usa_finance)

          // setCarrierSelect(elem.carrier_id)

          if (result != null) {
            result.byLand && setByLand(result.byLand)
            result.bySea && setBySea(result.bySea)
            result.DocFee && setDocFee(result.DocFee)
            result.agFee && setAgFee(result.agFee)
            result.speedCall && setSpeedCall(result.speedCall)
            result.unloading && setUnloading(result.unloading)
            result.addThree && setAddThree(result.addThree)
            result.InterTradeAccount &&
              setInterTradeAccount(result.InterTradeAccount)
            result.preBid && setPreBid(result.preBid)
            result.storageFee && setStorageFee(result.storageFee)
            result.addSelectStorage &&
              setAddSelectStorage(result.addSelectStorage)
            result.byClient && setByClient(result.byClient)
            result.byAg && setByAg(result.byAg)
            result.latePaymentFee && setLatePaymentFee(result.latePaymentFee)
            result.addSelectLate && setAddSelectLate(result.addSelectLate)
            result.ailingFee && setMailingFee(result.ailingFee)
            result.addSelectMailing &&
              setAddSelectMailing(result.addSelectMailing)
            result.evFee && setEvFee(result.evFee)

            result.accessRights && setAccessRights(result.accessRights)
            result.resultPrice && setCurrentRes(result.resultPrice)
          }
        })
      }
    }
    // return () => {
    //   setCarrierSelect('')
    //   setByLand('')
    //   setBySea('')
    //   setDocFee('')
    //   setSpeedCall('')
    //   setUnloading('')
    //   setAddThree('')
    //   setInterTradeAccount('')
    //   setPreBid('')
    //   setStorageFee('')
    //   setAddSelectStorage('')
    //   setByClient('')
    //   setByAg('')
    //   setLatePaymentFee('')
    //   setAddSelectLate('')
    //   setMailingFee('')
    //   setAddSelectMailing('')
    //   setEvFee('')
    //   setDateValueGeneration([])
    //   setAccessRights('')
    //   setCurrentRes('')
    // }
  }, [financeDateArray])

  useEffect(() => {
    if (financeDateArray.length > 0) {
      let ag_finance =
        financeDateArray.at(-1).ag_finance !== null &&
        JSON.parse(financeDateArray.at(-1).ag_finance).statusFinance

      let usa_finance =
        financeDateArray.at(-1).usa_finance !== null &&
        JSON.parse(financeDateArray.at(-1).usa_finance).statusFinance

      if (ag_finance && usa_finance) statusFunc(true)
      if (titleBlock === 'AG Logist')
        setStatusFinance(ag_finance ? true : false)
      if (titleBlock !== 'AG Logist')
        setStatusFinance(usa_finance ? true : false)
    }
    return () => {
      setStatusFinance(false)
      statusFunc(false)
    }
  }, [financeDateArray, titleBlock])

  // const handleToggle = (placement) => {
  //   setShowDrop(!showDrop)
  //   setPlacement(placement)
  // }

  let generatorArray = (val) => {
    let container = []
    setPrefix('')
    container.push({
      id: nextId(),
      title: '',
      value: '',
      carrier: '',
      dataArrayInitial: val,
    })
    setDateValueGeneration([...dateValueGeneration, ...container])
  }
  // let generatorArrayCarrier = (val) => {
  //   let container = []
  //   setPrefix('')
  //   container.push({
  //     id: nextId(),
  //     title: 'KLP-MSQ',
  //     value: '',
  //     carrier: '',
  //     dataArrayInitial: val,
  //   })
  //   setDateValueGeneration([...dateValueGeneration, ...container])
  // }

  const generationInput = (val, change) => {
    let changeObject = []
    dateValueGeneration.map((elem) =>
      changeObject.push(
        elem.id === val.id ? { ...elem, ...change } : { ...elem }
      )
    )
    setDateValueGeneration(changeObject)
  }

  // const handleAccessRights = (id) => {
  //   let filtered = accessRights.filter((e) => id === e)

  //   if (filtered.length > 0) {
  //     let removeAccessRights = accessRights.filter((e) => e !== id)
  //     setAccessRights(removeAccessRights)
  //   } else {
  //     setAccessRights([...accessRights, id])
  //   }

  //   dateValueGeneration.map((elem) =>
  //     elem.title || elem.value ? null : setDateValueGeneration([])
  //   )
  //   dateValueGenerationTop.map((elem) =>
  //     elem.title || elem.value ? null : setDateValueGenerationTop([])
  //   )
  // }

  // const isChecked = (id) => {
  //   if (accessRights.length > 0) {
  //     let filtered = accessRights.filter((e) => e === id)

  //     let bool = filtered.length > 0 ? true : false
  //     return bool
  //   }
  // }

  // const viewComponents = (idBlock) => {
  //   switch (idBlock) {
  //     case 'Быстрый вызов':
  //       return (
  //         <label>
  //           <span>Быстрый вызов</span>
  //           <input
  //             type="text"
  //             placeholder="Выгрузка Клайпеда"
  //             value={speedCall}
  //             onChange={(e) => setSpeedCall(controlNumber(e.target.value))}
  //             onBlur={() =>
  //               controlData({
  //                 statusView: false,
  //               })
  //             }
  //             disabled={statusFinance}
  //           />
  //         </label>
  //       )
  //     case 'Выгрузка Клайпеда':
  //       return (
  //         <label>
  //           <span>Выгрузка Клайпеда</span>
  //           <input
  //             type="text"
  //             placeholder="Выгрузка Клайпеда"
  //             value={unloading}
  //             onChange={(e) => setUnloading(controlNumber(e.target.value))}
  //             onBlur={() =>
  //               controlData({
  //                 statusView: false,
  //               })
  //             }
  //             disabled={statusFinance}
  //           />
  //         </label>
  //       )
  //     case 'Доп за тройку':
  //       return (
  //         <label>
  //           <span>Доп за тройку</span>
  //           <input
  //             type="text"
  //             placeholder="Доп за тройку"
  //             value={addThree}
  //             onChange={(e) => setAddThree(controlNumber(e.target.value))}
  //             onBlur={() =>
  //               controlData({
  //                 statusView: false,
  //               })
  //             }
  //             disabled={statusFinance}
  //           />
  //         </label>
  //       )
  //     case 'InterTrade account':
  //       return (
  //         <label>
  //           <span>InterTrade account</span>
  //           <input
  //             type="text"
  //             placeholder="InterTrade account"
  //             value={InterTradeAccount}
  //             onChange={(e) =>
  //               setInterTradeAccount(controlNumber(e.target.value))
  //             }
  //             onBlur={() =>
  //               controlData({
  //                 statusView: false,
  //               })
  //             }
  //             disabled={statusFinance}
  //           />
  //         </label>
  //       )
  //     case 'Pre-bid / InterTrade account':
  //       return (
  //         <label>
  //           <span> Pre-bid / InterTrade account</span>
  //           <input
  //             type="text"
  //             placeholder="Pre-bid / InterTrade account"
  //             value={preBid}
  //             onChange={(e) => setPreBid(controlNumber(e.target.value))}
  //             onBlur={() =>
  //               controlData({
  //                 statusView: false,
  //               })
  //             }
  //             disabled={statusFinance}
  //           />
  //         </label>
  //       )

  //     case 'Storage fee':
  //       return (
  //         <React.Fragment>
  //           <label>
  //             <span> Storage fee</span>
  //             <div className="customPosition">
  //               <input
  //                 type="text"
  //                 placeholder="Storage fee"
  //                 value={storageFee}
  //                 onChange={(e) => setStorageFee(controlNumber(e.target.value))}
  //                 onBlur={() =>
  //                   controlData({
  //                     statusView: false,
  //                   })
  //                 }
  //                 disabled={statusFinance}
  //               />
  //               <select
  //                 value={addSelectStorage}
  //                 onChange={(event) => setAddSelectStorage(event.target.value)}
  //                 onBlur={() =>
  //                   controlData({
  //                     statusView: false,
  //                   })
  //                 }
  //                 disabled={statusFinance}
  //               >
  //                 {addSelectArray.map((elem, i) => {
  //                   return (
  //                     <option key={elem.id} value={elem.id}>
  //                       {elem.id}
  //                     </option>
  //                   )
  //                 })}
  //               </select>
  //             </div>
  //           </label>

  //           <label>
  //             <span style={{ paddingLeft: '20px' }}>- by Client</span>
  //             <input
  //               type="text"
  //               placeholder="byClient"
  //               value={byClient}
  //               onChange={(e) => setByClient(controlNumber(e.target.value))}
  //               onBlur={() =>
  //                 controlData({
  //                   statusView: false,
  //                 })
  //               }
  //               disabled={statusFinance}
  //             />
  //           </label>
  //           <label>
  //             <span style={{ paddingLeft: '20px' }}>- by AG Logistic</span>
  //             <input
  //               type="text"
  //               placeholder="by AG Logistic"
  //               value={byAg}
  //               onChange={(e) => setByAg(controlNumber(e.target.value))}
  //               onBlur={() =>
  //                 controlData({
  //                   statusView: false,
  //                 })
  //               }
  //               disabled={statusFinance}
  //             />
  //           </label>
  //         </React.Fragment>
  //       )
  //     case 'late payment fee':
  //       return (
  //         <div className="blockPay">
  //           <label>
  //             <span>late payment fee</span>
  //             <div className="customPosition">
  //               <input
  //                 type="text"
  //                 placeholder="late payment fee"
  //                 value={latePaymentFee}
  //                 onChange={(e) =>
  //                   setLatePaymentFee(controlNumber(e.target.value))
  //                 }
  //                 onBlur={() =>
  //                   controlData({
  //                     statusView: false,
  //                   })
  //                 }
  //                 disabled={statusFinance}
  //               />
  //               <select
  //                 value={addSelectLate}
  //                 onChange={(event) => setAddSelectLate(event.target.value)}
  //                 onBlur={() =>
  //                   controlData({
  //                     statusView: false,
  //                   })
  //                 }
  //                 disabled={statusFinance}
  //               >
  //                 {addSelectArray.map((elem, i) => {
  //                   return (
  //                     <option key={elem.id} value={elem.id}>
  //                       {elem.id}
  //                     </option>
  //                   )
  //                 })}
  //               </select>
  //             </div>
  //           </label>
  //         </div>
  //       )
  //     case 'mailing fee':
  //       return (
  //         <div className="blockPay">
  //           <label>
  //             <span>mailing fee</span>
  //             <div className="customPosition">
  //               <input
  //                 type="text"
  //                 placeholder="mailing fee"
  //                 value={mailingFee}
  //                 onChange={(e) => setMailingFee(controlNumber(e.target.value))}
  //                 onBlur={() =>
  //                   controlData({
  //                     statusView: false,
  //                   })
  //                 }
  //                 disabled={statusFinance}
  //               />
  //               <select
  //                 value={addSelectMailing}
  //                 onChange={(event) => setAddSelectMailing(event.target.value)}
  //                 onBlur={() =>
  //                   controlData({
  //                     statusView: false,
  //                   })
  //                 }
  //                 disabled={statusFinance}
  //               >
  //                 {addSelectArray.map((elem, i) => {
  //                   return (
  //                     <option key={elem.id} value={elem.id}>
  //                       {elem.id}
  //                     </option>
  //                   )
  //                 })}
  //               </select>
  //             </div>
  //           </label>
  //         </div>
  //       )
  //     case 'EV fee':
  //       return (
  //         <label>
  //           <span>EV fee</span>
  //           <input
  //             type="text"
  //             placeholder="EV fee"
  //             value={evFee}
  //             onChange={(e) => setEvFee(controlNumber(e.target.value))}
  //             onBlur={() =>
  //               controlData({
  //                 statusView: false,
  //               })
  //             }
  //             disabled={statusFinance}
  //           />
  //         </label>
  //       )
  //     default:
  //       return console.log('incorrect value')
  //   }
  // }

  const additionalBlock = ({ pay_info }) => {
    let view = []

    if (pay_info) {
      const {
        yardStorageFee,
        latePaymentFee,
        mailingFee,

        dateValueGenerationTop,
      } = JSON.parse(pay_info)

      if (
        yardStorageFee &&
        latePaymentFee &&
        mailingFee &&
        dateValueGenerationTop
      ) {
        if (yardStorageFee.title && yardStorageFee.pay == 2) {
          view.push(`  <label>
      <span>Yard storage fee</span>
      <input type="text" value='${yardStorageFee.title}' placeholder="Yard storage fee" disabled />
      <select style='visibility: hidden'/>
    </label>`)
        }
        if (latePaymentFee.title && latePaymentFee.pay == 2) {
          view.push(` <label>
      <span>Late payment fee</span>
      <input
        type="text"
        placeholder="Late payment fee"
       value='${latePaymentFee.title}'
        disabled
      />
      <select style='visibility: hidden'/>
    </label>`)
        }
        if (mailingFee.title && mailingFee.pay == 2) {
          view.push(
            ` <label>
       <span>Mailing fee</span>
       <input type="text " value='${mailingFee.title}' placeholder="Mailing fee" disabled />
       <select style='visibility: hidden'/>
     </label>`
          )
        }
        if (dateValueGenerationTop.length > 0) {
          dateValueGenerationTop.map((elem) => {
            if (elem.pay == 2) {
              view.push(`<div className="generationBlock">
          <div className="blockPay">
            <label key='${elem.id}'>
              <span>
                <input
                  type="text"
                  value='${elem.title}'
                  
                  style={{ width: '60%' }}
                  disabled
                />
              </span>
              <input type="text" value='${elem.value}' disabled />
              <select style='visibility: hidden'/>
            </label>
          </div>
        </div>`)
            }
          })
        }
      }

      return view.map((el) => <div dangerouslySetInnerHTML={{ __html: el }} />)
    }
  }

  useEffect(() => {
    if (flagSendReq) controlData(flagSendReq)
  }, [flagSendReq])

  //статус клика по кнопке сохранить
  const controlPayClickSave = ({
    statusClosePay,
    statusClosePayFinance,
    clickSave,
  }) => {
    if (statusClosePay) {
      return clickSave
        ? JSON.stringify({
            ...pay_info,
            statusClosePay: true,
            clickSave: true,
          })
        : JSON.stringify({ ...pay_info, statusClosePay: true })
    } else if (statusClosePayFinance) {
      return clickSave
        ? JSON.stringify({
            ...pay_info,
            statusClosePayFinance: true,
            clickSave: true,
          })
        : JSON.stringify({ ...pay_info, statusClosePayFinance: true })
    } else
      return clickSave
        ? JSON.stringify({ ...pay_info, clickSave: true })
        : JSON.stringify(pay_info)
  }
  const defaultCarrirer = () => {
    let res
    if (carrierSelect) {
      res = +carrierSelect
    } else if (
      financeDateArray.length > 0 &&
      financeDateArray.at(-1).carrier_id
    ) {
      res = +financeDateArray.at(-1).carrier_id
    } else if (carrierArray.length > 0) {
      res = carrierArray[0].id
    }
    return res
  }

  const controlData = ({
    statusView,
    statusClosePay,
    statusClosePayFinance,
    clickSave,
    controlBlockTop,
  }) => {
    const titleShiping =
      titleBlock !== 'AG Logist' ? 'usa_finance' : 'ag_finance'

    const paramsFunc = {
      [titleShiping]: JSON.stringify({
        docFeeCarrier: docFeeCarrier,
        agFeeCarrier: agFeeCarrier,
        bySeaCarrier: bySeaCarrier,
        byLandCarrier: byLandCarrier,

        byLand: byLand,
        bySea: bySea,
        DocFee: DocFee,
        agFee: agFee,
        speedCall: speedCall,
        unloading: unloading,
        addThree: addThree,
        InterTradeAccount: InterTradeAccount,
        preBid: preBid,
        storageFee: storageFee,
        addSelectStorage: addSelectStorage,
        byClient: byClient,
        byAg: byAg,
        latePaymentFee: latePaymentFee,
        addSelectLate: addSelectLate,
        mailingFee: mailingFee,
        addSelectMailing: addSelectMailing,
        evFee: evFee,
        dateValueGeneration: dateValueGeneration,
        accessRights: accessRights,
        resultPrice: currentRes,
        statusFinance: false,
      }),
      carrier_id: defaultCarrirer(),
      general_information_id: propsId,
      status_finance_confirm: false,
      status_finance_cash_confirm: false,
      pay_info: controlPayClickSave({
        statusClosePay,
        statusClosePayFinance,
        clickSave,
      }),
    }

    if (financeDateArray.length > 0) {
      const optionOne =
        financeDateArray.at(-1).usa_finance &&
        JSON.parse(financeDateArray.at(-1).usa_finance).statusFinance === true
      const optionTwo =
        financeDateArray.at(-1).ag_finance &&
        JSON.parse(financeDateArray.at(-1).ag_finance).statusFinance === true

      updateParams({
        paramsFunc,
        statusView,
        optionOne,
        optionTwo,
        titleShiping,
        controlBlockTop,
      })
    } else {
      createParams({ paramsFunc, statusView, titleShiping, controlBlockTop })
    }
  }

  const createParams = ({
    paramsFunc,
    statusView,
    titleShiping,
    controlBlockTop,
  }) => {
    let container = {}
    let flag = false

    if (controlBlockTop) {
      container = {
        ...paramsFunc,
        pay_info: paramsFunc.pay_info,
        status_finance_confirm: false,
        status_finance_cash_confirm: false,
      }
      flag = true
    } else {
      container = statusView
        ? {
            ...paramsFunc,
            status_finance_cash_confirm: false,
            [titleShiping]: JSON.stringify({
              ...JSON.parse(paramsFunc[titleShiping]),
              statusFinance: true,
            }),
          }
        : paramsFunc
    }
    createAuctionAuto(container, flag)
  }

  const updateParams = ({
    paramsFunc,
    statusView,
    optionOne,
    optionTwo,
    titleShiping,
    controlBlockTop,
  }) => {
    let container = {}
    let flag = false
    if (controlBlockTop) {
      container = {
        pay_info: paramsFunc.pay_info,
        status_finance_confirm: false,
        status_finance_cash_confirm: false,
      }
      flag = true
    } else if (optionOne) {
      container = statusView
        ? {
            ...paramsFunc,
            status_finance_confirm: true,
            status_finance_cash_confirm: true,
            ag_finance: JSON.stringify({
              ...JSON.parse(paramsFunc.ag_finance),
              statusFinance: statusView,
            }),
          }
        : {
            ...paramsFunc,
            status_finance_cash_confirm: false,
          }
    } else if (optionTwo) {
      container = statusView
        ? {
            ...paramsFunc,
            status_finance_confirm: true,
            status_finance_cash_confirm: false,

            usa_finance: JSON.stringify({
              ...JSON.parse(paramsFunc.usa_finance),
              statusFinance: statusView,
            }),
          }
        : paramsFunc
    } else {
      container = statusView
        ? {
            ...paramsFunc,
            status_finance_cash_confirm: false,
            [titleShiping]: JSON.stringify({
              ...JSON.parse(paramsFunc[titleShiping]),
              statusFinance: statusView,
            }),
          }
        : paramsFunc
    }

    updateAuctionAuto(container, flag)
  }

  const updateAuctionAuto = (val, flag) => {
    dispatch(showLoder({ updateAuctionAuto: 1 }))
    setIsModalClose(false)
    //Проверка на заполненность полей(если не соответствует-очищается!)
    let filterParams = []
    let resultParams = {}

    if (flag) {
      resultParams = val
    } else {
      if (val.usa_finance) {
        if (JSON.parse(val.usa_finance).statusFinance) {
          filterParams = JSON.parse(val.usa_finance).dateValueGeneration.filter(
            (el) => el.title && el.value
          )

          resultParams = {
            ...val,
            usa_finance: JSON.stringify({
              ...JSON.parse(val.usa_finance),
              dateValueGeneration: filterParams,
            }),
          }
        } else {
          resultParams = val
        }
      } else {
        if (JSON.parse(val.ag_finance).statusFinance) {
          filterParams = JSON.parse(val.ag_finance).dateValueGeneration.filter(
            (el) => el.title && el.value
          )
          resultParams = {
            ...val,
            ag_finance: JSON.stringify({
              ...JSON.parse(val.ag_finance),
              dateValueGeneration: filterParams,
            }),
          }
        } else {
          resultParams = val
        }
      }
    }

    putRequest(`/api/v1/order/finance/${financeDateArray.at(-1).id}`, {
      ...financeDateArray.at(-1),
      ...resultParams,
    })
      .then((res) => {
        getFinanceArray()
        dispatch(showLoder({ updateAuctionAuto: 0 }))
      })
      .catch((e) => {
        state.createNotification('Что-то пошло не так!', 'error')
        dispatch(showLoder({ updateAuctionAuto: 0 }))
      })
  }

  const createAuctionAuto = (params) => {
    dispatch(showLoder({ createAuctionAuto: 1 }))

    postRequest('/api/v1/order/finance', {
      ...financeDateArray.at(-1),
      ...params,
    })
      .then((res) => {
        getFinanceArray()
        setIsModalClose(false)

        dispatch(showLoder({ createAuctionAuto: 0 }))
      })
      .catch((e) => {
        dispatch(showLoder({ createAuctionAuto: 0 }))

        state.createNotification('Что-то пошло не так!', 'error')
      })
  }

  // const Panel = React.forwardRef(({ ...props }, ref) => (
  //   <div
  //     {...props}
  //     ref={ref}
  //     style={{
  //       position: 'absolute',
  //       top: '0',
  //       right: '-250px',
  //       color: '#fff',
  //       zIndex: 100,
  //     }}
  //   >
  //     <React.Fragment>
  //       <div className="modalBlockInput">
  //         {btnShow.map((elem) => (
  //           <label key={elem.id}>
  //             <div>{elem.id}</div>
  //             <div>
  //               <input
  //                 checked={isChecked(elem.id)}
  //                 value={elem.id}
  //                 type="checkbox"
  //                 onChange={() => {
  //                   isChecked(elem.id)
  //                   // chooseItem(elem.id)
  //                   handleAccessRights(elem.id)
  //                   setShowDrop(!showDrop)
  //                 }}
  //               />
  //             </div>
  //           </label>
  //         ))}
  //       </div>
  //     </React.Fragment>
  //   </div>
  // ))

  // const controlBlockRight = () => {
  // 	let bool = false
  // 	if (titleBlock === 'AG Logist') {
  // 		// if (
  // 		// 	financeDateArray.length > 0 &&
  // 		// 	viewBlock(50) &&
  // 		// 	((financeDateArray.at(-1).usa_finance &&
  // 		// 		JSON.parse(financeDateArray.at(-1).usa_finance).statusFinance) ||
  // 		// 		(financeDateArray.at(-1).ag_finance &&
  // 		// 			JSON.parse(financeDateArray.at(-1).ag_finance).statusFinance))
  // 		// ) {
  // 		// 	bool = true
  // 		// }
  // 		if (
  // 			viewBlock(50)
  // 			//&& JSON.parse(window.sessionStorage.getItem('role')).code === 'finance'
  // 		) {
  // 			bool = true
  // 		}

  // 		if (
  // 			!viewBlock(50) &&
  // 			viewBlock(49) &&
  // 			JSON.parse(window.sessionStorage.getItem('role')).code !== 'admin'
  // 		) {
  // 			bool = true
  // 		}
  // 	} else {
  // 		bool = true
  // 	}

  //
  //
  // 	return bool
  // }
  let viewControlBlock = () => {
    if (role[2] === JSON.parse(window.sessionStorage.getItem('role')).code) {
      return titleBlock === 'AG Logist'
      //  && 'none'
    } else {
      if (viewBlock(50)) {
        return false
      } else {
        return (
          titleBlock !== 'AG Logist' &&
          JSON.parse(window.sessionStorage.getItem('role')).code !== 'admin'
        )
      }
    }
  }

  const controlViewBlock = () => {
    if (viewBlock(50)) {
      return true
    } else {
      return viewBlock(47) && viewBlock(49)
    }
  }
  const disabledFunc = () => {
    return !viewBlock(50)
      ? !(viewBlock(47) && viewBlock(49)) || statusFinance
      : statusFinance
  }

  const controlRoleView = ({ role, statusContainer, statusInvoice }) => {
    if (
      pathCurrent.split('/')[1] !== 'archiveTransport' &&
      pathCurrent.split('/')[1] !== 'removedTransport'
    ) {
      switch (role) {
        case 'finance':
          return statusContainer && controlViewBlock() ? (
            <React.Fragment>
              <div className="financeItemGroup">
                <input
                  style={{
                    display: statusFinance ? 'none' : 'block',
                  }}
                  type="button"
                  className="btn btn--closeInvoice"
                  value="Закрыть инвойс"
                  onClick={() => setIsModalClose(true)}
                />
                <input
                  style={{
                    display: statusFinance ? 'none' : 'block',
                  }}
                  onClick={() => {
                    controlData({
                      statusView: false,
                    })

                    state.createNotification('Успешно выполнено!', 'success')
                  }}
                  type="button"
                  className="btn btn--closeInvoice"
                  value="Сохранить"
                />

                {/* {titleBlock !== 'AG Logist' && !statusFinance && (
                  // <Dropdown title="Добавить затрату перевозчика">
                  //   {dataAdd.map((elem) => (
                  //     <Dropdown.Item
                  //       key={elem.id}
                  //       onClick={() => generatorArrayCarrier(elem.id)}
                  //     >
                  //       {elem.title}
                  //     </Dropdown.Item>
                  //   ))}
                  // </Dropdown>

                  // <button
                  //   style={{
                  //     display: statusFinance ? 'none' : 'block',
                  //   }}
                  //   onClick={generatorArrayCarrier}
                  //   // className="btn btn--closeInvoice"
                  // >
                  //   Добавить затрату перевозчика
                  // </button>
                )} */}
              </div>
            </React.Fragment>
          ) : !statusInvoice ? (
            <span style={{ fontSize: '14px', color: 'red' }}>
              * Заполните номер контейнера!
            </span>
          ) : null

        default:
          return controlViewBlock() ? (
            <React.Fragment>
              <div className="financeItemGroup">
                <input
                  style={{
                    display: statusFinance ? 'none' : 'block',
                  }}
                  onClick={() => {
                    controlData({
                      statusView: false,
                    })

                    state.createNotification('Успешно выполнено!', 'success')
                  }}
                  type="button"
                  className="btn btn--closeInvoice"
                  value="Сохранить"
                />
                <input
                  style={{
                    display: statusFinance ? 'none' : 'block',
                  }}
                  type="button"
                  className="btn btn--closeInvoice"
                  value="Закрыть инвойс"
                  onClick={() => {
                    // !statusContainer && role === 'logist' &&
                    // setIsModalFillContainer(true)
                    setIsModalClose(true)
                  }}
                />
                {/* {titleBlock !== 'AG Logist' && !statusFinance && (
                  <Dropdown title="Добавить затрату перевозчика">
                    {dataAdd.map((elem) => (
                      <Dropdown.Item
                        key={elem.id}
                        onClick={() => generatorArrayCarrier(elem.id)}
                      >
                        {elem.title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                )} */}
              </div>
            </React.Fragment>
          ) : null
      }
    }
  }

  const consrolDisabled = () => {
    let bool = false

    if (pathCurrent.split('/')[1] === 'archiveTransport') bool = true
    if (pathCurrent.split('/')[1] === 'removedTransport') bool = true
    if (disabledFunc()) bool = true
    if (addDesabled()) bool = true

    return bool
  }

  const titleView = () => {
    if (carrierArray.length > 0) {
      let titleMain = carrierArray.find((el) => el.id == carrierSelect)

      if (titleBlock !== 'AG Logist') {
        if (
          !statusFinance &&
          carrierArray.length > 0 &&
          !dataPriseObject.carrier
        ) {
          return (
            <Dropdown title={titleMain ? titleMain.title : ''}>
              {carrierArray.map((elem) => (
                <Dropdown.Item
                  key={elem.id}
                  onClick={() => setCarrierSelect(elem.id)}
                >
                  {elem.title}
                </Dropdown.Item>
              ))}
            </Dropdown>
          )
        } else {
          return titleMain ? titleMain.title : ''
        }
      } else {
        return titleBlock
      }
    } else return ''
  }

  const variantSelect = () => {
    if (
      !addDesabled() &&
      pathCurrent.split('/')[1] !== 'archiveTransport' &&
      pathCurrent.split('/')[1] !== 'removedTransport'
    ) {
      if (titleBlock !== 'AG Logist') {
        return (
          <div
            className="customButton"
            style={{
              display: statusFinance ? 'none' : 'block',
            }}
          >
            <Dropdown title="+">
              {dataAdd.map((elem) => (
                <Dropdown.Item
                  key={elem.id}
                  onClick={() => generatorArray(elem.id)}
                >
                  {elem.title}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        )
      } else {
        return (
          <button
            type="button"
            style={{
              display: statusFinance ? 'none' : 'block',
            }}
            className="addNewInput"
            onClick={() => generatorArray(1)}
          >
            +
          </button>
        )
      }
    }
  }

  return (
    <React.Fragment>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalClose}
          onClose={() => setIsModalClose(false)}
        >
          <Modal.Header>
            <Modal.Body>Вы действительно хотите закрыть инвойс?</Modal.Body>
          </Modal.Header>

          <Modal.Footer>
            <button
              className="btn-success "
              onClick={() =>
                controlData({
                  statusView: true,
                })
              }
              appearance="primary"
            >
              Да
            </button>
            <button
              className="btn-danger"
              onClick={() => setIsModalClose(false)}
              appearance="subtle"
            >
              Нет
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="modal-container">
        <Modal
          backdrop={'static'}
          keyboard={false}
          open={isModalFillContainer}
          onClose={() => setIsModalFillContainer(false)}
          style={{ top: '10%' }}
        >
          <Modal.Header>
            <Modal.Body>Заполните номер контейнера!</Modal.Body>
          </Modal.Header>

          {/* <Modal.Footer>
						<button
							className='btn-success '
							appearance='primary'
							onClick={() => setIsModalFillContainer(false)}
						>
							Понятно
						</button>
						<button
							className='btn-danger'
							onClick={() => setIsModalFillContainer(false)}
							appearance='subtle'
						>
							Закрыть
						</button>
					</Modal.Footer> */}
        </Modal>
      </div>

      <div
        className="dropBlockContent "
        style={{
          display: viewControlBlock() ? 'none' : 'block',
        }}
      >
        <div className="topContenet">
          <h2>{titleView()}</h2>
          <label>
            <span>Наземка</span>
            <input
              type="text"
              placeholder="Наземка"
              value={byLand}
              onChange={(e) => setByLand(controlNumber(e.target.value))}
              onBlur={() =>
                controlData({
                  statusView: false,
                })
              }
              disabled={consrolDisabled()}
            />

            <select
              value={bySeaCarrier}
              onChange={(event) => {
                setBySeaCarrier(event.target.value)
              }}
              style={{
                visibility: titleBlock !== 'AG Logist' ? 'visable' : 'hidden',
              }}
              disabled={consrolDisabled()}
            >
              {carrierArray.map((elem, i) => {
                return (
                  <option
                    key={elem.id}
                    value={elem.id}
                    // disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                  >
                    {elem.title}
                  </option>
                )
              })}
            </select>
          </label>
          <label>
            <span>Море</span>
            <input
              type="text"
              placeholder="Море"
              value={bySea}
              onChange={(e) => setBySea(controlNumber(e.target.value))}
              onBlur={() =>
                controlData({
                  statusView: false,
                })
              }
              disabled={consrolDisabled()}
            />

            <select
              value={bySeaCarrier}
              onChange={(event) => {
                setBySeaCarrier(event.target.value)
              }}
              style={{
                visibility: titleBlock !== 'AG Logist' ? 'visable' : 'hidden',
              }}
              disabled={consrolDisabled()}
            >
              {carrierArray.map((elem, i) => {
                return (
                  <option
                    key={elem.id}
                    value={elem.id}
                    // disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                  >
                    {elem.title}
                  </option>
                )
              })}
            </select>
          </label>
          <label>
            <span>Doc fee</span>
            <input
              type="text"
              placeholder="Doc fee"
              value={DocFee}
              onChange={(e) => setDocFee(controlNumber(e.target.value))}
              onBlur={() =>
                controlData({
                  statusView: false,
                })
              }
              disabled={consrolDisabled()}
            />

            <select
              value={docFeeCarrier}
              onChange={(event) => {
                setDocFeeCarrier(event.target.value)
              }}
              style={{
                visibility: titleBlock !== 'AG Logist' ? 'visable' : 'hidden',
              }}
              disabled={consrolDisabled()}
            >
              {carrierArray.map((elem, i) => {
                return (
                  <option
                    key={elem.id}
                    value={elem.id}
                    // disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                  >
                    {elem.title}
                  </option>
                )
              })}
            </select>
          </label>
          {titleBlock === 'AG Logist' && dataPriseObject.agFee !== '-' && (
            <label>
              <span>Ag fee</span>
              <input
                type="text"
                placeholder="Ag fee"
                value={agFee}
                onChange={(e) => setAgFee(controlNumber(e.target.value))}
                onBlur={() =>
                  controlData({
                    statusView: false,
                  })
                }
                disabled={consrolDisabled()}
              />

              <select
                value={agFeeCarrier}
                onChange={(event) => {
                  setAgFeeCarrier(event.target.value)
                }}
                disabled={consrolDisabled()}
                style={{
                  visibility: titleBlock !== 'AG Logist' ? 'visable' : 'hidden',
                }}
              >
                {carrierArray.map((elem, i) => {
                  return (
                    <option
                      key={elem.id}
                      value={elem.id}
                      // disabled={elem.id === 0 || (elem.id === 3 && statusMoney)}
                    >
                      {elem.title}
                    </option>
                  )
                })}
              </select>
            </label>
          )}
          {/* {btnShow.map((elem) => isChecked(elem.id) && viewComponents(elem.id))} */}
          {financeDateArray.length > 0 &&
            additionalBlock(financeDateArray.at(-1))}
          <div className="generationBlock">
            {dateValueGeneration.length > 0 &&
              dateValueGeneration.map((elem, i) => (
                <div className="blockPay" key={elem.id}>
                  <label>
                    <span>
                      <input
                        type="text"
                        value={elem.title}
                        onChange={(e) =>
                          generationInput(elem, { title: e.target.value })
                        }
                        onBlur={() =>
                          controlData({
                            statusView: false,
                          })
                        }
                        disabled={consrolDisabled()}
                      />

                      {/* <select
                        value={elem.title}
                        onChange={(e) =>
                          generationInput(elem, { title: e.target.value })
                        }
                        style={{
                          visibility:
                            titleBlock !== 'AG Logist' ? 'visable' : 'hidden',
                        }}
                        disabled={consrolDisabled()}
                      >
                        {controlDataSelect(elem.dataArrayInitial).map(
                          (item, i) => {
                            return (
                              <option key={item.title} value={item.title}>
                                {item.title}
                              </option>
                            )
                          }
                        )}
                      </select> */}
                      {/* <div className="selectCustom selectCustom--space">
                        <SelectPicker
                          data={controlDataSelect(elem.dataArrayInitial)}
                          valueKey="title"
                          labelKey="title"
                          onChange={(e) => generationInput(elem, { title: e })}
                          placeholder={false}
                          searchable={false}
                        />
                      </div> */}
                      {!consrolDisabled() &&
                        titleBlock !== 'AG Logist' &&
                        controlDataSelect(elem.dataArrayInitial).length > 0 && (
                          <Whisper
                            followCursor
                            placement="right"
                            speaker={
                              <Tooltip>Выбрать из существующих затрат</Tooltip>
                            }
                          >
                            <Dropdown>
                              {controlDataSelect(elem.dataArrayInitial).map(
                                (item) => (
                                  <Dropdown.Item
                                    key={elem.id}
                                    onClick={() =>
                                      generationInput(elem, {
                                        title: item.title,
                                      })
                                    }
                                  >
                                    {item.title}
                                  </Dropdown.Item>
                                )
                              )}
                            </Dropdown>
                          </Whisper>
                        )}
                    </span>
                    <input
                      type="text"
                      value={elem.value}
                      onChange={(e) =>
                        generationInput(elem, {
                          value: controlNumber(e.target.value),
                        })
                      }
                      onBlur={() =>
                        controlData({
                          statusView: false,
                        })
                      }
                      disabled={consrolDisabled()}
                    />

                    <select
                      value={elem.carrier}
                      onChange={(e) =>
                        generationInput(elem, { carrier: e.target.value })
                      }
                      style={{
                        visibility:
                          titleBlock !== 'AG Logist' ? 'visable' : 'hidden',
                      }}
                      disabled={consrolDisabled()}
                    >
                      {controlArray(elem.dataArrayInitial).map((item, i) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            // disabled={
                            //   elem.id === 0 || (elem.id === 3 && statusMoney)
                            // }
                          >
                            {controlTitle(elem.dataArrayInitial, item)}
                          </option>
                        )
                      })}
                    </select>
                  </label>
                </div>
              ))}

            {/* <Animation.Slide
    unmountOnExit
    transitionAppear
    timeout={300}
    in={showDrop}
    placement={placement}
  >
    {(props, ref) => <Panel {...props} ref={ref} />}
  </Animation.Slide> */}
          </div>
          {variantSelect()}
          <label>
            <span> Итого </span>
            <input
              type="text"
              placeholder="Итого"
              value={currentRes}
              disabled
            />
            <select style={{ visibility: 'hidden' }} />
          </label>
        </div>

        <div className="blockInputClose">
          <input
            type="submit"
            style={{ display: statusFinance ? 'block' : 'none' }}
            className="btn  "
            value="Инвойс ЗАКРЫТ"
            disabled
          />
          {controlRoleView({
            role: JSON.parse(window.sessionStorage.getItem('role')).code,
            statusContainer: shortInfoArray.number_container,
            statusInvoice: statusFinance,
          })}
        </div>
      </div>
    </React.Fragment>
  )
}

AuctionTransportFinance.propTypes = {
  titleBlock: PropTypes.string,
  dataResult: PropTypes.func,
  getCurrentAucFunc: PropTypes.func,
  propsId: PropTypes.string,
  statusFunc: PropTypes.func,
  financeDateArray: PropTypes.array,
  getFinanceArray: PropTypes.func,
  viewBlock: PropTypes.func,
  shortInfoArray: PropTypes.object,
}

export default memo(AuctionTransportFinance)
