import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/";

import ProfileHp from "../Items/ProfileHp";
import Timer from "../Items/Timer";
import HpBar from "../Items/HpBar";

import './Attack.css'

import SpellBox from "../../../assets/InGame/SpellBox.png";
import SkillBar from "../../../assets/InGame/SkillBar.png";

interface Spell {
    name: string;
    content: string;
    time: number;
}

const wind3: Spell = {
  name: "wind3",
  content: "칼날의 바람이여 적을 베어라",
  time: 4,
};
const fire1: Spell = {
  name: "fire1",
  content: "타올라라 불꽃 적을 태우는 탄환이 되어 날아라",
  time: 2,
};
const wind1: Spell = {
  name: "wind1",
  content: "모여라 대기의 번개 천지를 뒤흔드는 굉음의 뇌광 창이 되어 적을 꿰뚫어라",
  time: 8,
};
const ice1: Spell = {
  name: "ice1",
  content: "냉기여 휘몰아쳐라 빛을 삼키고 온기를 먹어치우며 이 땅을 내달려 모든 것이 얼어붙을 것이니",
  time: 2,
};
const storm1: Spell = {
  name: "storm1",
  content: "불어라 한줄기 바람 모이고 모여 적들을 쓸어버려라",
  time: 5,
};
const light1: Spell = {
  name: "light1",
  content: "악을 멸하는 성스러운 빛이여 마의 존재를 멸하는 성화의 빛으로 적을 강타해라",
  time: 8,
};
const dark1: Spell = {
  name: "dark1",
  content: "어둠보다 어두운자여 심연 깊은 곳에서 우리를 올려다보는 자여 한 점 빛조차 허락하지 않는 어둠을 내보여 그 공포로 영혼까지 떨게 하라",
  time: 12,
};

