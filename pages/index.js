import Head from 'next/head'
import Card from '../src/components/Card'
import CardSubmission from '../src/components/CardSubmission'

export default function Home() {
  return (
    <div className="container flex flex-col items-center mx-auto">
      <Head>
        <title>Charades</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-start">
        <h1 className="text-6xl">
          Charades
        </h1>
        <p>Draw a card to get started</p>
        <Card />
        <CardSubmission />
      </main>
    </div>
  )
}
