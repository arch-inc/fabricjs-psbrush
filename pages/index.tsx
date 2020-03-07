import { NextPage } from "next";
import Head from "next/head";

const js = `
  import { hello } from "https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush/dist/index.es.js";
  hello();
`;

const Index: NextPage = () => (<>
  <Head>
    <title key="title">hello world</title>
    <script type="module" dangerouslySetInnerHTML={{
      __html: js
    }}></script>
  </Head>
  <div>hello world!</div>
</>);

export default Index;
