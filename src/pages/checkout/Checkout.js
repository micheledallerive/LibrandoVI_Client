import React from 'react'
import { getTotalPrice, priceFormat } from '../../utils'

import * as bootstrap from 'bootstrap'

import { Redirect, Switch, Route } from 'react-router-dom'
import CheckoutSuccess from './CheckoutSuccess'

import $ from 'jquery'

export default class Checkout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nome: '',
      cognome: '',
      email: '',
      codice: '',
      tassa: 3,
      order_id: null
    }

    this.sendOrder = this.sendOrder.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  changeTassa (index) {
    let t = 0
    switch (index) {
      case 0: // VENIAMO A CASA TUA
        t = 3
        break
      case 1: // IN CENTRO
        t = 0
        break
    }
    this.setState({ tassa: t })
  }

  componentDidMount () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }

  sendOrder () {
    const orderInfo = this.state
    delete orderInfo.order_id
    const prezzoLibri = getTotalPrice(this.props.cart)
    orderInfo.prezzoLibri = prezzoLibri
    orderInfo.prezzoTotale = prezzoLibri + this.state.tassa
    orderInfo.libri = {}
    Object.keys(this.props.cart).forEach((key) => {
      orderInfo.libri[key] = {
        action: this.props.cart[key].action,
        quantity: this.props.cart[key].quantity
      }
    })
    console.log(orderInfo)
    fetch('https://micheledallerive.ch:3001/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderInfo)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({ order_id: data.id })
        }
        console.log(data)
      })
  }

  validateForm () {
    $('.has-validation').addClass(' was-validated')
    if (this.state.nome === '' || this.state.cognome === '' || this.state.email === '' || this.state.tassa === null) return false
    if ((!this.state.email.includes('@')) || (!this.state.email.includes('.'))) return false
    return true
  }

  render () {
    const cartPrice = getTotalPrice(this.props.cart)
    return (
      <Switch>
        <Route exact path='/checkout'>
          <>
            {(this.state.order_id) ? <Redirect to='/checkout/success' /> : <></>}
            {((!this.props.cart) || Object.keys(this.props.cart).length === 0 || this.props.cart === undefined || this.props.cart === null) ? <><Redirect to='/' /></> : <></>}
            <div className='row h-100'>
              <div className='col-lg-6 bg-white d-flex justify-content-center align-items-center py-lg-0 py-4 shadow'>
                <form className='col-lg-8 col-12 mt-lg-0 mt-2' id='checkout-form' noValidate>
                  <div className='form-row'>
                    <div className='form-group has-validation col-lg-6 col-6'>
                      <label for='nome'>Nome*</label>
                      <input type='text' style={{ textTransform: 'capitalize' }} class='form-control invalid' id='nome' value={this.state.nome} onChange={(e) => this.setState({ nome: e.target.value })} required />
                      <div className='invalid-feedback'>
                        Inserisci il tuo nome
                      </div>
                    </div>
                    <div className='form-group has-validation col-lg-6 col-6'>
                      <label for='cognome'>Cognome*</label>
                      <input type='text' style={{ textTransform: 'capitalize' }} class='form-control' id='cognome' value={this.state.cognome} onChange={(e) => this.setState({ cognome: e.target.value })} required />
                      <div className='invalid-feedback'>
                        Inserisci il tuo cognome
                      </div>
                    </div>
                  </div>
                  <div className='form-row'>
                    <div className='form-group has-validation col-lg-8 col-12'>
                      <label for='email'>Email*</label>
                      <input type='email' class='form-control' id='email' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} required />
                      <div className='invalid-feedback'>
                        Inserisci la tua email
                      </div>
                    </div>
                    <div className='form-group col-lg-4 col-12'>
                      <label for='codice'>Codice d'invito</label>
                      <li
                        className='fas fa-question-circle text-muted ml-2' data-toggle='tooltip' data-placement='top' data-html='false'
                        title='Se qualcuno ti ha invitato su LibrandoVI inserisci qui il codice che ti ha dato.'
                      />
                      <input type='text' style={{ textTransform: 'uppercase' }} class='form-control' id='codice' value={this.state.codice} onChange={(e) => this.setState({ codice: e.target.value })} />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label for='tassa'>Tassa di spostamento*</label>
                    <li
                      className='fas fa-question-circle text-muted ml-2' data-toggle='tooltip' data-placement='top' data-html='true'
                      title="
                                        <div class='text-left'>
                                            Scegli come ci incontreremo per completare la consegna. Puoi scegliere tra:
                                            <ul>
                                                <li class='mt-2'>
                                                    Veniamo noi: veniamo noi a casa tua a consegnarti/ritirare i libri (<b>3€</b>)
                                                </li>
                                                <li class='mt-2'>
                                                    In centro: ci troviamo in centro per completare l'acquisto (<b>gratis</b>)
                                                </li>
                                            </ul>
                                        </div>
                                    "
                    />
                    <select id='tassa' class='form-control form-select' onChange={(e) => this.changeTassa($(e.target).prop('selectedIndex'))}>
                      <option selected>
                        Veniamo a casa tua - 3€
                      </option>
                      <option>
                        In centro - Gratis
                      </option>
                    </select>
                  </div>
                  <small className='d-block text-muted'>* campo obbligatorio</small>
                  <div className='col-12 mt-4 d-flex justify-content-center '>
                    <button
                      className='btn btn-primary col-lg-4 col-12 ' onClick={(e) => {
                        e.preventDefault()
                        if (this.validateForm()) {
                          this.sendOrder()
                        }
                      }}
                    >Invia
                    </button>
                  </div>
                </form>
              </div>
              <div className='col-lg-6 bg-light d-flex justify-content-center align-items-center row py-lg-0 py-4'>
                <div class='card rounded-lg shadow border-0 col-lg-6 col-12'>
                  <div class='card-body px-4 py-3'>
                    <p class='card-title h3'>Riepilogo</p>
                    {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                    <div className='card-text d-flex mt-4' style={{ fontSize: '1.2rem' }}>
                      <span className='' style={{ fontWeight: '500' }}>Totale libri: </span><span className='ml-auto'>{priceFormat(cartPrice)}</span>
                    </div>
                    <div className='card-text d-flex mt-2' style={{ fontSize: '1.2rem' }}>
                      <span className='' style={{ fontWeight: '500' }}>Spostamento: </span><span className='ml-auto'>{priceFormat(this.state.tassa)}</span>
                    </div>
                    <hr className='mt-4 mb-3' />
                    <div className='card-text d-flex' style={{ fontSize: '1.5rem' }}>
                      <span className='font-weight-bold'>Totale: </span>

                      <span className='ml-auto'>{priceFormat(cartPrice + this.state.tassa)}</span>
                    </div>
                    <small className='text-muted'>Se il totale è negativo, a pagarti siamo noi!</small>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Route>
        <Route path='/checkout/success'>
          <CheckoutSuccess id={this.state.order_id} clearCart={this.props.clearCart} />
        </Route>
      </Switch>
    )
  }
}
