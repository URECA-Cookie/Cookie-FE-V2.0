import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/auth/axiosInstance";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MovieCard = styled.div`
  background: #fdf8fa;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 1rem;
  text-align: center;

  h2 {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  p {
    font-size: 0.85rem;
    color: #666;
    margin: 0.2rem 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const EmptyMessage = styled.div`
  font-size: 1.2rem;
  color: #999;
  text-align: center;
  margin: 2rem 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;

  .title {
    font-size: 1.4rem;
    font-weight: bold;
    color: #f84b99;
    margin-left: 0.5rem;
  }
`;

const PrevIcon = styled.div`
  width: 32px;
  height: 32px;
  background: no-repeat center/cover url("/assets/images/prev-button.svg");
  cursor: pointer;
  margin-left: 1rem;
`;

const CommentSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CommentIcon = styled.div`
  width: 16px;
  height: 16px;
  background: no-repeat center/cover
    url("/assets/images/review/comment-review-feed.svg");
`;

const LikeIcon = styled.div`
  width: 16px;
  height: 16px;
  background: no-repeat center/cover
    url("/assets/images/review/heart-review-feed.svg");
`;

const LikedMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLikedMovies = async (page = 0, size = 5) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/users/likedMovieList?userId=1&page=${page}&size=${size}`
      );
      const fetchedMovies = response.data.response.movies || [];
      setMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
      setTotalPages(response.data.response.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error("좋아하는 영화 목록 불러오기 실패:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedMovies(currentPage);
  }, [currentPage]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const onBack = () => {
    navigate(-1);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (!loading && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, currentPage, totalPages]);

  return (
    <Container>
      <Helmet>
        <title>내가 좋아한 영화 | Cookie-V2.00</title>
        <meta
          name="description"
          content="쿠키 서비스의 내가좋아한 영화페이지입니다."
        />
      </Helmet>
      <HeaderContainer>
        <PrevIcon onClick={onBack}></PrevIcon>
        <span className="title">내가 좋아한 영화</span>
      </HeaderContainer>

      {movies.length > 0 ? (
        <>
          <MoviesGrid>
            {movies.map((movie, index) => (
              <MovieCard key={index} onClick={() => handleMovieClick(movie.id)}>
                <Poster src={movie.poster} alt={movie.title} />
                <MovieInfo>
                  <h2>{movie.title}</h2>
                  <p>{movie.releasedAt}</p>
                  <CommentSection>
                    <LikeIcon />
                    <p>{movie.likes || 0}</p>
                    <CommentIcon />
                    <p>{movie.reviews || 0}</p>
                  </CommentSection>
                </MovieInfo>
              </MovieCard>
            ))}
          </MoviesGrid>
          {loading && <EmptyMessage>로딩 중...</EmptyMessage>}
        </>
      ) : (
        <EmptyMessage>좋아하는 영화를 선택해보세요!</EmptyMessage>
      )}
    </Container>
  );
};

export default LikedMovies;
