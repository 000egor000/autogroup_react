import React, { useState, useEffect, useContext, useRef } from 'react'
import nextId, { setPrefix } from 'react-id-generator'
import { Modal } from 'rsuite'
import 'react-toastify/dist/ReactToastify.css'

import ContextApp from '../context/contextApp'
import { showLoder } from '../reducers/actions'
import { putRequest } from '../base/api-request'
import PropTypes from 'prop-types'
import { controlNumber } from '../helper.js'
import { toast } from 'react-toastify'
import { Dropdown } from 'rsuite'

import { arrayPort, dataAdd } from '../const.js'
const AuctionTransportFinanceDrop = ({
  carrierArray,
  getToastSucces,
  getToastError,
  initialValue,
  financeDateArray,
  getFinanceArray,
  dataResultAecDrop,
  dataResultAgDrop,
  viewBlock,
  titleBlock,
  controlParamsClear,
}) => {
  const [dateValueGenerationRight, setDateValueGenerationRight] = useState([])
  const [dateValueGenerationLeft, setDateValueGenerationLeft] = useState([])
  const [countResleft, setCountResleft] = useState(0)
  const [countResRight, setCountResRight] = useState(0)
  const [isModalClose, setIsModalClose] = useState(false)
  const [containerCurrent, setContainerCurrent] = useState('')
  const [statusDropUsa, setStatusDropUsa] = useState(false)
  const [statusDropAg, setStatusDropUsaAg] = useState(false)

  const { state, dispatch } = useContext(ContextApp)

  const refFocusLeft1 = useRef()
  const refFocusLeft2 = useRef()
  const refFocusRight1 = useRef()
  const refFocusRight2 = useRef()

  useEffect(() => {
    if (financeDateArray.length > 0) {
      let finalPriceUsaAll = 0
      let finalPriceAgAll = 0

      Object.keys(JSON.parse(financeDateArray[0].usa_finance)).includes(
        'children'
      ) &&
        JSON.parse(financeDateArray[0].usa_finance).children.map((el) => {
          Object.keys(el).includes('finalPriceUsa') &&
            (finalPriceUsaAll += el.finalPriceUsa)

          Object.keys(el).includes('finalPriceAg') &&
            (finalPriceAgAll += el.finalPriceAg)

          dataResultAecDrop(finalPriceUsaAll)
          dataResultAgDrop(finalPriceAgAll)
        })
    }
  }, [financeDateArray])

  useEffect(() => {
    let countResLeftInner = 0
    let countResRightInner = 0
    dateValueGenerationLeft.map((el) => (countResLeftInner += +el.value))
    dateValueGenerationRight.map((el) => (countResRightInner += +el.value))

    setCountResleft(countResLeftInner)
    setCountResRight(countResRightInner)
  }, [
    dateValueGenerationLeft,
    dateValueGenerationRight,
    countResleft,
    countResRight,
  ])

  const params = [
    {
      dataArray: [
        {
          ag_finance: dateValueGenerationRight,
          status: false,
        },
        {
          usa_finance: dateValueGenerationLeft,
          status: false,
        },
      ],
      status: false,
    },
  ]

  const generatorArrayRight = () => {
    let bool =
      dateValueGenerationRight.length > 0
        ? dateValueGenerationRight.at(-1).title &&
          dateValueGenerationRight.at(-1).value
        : false

    if (!dateValueGenerationRight.length || !!bool) {
      let container = []
      setPrefix('')
      container.push({ id: nextId(), title: '', value: '' })
      setDateValueGenerationRight([...dateValueGenerationRight, ...container])
    } else {
      getToastError('Заполните текущие поля, до открытия новых!')
    }
  }

  const generationInputRight = (val, change) => {
    let changeObject = []
    dateValueGenerationRight.map((elem) =>
      changeObject.push(
        elem.id === val.id ? { ...elem, ...change } : { ...elem }
      )
    )
    setDateValueGenerationRight(changeObject)
  }

  // let generatorArrayLeftCarrier = (val) => {
  //   let bool =
  //     dateValueGenerationLeft.length > 0
  //       ? dateValueGenerationLeft.at(-1).title &&
  //         dateValueGenerationLeft.at(-1).value
  //       : false

  //   if (!dateValueGenerationLeft.length || !!bool) {
  //     let container = []
  //     setPrefix('')
  //     container.push({
  //       id: nextId(),
  //       title: 'KLP-MSQ',
  //       value: '',
  //       carrier: '',
  //       dataArrayInitial: val,
  //     })
  //     setDateValueGenerationLeft([...dateValueGenerationLeft, ...container])
  //   } else {
  //     getToastError('Заполните текущие поля, до открытия новых!')
  //   }
  // }

  const generatorArrayLeft = (val) => {
    let bool =
      dateValueGenerationLeft.length > 0
        ? dateValueGenerationLeft.at(-1).title &&
          dateValueGenerationLeft.at(-1).value
        : false

    if (!dateValueGenerationLeft.length || !!bool) {
      let container = []
      setPrefix('')
      container.push({
        id: nextId(),
        title: '',
        value: '',
        carrier: '',
        dataArrayInitial: val,
      })
      setDateValueGenerationLeft([...dateValueGenerationLeft, ...container])
    } else {
      getToastError('Заполните текущие поля, до открытия новых!')
    }
  }

  const generationInputLeft = (val, change) => {
    let changeObject = []
    dateValueGenerationLeft.map((elem) =>
      changeObject.push(
        elem.id === val.id ? { ...elem, ...change } : { ...elem }
      )
    )
    setDateValueGenerationLeft(changeObject)
  }

  // const controlWrite = (e) => {
  //   let value = e.target.value
  //   if (value.at(-1) === ',') {
  //     return (value = value.replace(/,/gi, '.').toUpperCase())
  //   } else {
  //     return value.replace(/[A-Za-zА-Яа-яЁё]/gi, '')
  //   }
  // }

  const controlClose = () => {
    let ag_finance = params[0].dataArray[0]['ag_finance']
    let usa_finance = params[0].dataArray[1]['usa_finance']
    if (ag_finance.length > 0) {
      if (!ag_finance.at(-1).title && !ag_finance.at(-1).value) ag_finance.pop()
    }
    if (usa_finance.length > 0) {
      if (!usa_finance.at(-1).title && !usa_finance.at(-1).value)
        usa_finance.pop()
    }
  }

  useEffect(() => {
    if (JSON.parse(financeDateArray.at(-1).usa_finance).children) {
      JSON.parse(financeDateArray.at(-1).usa_finance)
        .children.at(-1)
        .dataArray.map((elem) => {
          if (Object.keys(elem).includes('usa_finance'))
            setStatusDropUsa(elem.status ? true : false)
          if (Object.keys(elem).includes('ag_finance'))
            setStatusDropUsaAg(elem.status ? true : false)
        })
    }
  }, [financeDateArray])

  useEffect(() => {
    if (statusDropUsa && statusDropAg) closeInvoceAll()
  }, [statusDropUsa, statusDropAg])

  const closeInvoceAll = () => {
    let resultStatusEnd = {
      ...financeDateArray.at(-1),
      status_finance_confirm: true,
      status_finance_cash_confirm: false,

      usa_finance: JSON.stringify({
        ...JSON.parse(financeDateArray.at(-1).usa_finance),
        children: [
          ...JSON.parse(financeDateArray.at(-1).usa_finance).children.slice(
            0,
            JSON.parse(financeDateArray.at(-1).usa_finance).children.length - 1
          ),
          {
            ...JSON.parse(financeDateArray[0].usa_finance).children.at(-1),
            status: true, //Статус на закрытие
          },
        ],
      }),
    }
    dispatch(showLoder({ closeInvoceAll: 1 }))
    putRequest(
      `/api/v1/order/finance/${financeDateArray.at(-1).id}`,
      resultStatusEnd
    )
      .then((res) => {
        close()
        getFinanceArray()
        dispatch(showLoder({ closeInvoceAll: 0 }))
      })
      .catch(() => {
        close()

        getToastError('Что-то пошло не так!')
        dispatch(showLoder({ closeInvoceAll: 0 }))
      })
  }
  const controlField = (resStatusArrayRight, ag, resStatusArrayLeft, usa) => {
    if (resStatusArrayRight.length > 0 && !ag.status) {
      getToastError('Заполните все выбранные поля!')
      let refArray = [refFocusRight1, refFocusRight2]
      let a = refArray.filter((el) =>
        el.current && !el.current.value ? el.current : null
      )
      let b = refArray.filter((el) =>
        el.current && el.current.value ? el.current : null
      )

      a.forEach((el) => {
        el.current.focus()
        el.current.style.outline = 'none'
        el.current.style.border = 'solid'
        el.current.style.borderWidth = '1px'
        el.current.style.borderColor = 'red'
      })
      b.forEach((el) => {
        el.current.focus()
        el.current.style.outline = 'none'
        el.current.style.border = 'solid'
        el.current.style.borderWidth = '1px'
        el.current.style.borderColor = 'green'
      })

      setIsModalClose(false)
    } else if (resStatusArrayLeft.length > 0 && !usa.status) {
      getToastError('Заполните все выбранные поля!')
      let refArray = [refFocusLeft1, refFocusLeft2]
      let a = refArray.filter((el) =>
        el.current && !el.current.value ? el.current : null
      )
      let b = refArray.filter((el) =>
        el.current && el.current.value ? el.current : null
      )

      a.forEach((el) => {
        el.current.focus()
        el.current.style.outline = 'none'
        el.current.style.border = 'solid'
        el.current.style.borderWidth = '1px'
        el.current.style.borderColor = 'red'
      })
      b.forEach((el) => {
        el.current.focus()
        el.current.style.outline = 'none'
        el.current.style.border = 'solid'
        el.current.style.borderWidth = '1px'
        el.current.style.borderColor = 'green'
      })

      setIsModalClose(false)
    }
  }
  const controlParamsUpdate = (
    resStatusArrayRight,
    ag,
    resStatusArrayLeft,
    usa,
    val
  ) => {
    let currentStatus = []
    if (usa.status || ag.status) {
      let find = JSON.parse(financeDateArray.at(-1).usa_finance)
        .children.at(-1)
        .dataArray.find((elem) => elem.status)

      if (containerCurrent) {
        currentStatus = params[0].dataArray.map((elem) => {
          return Object.keys(elem).includes(containerCurrent)
            ? {
                ...elem,
                status:
                  !(
                    resStatusArrayRight.length > 0 &&
                    resStatusArrayLeft.length > 0
                  ) && val
                    ? true
                    : false,
              }
            : { ...elem, status: true }
        })
      } else {
        currentStatus = params[0].dataArray.map((elem) =>
          !elem[Object.keys(find)[0]] ? { ...elem, status: false } : find
        )
      }
    } else {
      currentStatus = params[0].dataArray.map((elem) =>
        containerCurrent &&
        elem[containerCurrent] &&
        !(resStatusArrayRight.length > 0 || resStatusArrayLeft.length > 0)
          ? { ...elem, status: true }
          : elem
      )
    }

    let resAll = {
      usa_finance: JSON.stringify({
        ...JSON.parse(financeDateArray.at(-1).usa_finance),
        children: [
          ...JSON.parse(financeDateArray.at(-1).usa_finance).children.slice(
            0,
            JSON.parse(financeDateArray.at(-1).usa_finance).children.length - 1
          ),
          {
            ...JSON.parse(financeDateArray.at(-1).usa_finance).children.at(-1),
            ...{ ...params[0], dataArray: currentStatus },

            finalPriceUsa: countResleft,
            finalPriceAg: countResRight,
          },
        ],
      }),
    }

    let controlParams = {
      ...financeDateArray.at(-1),
      status_finance_confirm: val ? true : false,

      status_finance_cash_confirm:
        containerCurrent === 'ag_finance' ? true : false,
      //статус для снятия суммы

      ...resAll,
    }

    updateAuctionAutoRequest(controlParams)
  }

  const updateAuctionAuto = (val) => {
    controlClose()

    let usa = JSON.parse(financeDateArray.at(-1).usa_finance).children.at(-1)
      .dataArray[1]
    let ag = JSON.parse(financeDateArray.at(-1).usa_finance).children.at(-1)
      .dataArray[0]
    let resStatusArrayLeft = params.map((elem) =>
      elem.dataArray.map((el) =>
        el.usa_finance
          ? el.usa_finance.filter(
              (el) => (el.title && !el.value) || (!el.title && el.value)
            )
          : null
      )
    )[0][1]

    let resStatusArrayRight = params.map((elem) =>
      elem.dataArray.map((el) =>
        el.ag_finance
          ? el.ag_finance.filter(
              (el) => (el.title && !el.value) || (!el.title && el.value)
            )
          : null
      )
    )[0][0]

    if (
      (resStatusArrayRight.length > 0 || resStatusArrayLeft.length > 0) &&
      val
    ) {
      controlField(resStatusArrayRight, ag, resStatusArrayLeft, usa)
    } else {
      controlParamsUpdate(resStatusArrayRight, ag, resStatusArrayLeft, usa, val)
    }
  }

  const updateAuctionAutoRequest = (params) => {
    dispatch(showLoder({ updateAuctionAuto: 1 }))
    putRequest(`/api/v1/order/finance/${financeDateArray.at(-1).id}`, params)
      .then((res) => {
        close()
        getFinanceArray()
        setContainerCurrent('')
        dispatch(showLoder({ updateAuctionAuto: 0 }))
      })
      .catch(() => {
        close()

        getToastError('Что-то пошло не так!')
        setContainerCurrent('')
        dispatch(showLoder({ updateAuctionAuto: 0 }))
      })
  }
  useEffect(() => {
    clearField()
  }, [])

  const close = () => {
    setContainerCurrent('')
    setIsModalClose(false)
  }

  const clearField = () => {
    let controlParams
    if (controlParamsClear) {
      if (
        JSON.parse(financeDateArray.at(-1).usa_finance).hasOwnProperty(
          'children'
        )
      ) {
        let currentValue = JSON.parse(
          financeDateArray.at(-1).usa_finance
        ).children
        if (
          !currentValue.at(-1).dataArray[0].ag_finance.length > 0 &&
          !currentValue.at(-1).dataArray[1].usa_finance.length > 0
        ) {
          currentValue.pop()
          if (currentValue.length > 0) {
            controlParams = {
              ...financeDateArray.at(-1),
              usa_finance: JSON.stringify({
                ...JSON.parse(financeDateArray.at(-1).usa_finance),
                children: currentValue,
              }),
              status_finance_confirm: false,
              status_finance_cash_confirm: false,
            }
          } else {
            let arrayNot = JSON.parse(financeDateArray.at(-1).usa_finance)
            delete arrayNot.children
            controlParams = {
              ...financeDateArray.at(-1),
              usa_finance: JSON.stringify(arrayNot),
              status_finance_confirm: false,
              status_finance_cash_confirm: false,
            }
          }
        }
      }
    }
    if (controlParams && titleBlock == 'AG Logist')
      clearFieldRequst(controlParams)
  }
  const clearFieldRequst = (params) => {
    dispatch(showLoder({ clearFieldRequst: 1 }))
    putRequest(`/api/v1/order/finance/${financeDateArray.at(-1).id}`, params)
      .then((res) => {
        getFinanceArray()
        dispatch(showLoder({ clearFieldRequst: 0 }))
      })
      .catch(() => {
        getToastError('Что-то пошло не так!')
        dispatch(showLoder({ clearFieldRequst: 0 }))
      })
  }

  useEffect(() => {
    if (initialValue.length > 0) {
      initialValue.map((el) => {
        if (!el.status) {
          setDateValueGenerationLeft(el.dataArray[1].usa_finance)
          setDateValueGenerationRight(el.dataArray[0].ag_finance)
        }
      })
    }
  }, [initialValue])

  let viewControlBlock = () => {
    if (viewBlock(50)) {
      return true
    } else {
      return (
        titleBlock == 'AG Logist' &&
        JSON.parse(window.sessionStorage.getItem('role')).code !== 'admin'
      )
    }
  }

  useEffect(() => {
    let refArray = [
      refFocusLeft1,
      refFocusLeft2,
      refFocusRight1,
      refFocusRight2,
    ]

    refArray.forEach((el) =>
      el.current && el.current.value
        ? (el.current.style.borderColor = '#dfdfe3')
        : null
    )

    return () => {}
  }, [dateValueGenerationLeft, dateValueGenerationRight])

  return (
    initialValue.length > 0 && (
      <React.Fragment>
        <div className="modal-container">
          <Modal
            backdrop={'static'}
            keyboard={false}
            open={isModalClose}
            onClose={() => close()}
          >
            <Modal.Header>
              <Modal.Body>Вы действительно хотите закрыть инвойс?</Modal.Body>
            </Modal.Header>

            <Modal.Footer>
              <button
                className="btn-success "
                onClick={() => updateAuctionAuto(true)}
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
        {initialValue.map((elemMain) => {
          return elemMain.status ? (
            <div className="inner-Drop" key={elemMain.id}>
              <div
                className="dropBlockContent"
                style={{
                  display: !viewControlBlock() ? 'none' : 'block',
                }}
              >
                <div className="topContenet">
                  {' '}
                  <div className="generationBlock">
                    {elemMain.dataArray.length > 0 &&
                      elemMain.dataArray.map(
                        (elem, i) =>
                          Object.keys(elem).includes('usa_finance') &&
                          elem.usa_finance.map((el) => {
                            console.log(el)
                            return (
                              <React.Fragment key={el.id}>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                  }}
                                  className="custumGenetationInput"
                                  key={el.id}
                                >
                                  <label key={el.id}>
                                    <span>
                                      <input
                                        type="text"
                                        value={el.title}
                                        onBlur={() => updateAuctionAuto()}
                                        disabled={elemMain.status}
                                      />
                                    </span>
                                    <input
                                      type="number"
                                      value={el.value}
                                      onBlur={() => updateAuctionAuto()}
                                      disabled={elemMain.status}
                                    />

                                    <select
                                      value={el.carrier}
                                      disabled={elemMain.status}
                                    >
                                      {(+el.dataArrayInitial === 1
                                        ? carrierArray
                                        : arrayPort
                                      ).map((item, i) => {
                                        return (
                                          <option key={item.id} value={item.id}>
                                            {el.dataArrayInitial == 1
                                              ? item.title
                                              : item.label}
                                          </option>
                                        )
                                      })}
                                    </select>
                                  </label>
                                </div>
                              </React.Fragment>
                            )
                          })
                      )}
                  </div>
                  <label style={{ marginBottom: '50px' }}>
                    <span> Итого </span>
                    <input
                      type="text"
                      placeholder="Итого"
                      value={elemMain.finalPriceUsa}
                      disabled
                    />
                    <select style={{ visibility: 'hidden' }} />
                  </label>
                </div>

                <div className="blockInputClose">
                  <input
                    type="submit"
                    style={{
                      display: !elemMain.status ? 'none' : 'block',
                    }}
                    className="btn"
                    value="Инвойс ЗАКРЫТ"
                    disabled
                  />
                </div>
              </div>

              <div className="dropBlockContent">
                <div className="topContenet">
                  <div className="generationBlock">
                    {elemMain.dataArray.length > 0 &&
                      elemMain.dataArray.map(
                        (elem, i) =>
                          Object.keys(elem).includes('ag_finance') &&
                          elem.ag_finance.map((el) => {
                            return (
                              <React.Fragment key={el.id}>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                  }}
                                  className="custumGenetationInput"
                                  key={el.id}
                                >
                                  <label>
                                    <span>
                                      <input
                                        type="text"
                                        value={el.title}
                                        onBlur={() => updateAuctionAuto()}
                                        disabled={elemMain.status}
                                      />
                                    </span>
                                    <input
                                      type="number"
                                      value={el.value}
                                      onBlur={() => updateAuctionAuto()}
                                      disabled={elemMain.status}
                                    />
                                  </label>
                                </div>
                              </React.Fragment>
                            )
                          })
                      )}
                  </div>
                  <label style={{ marginBottom: '50px' }}>
                    <span> Итого </span>
                    <input
                      type="text"
                      placeholder="Итого"
                      value={elemMain.finalPriceAg}
                      disabled
                    />
                    <select style={{ visibility: 'hidden' }} />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="inner-Drop">
              <div className="dropBlockContent">
                <div className="topContenet">
                  <div className="generationBlock">
                    <h2
                      style={{
                        display: viewControlBlock() ? 'block' : 'none',
                      }}
                    >
                      Новый инвойс
                    </h2>
                    {dateValueGenerationLeft.length > 0 &&
                      dateValueGenerationLeft.map((elem, i) => (
                        <React.Fragment key={elem.id}>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                            className="custumGenetationInput"
                            key={elem.id}
                          >
                            <label key={elem.id}>
                              <span>
                                {/* {elem.title === 'KLP-MSQ' ? (
                                'KLP-MSQ'
                              ) : ( */}
                                <input
                                  type="text"
                                  value={elem.title}
                                  disabled={state.loader || statusDropUsa}
                                  onChange={(e) =>
                                    generationInputLeft(elem, {
                                      title: e.target.value,
                                    })
                                  }
                                  onBlur={() => updateAuctionAuto()}
                                  ref={refFocusLeft1}
                                />
                                {/* )} */}
                              </span>

                              <input
                                type="text"
                                value={elem.value}
                                disabled={state.loader || statusDropUsa}
                                onChange={(e) =>
                                  generationInputLeft(elem, {
                                    value: controlNumber(e.target.value),
                                  })
                                }
                                onBlur={() => updateAuctionAuto()}
                                ref={refFocusLeft2}
                              />

                              <select
                                value={elem.carrier}
                                onChange={(e) =>
                                  generationInputLeft(elem, {
                                    carrier: e.target.value,
                                  })
                                }
                                disabled={state.loader || statusDropUsa}
                              >
                                {(+elem.dataArrayInitial === 1
                                  ? carrierArray
                                  : arrayPort
                                ).map((item, i) => {
                                  return (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      // disabled={
                                      //   elem.id === 0 || (elem.id === 3 && statusMoney)
                                      // }
                                    >
                                      {+elem.dataArrayInitial === 1
                                        ? item.title
                                        : item.label}
                                    </option>
                                  )
                                })}
                              </select>
                            </label>
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                  {!statusDropUsa && (
                    <div className="customButton">
                      <Dropdown title="+">
                        {dataAdd.map((elem) => (
                          <Dropdown.Item
                            key={elem.id}
                            onClick={() => generatorArrayLeft(elem.id)}
                          >
                            {elem.title}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </div>

                    // <button
                    //   style={{
                    //     display: !viewControlBlock() ? 'none' : 'block',
                    //   }}
                    //   type="button"
                    //   className="addNewInput"
                    //   onClick={() => generatorArrayLeft()}
                    // >
                    //   +
                    // </button>
                  )}
                  <label style={{ marginBottom: '70px' }}>
                    <span> Итого </span>
                    <input
                      type="text"
                      placeholder="Итого"
                      value={countResleft}
                      disabled
                    />
                    <select style={{ visibility: 'hidden' }} />
                  </label>
                </div>

                {!statusDropUsa && (
                  <div className="blockInputClose">
                    <div className="financeItemGroup">
                      <input
                        onClick={() => {
                          updateAuctionAuto()
                          toast.success('Информация сохранена')
                        }}
                        type="button"
                        className="btn btn--closeInvoice"
                        value="Сохранить"
                      />
                      <input
                        type="button"
                        className="btn btn--closeInvoice"
                        value="Закрыть инвойс"
                        onClick={() => {
                          setContainerCurrent('usa_finance')
                          setIsModalClose(true)
                        }}
                      />
                      {/* <Dropdown title="Добавить затрату перевозчика">
                        {dataAdd.map((elem) => (
                          <Dropdown.Item
                            key={elem.id}
                            onClick={() => generatorArrayLeftCarrier(elem.id)}
                          >
                            {elem.title}
                          </Dropdown.Item>
                        ))}
                      </Dropdown> */}
                    </div>
                    {/* <div className="customAddCarrier">
                      <Dropdown title="Добавить затрату перевозчика">
                        {dataAdd.map((elem) => (
                          <Dropdown.Item
                            key={elem.id}
                            onClick={() => generatorArrayLeftCarrier(elem.id)}
                          >
                            {elem.title}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </div> */}

                    {/* <button
                      onClick={generatorArrayLeftCarrier}
                      className="btn btn--closeInvoice"
                    >
                      Добавить затрату перевозчика
                    </button> */}
                  </div>
                )}
              </div>

              <div
                className="dropBlockContent"
                style={{
                  display: !viewControlBlock() ? 'none' : 'block',
                }}
              >
                <div className="topContenet">
                  <div className="generationBlock">
                    <h2 style={{ visibility: 'hidden' }}>Новый инвойс</h2>
                    {dateValueGenerationRight.length > 0 &&
                      dateValueGenerationRight.map((elem, i) => (
                        <React.Fragment key={elem.id}>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                            className="custumGenetationInput"
                          >
                            <label>
                              <span>
                                <input
                                  type="text"
                                  value={elem.title}
                                  disabled={state.loader || statusDropAg}
                                  onChange={(e) =>
                                    generationInputRight(elem, {
                                      title: e.target.value,
                                    })
                                  }
                                  onBlur={() => updateAuctionAuto()}
                                  ref={refFocusRight1}
                                />
                              </span>

                              <input
                                type="text"
                                value={elem.value}
                                disabled={state.loader || statusDropAg}
                                onChange={(e) =>
                                  generationInputRight(elem, {
                                    value: controlNumber(e.target.value),
                                  })
                                }
                                onBlur={() => updateAuctionAuto()}
                                ref={refFocusRight2}
                              />
                            </label>
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                  {!statusDropAg && (
                    <button
                      type="button"
                      className="addNewInput"
                      onClick={() => generatorArrayRight()}
                    >
                      +
                    </button>
                  )}
                  <label style={{ marginBottom: '50px' }}>
                    <span> Итого </span>
                    <input
                      type="text"
                      placeholder="Итого"
                      value={countResRight}
                      disabled
                    />
                    <select style={{ visibility: 'hidden' }} />
                  </label>
                  {!statusDropAg && (
                    <div className="blockInputClose">
                      <div className="financeItemGroup">
                        <input
                          onClick={() => {
                            updateAuctionAuto()
                            toast.success('Информация сохранена')
                          }}
                          type="button"
                          className="btn btn--closeInvoice"
                          value="Сохранить"
                        />
                        <input
                          type="button"
                          className="btn btn--closeInvoice"
                          value="Закрыть инвойс"
                          onClick={() => {
                            setContainerCurrent('ag_finance')
                            setIsModalClose(true)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </React.Fragment>
    )
  )
}

AuctionTransportFinanceDrop.propTypes = {
  initialValue: PropTypes.object,
  financeDateArray: PropTypes.object,
  getFinanceArray: PropTypes.func,
  dataResultAecDrop: PropTypes.func,
  dataResultAgDrop: PropTypes.func,
  viewBlock: PropTypes.func,
  titleBlock: PropTypes.string,
  controlParamsClear: PropTypes.bool,
}

export default AuctionTransportFinanceDrop
