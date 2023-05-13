import React, { useEffect, useRef, useState, memo } from 'react'
import 'rsuite/dist/rsuite.min.css'
import { Loader } from 'rsuite'
import BlockContentModal from './BlockContentModal'
import { Close } from '@rsuite/icons'
import PropTypes from 'prop-types'
import { dataInfo } from '../const.js'

const ModalChoosePackage = ({ isVisible = false, onClose }) => {
  const keydownHandler = ({ key }) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
      default:
    }
  }

  const [dataContent, setDataContent] = useState(dataInfo)

  const controlStatus = (id) => {
    const newArr = dataContent.map((item) => {
      return item.id === id
        ? { ...item, status: true }
        : { ...item, status: false }
    })

    setDataContent(newArr)
  }

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => document.removeEventListener('keydown', keydownHandler)
  })

  return !isVisible ? null : (
    <div className="modalCustomBlock" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-close" onClick={onClose}>
            <Close />
          </span>
        </div>
        <div className="modal-body">
          <div className="modal-content">
            <div className="itemInnerModal">
              <BlockContentModal
                dataContent={dataContent}
                controlStatus={controlStatus}
                onClose={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

BlockContentModal.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default memo(ModalChoosePackage)
