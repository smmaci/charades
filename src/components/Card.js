import React from 'react'

export default class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            card: undefined,
            remainingCards: undefined
        }
        this.newCard = this.newCard.bind(this)
        this.deleteCard = this.deleteCard.bind(this)
    }

    newCard() {
        fetch(`${process.env.NEXT_PUBLIC_HOST}${process.env.basePath || ''}/api/card`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        card: { text: result.card.text, id: result.card.id },
                        remainingCards: result.remainingCards,
                        error: false
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    deleteCard() { 
        fetch(`${process.env.NEXT_PUBLIC_HOST}${process.env.basePath || ''}/api/card`, { method: 'DELETE', body: JSON.stringify({ id: this.state.card.id }) }).then(res => res.json())
        .then(
            (result) => {
                this.setState({ remainingCards: result.remainingCards, card: { text: undefined, id: undefined}, isLoaded: false})
            },
            (error) => {
                console.error(error)
            }
        )
    }


    render() {
        const { error, isLoaded, card, remainingCards } = this.state
        const cardBody = () => {
            if (error) {
                return <div>Error: {error.message}</div>
            } else if (!isLoaded) {
                return <p className="text-lg font-thin">(Draw a new card with the button below)</p>
            } else {
                return (
                    <h3>{card.text}</h3>
                )
            }
        }
        return (
            <React.Fragment>
                <div className="w-full flex flex-col items-center border border-gray-400 shadow rounded p-8 mb-4 max-w-lg">
                    {cardBody()}
                </div>
                <aside className="text-lg font-thin mb-4" >
                    {remainingCards} card(s) left
                </aside>
                <div className="mb-4">
                    <button className="inline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={this.newCard}>New Card</button>
                    <button className="inline bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={this.deleteCard}>Delete Card</button>
                </div>
            </React.Fragment>
        )


    }
}
