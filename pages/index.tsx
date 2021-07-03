/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Character } from "../components/Character";

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

type CurrentTarget = {
  values: any;
};

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

  function handleSubmitSearch(e: any) {
    e.preventDefault();

    const { currentTarget = {} }: any = e;
    console.log(currentTarget);
    const fields = Array.from(currentTarget.values);
    const fieldQuery: any = fields.find((field: any) => field.name === "query");

    const value = fieldQuery.value || "";
    console.log(value);

    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;
    updatePage({
      current: endpoint,
    });
  }

  return (
    <div className="home">
      <form onSubmit={handleSubmitSearch}>
        <input
          name="query"
          type="search"
          placeholder="Search a character by name"
        />
        <button>
          <img src="./portal2.png" alt="Portal" />
        </button>
      </form>
      <div className="cardList">
        {results ? (
          results.map((results: any) => {
            const {
              id,
              name,
              status,
              species,
              gender,
              origin,
              location,
              image,
            } = results;
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
          })
        ) : (
          <h1>oi</h1>
        )}
      </div>
      {results && (
        <button className="load" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}