function Attack() {
    const chooseCards = useSelector((state: RootState) => state.attack.chooseCards);
    // console.log(chooseCards);
    // console.log('왜렌더링이 계속 되냐고옹오ㅗ오오오오오')
    //@ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    // 인스턴스 생성
    const recognition = new SpeechRecognition();
  
    // true면 말을 실시간으로 출력 false면 말을 마친 후에 출력
    recognition.interimResults = true;
    // 값이 없으면 HTML의 <html lang="en">을 참고합니다. ko-KR, en-US
    recognition.lang = "ko-KR";
    // true means continuous, and false means not continuous (single result each time.)
    // true면 음성 인식이 안 끝나고 계속 됩니다.
    recognition.continuous = true;
    // 숫자가 작을수록 발음대로 적고, 크면 문장의 적합도에 따라 알맞은 단어로 대체합니다.
    // maxAlternatives가 크면 이상한 단어도 문장에 적합하게 알아서 수정합니다.
    recognition.maxAlternatives = 0;
  
    const [spanEl, setSpanEl] = useState<JSX.Element[]>([]);
    const reg = /[~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim;

    const spanList: JSX.Element[] = [];

    // 타이머 띄우기
    const [sec, setSec] = useState<number>(0);

    const SpellIt = async (selectSpell:Spell, idx:number) => {
      
        let spellLength = 0; // 띄어쓰기 제거한 주문의 길이
        for (let i = 0; i < selectSpell.content.length; i++) {
            if (!selectSpell.content[i].match(reg)) {
            spellLength++;
            }
            let spanClassName = `spell`;
            if (selectSpell.content[i] != " ") {
            spanClassName = `spell-${spellLength - 1}`;
            }
            const newSpanEl = <span id={spanClassName}>{selectSpell.content[i]}</span>; // spanEl에 id 값 넣어주기
            spanList.push(newSpanEl);
        }
        setSpanEl(spanList);

        const trimText = selectSpell.content.replaceAll(" ", ""); // 띄어쓰기 제거한 주문
        // console.log(trimText);

        recognition.addEventListener("result", (e :any) => {
            console.log("말하는 중이잖아요?");
            let transcript = e.results[0][0].transcript; // 인식된 음성 글자
            transcript = transcript.replaceAll(" ", ""); // 띄어쓰기 제거한 음성 인식 글자
            console.log(transcript);

            let correct = 0;
            console.log("------------------------------------------------");
            for (let i = 0; i < transcript.length; i++) {
                if (transcript[i] == trimText[i]) {
                    const element = document.getElementById(`spell-${i}`);

                    const correctColor = `${selectSpell.name}-correct`;
                    element?.classList.add(correctColor);
                    correct++;
                }
            }
            const percentEl = document.getElementById("percent") as HTMLDivElement;
            const correctPercent = Math.round((correct / spellLength) * 100);
            percentEl.innerText = `총 ${spellLength}개 중 ${correct}개 맞음 : ${correctPercent} %`;
        });

        // 음성 인식 시작
        recognition.start();
        setSec(selectSpell.time);
        console.log('SpeechRecognition start!')

        // 타이머
        const interval = setInterval(() => {
            setSec(prevSec => prevSec - 1);
        }, 1000)
        
        // 주문 제한 시간 흐른 후 음성인식 종료
        setTimeout(() => {
            recognition.stop();
            clearInterval(interval);
            console.log('SpeechRecognition end!')
            // class 속성 제거하기
            setTimeout(() => {
              for (let j=0; j<selectSpell.content.length; j++) {
                const spellClass = document.getElementById(`spell-${j}`);
                spellClass?.classList.remove(`${selectSpell.name}-correct`)
                // console.log(selectSpell.name);
                // console.log('옛다 제거함~')
              }
              setIdx(idx+1);
            }, 500)
        }, selectSpell.time*1000); 

    };

    const navigate = useNavigate();
    const [idx, setIdx] = useState(0);
    useEffect(() => {
      // console.log(idx);
      if (fire1.name == chooseCards[idx]) {
          SpellIt(fire1, idx);
        } else if (ice1.name == chooseCards[idx]) {
          SpellIt(ice1, idx);
        } else if (wind1.name == chooseCards[idx]) {
          SpellIt(wind1, idx);
        } else if (light1.name == chooseCards[idx]) {
          SpellIt(light1, idx);
        } else if (dark1.name == chooseCards[idx]) {
          SpellIt(dark1, idx);
        } else if (wind3.name == chooseCards[idx]) {
          SpellIt(wind3, idx);
        } else if (storm1.name == chooseCards[idx]) {
          SpellIt(storm1, idx);
        }

        if (idx == chooseCards.length) {
          navigate('/settle');
        }
        
        // 주문 삭제하기
        // if (idx == chooseCards.length) {
        //   const spell = document.querySelectorAll('span')
        //   for (let i=0; i<spell.length; i++) {
        //     spell[i].remove()
        //   }
          
        //   const percent = document.querySelector("percent") as HTMLDivElement;
        //   percent.remove()

        // }
    }, [idx])

    const defaultHP = useSelector((state: RootState) => (state.attack.defaultHp));
    const firstHp = useSelector((state: RootState) => (state.attack.firstHp));
    const secondHp = useSelector((state: RootState) => (state.attack.secondHp));
    
    // console.log(firstHp);
    
    const firstHpStyle = {
        width: `${firstHp}px`,
        backgroundColor: firstHp > defaultHP/4 ? '#FFF500' : '#FF0000' ,
    }
    const secondHpStyle = {
        width: `${secondHp}px`,
        backgroundColor: secondHp > defaultHP/4 ? '#FFF500' : '#FF0000' ,
    }

    return (
        <div className="attack-bg">
          <div className="attack-top-items">
            <div className='first-hp-box'>
                <ProfileHp></ProfileHp>
                <div className="first-hp-bar" style={firstHpStyle}></div>
            </div>
            <Timer time={sec}></Timer>
            <div className='second-hp-box'>
                <ProfileHp></ProfileHp>
                <div className="second-hp-bar" style={secondHpStyle}></div>
            </div>
          </div>

          <div id="percent"></div>
          
          <div className="attack-bottom-itmes">
            <div className="SpellBox">
                <img style={{ width: 800, height: 400}} src={SpellBox} alt="" />
                <div id='origin'>{spanEl}</div>
            </div>
            {/* <div className="words"></div> */}

            <div className="spell-bar-box">
              <img src={SkillBar} alt="" style={{width: '100%', height: '120px'}} />
              <div className="spells">
                {chooseCards.map((card: string, index: number) => (
                  <img 
                    style={{height: '100px', margin: '10px'}}
                    key={index} 
                    src={require(`../../../assets/card/icon/${card}.png`)} 
                    alt={card}
                  ></img>
                ))}
              </div>
            </div>

          </div>
        </div>
    )
}

export default Attack;