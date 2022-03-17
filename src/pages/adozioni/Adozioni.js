import React from 'react'

import SchoolItem from '../../components/SchoolItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import BookLoader from '../../components/BookLoader'
import ScrollButton from '../../components/ScrollButton'

import SchoolWrapper from '../../wrappers/SchoolWrapper'
import ClasseWrapper from '../../wrappers/ClasseWrapper'

import { Switch, Route } from 'react-router-dom'
import { API_URL } from '../../constants'

export default class Adozioni extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      schools: [],
      hasMoreData: true,
      limit: 0,
      filter: ''
    }

    this.getSchools = this.getSchools.bind(this)
  }

  componentDidMount () {
    this.getSchools(20)
    if (document.getElementById('filter_input')) {
      document.getElementById('filter_input').value = this.state.filter
    }

    window.onpopstate = () => {
      if (document.getElementById('filter_input')) {
        console.log('set')
        document.getElementById('filter_input').value = this.state.filter
      }
    }
  }

  schoolsLength (schools) {
    let tot = 0
    Object.keys(schools).forEach(key => {
      const skls = schools[key].schools
      tot += skls.length
    })
    return tot
  }

  getSchools (increment) {
    const newLimit = this.state.limit + increment
    let query = `/schools/sorted?sort=1&limit=${newLimit}`
    if (this.state.filter !== '' && this.state.filter != null) {
      query += '&filter=' + this.state.filter
    }
    fetch(`${API_URL}${query}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.schools)
        console.log(
          'Length: ' +
            this.schoolsLength(data.schools) +
            ' Count: ' +
            data.count
        )
        this.setState({
          limit: newLimit,
          schools: data.schools,
          hasMoreData: this.schoolsLength(data.schools) < data.count
        })
      })
  }

  render () {
    let timeOut = null
    return (
      <>
        <div className='h-100 w-100'>
          <Switch>
            <Route exact path='/adozioni'>
              <div className='h-100'>
                <div className='container mt-4 d-flex justify-content-center'>
                  <div class='input-group w-75'>
                    <div class='input-group-prepend'>
                      <span class='input-group-text' id='basic-addon1'>
                        <i class='fas fa-search' />
                      </span>
                    </div>
                    <input
                      type='text'
                      class='form-control'
                      style={{ borderRadius: '0 .25rem .25rem 0' }}
                      placeholder='Cerca scuola...'
                      aria-label='ISBN'
                      aria-describedby='basic-addon1'
                      id='filter_input'
                      onChange={e => {
                        if (timeOut) {
                          clearTimeout(timeOut)
                          timeOut = null
                        }
                        timeOut = setTimeout(() => {
                          this.setState(
                            { filter: e.target.value, limit: 20 },
                            () => this.getSchools(0)
                          )
                          timeOut = null
                        }, 500)
                      }}
                    />
                    <button
                      type='button'
                      class='btn bg-transparent'
                      style={{ marginLeft: '-40px', zIndex: '10' }}
                      onClick={() => {
                        this.setState({ filter: '', limit: 20 }, () =>
                          this.getSchools(0)
                        )
                      }}
                    >
                      <i class='fas fa-times' />
                    </button>
                  </div>
                </div>
                <InfiniteScroll
                  dataLength={this.state.limit}
                  next={() => this.getSchools(20)}
                  hasMore={this.state.hasMoreData}
                  scrollThreshold='90%'
                  loader={
                    <div className='h-100 d-flex justify-content-center align-items-center py-4'>
                      <BookLoader />
                    </div>
                  }
                  scrollableTarget='main-content'
                  className='w-100 h-100 p-4'
                >
                  {Object.keys(this.state.schools)
                    .reverse()
                    .map((value, index) => (
                      // PER OGNI TIPO DI SCUOLA
                      <span key={index}>
                        {this.state.schools[value].schools.length !== 0
                          ? (
                            <>
                              <p className='text-secondary h4 mt-2'>
                                {this.state.schools[value].label}
                              </p>
                              <div className='row my-3'>
                                {this.state.schools[value].schools.map(
                                  (school, index) => (
                                    <SchoolItem key={index} school={school} />
                                  )
                                )}
                              </div>
                            </>
                            )
                          : (
                            <></>
                            )}
                      </span>
                    ))}
                </InfiniteScroll>
                <ScrollButton container='main-content' />
              </div>
            </Route>
            <Route exact path='/adozioni/:codice'>
              <SchoolWrapper />
            </Route>
            <Route path='/adozioni/:codice/:classe'>
              <ClasseWrapper addToCart={this.props.addToCart} />
            </Route>
          </Switch>
        </div>
      </>
    )
  }
}
