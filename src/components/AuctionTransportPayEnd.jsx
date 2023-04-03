import React from 'react'
import { config } from '../config.js'
import nextId from 'react-id-generator'
import PropTypes from 'prop-types'

const AuctionTransportPayEnd = ({ itemStatus, dataPayArray }) => {
  return (
    <div
      className="accessUsers accessUsers--doc"
      style={{ display: itemStatus ? 'block' : 'none' }}
    >
      <div className="contentBlockTop">
        <div className="dropBlockContent dropBlockContent--doc dropBlockContent--file">
          {dataPayArray[0] && (
            <div className="leftSpace">
              <label>
                <h2>Документы для оплаты на аукцион</h2>
                {dataPayArray[0].map(
                  (elem, i) =>
                    elem.file && (
                      <a
                        key={nextId()}
                        download
                        href={config.backRequestDoc + elem.file}
                      >
                        {i + 1 + '. ' + elem.file.split('/')[3].split('.')[0]}
                      </a>
                    )
                )}
              </label>
            </div>
          )}
          {dataPayArray[1] && (
            <div className="rightSpace">
              <label>
                <h2>Доcтавка</h2>
                {dataPayArray[1].map(
                  (elem, i) =>
                    elem.file && (
                      <a
                        key={nextId()}
                        download
                        href={config.backRequestDoc + elem.file}
                      >
                        {i + 1 + '. ' + elem.file.split('/')[3].split('.')[0]}
                      </a>
                    )
                )}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

AuctionTransportPayEnd.propTypes = {
  itemStatus: PropTypes.bool,
  dataPayArray: PropTypes.array,
}
export default AuctionTransportPayEnd
