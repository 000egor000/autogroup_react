import React, { memo } from 'react'

import PropTypes from 'prop-types'

const BlockContentModal = ({ dataContent, controlStatus, onClose }) => {
  let content = dataContent.map((el) => {
    return (
      <div
        className="blockContentModal"
        style={{ border: el.status ? '2px solid #FADB69' : 'none' }}
        key={el.id}
      >
        <h3>{el.title}</h3>
        <ul>
          {el.content.map((elChaild) => (
            <li key={elChaild.id}>{elChaild.title}</li>
          ))}
        </ul>
        <div className="bottomPart">
          <span className="priseBlock">{el.prise} руб.</span>
          <button
            className="btn btn-addGood"
            id="borderControlOne"
            onClick={(e) => {
              controlStatus(el.id)
              onClose()
            }}
          >
            {el.titleBtn}
          </button>
        </div>
      </div>
    )
  })
  return content
}

BlockContentModal.propTypes = {
  dataContent: PropTypes.array,
  controlStatus: PropTypes.func,
  onClose: PropTypes.func,
}
export default memo(BlockContentModal)
