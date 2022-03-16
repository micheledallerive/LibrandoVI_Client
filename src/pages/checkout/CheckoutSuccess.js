import React from 'react'

import { Link } from 'react-router-dom'
import $ from 'jquery'

export default class CheckoutSuccess extends React.Component {
  constructor (props) {
    super(props)
    localStorage.clear()
    if (this.props.clearCart) this.props.clearCart()
    $(window).bind('beforeunload', function (event) {
      return 'Attenzione! Le informazioni potrebbero non essere salvate'
    })
  }

  render () {
    return (
      <>
        {/*
                (!this.props.id)
                ?<><Redirect to="/"/></>
                :<> */}
        <div className='d-flex justify-content-center align-items-center h-100 w-100 bg-success p-3'>
          <div className='card shadow bg-white col-lg-6 col-12 p-4' style={{ borderRadius: '1rem', maxHeight: '90%', overflow: 'auto' }}>
            <div className=' d-flex justify-content-center text-center flex-column'>
              <i class='fas fa-check-circle card-img fa-6x text-success' style={{ height: 96 }} />
              <p className='card-title h4 font-weight-bold mt-4'>Ordine effettuato</p>
              <p className='card-text h5'>Numero d'ordine: <span className='font-weight-bold'>{(this.props.id) || 'ID'}</span></p>
              <p className='card-text mt-3' style={{ fontSize: '1.2rem' }}>Ora contattaci su Instagram (<span className='font-weight-bold'>@librandovi</span>) o tramite e-mail (<span className='font-weight-bold'>librandovi.staff@gmail.com</span>) scrivendoci il tuo numero d'ordine per accordarci per lo scambio. <br /><span className='font-weight-bold'>Attenzione: </span>se non ci contatterai entro 48 ore l'ordine verrà automaticamente cancellato.</p>
              <p className='card-text font-weight-light' style={{ fontSize: '1.1rem' }}>Ti è stata inviata un'email di riepilogo.</p>
              <Link to='/'><button className='btn btn-primary mt-2' style={{ fontSize: '1.2rem' }}>Torna alla home page</button></Link>
            </div>
          </div>
        </div>
        {/* </> */}

      </>
    )
  }
}
