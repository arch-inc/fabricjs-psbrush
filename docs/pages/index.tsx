import { NextPage } from "next";
import Head from "next/head";

const js = `
  let canvas = new fabric.Canvas("c");
  console.log(fabric);
`;

const Index: NextPage = () => (<>
  <Head>
    <title key="title">hello world</title>
  </Head>
  <div>hello world!</div>
  <p><canvas id="c" /></p>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.6.2/fabric.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush/dist/index.js"></script>
  <script dangerouslySetInnerHTML={{
    __html: js
  }}></script>
</>);

export default Index;
