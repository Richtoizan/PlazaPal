import Head from "next/head";
import Paragraph from "./components/ui/Paragraph";

const Home = () => {
  return (
    <div>
      <Head>
        <title>PlazaPal</title>
        <meta name="description" content="PlazaPal Application" />
      </Head>

      <main>
        <h1>Welcome to PlazaPal</h1>
        <Paragraph size="sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias
          error nostrum aspernatur mollitia hic minus cumque quos eum? In
          repellat consequuntur nesciunt debitis nobis, mollitia voluptatibus
          necessitatibus quia? Nesciunt, quidem.
        </Paragraph>
      </main>
    </div>
  );
};

export default Home;
