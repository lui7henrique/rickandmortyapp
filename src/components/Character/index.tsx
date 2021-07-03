/* eslint-disable @next/next/no-img-element */

type Character = {
  name: string;
  status: string;
  species: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
};

export function Character({
  name,
  status,
  species,
  origin,
  location,
  image,
}: Character) {
  return (
    <div className="card">
      <img src={image} alt="Imagem" />
      <div className="content">
        <section className="header">
          <h1>{name}</h1>
          <div className="status">
            <span className={`circle ${status}`}>•</span>
            <span>
              {status} - {species}
            </span>
          </div>
        </section>

        <section className="body">
          <div className="location">
            <span>Last know location:</span>
            <p>{location.name}</p>
          </div>
          <div className="origin">
            <span>First seen in:</span>
            <p>{origin.name}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
