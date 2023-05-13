import React, { useState, useContext, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'

// import { Sidenav, Nav, Toggle } from 'rsuite'
// import DashboardIcon from '@rsuite/icons/legacy/Dashboard'
// import GroupIcon from '@rsuite/icons/legacy/Group'
// import MagicIcon from '@rsuite/icons/legacy/Magic'
// import GearCircleIcon from '@rsuite/icons/legacy/GearCircle'
// import PushMessageIcon from '@rsuite/icons/PushMessage'
// import CouponIcon from '@rsuite/icons/Coupon'
import CustomSidenav from './CustomSidenav'

// import {
//   ArrowRightLine,
//   ArrowDownLine,
//   UserChange,
//   Location,
//   Setting,
//   Growth,
//   Conversion,
//   Member,
//   OperatePeople,
//   PeopleBranch,
//   Model,
//   Code,
//   Coupon,
//   WavePoint,
//   Split,
//   Shield,
//   OneColumn,
//   AbTest,
//   AdvancedAnalytics,
//   Trend,
//   Peoples,
//   PeoplesMap,
//   UserInfo,
//   SettingHorizontal,
//   ThreeColumns,
//   ArrowRight,
//   ArrowLeft,
//   PeoplesCostomize,
//   PeopleExpand,
//   Storage,
//   FunnelTime,
//   PieChart,
//   Tag,
//   ExpandOutline,
// } from '@rsuite/icons'

import ContextApp from '../context/contextApp'
// import { widthOpen, widthClose } from '../reducers/actions'

// import { Tooltip, Whisper } from 'rsuite'

function HeaderItem() {
  const [viewControler, setViewControler] = useState([])

  // const { state, dispatch } = useContext(ContextApp)

  // let { title } = JSON.parse(window.sessionStorage.getItem('role'))

  const [expanded, setExpanded] = React.useState(false)
  const [activeKey, setActiveKey] = React.useState('1')
  const [openKeys, setOpenKeys] = React.useState([])

  // const controlLink = (view) => {
  //   const dataView = [
  //     setShowRate,
  //     setShowAec,
  //     setShowAuto,
  //     setShowAgLogistic,
  //     setShowContr,
  //     setShowAgFree,
  //     setShowPurse,
  //     setShowUser,
  //     setShowOfiice,
  //     setShowCal,
  //     setShowAuction,
  //   ]
  //   if (view === 'Rates / Fees') {
  //     dataView.forEach((e) => e(false))
  //     setShowRate(!showRate)
  //   } else if (view === 'AEC') {
  //     dataView.slice(2).forEach((e) => e(false))
  //     setShowAec(!showAec)
  //   } else if (view === 'AUTO UNIVERCE') {
  //     dataView.slice(1).forEach((e) => e(false))
  //     setShowAuto(!showAuto)
  //   } else if (view === 'AG Logistic') {
  //     dataView.slice(1).forEach((e) => e(false))
  //     setShowAgLogistic(!showAgLogistic)
  //   } else if (view === 'Калькулятор') {
  //     dataView.slice(1).forEach((e) => e(false))
  //     setShowCal(!showCal)
  //   } else if (view === 'Кошельки') {
  //     dataView.forEach((e) => e(false))
  //     setShowPurse(!showPurse)
  //   } else if (view === 'Контрагенты') {
  //     dataView.forEach((e) => e(false))
  //     setShowContr(!showContr)
  //   } else if (view === 'Пользователи') {
  //     dataView.forEach((e) => e(false))
  //     setShowUser(!showUser)
  //   } else if (view === 'Офис') {
  //     dataView.slice(8).forEach((e) => e(false))
  //     setShowOfiice(!showOfiice)
  //   } else if (view === 'Аукцион') {
  //     dataView.forEach((e) => e(false))
  //     setShowAuction(!showAuction)
  //   } else {
  //     state.width === '60px' ? dispatch(widthOpen()) : dispatch(widthClose())

  //     dataView.forEach((e) => e(false))
  //     setShowBlockView(!showBlockView)
  //     sessionStorage.removeItem('curLink')
  //   }
  // }

  useEffect(
    () =>
      window.sessionStorage.getItem('access_rights') !== 'null' &&
      controlRoleView(),
    [window.sessionStorage.getItem('access_rights')]
  )

  let controlRoleView = () => {
    let initialValue = JSON.parse(
      window.sessionStorage.getItem('access_rights')
    )

    setViewControler(initialValue)
  }

  let viewBlock = (val) => {
    let bool = false
    let keyTitle = Object.keys(viewControler).includes(val.keyTitle)

    keyTitle &&
      viewControler[val.keyTitle].access_rights.map(
        (el) => el.id === val.id && (bool = true)
      )

    return JSON.parse(window.sessionStorage.getItem('role')).code === 'admin'
      ? true
      : bool
  }

  return (
    <CustomSidenav
      activeKey={activeKey}
      onSelect={setActiveKey}
      expanded={expanded}
      onExpand={setExpanded}
      viewBlock={viewBlock}
      appearance="default"
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
    />

    //   <div
    //     className="checkBlock"
    //     onClick={() => controlLink()}
    //     style={{ display: 'flex', flexDirection: 'column' }}
    //   >
    //     <div
    //       className="titleHigh"
    //       onClick={() => setShowBlockView(!showBlockView)}
    //       style={{ margin: '5px 0' }}
    //     >
    //       {showBlockView ? <ArrowLeft /> : <ArrowRight />}
    //     </div>
    //     <ul
    //       style={{
    //         display: !showBlockView ? 'block' : 'none',
    //         padding: '2px 5px',
    //       }}
    //     >
    //       <li
    //         className="titleHigh"
    //         style={{ margin: '5px 0' }}
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <Whisper
    //           followCursor
    //           placement="right"
    //           speaker={<Tooltip>Автомобили</Tooltip>}
    //         >
    //           <Link to="/">
    //             <Shield style={{ width: '20px', height: '20px' }} />
    //           </Link>
    //         </Whisper>
    //       </li>

    //       {viewBlock({ keyTitle: 'container', id: 88 }) && (
    //         <li
    //           style={{ margin: '5px 0' }}
    //           onClick={(e) => e.stopPropagation()}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Контейнеры</Tooltip>}
    //           >
    //             <Link to="/containers/container">
    //               <OneColumn style={{ width: '20px', height: '20px' }} />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}

    //       <li style={{ margin: '5px 0' }} onClick={(e) => e.stopPropagation()}>
    //         <Whisper
    //           followCursor
    //           placement="right"
    //           speaker={<Tooltip>Импорт контейнеров</Tooltip>}
    //         >
    //           <Link to="/containers/import">
    //             <ExpandOutline style={{ width: '20px', height: '20px' }} />
    //           </Link>
    //         </Whisper>
    //       </li>

    //       <li
    //         className="titleHigh"
    //         style={{ margin: '5px 0' }}
    //         onClick={(e) => {
    //           e.stopPropagation()
    //           controlLink()
    //           controlLink('Калькулятор')
    //         }}
    //       >
    //         <Whisper
    //           followCursor
    //           placement="right"
    //           speaker={<Tooltip>Калькулятор</Tooltip>}
    //         >
    //           <span>
    //             <AbTest style={{ width: '20px', height: '20px' }} />
    //           </span>
    //         </Whisper>
    //       </li>

    //       {(viewBlock({ keyTitle: 'fee_rates', id: 80 }) ||
    //         viewBlock({ keyTitle: 'fee_rates', id: 82 }) ||
    //         viewBlock({ keyTitle: 'fee_rates', id: 84 }) ||
    //         viewBlock({ keyTitle: 'fee_rates', id: 86 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={(e) => {
    //             e.stopPropagation()
    //             controlLink()
    //             controlLink('Rates / Fees')
    //           }}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Rates / Fees</Tooltip>}
    //           >
    //             <span>
    //               <AdvancedAnalytics
    //                 style={{ width: '20px', height: '20px' }}
    //               />
    //             </span>
    //           </Whisper>
    //         </li>
    //       )}

    //       {(viewBlock({ keyTitle: 'cash_account', id: 93 }) ||
    //         viewBlock({ keyTitle: 'cash_account', id: 94 }) ||
    //         viewBlock({ keyTitle: 'cash_account', id: 95 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={(e) => {
    //             e.stopPropagation()
    //             controlLink()
    //             controlLink('Кошельки')
    //           }}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Кошельки</Tooltip>}
    //           >
    //             <span>
    //               <Coupon style={{ width: '20px', height: '20px' }} />
    //             </span>
    //           </Whisper>
    //         </li>
    //       )}

    //       {(viewBlock({ keyTitle: 'masters', id: 4 }) ||
    //         viewBlock({ keyTitle: 'masterfinance', id: 73 }) ||
    //         viewBlock({ keyTitle: 'logist', id: 79 }) ||
    //         viewBlock({ keyTitle: 'office', id: 8 }) ||
    //         viewBlock({ keyTitle: 'dealer', id: 12 }) ||
    //         viewBlock({ keyTitle: 'archive', id: 90 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={(e) => {
    //             e.stopPropagation()
    //             controlLink()
    //             controlLink('Пользователи')
    //           }}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Пользователи</Tooltip>}
    //           >
    //             <span>
    //               <Member style={{ width: '20px', height: '20px' }} />
    //             </span>
    //           </Whisper>
    //         </li>
    //       )}

    //       {(viewBlock({ keyTitle: 'carrier', id: 111 }) ||
    //         viewBlock({ keyTitle: 'carrier', id: 112 }) ||
    //         viewBlock({ keyTitle: 'carrier', id: 113 }) ||
    //         viewBlock({ keyTitle: 'partners', id: 101 }) ||
    //         viewBlock({ keyTitle: 'partners', id: 102 }) ||
    //         viewBlock({ keyTitle: 'partners', id: 103 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={(e) => {
    //             e.stopPropagation()
    //             controlLink()
    //             controlLink('Контрагенты')
    //           }}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Контрагенты</Tooltip>}
    //           >
    //             <span>
    //               <UserInfo style={{ width: '20px', height: '20px' }} />
    //             </span>
    //           </Whisper>
    //         </li>
    //       )}

    //       {(viewBlock({ keyTitle: 'credential', id: 96 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 97 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 98 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 99 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 100 })) && (
    //         <li
    //           onClick={(e) => e.stopPropagation()}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Доступы</Tooltip>}
    //           >
    //             <Link to="/credentials">
    //               <Code style={{ width: '20px', height: '20px' }} />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}
    //       {viewBlock({ keyTitle: 'assign_permissions', id: 105 }) && (
    //         <li
    //           onClick={(e) => e.stopPropagation()}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Марки</Tooltip>}
    //           >
    //             <Link to="/services/brands-models">
    //               <Model style={{ width: '20px', height: '20px' }} />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}

    //       {viewBlock({ keyTitle: 'assign_permissions', id: 61 }) && (
    //         <li
    //           onClick={(e) => e.stopPropagation()}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Роли</Tooltip>}
    //           >
    //             <Link to="/assign-permissions-to-roles">
    //               <SettingHorizontal
    //                 style={{ width: '20px', height: '20px' }}
    //               />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}
    //       {viewBlock({ keyTitle: 'location', id: 108 }) && (
    //         <li
    //           onClick={(e) => e.stopPropagation()}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Локация</Tooltip>}
    //           >
    //             <Link to="/location">
    //               <Location style={{ width: '20px', height: '20px' }} />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}

    //       {viewBlock({ keyTitle: 'pre-bid', id: 104 }) && (
    //         <li
    //           onClick={(e) => e.stopPropagation()}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Pre-Bid</Tooltip>}
    //           >
    //             <Link to="/pre-Bid">
    //               <Trend style={{ width: '20px', height: '20px' }} />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}

    //       {title === 'Администратор' && (
    //         <li
    //           onClick={(e) => e.stopPropagation()}
    //           style={{ margin: '5px 0' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Общие настройки</Tooltip>}
    //           >
    //             <Link to="/setting">
    //               <Setting style={{ width: '20px', height: '20px' }} />
    //             </Link>
    //           </Whisper>
    //         </li>
    //       )}

    //       <li onClick={(e) => e.stopPropagation()} style={{ margin: '5px 0' }}>
    //         <Whisper
    //           followCursor
    //           placement="right"
    //           speaker={<Tooltip>Архив</Tooltip>}
    //         >
    //           <Link to="/archiveTransport">
    //             <Storage style={{ width: '20px', height: '20px' }} />
    //           </Link>
    //         </Whisper>
    //       </li>
    //       {title === 'Администратор' && (
    //         <li
    //           className="titleHigh"
    //           onClick={(e) => {
    //             e.stopPropagation()
    //             controlLink()
    //             controlLink('Контрагенты')
    //           }}
    //           style={{ marginTop: '20px' }}
    //         >
    //           <Whisper
    //             followCursor
    //             placement="right"
    //             speaker={<Tooltip>Аукцион</Tooltip>}
    //           >
    //             <span>
    //               <AdvancedAnalytics
    //                 style={{ width: '20px', height: '20px' }}
    //               />
    //             </span>
    //           </Whisper>
    //         </li>
    //       )}
    //     </ul>
    //   </div>
    //   <div style={{ display: showBlockView ? 'block' : 'none' }}>
    //     <ul>
    //       <li className="titleHigh" onClick={() => controlLink('Автомобили')}>
    //         <span>
    //           <Shield />
    //           <Link to="/">Автомобили</Link>
    //         </span>
    //       </li>

    //       {viewBlock({ keyTitle: 'container', id: 88 }) && (
    //         <li onClick={() => controlLink()}>
    //           <Link to="/containers/container">
    //             <OneColumn />
    //             <span>Контейнеры</span>
    //           </Link>
    //         </li>
    //       )}
    //       <li onClick={() => controlLink()}>
    //         <Link to="/containers/import">
    //           <ExpandOutline />
    //           <span>Импорт контейнеров</span>
    //         </Link>
    //       </li>

    //       <li className="titleHigh" onClick={() => controlLink('Калькулятор')}>
    //         <span>
    //           <AbTest />
    //           <span> Калькулятор</span>
    //         </span>
    //         <span>{showCal ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //       </li>

    //       <ul style={{ display: showCal ? 'block' : 'none' }}>
    //         <li onClick={() => controlLink()}>
    //           <PeoplesCostomize />
    //           <Link to="/calculator/dealers">Для дилера</Link>
    //         </li>

    //         <li onClick={() => controlLink()}>
    //           <PeopleExpand />
    //           <Link to="/calculator/clients">Для клиента</Link>
    //         </li>
    //       </ul>

    //       {/*  */}

    //       {(viewBlock({ keyTitle: 'fee_rates', id: 80 }) ||
    //         viewBlock({ keyTitle: 'fee_rates', id: 82 }) ||
    //         viewBlock({ keyTitle: 'fee_rates', id: 84 }) ||
    //         viewBlock({ keyTitle: 'fee_rates', id: 86 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={() => controlLink('Rates / Fees')}
    //         >
    //           <span>
    //             <AdvancedAnalytics />
    //             <span> Rates / Fees</span>
    //           </span>
    //           <span>{showRate ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //         </li>
    //       )}

    //       <ul style={{ display: showRate ? 'block ' : 'none' }}>
    //         {viewBlock({ keyTitle: 'fee_rates', id: 80 }) && (
    //           <li className="titleHigh" onClick={() => controlLink('AEC')}>
    //             <span>
    //               <span> AEC</span>
    //             </span>
    //             <span>{showAec ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //           </li>
    //         )}
    //         <ul style={{ display: showAec ? 'block ' : 'none' }}>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/aec/inlandrates">Inland rates</Link>
    //           </li>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/aec/searatesconsolidation">Sea rates</Link>
    //           </li>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/aec/docfees">Doc fees</Link>
    //           </li>
    //         </ul>
    //         {viewBlock({ keyTitle: 'fee_rates', id: 82 }) && (
    //           <li
    //             className="titleHigh"
    //             onClick={() => controlLink('AUTO UNIVERCE')}
    //           >
    //             <span>AUTO UNIVERCE</span>

    //             <span>{showAuto ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //           </li>
    //         )}
    //         <ul style={{ display: showAuto ? 'block ' : 'none' }}>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/auto_universe/inlandrates">Inland rates</Link>
    //           </li>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/auto_universe/searatesconsolidation">Sea rates</Link>
    //           </li>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/auto_universe/docfees">Doc fees</Link>
    //           </li>
    //           {viewBlock({ keyTitle: 'fee_rates', id: 84 }) ||
    //             (viewBlock({ keyTitle: 'fee_rates', id: 86 }) && (
    //               <li
    //                 className="titleHigh"
    //                 onClick={() => controlLink('AG Logistic')}
    //               >
    //                 <span> AG Logistic</span>

    //                 <span>
    //                   {showAgLogistic ? <ArrowDownLine /> : <ArrowRightLine />}
    //                 </span>
    //               </li>
    //             ))}
    //         </ul>

    //         <ul
    //           style={{
    //             display: showAgLogistic || showAgFree ? 'block ' : 'none',
    //           }}
    //         >
    //           {viewBlock({ keyTitle: 'fee_rates', id: 84 }) && (
    //             <React.Fragment>
    //               <li onClick={() => controlLink()}>
    //                 <Link to="/aglogistic/inlandrates">Inland rates</Link>
    //               </li>
    //               <li onClick={() => controlLink()}>
    //                 <Link to="/aglogistic/searatesconsolidation">
    //                   Sea rates
    //                 </Link>
    //               </li>
    //               <li onClick={() => controlLink()}>
    //                 <Link to="/aglogistic/docfees">Doc fees</Link>
    //               </li>
    //             </React.Fragment>
    //           )}
    //         </ul>
    //         {viewBlock({ keyTitle: 'fee_rates', id: 86 }) && (
    //           <li className="titleHigh" onClick={() => controlLink()}>
    //             <Link to="/aglogistic/fee_rates">AG Fee</Link>
    //           </li>
    //         )}
    //       </ul>

    //       {(viewBlock({ keyTitle: 'cash_account', id: 93 }) ||
    //         viewBlock({ keyTitle: 'cash_account', id: 94 }) ||
    //         viewBlock({ keyTitle: 'cash_account', id: 95 })) && (
    //         <li className="titleHigh" onClick={() => controlLink('Кошельки')}>
    //           <span>
    //             <Coupon />
    //             <span> Кошельки</span>
    //           </span>
    //           <span>{showPurse ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //         </li>
    //       )}

    //       <ul style={{ display: showPurse ? 'block' : 'none' }}>
    //         {viewBlock({ keyTitle: 'cash_account', id: 93 }) && (
    //           <li onClick={() => controlLink()}>
    //             <WavePoint />
    //             <Link to="/wallets/auctions">Аукционы</Link>
    //           </li>
    //         )}
    //         {viewBlock({ keyTitle: 'cash_account', id: 94 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Split />
    //             <Link to="/wallets/shipping">Доставка</Link>
    //           </li>
    //         )}
    //         {viewBlock({ keyTitle: 'cash_account', id: 95 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Peoples />
    //             <Link to="/wallets/agent">Посредники</Link>
    //           </li>
    //         )}

    //         {/* {viewBlock({ keyTitle: 'cash_account', id: 95 }) && ( */}
    //         {(title === 'Администратор' || title === 'Мастер финансов') && (
    //           <li onClick={() => controlLink()}>
    //             <Tag />
    //             <Link to="/wallets/cashAll">Наличные</Link>
    //           </li>
    //         )}

    //         {/* )} */}
    //       </ul>

    //       {(viewBlock({ keyTitle: 'masters', id: 4 }) ||
    //         viewBlock({ keyTitle: 'masterfinance', id: 73 }) ||
    //         viewBlock({ keyTitle: 'logist', id: 79 }) ||
    //         viewBlock({ keyTitle: 'office', id: 8 }) ||
    //         viewBlock({ keyTitle: 'dealer', id: 12 }) ||
    //         viewBlock({ keyTitle: 'archive', id: 90 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={() => controlLink('Пользователи')}
    //         >
    //           <span>
    //             <Member />
    //             <span> Пользователи</span>
    //           </span>

    //           <span>{showUser ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //         </li>
    //       )}
    //       <ul style={{ display: showUser ? 'block' : 'none' }}>
    //         {viewBlock({ keyTitle: 'masters', id: 4 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Link to="/masters">
    //               <OperatePeople />
    //               <span>Мастера</span>
    //             </Link>
    //           </li>
    //         )}
    //         {viewBlock({ keyTitle: 'masterfinance', id: 73 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Link to="/mastersfinances">
    //               <Growth />
    //               <span>Финансы</span>
    //             </Link>
    //           </li>
    //         )}
    //         {viewBlock({ keyTitle: 'logist', id: 79 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Link to="/logist">
    //               <Conversion />
    //               <span>Перевозка</span>
    //             </Link>
    //           </li>
    //         )}

    //         {viewBlock({ keyTitle: 'office', id: 8 }) && (
    //           <li className="titleHigh" onClick={() => controlLink('Офис')}>
    //             <span>
    //               <ThreeColumns />
    //               <span> Офис</span>
    //             </span>

    //             <span>
    //               {showOfiice ? <ArrowDownLine /> : <ArrowRightLine />}
    //             </span>
    //           </li>
    //         )}

    //         <ul style={{ display: showOfiice ? 'block' : 'none' }}>
    //           <li onClick={() => controlLink()}>
    //             <Link to="/office">
    //               <span>Розница служба </span>
    //             </Link>
    //           </li>

    //           <li onClick={() => controlLink()}>
    //             <Link to="/officeDealers">
    //               <span>Дилерская служба</span>
    //             </Link>
    //           </li>
    //         </ul>

    //         {viewBlock({ keyTitle: 'dealer', id: 12 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Link to="/dealers">
    //               <PeopleBranch />
    //               <span>Дилеры</span>
    //             </Link>
    //           </li>
    //         )}

    //         <li onClick={() => controlLink()}>
    //           <Link to="/subusers">
    //             <PeopleBranch />
    //             <span>Субпользователь </span>
    //           </Link>
    //         </li>

    //         {viewBlock({ keyTitle: 'archive', id: 90 }) && (
    //           <li onClick={() => controlLink()}>
    //             <Link to="/archive">
    //               <UserChange />
    //               <span>В архиве</span>
    //             </Link>
    //           </li>
    //         )}
    //       </ul>

    //       {/*  */}
    //       {(viewBlock({ keyTitle: 'carrier', id: 111 }) ||
    //         viewBlock({ keyTitle: 'carrier', id: 112 }) ||
    //         viewBlock({ keyTitle: 'carrier', id: 113 }) ||
    //         viewBlock({ keyTitle: 'partners', id: 101 }) ||
    //         viewBlock({ keyTitle: 'partners', id: 102 }) ||
    //         viewBlock({ keyTitle: 'partners', id: 103 })) && (
    //         <li
    //           className="titleHigh"
    //           onClick={() => controlLink('Контрагенты')}
    //         >
    //           <span>
    //             <UserInfo />
    //             <span> Контрагенты</span>
    //           </span>
    //           <span>{showContr ? <ArrowDownLine /> : <ArrowRightLine />}</span>
    //         </li>
    //       )}

    //       <ul style={{ display: showContr ? 'block' : 'none' }}>
    //         {(viewBlock({ keyTitle: 'carrier', id: 111 }) ||
    //           viewBlock({ keyTitle: 'carrier', id: 112 }) ||
    //           viewBlock({ keyTitle: 'carrier', id: 113 })) && (
    //           <li onClick={() => controlLink()}>
    //             <Model />
    //             <Link to="/carrier">Перевозчик</Link>
    //           </li>
    //         )}

    //         {(viewBlock({ keyTitle: 'partners', id: 101 }) ||
    //           viewBlock({ keyTitle: 'partners', id: 102 }) ||
    //           viewBlock({ keyTitle: 'partners', id: 103 })) && (
    //           <li onClick={() => controlLink()}>
    //             <Link to="/agent">
    //               <PeoplesMap />
    //               <span> Посредники</span>
    //             </Link>
    //           </li>
    //         )}
    //       </ul>

    //       {/*  */}

    //       {(viewBlock({ keyTitle: 'credential', id: 96 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 97 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 98 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 99 }) ||
    //         viewBlock({ keyTitle: 'credential', id: 100 })) && (
    //         <li onClick={() => controlLink()}>
    //           <Link to="/credentials">
    //             <Code />
    //             <span>Доступы</span>
    //           </Link>
    //         </li>
    //       )}
    //       {viewBlock({ keyTitle: 'assign_permissions', id: 105 }) && (
    //         <li onClick={() => controlLink()}>
    //           <Link to="/services/brands-models">
    //             <Model />
    //             <span>Марки</span>
    //           </Link>
    //         </li>
    //       )}

    //       {viewBlock({ keyTitle: 'assign_permissions', id: 61 }) && (
    //         <li onClick={() => controlLink()}>
    //           <Link to="/assign-permissions-to-roles">
    //             <SettingHorizontal />
    //             <span>Роли</span>
    //           </Link>
    //         </li>
    //       )}
    //       {viewBlock({ keyTitle: 'location', id: 108 }) && (
    //         <li onClick={() => controlLink()}>
    //           <Link to="/location">
    //             <Location />
    //             <span>Локация</span>
    //           </Link>
    //         </li>
    //       )}

    //       {viewBlock({ keyTitle: 'pre-bid', id: 104 }) && (
    //         <li onClick={() => controlLink()}>
    //           <Link to="/pre-Bid">
    //             <Trend />
    //             <span>Pre-Bid</span>
    //           </Link>
    //         </li>
    //       )}
    //       {title === 'Администратор' && (
    //         <li onClick={() => controlLink()}>
    //           <Setting />
    //           <Link to="/setting">Общие настройки</Link>
    //         </li>
    //       )}

    //       <li onClick={() => controlLink()}>
    //         <Storage />
    //         <Link to="/archiveTransport">Архив</Link>
    //       </li>
    //       {title === 'Администратор' && (
    //         <li
    //           className="titleHigh"
    //           onClick={() => controlLink('Аукцион')}
    //           style={{ marginTop: '20px' }}
    //         >
    //           <span>
    //             <AdvancedAnalytics />
    //             <span> Аукцион</span>
    //           </span>
    //           <span>
    //             {showAuction ? <ArrowDownLine /> : <ArrowRightLine />}
    //           </span>
    //         </li>
    //       )}

    //       <ul style={{ display: showAuction ? 'block' : 'none' }}>
    //         <li onClick={() => controlLink()}>
    //           <FunnelTime />
    //           <a href={dataTargetLink} target="_blank" rel="noreferrer">
    //             Купить
    //           </a>
    //         </li>

    //         <li onClick={() => controlLink()}>
    //           <Link to="/auctions-inSale">
    //             <PieChart />
    //             <span> Продать</span>
    //           </Link>
    //         </li>
    //       </ul>
    //     </ul>
    //   </div>
    // </div>
  )
}

export default HeaderItem
