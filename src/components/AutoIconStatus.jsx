import React, { memo } from 'react'
import { OneColumn } from '@rsuite/icons'
import PropTypes from 'prop-types'

const AutoIconStatus = ({ data }) => {
  const controlColor = () => {
    switch (data.status) {
      // red
      case 1:
        return '#f70404 '
      //  yellow
      case 2:
        return '#e1e111'
      //  green
      default:
        return '#039303'
    }
  }
  const controlSvg = () => {
    switch (data.title) {
      case 'auto':
        return (
          <svg
            width="25px"
            height="25px"
            viewBox="0 0 36 36"
            version="1.1"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect
              className="clr-i-outline clr-i-outline-path-1"
              x="15"
              y="17"
              width="3"
              height="2"
              fill={controlColor()}
            ></rect>
            <path
              className="clr-i-outline clr-i-outline-path-2"
              d="M26.45,14.17A22.1,22.1,0,0,0,19.38,7a9.64,9.64,0,0,0-9-.7,8.6,8.6,0,0,0-4.82,6.4c-.08.47-.14.92-.2,1.36A4,4,0,0,0,2,18v6.13a2,2,0,0,0,2,2V20H4V18a2,2,0,0,1,2-2H24.73A7.28,7.28,0,0,1,32,23.27V24h-2a4.53,4.53,0,1,0,.33,2H32a2,2,0,0,0,2-2v-.73A9.28,9.28,0,0,0,26.45,14.17ZM11,14H6.93c0-.31.09-.63.15-1A6.52,6.52,0,0,1,11,8h0Zm2,0V7.58a8.17,8.17,0,0,1,5.36,1.16A19,19,0,0,1,23.9,14ZM25.8,28.38a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,25.8,28.38Z"
              fill={controlColor()}
            ></path>
            <path
              className="clr-i-outline clr-i-outline-path-3"
              d="M14.17,24a4.53,4.53,0,1,0,.33,2h5.3c0-.08,0-.17,0-.25A6,6,0,0,1,20,24ZM10,28.38a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,10,28.38Z"
              fill={controlColor()}
            ></path>
            <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
          </svg>
        )

      case 'container':
        return (
          <OneColumn
            style={{
              width: '25px',
              height: '25px',
              color: controlColor(),
            }}
          />
        )

      default:
        return null
    }
  }
  return <span className="svgItem">{controlSvg()}</span>
}

AutoIconStatus.propTypes = {
  data: PropTypes.object,
}
export default memo(AutoIconStatus)
