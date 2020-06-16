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
    }

    newCard() {
        fetch(`http://${process.env.NEXT_PUBLIC_HOST}${process.env.basePath || ''}/api/card`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        card: result.card,
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
                <div className="w-full flex flex-col items-center border border-gray-400 shadow rounded p-8 my-8 max-w-lg">
                    {cardBody()}
                </div>
                <aside className="text-lg font-thin" >
                    {remainingCards} card(s) left
                </aside>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-12" onClick={this.newCard}>New Card</button>
            </React.Fragment>
        )


    }
}
