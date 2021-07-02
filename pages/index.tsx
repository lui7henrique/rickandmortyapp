import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Character } from "../components/Character";

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }: any) {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({ current, ...nextData.info });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev: any) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev: any) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  return (
    <div className="home">
      <div>
        <h1>Wubba Lubba Dub Dub</h1>
        <h1>This is an app builded used Next Js and Rick and Morty API</h1>
      </div>
      <div className="cardList">
        {results.map((results: any) => {
          const { id, name, status, species, gender, origin, location, image } =
            results;
          return (
            <Character
              key={id}
              name={name}
              status={status}
              species={species}
              origin={origin}
              location={location}
              image={image}
            />
          );
        })}
      </div>
      <button onClick={handleLoadMore}>Load more</button>
    </div>
  );
}
