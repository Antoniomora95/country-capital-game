
import { useState } from 'react';
import './App.css'

type CountryCapitalGameProps = {
  data: Record<string, string>,
};

type GameItem = {
  countryId: string,
  name: string,
  class: 'ERROR' | 'SELECTED' | 'DEFAULT',
}

const getAllGameItems = (data: Record<string, string>): GameItem[] => (
  Object.entries(data).flatMap(([countryName, capital]): GameItem[] => {
    return [
      {
        countryId: countryName,
        name: countryName,
        class: 'DEFAULT',
      },
      {
        countryId: countryName,
        name: capital,
        class: 'DEFAULT',
      }
    ]
  }).sort(() => Math.random() - 0.5)
);

function CountryCapitalGame({ data }: CountryCapitalGameProps) {
  const [gameItems, setGameItems] = useState(() => getAllGameItems(data))

  const getIsSameCountry = (someItem: GameItem, anotherItem: GameItem) => someItem.countryId === anotherItem?.countryId;

  const getIsSameName = (someItem: GameItem, anotherItem: GameItem) => someItem.name === anotherItem?.name;

  const isDefaultOrErrorState = (selectedItems: GameItem[]): boolean => selectedItems.length === 0 || selectedItems.length === 2;

  const onButtonClick = (gameItem: GameItem) => () => {

    if (gameItem.class !== 'DEFAULT') {
      return
    }

    const selectedItems = gameItems.filter(item => item.class !== 'DEFAULT');
    const [previouslySelected] = selectedItems;

    if (isDefaultOrErrorState(selectedItems)) {
      setGameItems((prevItems) => (
        prevItems.map((item) => {
          return {
            ...item,
            class: getIsSameName(item, gameItem) ? 'SELECTED' : 'DEFAULT'
          }
        })
      ));
    } else if (getIsSameCountry(gameItem, previouslySelected)) {
      setGameItems((prevItems) => prevItems.filter(item => !getIsSameCountry(item, gameItem)));
      return;
    }
    else {
      setGameItems((prevItems) => {
        return prevItems.map(item => {
          if (getIsSameName(item, gameItem)
            || getIsSameName(item, previouslySelected)) {
            return {
              ...item,
              class: 'ERROR'
            }
          }
          return item;
        })
      });
    }
  }

  return (
    <div>
      {
        gameItems.length ? (
          gameItems.map((gameItem) => {
            return <button key={gameItem.name} onClick={onButtonClick(gameItem)} className={gameItem.class}>{gameItem.name}</button>
          })
        ) : ('Congratulations!!')
      }
    </div>
  )
}
function App() {

  return (
    <>
      <h1>Country capital game algorithm</h1>
      <div className="card">
        <CountryCapitalGame data={{ Germany: 'Berlin', Azerbaijan: 'Baku', Mexico: 'CDMX', USA: 'Washington', Argentina: 'Buenos Aires'}} />
      </div>
    </>
  )
}

export default App
