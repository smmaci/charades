import React from 'react'

export default class CardSubmission extends React.Component {
  constructor(props) {
    super(props)
    this.submitCard = this.submitCard.bind(this)
    this.state = { successfulSubmission: false }
  }

  submitCard(e) {
    e.preventDefault()
    const newCardValue = e.target.newCard.value
    e.target.newCard.value = ''
    if (newCardValue) {
      //TODO: Don't hit this, hit ${host}${basePath}/api/card
      // console.log(`Trying to hit `, `http://${process.env.NEXT_PUBLIC_HOST}${process.env.basePath || ''}/api/card`)
      fetch(`${process.env.NEXT_PUBLIC_HOST}${process.env.basePath || ''}/api/card`, { method: 'POST', body: JSON.stringify({newCard: newCardValue}) }).then(res => res.json())
      .then(
          (result) => {
              this.setState({ successfulSubmission: { result, text: newCardValue}})
          },
          (error) => {
              console.error(error)
              this.setState({successfulSubmission: false})
          }
      )
    }
  }

  render() {
    const {successfulSubmission } = this.state
    return (
      <div className="max-w-lg w-full flex flex-col">
        <form action="" onSubmit={this.submitCard} className="w-full flex flex-col items-start">
          <label htmlFor="newCard">
            Submit a new card
          </label>
          <div className="flex w-full mb-2">
            <input className="flex-grow border rounded p-4 mr-4" name="newCard" id="newCard" />
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" >Submit</button>
          </div>
        </form>
        { successfulSubmission && <div className="w-full border border-thick border-green-600 bg-green-200 rounded p-1">Submitted "{successfulSubmission.text}"</div> }
      </div>
    )
  }
}
