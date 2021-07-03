/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Character } from "../components/Character";
import { PageNotFound } from "../components/PageNotFound";
import { FaSearch } from 'react-icons/fa'

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

interface IProps {
  handleSearchTyping(event: React.FormEvent<HTMLInputElement>): void;
}

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
  const [search, setSearch] = useState("");
  const [hasMoreResults, setHasMoreResults] = useState<true | false>(true)

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
      setHasMoreResults(nextData.info.next !== null)

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

  function handleSubmitSearch(event: React.FormEvent) {
    event.preventDefault();

    const endpoint = `https://rickandmortyapi.com/api/character/?name=${search}`;
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
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>
          <FaSearch size={25}/>
        </button>
      </form>
      {results ? (
        <div className="cardList">
          {results.map((results: any) => {
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
          })}
        </div>
      ) : (
        <PageNotFound />
      )}
      {hasMoreResults === true && (
        <button className="load" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}
