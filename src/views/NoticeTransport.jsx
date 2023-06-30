import React, { useState, useContext, useEffect } from 'react'

import { postRequest, getRequest, putRequest } from '../base/api-request'
// import { Badge, Modal } from 'rsuite'
// import { Link } from 'react-router-dom's
// import { Notice, Email } from '@rsuite/icons'
// import { useState } from 'react'
// import { Pagination } from 'rsuite'
// import { Link } from 'react-router-dom'
// import ArowBackIcon from '@rsuite/icons/ArowBack'
import { ArrowRightLine, ArrowDownLine, InfoOutline } from '@rsuite/icons'
import NoData from '../components/NoData'
import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'
import { Pagination } from 'rsuite'
import NoticeInner from '../components/NoticeInner'

const NoticeTransport = (
  {
    // showBlockNotice,
    // setShowBlockNotice,
    // contentNotice,
  }
) => {
  //pagination
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [paginationValue, setPaginationValue] = useState([])
  //

  const { state, dispatch } = useContext(ContextApp)
  const [dropShow, setDropShow] = useState([])
  const [notificationsArray, setNotificationsArray] = useState([])
  const handleShow = ({ id, max_id, read }) => {
    let filtered = dropShow.filter((e) => id === e)

    if (filtered.length > 0) {
      let removeAccessRights = dropShow.filter((e) => e !== id)
      setDropShow(removeAccessRights)
    } else {
      setDropShow([...dropShow, id])
    }
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const isChecked = (id) => {
    let filtered = dropShow.filter((e) => e === id)

    let bool = filtered.length > 0 ? true : false
    return bool
  }

  useEffect(() => {
    dispatch(showLoder({ notifications: 1 }))
    getRequest(`/api/v1/notifications?limit=${500}`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then(({ user_notifications }) => {
        setNotificationsArray(user_notifications)

        if (
          user_notifications.at(-1).hasOwnProperty('trasport_auto_information')
        )
          setPaginationValue(
            user_notifications.at(-1).trasport_auto_information.pagination
          )

        dispatch(showLoder({ notifications: 0 }))
      })
      .catch((err) => {
        setNotificationsArray([])
        setPaginationValue(0)
        dispatch(showLoder({ notifications: 0, status: err.status }))
      })
  }, [])

  const toastClick = (val) => state.createNotification(val, 'info')

  return (
    <div className="noticeTransport">
      <div className="itemContainer">
        <div className="itemContainer-inner">
          <div
            className="top-item "
            style={{ paddingLeft: state.width, justifyContent: 'right' }}
          >
            <div className="btnTransport"></div>
          </div>
          <div
            className="bottom-itemFooter"
            style={{
              paddingLeft: state.width,
            }}
          >
            {notificationsArray.length > 0 ? (
              <div className="overFlowBlock">
                <table>
                  <tbody>
                    {notificationsArray.map((e, i) => {
                      return (
                        <React.Fragment key={e + i}>
                          <tr style={{ textAlign: 'left' }}>
                            <td onClick={() => handleShow(e)}>
                              {isChecked(e.id) ? (
                                <ArrowRightLine />
                              ) : (
                                <ArrowDownLine />
                              )}
                              <span className="flashItem">
                                <InfoOutline style={{ margin: '8px' }} />
                              </span>

                              <span>{e.type_notification.name}</span>
                            </td>
                          </tr>

                          {isChecked(e.id) && (
                            <NoticeInner
                              toastClick={toastClick}
                              dataAray={
                                e.trasport_auto_information.general_information
                              }
                              resView={isChecked(e.id)}
                              idItem={e.id}
                              type_notification={e.type_notification.type}
                            />
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
                {paginationValue && (
                  <div className="paginationBlock">
                    <Pagination
                      prev
                      next
                      // first
                      // last
                      ellipsis
                      // boundaryLinks
                      maxButtons={5}
                      size="xs"
                      layout={['total', 'pager']}
                      total={paginationValue.total_results}
                      limitOptions={[5, 10]}
                      limit={limit}
                      activePage={page}
                      onChangePage={setPage}
                      onChangeLimit={handleChangeLimit}
                    />
                  </div>
                )}
              </div>
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </div>
    </div>
    // <div className="modal-container">
    //   <Modal
    //     backdrop={'static'}
    //     keyboard={false}
    //     open={showBlockNotice}
    //     onClose={() => {
    //       setShowBlockNotice(false)
    //       resetObject()
    //     }}
    //   >
    //     <div className="modalTitleNotice">
    //       <Modal.Header>
    //         <React.Fragment>
    //           <div className="modalHeader">
    //             {contentClick.id ? (
    //               <label onClick={() => resetObject()}>
    //                 <span>
    //                   <ArowBackIcon />
    //                 </span>
    //                 <span>{contentClick.id}</span>
    //               </label>
    //             ) : (
    //               <React.Fragment>
    //                 <div className="fistParts">
    //                   <div className="noticeCount">
    //                     <h4>Уведомление </h4>

    //                     <Badge content="99+ новых" />
    //                   </div>
    //                   <div className="noticeMsg">
    //                     <label>
    //                       <Email />
    //                       <p>Прочитать все </p>
    //                     </label>
    //                   </div>
    //                 </div>
    //                 <div className="secondParts">
    //                   <Notice style={{ fontSize: '5em' }} />
    //                 </div>
    //               </React.Fragment>
    //             )}
    //           </div>
    //         </React.Fragment>
    //       </Modal.Header>
    //     </div>
    //     <div className="modalBodyNotice">
    //       <div className="modalBody">
    //         <Modal.Body>
    //           {contentClick.id ? (
    //             <div className="contentNotice">
    //               Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
    //               repudiandae modi pariatur iusto, nostrum magnam molestias amet
    //               praesentium suscipit aspernatur dolor hic animi necessitatibus
    //               architecto ex. Consectetur ex expedita laboriosam!
    //             </div>
    //           ) : (
    //             <React.Fragment>
    //               {/* <ul>
    //             {contentNotice.lenght > 0 ? (
    //               contentNotice.map((el) => <li key={el.id}></li>)
    //             ) : (
    //               <li style={{ textAlign: 'center' }}>Нет данных!</li>
    //             )}
    //           </ul> */}
    //               <ul>
    //                 <li
    //                   style={{
    //                     boxShadow:
    //                       '0 4px 4px rgb(50 50 71 / 8%), 0 4px 8px #f8f9fe',
    //                   }}
    //                   onClick={() => setContentClick({ id: 1 })}
    //                 >
    //                   <span className="flashItem">
    //                     <InfoOutlineIcon style={{ margin: '8px' }} />
    //                   </span>

    //                   <span>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
    //                   </span>
    //                 </li>
    //                 <li onClick={() => setContentClick({ id: 1 })}>
    //                   <span>
    //                     <InfoOutlineIcon style={{ margin: '8px' }} />
    //                   </span>

    //                   <span>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
    //                   </span>
    //                 </li>
    //                 <li onClick={() => setContentClick({ id: 1 })}>
    //                   <span>
    //                     <InfoOutlineIcon style={{ margin: '8px' }} />
    //                   </span>

    //                   <span>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
    //                   </span>
    //                 </li>
    //                 <li
    //                   style={{
    //                     boxShadow:
    //                       '0 4px 4px rgb(50 50 71 / 8%), 0 4px 8px #f8f9fe',
    //                   }}
    //                   onClick={() => setContentClick({ id: 4 })}
    //                 >
    //                   <span className="flashItem">
    //                     <InfoOutlineIcon style={{ margin: '8px' }} />
    //                   </span>

    //                   <span>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
    //                   </span>
    //                 </li>
    //                 <li onClick={() => setContentClick({ id: 1 })}>
    //                   <span>
    //                     <InfoOutlineIcon style={{ margin: '8px' }} />
    //                   </span>

    //                   <span>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
    //                   </span>
    //                 </li>
    //               </ul>
    //               <div className="paginationBlock">
    //                 <Pagination
    //                   prev
    //                   next
    //                   ellipsis
    //                   maxButtons={5}
    //                   size="xs"
    //                   layout={['total', 'pager', 'limit']}
    //                   total={10}
    //                   // limitOptions={1}
    //                   // limit={limit}
    //                   activePage={1}
    //                   // onChangePage={setPage}
    //                   // onChangeLimit={handleChangeLimit}
    //                 />
    //               </div>
    //             </React.Fragment>
    //           )}
    //         </Modal.Body>
    //       </div>
    //     </div>
    //   </Modal>
    // </div>
  )
}
export default NoticeTransport
