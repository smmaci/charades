import React from 'react'

export default function Card(props) {
	const { currentCard, onDeleteCard, onNewCard } = props

	let curriedDeleteCard = () => {
		if(currentCard !== null) { 
			onDeleteCard(currentCard.id) 
		}
	}

	
	return (
		<>
			<div className="w-full flex justify-center items-center border border-gray-400 shadow rounded p-8 mb-4 max-w-lg">
				{ currentCard === null
					? <span className="text-lg font-thin">(Draw a new card to get started)</span>
					: <span className="text-lg font-thick">{currentCard.text}</span>
				}
			</div>
			<div className="mb-4">
				<button
					className="inline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
					onClick={onNewCard}
				>
					New Card
				</button>
				<button
					className="inline bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					onClick={ curriedDeleteCard }
					disabled={ currentCard === null }
				>
					Delete Card
				</button>
			</div>
		</>
	)
}
