import React, { useState, useContext } from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams } from 'react-router-dom'
import { config } from '../config.js'
import { Pagination, Modal, Whisper, Tooltip } from 'rsuite'
import { Trash, Attachment, CheckOutline } from '@rsuite/icons'
import ReloadIcon from '@rsuite/icons/Reload'

import {
  postRequest,
  getRequest,
  deleteRequest,
  postRequestFile,
} from '../base/api-request.js'

import { showLoder } from '../reducers/actions'
import ContextApp from '../context/contextApp.js'

// import ModalByPhotos from '../components/ModalByPhotos'

import { useEffect } from 'react'
// import ImageGallery from 'react-image-gallery'
// import 'react-image-gallery/styles/css/image-gallery.css'

const AuctionPictures = ({ viewBlock }) => {
  const [dataContainer, setDataContainer] = useState([])
  const [fileGive, setFileGive] = useState('')
  const { state, dispatch } = useContext(ContextApp)
  const [isModalRemove, setIsModalRemove] = useState(false)
  const [container, setContainer] = useState([])
  const [fileName, setFileName] = useState('')
  const [showIcon, setShowIcon] = useState(false)
  // const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  // const [paginationValue, setPaginationValue] = useState([])
  const [itemsPhotoClick, setItemsPhotoClick] = useState('')
  const pathCurrent = window.location.pathname

  const { id } = useParams()

  useEffect(() => {
    id && getPicturesFunc()
  }, [id])

  const getParsFunc = () => {
    dispatch(showLoder({ getParsFunc: 1 }))
    postRequest('/api/v1/order/image-order/parseImageOrder', {
      general_information_id: +id,
    })
      .then((res) => {
        getPicturesFunc()
        toast.success('Успешно найдено!')
        dispatch(showLoder({ getParsFunc: 0 }))
      })
      .catch(() => {
        toast.error('Не найдено')
        dispatch(showLoder({ getParsFunc: 0 }))
      })
  }

  const getPicturesFunc = () => {
    dispatch(showLoder({ getPicturesFunc: 1 }))
    getRequest(`/api/v1/order/image/${+id}/info?page=${page}&limit=500`, {
      Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`,
    })
      .then((res) => {
        setDataContainer(res.image_information)

        setItemsPhotoClick(res.image_information[0])

        // setPaginationValue(res.pagination)
        dispatch(showLoder({ getPicturesFunc: 0 }))
        // toast.success('Успешно найдено!')
      })
      .catch(() => {
        // toast.error('Не найдено')

        setDataContainer([])

        setItemsPhotoClick('')

        // setPaginationValue([])

        dispatch(showLoder({ getPicturesFunc: 0 }))
      })
  }
  // useEffect(() => {
  //   getPicturesFunc()
  // }, [page])

  const close = () => {
    setIsModalRemove(false)
  }

  const removePicture = (idItem) => {
    dispatch(showLoder({ removePicture: 1 }))
    deleteRequest(`	/api/v1/order/image/${idItem}`)
      .then((res) => {
        close()
        getPicturesFunc()
        toast.success('Успешно удалено!')
        dispatch(showLoder({ removePicture: 0 }))
      })
      .catch(() => {
        close()
        toast.error('Что-то пошло не так')
        dispatch(showLoder({ removePicture: 0 }))
      })
  }

  let controlFile = (e) => {
    if (e.target.files[0]) {
      setShowIcon(true)
      setFileGive(e.target.files[0])
      setFileName(e.target.files[0].name)
      toast.success('Файл прикреплен!')
    }
  }

  let formData = new FormData()
  formData.append('general_information_id', id)
  formData.append('file', fileGive)

  const closeFile = () => {
    setShowIcon(false)
    setFileGive('')
    setFileName('')
    document.getElementById('ava').value = ''
  }
  // console.log(showIcon, fileGive, fileName)

  const addPicture = (e) => {
    if (fileGive) {
      dispatch(showLoder({ addPicture: 1 }))
      postRequestFile('/api/v1/order/image', formData)
        .then((res) => {
          toast.success('Успешно создано!')

          closeFile()

          getPicturesFunc()
          dispatch(showLoder({ addPicture: 0 }))
        })
        .catch(() => {
          toast.error('Что-то пошло не так!')
          dispatch(showLoder({ addPicture: 0 }))
        })
    } else {
      toast.error('Прикрепите файл!')
    }
  }

  // const handleChangeLimit = (dataKey) => {
  //   setPage(1)
  //   setLimit(dataKey)
  // }

  const consrolViewBlock = () => {
    let bool = false

    if (pathCurrent.split('/')[1] === 'archiveTransport') bool = true
    if (pathCurrent.split('/')[1] === 'removedTransport') bool = true
    return bool
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <Modal
        backdrop={'static'}
        keyboard={false}
        open={isModalRemove}
        onClose={() => close()}
      >
        <Modal.Header>
          <Modal.Title>Удаление фото</Modal.Title>
        </Modal.Header>

        <Modal.Body>Вы действительно хотите удалить?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn-success "
            onClick={() => removePicture(container.id)}
            appearance="primary"
          >
            Да
          </button>
          <button
            className="btn-danger"
            onClick={() => setIsModalRemove(false)}
            appearance="subtle"
          >
            Нет
          </button>
        </Modal.Footer>
      </Modal>
      {!consrolViewBlock() && (
        <div
          className="item-PictureGroup"
          style={{
            display: 'flex',

            justifyContent: 'space-between',
            margin: '0 12px',
          }}
        >
          <span className="btn-pictures " onClick={() => getParsFunc()}>
            Получить фотографии
          </span>

          <div className="addPicture">
            {showIcon && (
              <React.Fragment>
                <Whisper
                  followCursor
                  placement="top"
                  speaker={<Tooltip>Отменить</Tooltip>}
                >
                  <ReloadIcon
                    style={{
                      width: '35px',
                      marginRight: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => closeFile()}
                  ></ReloadIcon>
                </Whisper>

                <span className="btn-primary" onClick={() => addPicture()}>
                  Добавить фото
                </span>
              </React.Fragment>
            )}

            <label>
              <p>{fileName ? fileName : 'Название файла'}</p>
              <input
                id="ava"
                name="ava"
                // value={fileName}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={controlFile}
              />

              <Whisper
                followCursor
                placement="top"
                speaker={
                  <Tooltip>
                    {showIcon ? 'Файл прикреплен!' : 'Прикрепить файл!'}
                  </Tooltip>
                }
              >
                <div
                  htmlFor="ava"
                  style={{ cursor: 'pointer' }}
                  className="fileAdd"
                >
                  {showIcon ? (
                    <CheckOutline style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <Attachment style={{ width: '20px', height: '20px' }} />
                  )}
                </div>
              </Whisper>
            </label>
          </div>
        </div>
      )}
      {dataContainer.length > 0 && (
        <div
          className="dropBlockContent dropBlockContent--photo"
          style={{
            width: '100%',
            padding: 0,
          }}
        >
          <div className="PictureBlock">
            <div className="itemsOne">
              {itemsPhotoClick && (
                <div className="innerPhoto" key={itemsPhotoClick.id}>
                  <button
                    data-src={
                      config.backRequestDoc + itemsPhotoClick.image_path
                    }
                    className="button button--secondary"
                  >
                    <img
                      src={config.backRequestDoc + itemsPhotoClick.image_path}
                      alt={dataContainer[0].image_name}
                    />

                    <Trash
                      color="red"
                      style={{ fontSize: '1.2em' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setContainer({ id: itemsPhotoClick.id })
                        setIsModalRemove(!isModalRemove)
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
            <div className="itemsTwo">
              {dataContainer.length > 0 &&
                dataContainer.map((el) => {
                  return (
                    <div className="innerPhoto" key={el.id}>
                      <button
                        data-src={config.backRequestDoc + el.image_path}
                        className="button button--secondary"
                        onClick={() => setItemsPhotoClick(el)}
                      >
                        <img
                          width="255px"
                          height="255px"
                          src={config.backRequestDoc + el.image_path}
                          alt={el.image_name}
                        />
                      </button>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* <div
        className="paginationBlock"
        style={{ display: dataContainer.length > 0 ? 'flex' : 'none' }}
      >
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
      </div> */}
    </React.Fragment>
  )
}
export default AuctionPictures
