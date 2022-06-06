import Head from 'next/head'
import styles from '../styles/Home.module.css'
import HOST from '../constants/host'

export default function Home({ PET_price, GLAS_price }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Flaschenpost Tracker</title>
        <meta name="description" content="Tracks flaschenpost Vilsa prices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <h2>Vilsa</h2>
        <h1>Pet price: {PET_price}€</h1>
        <h1>Glas price: {GLAS_price}€</h1>
        
      </main>

    </div>
  )
}

// call scaper API
export async function getServerSideProps() {
  const url = `${HOST}/api/scraper`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    props: {
      PET_price: data.PET_price,
      GLAS_price: data.GLAS_price
    }
  }
}
