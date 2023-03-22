import { useState, ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import API from "@/utils/API"
import './Login.css'
import kakao from '../../assets/ui/kakao_login_medium_narrow.png'


const Login = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const idChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  }
    
  const pwChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPw(event.target.value);
  }
 

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('login btn')
    // axios.post(process.env.REACT_APP_SPRING + 'member/login', {'email': id, 'password': pw})
    // .then((res)=> {
    //   console.log(res)
    // })
    // .catch((err)=>{
    //   console.log(err)
    // })
    API.post<any>(
      "member/login", 
      {'email': id, 'password': pw}, 
      // {headers: {
      //   Authorization: sessionStorage.getItem('token')
      // }}
    ).then((res) => {
      console.log(res)
      navigate('/home')
    }).catch((err) => {
      console.log(err)
    })
  };

  const { Kakao } = window;

  const onKakao = () => {
    console.log('onKakao')
    console.log(Kakao)
    Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_HERE + 'oauth',
      scope: "account_email"
    })
  };

  const toSignup = () => {
    navigate('/join')
  };

  return (
    <div className='bg'>
      <div className="login-box">
        <form action="submit" className="login-form" onSubmit={submitHandler}>
          <label htmlFor="">ID</label>
          <br />
          <input 
            type="email" 
            onChange={idChangeHandler}
          />
          <br />
          <label htmlFor="">PW</label>
          <br />
          <input 
            type="password" 
            onChange={pwChangeHandler}
          />
          <br />
          <button type="submit">Connect</button>
        </form>
        <br />
        <img src={kakao} alt="kakao" className="mouse-hover" onClick={onKakao}/>
        <p onClick={toSignup} className="mouse-hover">회원가입</p>
      </div>
    </div>
  )
}
export default Login