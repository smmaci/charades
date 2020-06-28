import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import Card from '../src/components/Card'
import CardSubmission from '../src/components/CardSubmission'

const cardEndpoint = `${process.env.NEXT_PUBLIC_HOST}${process.env.basePath || ''}/api/card`

export default class Home extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			remainingCards: 0,
			currentCard: null,
			successfulSubmission: null
		}

		this.setRemainingCards = this.setRemainingCards.bind(this)
		this.getRemainingCards = this.getRemainingCards.bind(this)
		this.getNewCard = this.getNewCard.bind(this)
		this.deleteCard = this.deleteCard.bind(this)
		this.submitCard = this.submitCard.bind(this)
	}
	
	setRemainingCards = (count) => this.setState({ remainingCards: count })
	
	getRemainingCards = async () => {
		let response = await fetch(`${cardEndpoint}/count`)
		return await response.json()
	}

	getNewCard() {
		fetch(cardEndpoint)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						currentCard: {
							text: result.card.text, 
							id: result.card.id
						},
						remainingCards: result.remainingCards
					})
				},
				(error) => {
					console.log(`Error fetching new card: ${error}`)
					this.setState({
						currentCard: null,
						error
					});
				}
			)
	}

	deleteCard(id) {
		if(id) {
			fetch(cardEndpoint, { method: 'DELETE', body: JSON.stringify({ id }) })
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({ remainingCards: result.remainingCards, currentCard: null })
					},
					(error) => {
						console.error(error)
					}
				)
		}
	}

	submitCard(text) {
    if (text) {
			fetch(cardEndpoint, { method: 'POST', body: JSON.stringify({newCard: text}) })
			.then(res => res.json())
      .then(
				(result) => {
					this.setState({ successfulSubmission: { result, text: text}})
					this.getRemainingCards().then(
						(result) => {
							console.log(`Found ${result.remainingCards} cards in redis`)
							this.setRemainingCards(result.remainingCards)
						},
						(error) => {
							console.log(`Error fetching updated card count: ${error}`)
						}
					)
				},
				(error) => {
					console.error(error)
					this.setState({successfulSubmission: false})
				}
      )
    }
  }

	componentDidMount() {
		this.getRemainingCards().then(
			(result) => {
				console.log(`Found ${result.remainingCards} cards in redis`)
				this.setRemainingCards(result.remainingCards)
			},
			(error) => {
				console.log(`Error fetching initial card count: ${error}`)
			}
		)
	}

	render () {
		const { remainingCards, currentCard, successfulSubmission } = this.state
		return (
			<div className="container flex flex-col items-center mx-auto">
				<Head>
					<title>Charades</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main className="flex flex-col items-start">
					<h1 className="text-6xl">Charades</h1>
					<Card onNewCard={this.getNewCard} onDeleteCard={this.deleteCard} currentCard={currentCard}/>
					<aside className="text-lg font-thin mb-4" >
						{remainingCards} card(s) left
        	</aside>
					<CardSubmission onCardSubmission={this.submitCard} successfulSubmission={successfulSubmission} />
				</main>
			</div>
		)
	}
}
