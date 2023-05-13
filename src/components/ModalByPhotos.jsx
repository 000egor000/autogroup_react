import React, { useEffect, memo } from 'react'

import { Fancybox as NativeFancybox } from '@fancyapps/ui/dist/fancybox.esm.js'
import '@fancyapps/ui/dist/fancybox.css'
// import PropTypes from 'prop-types'

const ModalByPhotos = (props) => {
  const delegate = props.delegate || '[data-fancybox]'

  useEffect(() => {
    const opts = props.options || {}

    NativeFancybox.bind(delegate, opts)

    return () => {
      NativeFancybox.destroy()
    }
  }, [])

  return <React.Fragment>{props.children}</React.Fragment>
}

export default memo(ModalByPhotos)
