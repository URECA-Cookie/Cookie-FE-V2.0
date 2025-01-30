import GlobalStyle from "../styles/global";

import styled from "styled-components";
import { OAuth_LOGIN_PROVIDER } from "../config/OAuthConfig";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { Helmet } from "react-helmet-async";

export const LoginContainer = styled.div`
  /* background-color: #fdf8fa; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  .regular {
    margin-bottom: 0.2rem;
  }

  .bold {
    color: #f84b99;
    font-weight: 900;
  }

  .login__img {
    margin: 0.5rem 0;
    width: 400px;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.25rem;
    }
    .login__img {
      margin: 1.5rem 0;
      width: 10rem;
      height: auto;
    }
    .logo {
      width: 10rem;
      height: auto;
      padding: 0;
    }
  }
`;

export const LoginBtn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
  cursor: pointer;

  button {
    background: none;
    border: none;
  }

  img {
    width: 3rem;
    height: auto;
    margin: 0.5rem 0;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    button img {
      margin-top: 1rem;
      width: 2.5rem;
      height: auto;
      margin: 1;
    }
  }
`;

const GuestLink = styled.div`
  font-size: 0.7rem;
  color: #f84b99;
  cursor: pointer;
  padding: 0.5rem 0.6rem;
  text-decoration: underline;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    top: 2rem;
  }
`;

const DividerText = styled.p`
  display: flex;
  align-items: center;
  width: 90%;
  color: #000;
  margin: 1rem 0;
  font-size: 0.9rem;
  font-weight: 500;

  &::before,
  &::after {
    content: "";
    flex: 2;
    border-bottom: 1px solid #d9d9d9;
    margin: 0 2rem;
  }
`;

function Login() {
  const navigate = useNavigate();
  const guestLogin = useAuthStore((state) => state.guestLogin);

  const handleLoginClick = (url) => {
    window.location.href = url;
  };

  const handleGuestAccess = () => {
    guestLogin();
    navigate("/");
  };

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>로그인 | Cookie-V2.00</title>
        <meta name="description" content="쿠키 서비스의 로그인페이지입니다." />
      </Helmet>
      <LoginContainer>
        <p className="regular">영화 리뷰 커뮤니티 1등 앱</p>
        <h2 className="bold">쿠키에서 여운 즐기기</h2>
        <img
          className="login__img"
          src="/assets/images/cookie-logo.png"
          alt="logoImg"
        />
        <DividerText>SNS 계정으로 로그인</DividerText>
        <LoginBtn>
          {Object.entries(OAuth_LOGIN_PROVIDER).map(([key, { img, url }]) => (
            <button key={key} onClick={() => handleLoginClick(url)}>
              <img src={img} alt={`${key}Login`} />
            </button>
          ))}
        </LoginBtn>
        <GuestLink onClick={handleGuestAccess}>게스트 로그인</GuestLink>
      </LoginContainer>
    </>
  );
}

export default Login;
