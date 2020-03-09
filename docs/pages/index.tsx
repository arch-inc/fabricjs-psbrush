import { NextPage } from "next";
import Head from "next/head";

const Index: NextPage = () => {
  return (<>
    <Head>
      <title key="title">fabricjs-psbrush | A lightweight pressure-sensitive brush implementation for Fabric.js</title>
      <style>{`
        canvas {
          border: 1px solid #ccc;
        }
      `}</style>
    </Head>
    <p>We're working on documentations -- stay tuned!</p>
    <div dangerouslySetInnerHTML={{
      __html: "<canvas id=\"c\" width=\"720\" height=\"480\" />"
    }}></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.6.2/fabric.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush@0.0.12/dist/index.js"></script>
    <script src={`${process.env.BASE_PATH}index.js`}></script>
  </>);
}

export default Index;
