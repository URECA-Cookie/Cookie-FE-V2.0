import styled from "styled-components";
// import { FaPencilAlt } from "react-icons/fa";
import Pencil from "../assets/images/main/edit-pencil.svg";
import MatchUpSection from "../components/main/MatchUpSection";
import AdminRecommend from "../components/main/AdminRecommend";
import CookieMovies from "../components/main/CookieMovies";
import SpecialMovie from "../components/main/SpecialMovie";
import GenreMovie from "../components/main/GenreMovie";
import TopButton from "../components/searchpage/TopButton";
import { useEffect, useState } from "react";
import LoginModal from "../components/common/LoginModal";
import useAuthStore from "../stores/useAuthStore";
import Question from "../components/main/Question";
import Footer from "../components/main/Footer";
import Popup from "../components/common/Popup";
import { Helmet } from "react-helmet-async";

const Main = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const { isLogined } = useAuthStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setShowTopButton(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>홈 | Cookie-V2.00</title>
        <meta name="description" content="쿠키 서비스의 홈입니다." />
      </Helmet>
      <MainContainer>
        <Popup />
        <Content>
          <MatchUpSection />
          <AdminRecommend />
          <CookieMovies />
          <SpecialMovie categorydata={categoryData} />
          <GenreMovie categorydata={categoryData} />
          <Question />
          <Footer />
        </Content>
        <LoginModal />
        <WriteReviewButton onClick={() => isLogined("/searchmov")}>
          <img src={Pencil} className="icon" alt="리뷰 작성 아이콘" />
        </WriteReviewButton>
        <TopButton visible={showTopButton} onClick={scrollToTop} />
      </MainContainer>
      <NavbarWrapper></NavbarWrapper>
    </>
  );
};

export default Main;

const CommonContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const MainContainer = styled(CommonContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: black;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 2rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
  @media (max-width: 430px) {
    gap: 0.5rem;
  }
  @media (max-width: 393px) {
    gap: 0.3em;
  }
`;

const NavbarWrapper = styled(CommonContainer)`
  position: fixed;
  bottom: 0;
  z-index: 100;
  background-color: white;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    padding: 0 10px;
  }
`;

const WriteReviewButton = styled.button`
  position: fixed;
  bottom: 5.7rem;
  right: calc(50% - 280px);
  background-color: #f84b99;
  color: #fdf8fa;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.8rem;
  width: 2.625rem;
  height: 2.625rem;
  border-radius: 50%;
  border: none;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #ff73b2;
  }

  .icon {
    font-size: 1.8rem;
  }
  @media (max-width: 768px) {
    right: calc(50% - 190px);
    width: 2.625rem;
    height: 2.625rem;
    font-size: 0.9rem;
    padding: 0.7rem;
  }

  @media (max-width: 600px) {
    right: calc(50% - 280px);
    width: 3.2rem;
    height: 3.2rem;
    font-size: 0.9rem;
    padding: 0.7rem;
  }

  @media (max-width: 390px) {
    right: calc(50% - 175px);
    bottom: 5rem;
    width: 3.2rem;
    height: 3.2rem;
    font-size: 0.8rem;
    padding: 0.6rem;
  }
  @media (max-width: 393px) {
    right: calc(50% - 179px);
    bottom: 5rem;
    width: 3.2rem;
    height: 3.2rem;
    font-size: 0.8rem;
    padding: 0.6rem;
  }
`;

const categoryData = [
  { id: 1, mainCategory: "장르", subCategory: "로맨스" },
  { id: 2, mainCategory: "장르", subCategory: "공포" },
  { id: 3, mainCategory: "장르", subCategory: "코미디" },
  { id: 4, mainCategory: "장르", subCategory: "액션" },
  { id: 5, mainCategory: "장르", subCategory: "판타지" },
  { id: 6, mainCategory: "장르", subCategory: "애니메이션" },
  { id: 7, mainCategory: "장르", subCategory: "범죄" },
  { id: 8, mainCategory: "장르", subCategory: "SF" },
  { id: 9, mainCategory: "장르", subCategory: "음악" },
  { id: 10, mainCategory: "장르", subCategory: "스릴러" },
  { id: 11, mainCategory: "장르", subCategory: "전쟁" },
  { id: 12, mainCategory: "장르", subCategory: "다큐멘터리" },
  { id: 13, mainCategory: "장르", subCategory: "드라마" },
  { id: 14, mainCategory: "장르", subCategory: "가족" },
  { id: 15, mainCategory: "장르", subCategory: "역사" },
  { id: 16, mainCategory: "장르", subCategory: "미스터리" },
  { id: 17, mainCategory: "장르", subCategory: "TV 영화" },
  { id: 18, mainCategory: "장르", subCategory: "서부극" },
  { id: 19, mainCategory: "장르", subCategory: "모험" },
  { id: 20, mainCategory: "장르", subCategory: "N/A" },
  { id: 21, mainCategory: "시즌", subCategory: "설레는 봄" },
  { id: 22, mainCategory: "시즌", subCategory: "청량한 여름" },
  { id: 23, mainCategory: "시즌", subCategory: "포근한 가을" },
  { id: 24, mainCategory: "시즌", subCategory: "눈 오는 겨울" },
  { id: 25, mainCategory: "시즌", subCategory: "어린이날" },
  { id: 27, mainCategory: "시즌", subCategory: "새해" },
  { id: 26, mainCategory: "시즌", subCategory: "크리스마스" },
  { id: 28, mainCategory: "시즌", subCategory: "명절" },
  { id: 29, mainCategory: "테마", subCategory: "실화를 소재로 한" },
  { id: 30, mainCategory: "테마", subCategory: "가족과 함께" },
  { id: 31, mainCategory: "테마", subCategory: "연인과 함께" },
  { id: 32, mainCategory: "테마", subCategory: "열린결말" },
  { id: 33, mainCategory: "테마", subCategory: "비 오는 날" },
  { id: 34, mainCategory: "테마", subCategory: "킬링타임" },
  { id: 35, mainCategory: "테마", subCategory: "디즈니" },
];
