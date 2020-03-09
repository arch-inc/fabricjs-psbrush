import { NextPage } from "next";
import Head from "next/head";

const js = `
  let canvas = new fabric.Canvas("c");
  console.log("fabric", fabric);
`;

const Index: NextPage = () => (<>
  <Head>
    <title key="title">fabricjs-psbrush | A lightweight pressure-sensitive brush implementation for Fabric.js</title>
  </Head>
  <div>We're working on documentations -- stay tuned!</div>
  <canvas id="c"></canvas>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.6.2/fabric.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush@0.0.9/dist/index.js"></script>
  <script dangerouslySetInnerHTML={{
    __html: js
  }}></script>
</>);

export default Index;
