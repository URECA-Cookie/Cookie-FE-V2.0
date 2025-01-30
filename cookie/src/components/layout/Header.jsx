import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "../common/Notification";
import useUserStore from "../../stores/useUserStore";
import CookieLogo from "/assets/images/cookie-logo.png";

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 125px;
    height: 100px;
    object-fit: cover;
  }
`;

const HeaderContainer = styled.header`
  width: 100vw;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isDarkGray }) => (isDarkGray ? "#1e1e1e" : "black")};
  color: ${({ isWhite }) => (isWhite ? "#000" : "#fff")};
  padding: 15px 20px;
  height: 70px;
  position: fixed;
  top: 0;
  z-index: 100;

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;

    button {
      cursor: pointer;
      border-radius: 0.7rem;
      padding: 0.4rem 1rem;
      border: none;
      background-color: ${({ isWhite }) => (isWhite ? "#f5f5f5" : "#333")};
      color: ${({ isWhite }) => (isWhite ? "#000" : "#fff")};
    }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useUserStore((state) => state.getUserInfo());

  const isDarkGrayHeader =
    ["/mypage", "/point-history", "/notifications", "/manageprofile"].includes(
      location.pathname
    ) || location.pathname.match(/^\/reviews\/\d+$/);

  const handleLogoClick = () => navigate("/");
  const handleNotificationClick = () => navigate("/notifications");
  const handleLoginClick = () => navigate("/login");

  return (
    <HeaderContainer isDarkGray={isDarkGrayHeader}>
      <Logo onClick={handleLogoClick}>
        <img
          src="/assets/images/cookie-logo.webp"
          alt="로고 이미지"
          width="100"
          height="80"
          loading="eager"
          fetchPriority="high"
        />
      </Logo>
      <div className="header-right">
        {userInfo.nickname ? (
          <div onClick={handleNotificationClick}>
            <Notification />
          </div>
        ) : (
          <button onClick={handleLoginClick}>로그인</button>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Header;
