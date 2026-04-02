import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import Page_0 from "./pages/login.tsx";
import PageLayout_0 from "./pages/login.pageLayout.tsx";
import Page_1 from "./pages/visao.tsx";
import PageLayout_1 from "./pages/visao.pageLayout.tsx";
import Page_2 from "./pages/_index.tsx";
import PageLayout_2 from "./pages/_index.pageLayout.tsx";
import Page_3 from "./pages/painel.tsx";
import PageLayout_3 from "./pages/painel.pageLayout.tsx";
import Page_4 from "./pages/firmware.tsx";
import PageLayout_4 from "./pages/firmware.pageLayout.tsx";
import Page_5 from "./pages/historico.tsx";
import PageLayout_5 from "./pages/historico.pageLayout.tsx";
import Page_6 from "./pages/assistente.tsx";
import PageLayout_6 from "./pages/assistente.pageLayout.tsx";

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (cb) => {
    setTimeout(cb, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([["./pages/login.tsx","/login"],["./pages/visao.tsx","/visao"],["./pages/_index.tsx","/"],["./pages/painel.tsx","/painel"],["./pages/firmware.tsx","/firmware"],["./pages/historico.tsx","/historico"],["./pages/assistente.tsx","/assistente"]]);
const fileNameToComponent = new Map([
    ["./pages/login.tsx", Page_0],
["./pages/visao.tsx", Page_1],
["./pages/_index.tsx", Page_2],
["./pages/painel.tsx", Page_3],
["./pages/firmware.tsx", Page_4],
["./pages/historico.tsx", Page_5],
["./pages/assistente.tsx", Page_6],
  ]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  return <Component />;
}

function toElement({
  trie,
  fileNameToRoute,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
    </div>
  );
}

import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    // Back/forward: keep browser-like behavior
    if (navType === "POP") return;

    // Hash links: let the browser scroll to the anchor
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash, navType]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <GlobalContextProviders>
        <Routes>
          {toElement({ trie: buildLayoutTrie({
"./pages/login.tsx": PageLayout_0,
"./pages/visao.tsx": PageLayout_1,
"./pages/_index.tsx": PageLayout_2,
"./pages/painel.tsx": PageLayout_3,
"./pages/firmware.tsx": PageLayout_4,
"./pages/historico.tsx": PageLayout_5,
"./pages/assistente.tsx": PageLayout_6,
}), fileNameToRoute, makePageRoute })} 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}
