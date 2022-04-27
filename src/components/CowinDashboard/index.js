import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    initialData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachVaccine => ({
          vaccineDate: eachVaccine.vaccine_date,
          dose1: eachVaccine.dose_1,
          dose2: eachVaccine.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        })),
      }
      //  console.log(updatedData)
      this.setState({
        initialData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderSuccess = () => {
    const {initialData} = this.state
    return (
      <>
        <VaccinationCoverage coverage={initialData.last7DaysVaccination} />
        {/* <p>{JSON.stringify(initialData)}</p> */}
        {/* <p>{JSON.stringify(initialData.vaccinationByGender)}</p> */}
        <VaccinationByGender genderData={initialData.vaccinationByGender} />
        {/* <p>{JSON.stringify(initialData.vaccinationByAge)}</p> */}
        <VaccinationByAge ageDataSend={initialData.vaccinationByAge} />
      </>
    )
  }

  renderLoading = () => (
    <div className="loading-view" testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderPromises = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-covid-container">
        <div className="main-page-heading">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p className="heading-text">Co-WIN</p>
        </div>
        <h1 className="title">CoWIN Vaccination in India</h1>
        {this.renderPromises()}
      </div>
    )
  }
}

export default CowinDashboard
