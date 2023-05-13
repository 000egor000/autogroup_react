import React, { useEffect, memo } from 'react'
import { Close } from '@rsuite/icons'
import PropTypes from 'prop-types'

const ModalContainerAdd = ({ isVisible = false, onClose, dataArray }) => {
  return !isVisible ? null : (
    <div className="modalCustomBlock" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ width: 'fit-content', height: 'fit-content' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h4> Добавить авто в контейнер</h4>
          <span className="modal-close" onClick={onClose}>
            <Close />
          </span>
        </div>
        <div className="modal-body">
          <div className="modal-content" style={{ padding: 0 }}>
            <div className="itemInnerModal">{dataArray}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ModalContainerAdd)
