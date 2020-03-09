import { NextPage } from "next";
import Head from "next/head";

const Index: NextPage = () => {
  return (<>
    <Head>
      <title key="title">fabricjs-psbrush | A lightweight pressure-sensitive brush implementation for Fabric.js</title>
      <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.4/dist/semantic.min.css"></link>
    </Head>
    <style jsx>{`
      :global(html, body) {
        background: #eee;
      }
      div.hero {
        padding: 3em 0;
      }
      div.main.content {
        background: #fff;
        padding: 2em 0 1em 0;
      }
      div.canvas {
        margin: 0 auto;
        padding: 1em 0;
        text-align: center;
      }
      div.canvas :global(canvas) {
        border: 1px solid #ccc;
      }
      footer {
        padding: 2em 0;
      }
    `}</style>
    <div className="hero">
      <div className="ui container">
        <h1 className="ui header">
          fabricjs-psbrush
        </h1>
      </div>
    </div>
    <div className="main content">
      <div className="ui container">
        <p>We're working on documentations -- stay tuned!</p>
      </div>
      <div className="canvas" dangerouslySetInnerHTML={{
        __html: "<canvas id=\"c\" width=\"720\" height=\"480\" />"
      }}></div>
    </div>
    <footer>
      <div className="ui container">
        <div className="ui horizontal divided list">
          <div className="item">
            &copy; <a href="//research.archinc.jp">Arch Inc.</a> 2020
          </div>
          <div className="item">
            <a href="https://github.com/arch-inc/fabricjs-psbrush"><i className="github icon" /> arch-inc/fabricjs-psbrush</a>
          </div>
        </div>
      </div>
    </footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.6.2/fabric.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@arch-inc/fabricjs-psbrush@0.0.12/dist/index.js"></script>
    <script src={`${process.env.BASE_PATH}/index.js`}></script>
  </>);
}

export default Index;
