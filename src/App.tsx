import { useState, useEffect } from 'react'
import './App.css'
import './style.css'

type PokemonProps = {
  name: string,
  url: string,
  image: string,
  imageback: string, 
  hideInfo: (info: string) => void,
  showInfo: () => void
}

type PokemonData = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonData[];
};


const Pokemon:React.FC<PokemonProps> = ({id, hideInfo, showInfo, name, url, image, imageback}) => {
  return (
    <div onMouseEnter={() => showInfo(url, id)}
    onMouseLeave={() => hideInfo()} data-info={url} className="m-auto bg-white shadow-sm p-10">
      <img   style={{
    '--image-url': `url(${image})`,
    '--image-backurl': `url(${imageback})`,
  }} className="w-24 h-24 m-auto bg-[image:var(--image-url)] hover:bg-[image:var(--image-backurl)]"/>
  <p>{name.toUpperCase()}</p></div>
  )
}

function App() {
  let baseapi="https://pokeapi.co/api/v2/pokemon?limit=151";
  let baseimageurl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
  let basebackimageurl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/";

  const [currentAPI, setCurrentAPI] = useState<string>(baseapi);
  const [pokemonList, setPokemonList] = useState<PokemonListResponse | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [warning, setWarning] = useState(true);
  const [moreInfoUrl, setMoreInfoUrl] = useState<string>('');
  const [pokemonData, setPokemonData] = useState();

  useEffect(()=> {
    fetch(currentAPI, {method: "GET"}).then(response=>response.json()).then(data=>setPokemonList(data)).catch(error=>console.log(error));
  }, [])

  useEffect(()=> {
    if (warning) {
      fetch(moreInfoUrl, {method: "GET"}).then(response=>response.json()).then(data=>setPokemonData(data)).catch(error=>console.log(error));
    }
    console.log(pokemonData);
  },[warning]);

  const showInfo = (url:string, id:number) => {
    setWarning(true);
    setMoreInfoUrl(url);

  }

  const hideInfo = () => {
    setWarning(false);
  }

  return (
    <>
    {warning.toString()}
    <div className="p-10 bg-slate-50 w-full min-w-[200px]">
    <input  className=" max-w-sm w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
    placeholder="Type to search"
    type="text"
    value={searchValue}
    onChange={(e)=>setSearchValue(e.target.value)}
    /></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 bg-slate-50">
      {pokemonList && pokemonList.results ? (
              pokemonList.results
              .filter(item=>item.name.toLowerCase().includes(searchValue.toLowerCase()))
                .map((pokemon) => (
                <Pokemon
                  key={pokemon.name}
                  name={pokemon.name}
                  url={pokemon.url}
                  image={baseimageurl+(pokemonList.results.indexOf(pokemon)+1)+".png"}
                  imageback={basebackimageurl+(pokemonList.results.indexOf(pokemon)+1)+".png"}
                  hideInfo={hideInfo}
                  showInfo={showInfo}
                  id={pokemonList.results.indexOf(pokemon)+1}
                />
              ))
            ) : (
              <p>Loading...</p>
            )}

            </div>
            {warning && pokemonData &&
            <div> {pokemonData.weight}
            </div>}
    </>
  )
}

export default App
