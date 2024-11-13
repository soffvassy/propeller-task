import { useState, useEffect } from 'react';
import './App.css';
import './style.css';

type PokemonProps = {
  name: string;
  url: string;
  image: string;
  imageback: string;
  id: number;
  weight: number;
  height: number;
  type1: string,
  type2?: string
};

type PokemonData = {
  name: string;
  url: string;
  details: any;
};

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonData[];
};

const Pokemon: React.FC<PokemonProps> = ({ type1, type2, id, weight, height, name, image, imageback }) => {
  return (
    <div
      className="m-auto bg-white shadow-sm p-10 text-xs text-left"
    >
      <img
        style={{
          '--image-url': `url(${image})`,
          '--image-backurl': `url(${imageback})`,
        }}
        className="mb-2 w-24 h-24 m-auto bg-[image:var(--image-url)] hover:bg-[image:var(--image-backurl)]"
      />
      <p><b>{name}</b></p>
      <p>ID: {id}</p>
      <p>Weight: {weight}</p>
      <p>Height: {height}</p>
      <p>Types: {type1} {type2 ? (", "+ type2): ""}</p>
    </div>
  );
};

function App() {
  const baseapi = 'https://pokeapi.co/api/v2/pokemon?limit=151';
  const baseimageurl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  const basebackimageurl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/';

  const [pokemonList, setPokemonList] = useState<PokemonListResponse | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const typesOfPokemons = ["grass", "normal", "bug", "fire", "poison", "fairy", "water", "psychic"];
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetch(baseapi, { method: 'GET' })
      .then((response) => response.json())
      .then(async (data) => {
        setPokemonList(data);

        const detailedPokemons = await Promise.all(
          data.results.map(async (item: any) => {
            const detailsResponse = await fetch(item.url);
            const details = await detailsResponse.json();
            return { ...item, details }; 
          })
        );

        setPokemonList((prevList: any) => ({
          ...prevList,
          results: detailedPokemons, 
        }));

        console.log(pokemonList);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }, []);


  return (
    <>
      <div className="p-10 bg-slate-50 w-full min-w-[200px]">
        <input
          className="max-w-sm w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Type to search"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="p-10 bg-slate-50">
        Sort by type: 
        {typesOfPokemons.map(currfilter=> (
          <span className={currfilter===filter? "cursor-pointer underline p-3": "cursor-pointer p-3"}  onClick={()=>setFilter(currfilter)}>{currfilter}</span>
        ))}
        <span className="cursor-pointer  p-3" onClick={()=>setFilter('')}>Clear types</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 bg-slate-50">
        {pokemonList && pokemonList.results ? (
          pokemonList.results
            .filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
            .filter((item) => {
              if (!filter) return item;
              const types = item.details.types;
              return (
                (types[0]?.type.name === filter) ||
                (types[1]?.type.name === filter)
              );
            })
            .map((pokemon) => (
              <Pokemon
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
                image={baseimageurl + (pokemonList.results.indexOf(pokemon)+1) + '.png'}
                imageback={basebackimageurl + (pokemonList.results.indexOf(pokemon)+1) + '.png'}
                id={pokemon.details ? pokemon.details.id : 'N/A'}
                weight={pokemon.details ? pokemon.details.weight : 'N/A'}
                height={pokemon.details ? pokemon.details.height : 'N/A'}
                type1={pokemon.details ? pokemon.details.types[0].type.name : "N/A"}
                type2={pokemon.details && pokemon.details.types[1] ? pokemon.details.types[1].type.name : ""}
              />
            ))
        ) : (
          <p>Loading Pokemons</p>
        )}
      </div>
    
    </>
  );
}

export default App;
