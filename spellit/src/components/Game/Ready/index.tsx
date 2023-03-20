import { useState } from "react"
import { useSelector, useDispatch, Provider } from 'react-redux';

import { costActions } from '../../../store/cost';

import './index.css'
import Frame from '../../../assets/ui/Frame.png'
import { RootState } from "@/store";

const Ready = () => {
  
  // 나의 덱 정보 저장
  const myCards = ['Fire1', 'Light1', 'Ice1', 'Wind1', 'Dark1']
  

  // cost 부족할 때 shake 효과
  const [isShaking, setIsShaking] = useState(false);

  function handleClick() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }
  
  // 선택된 카드 리스트
  const [selectedCards, setselectedCard] = useState<string[]>([]);

  // 카드 선택
  const selectCard = (event: React.MouseEvent<HTMLImageElement>) => {
    console.log(event)
    console.log(event.currentTarget.alt)
    setselectedCard([
      ...selectedCards,
      event.currentTarget.alt
    ])
    subCost()
  };

  // 선택한 카드 삭제
  const removeCard = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
    console.log(event)
    console.log(event.currentTarget)
    setselectedCard(selectedCards.slice(0, index).concat(selectedCards.slice(index + 1)));
    navigator.vibrate(200);
    addCost()
  };

  // cost + or -
  const cost = useSelector((state: RootState) => state.cost.cost);

  const dispatch = useDispatch();

  const addCost = () => {
    dispatch(costActions.add(10))
  }
  const subCost = () => {
    dispatch(costActions.sub(10))
  }
  return (
    <div>
      { cost }

      <div className={isShaking ? "shake selectedCardBox" : "selectedCardBox"} onClick={handleClick}>
        <img src={Frame} alt="frame"/>
        <div className="selectedCard">
          {selectedCards.map((card: string, index: number) => (
            <img 
              key={index} 
              src={require(`../../../assets/card/icon/${card}.png`)} 
              alt={card}
              onClick={(event) => removeCard(event, index)}
            ></img>
          ))}
        </div>
      </div>
      <div className="cards">
        {myCards.map((card, index) => (
          <img 
            key={index} 
            src={require(`../../../assets/card/front/${card}.png`)} 
            alt={card} 
            className="mycard" 
            onClick={selectCard}
          ></img>
        ))}
      </div>
    </div>
  )
}
export default Ready