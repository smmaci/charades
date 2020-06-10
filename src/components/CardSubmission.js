import React from 'react'

export default class CardSubmission extends React.Component {
  constructor(props) {
    super(props)
    this.submitCard = this.submitCard.bind(this)
  }

  submitCard(e) {
    e.preventDefault()
    console.log(e.target.newCard.value)
    const newCardValue = e.target.newCard.value
    if (newCardValue) {
      fetch('http://localhost:3000/api/card', { method: 'POST', body: JSON.stringify({newCard: newCardValue}) }).then(res => res.json())
      .then(
          (result) => {
              console.log(result)
          },
          (error) => {
              console.error(error)
          }
      )
    }
  }

  render() {
    return (
      <form action="" onSubmit={this.submitCard}>
        <label htmlFor="newCard">
          Submit a new card
        </label>
        <input className="border rounded p-2 mx-4" name="newCard" id="newCard" />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" >Submit</button>
      </form>
    )
  }
}