import { useMemo, useRef, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";

const Index: NextPage = () => {
  // create a canvas element that never gets reloaded
  const ref = useRef<HTMLCanvasElement>();
  const canvas = useMemo(
    () => <canvas ref={ref} width="720" height="480" />,
    []
  );

  // call window.initialize defined in index.js
  useEffect(() => {
    if (!ref.current || typeof window === "undefined") {
      return;
    }

    import("fabric").then(({ fabric }) => {
      const el = ref.current;

      // Create a Fabric.js canvas
      let canvas = new fabric.Canvas(el, {
        isDrawingMode: true,
        enablePointerEvents: true
      } as any);

      import("../../").then(({ PSBrush }) => {
        // Initialize a brush
        let brush = new PSBrush(canvas);
        brush.width = 10;
        brush.color = "#000";
        canvas.freeDrawingBrush = brush;
      });
    });
  }, [ref.current]);

  return (
    <>
      <Head>
        <title key="title">
          fabricjs-psbrush | A lightweight pressure-sensitive brush
          implementation for Fabric.js
        </title>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.4/dist/semantic.min.css"
        ></link>
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
          padding: 2em 0 0 0;
        }
        div.canvas-wrapper {
          background: #f5f5f5;
          margin: 2em auto 0 auto;
          padding: 2em 0;
        }
        div.canvas-wrapper > div.canvas {
          text-align: center;
          overflow: hidden;
        }
        div.canvas-wrapper > div.canvas :global(.canvas-container) {
          margin: auto;
          border: 1px solid #eee;
          background: #fff;
        }
        footer {
          padding: 2em 0;
        }
      `}</style>
      <div className="hero">
        <div className="ui container">
          <h1 className="ui header">
            <div className="content">
              fabricjs-psbrush
              <div className="sub header">
                A lightweight pressure-sensitive brush implementation for
                Fabric.js
              </div>
            </div>
          </h1>
        </div>
      </div>
      <div className="main content">
        <div className="ui container">
          <div className="ui message">
            <div className="header">How to install</div>
            <pre>npm i @arch-inc/fabricjs-psbrush</pre>
            <p>
              For more details on how to use this library, please refer to the
              following documents.
            </p>
          </div>
          <div className="ui selection divided list">
            <a
              className="item"
              href="https://www.npmjs.com/package/@arch-inc/fabricjs-psbrush"
            >
              <i className="npm icon"></i>
              <div className="content">
                <div className="header">NPM package registry</div>
                <div className="description">@arch-inc/fabricjs-psbrush</div>
              </div>
            </a>
            <a
              className="item"
              href="https://github.com/arch-inc/fabricjs-psbrush"
            >
              <i className="github icon"></i>
              <div className="content">
                <div className="header">GitHub repository</div>
                <div className="description">@arch-inc/fabricjs-psbrush</div>
              </div>
            </a>
            <a
              className="item"
              href="https://arch-inc.github.io/fabricjs-psbrush/api/globals.html"
            >
              <i className="file alternate outline icon"></i>
              <div className="content">
                <div className="header">API document</div>
                <div className="description">
                  automatically generated with TypeDoc
                </div>
              </div>
            </a>
            <a
              className="item"
              href="https://arch-inc.github.io/fabricjs-psbrush/index.js"
            >
              <i className="file code outline icon"></i>
              <div className="content">
                <div className="header">index.js</div>
                <div className="description">
                  example code loaded in this page
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className="canvas-wrapper">
          <div className="ui container">
            <h3 className="ui header">Live demo</h3>
            <p>
              Draw anything on the white blank canvas shown below; tested on
              iPad Pro and Surface Go.
            </p>
            <div className="ui divider"></div>
          </div>
          <div className="canvas">{canvas}</div>
        </div>
      </div>
      <footer>
        <div className="ui container">
          <div className="ui horizontal divided list">
            <div className="item">
              &copy; <a href="//research.archinc.jp">Arch Inc.</a> 2020-2021
            </div>
            <div className="item">
              <a href="https://github.com/arch-inc/fabricjs-psbrush">
                <i className="github icon" /> arch-inc/fabricjs-psbrush
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
