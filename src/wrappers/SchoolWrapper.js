import React from 'react'
import { useParams } from 'react-router-dom'

import School from '../pages/adozioni/School'

function SchoolWrapper (props) {
  const { codice } = useParams()
  return (
    <>
      <School codice={codice} />
    </>
  )
}
export default SchoolWrapper
