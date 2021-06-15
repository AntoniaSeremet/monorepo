import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>After Work Talks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a
        href="https://crocoder.dev/"
        className={styles.supported}
        rel="nofollow noopener noreferrer"
        target="_blank"
      >
        <Image
          className={styles.logo}
          width={80}
          height={80}
          alt="CroCoder Logo"
          src="/crocoder.png"
        />
      </a>
      <main className={styles.layout}>
        <h1 className={styles.title}>After Work Talks</h1>
        <div>
          <div>abc</div>
          <div>def</div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
