import React from 'react'
import 'rsuite/dist/rsuite.min.css'
import { Loader } from 'rsuite'

const loader = () => {
  return (
    <div className="Loader">
      <Loader size="lg" center speed="slow" vertical />
    </div>
  )
}

export default loader
