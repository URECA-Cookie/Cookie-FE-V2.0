import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import serverBaseUrl from "../../config/apiConfig";
// import likeHeart from "../../assets/images/main/like-heart2.svg";
// import reivew from "../../assets/images/main/reviews.svg";
import likeHeart from "/assets/images/main/like-heart2.svg";
import reivew from "/assets/images/main/reviews.svg";

function GenreMovie({ categorydata }) {
  const [selectedMainCategory] = useState("장르");
  const [selectedGenre, setSelectedGenre] = useState("로맨스");
  const [genreMovies, setGenreMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [startX, setStartX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  const navigate = useNavigate();

  const fetchMoviesByGenre = async (genre) => {
    const cacheKey = `movies_${genre}_${currentPage}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setGenreMovies(parsedData.movies);
      setTotalPages(parsedData.totalPages || 1);
    } else {
      try {
        const response = await axios.get(
          `${serverBaseUrl}/api/movies/categoryMovies`,
          {
            params: {
              mainCategory: "장르",
              subCategory: genre,
              page: currentPage - 1,
              size: 12,
            },
          }
        );
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            movies: response.data.movies,
            totalPages: response.data.totalPages,
          })
        );

        setGenreMovies(response.data.movies);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("장르별 영화 불러오는 데 실패했습니다:", error);
      }
    }
  };

  useEffect(() => {
    const genreList = categorydata
      .filter((category) => category.mainCategory === "장르")
      .map((category) => category.subCategory);
    setGenres(genreList);
  }, [categorydata]);

  useEffect(() => {
    fetchMoviesByGenre(selectedGenre);
  }, [selectedGenre, currentPage]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setCurrentIndex(0);
  };

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleMoreView = (mainCategory, subCategory) => {
    navigate("/category/movies", { state: { mainCategory, subCategory } });
  };

  const handleNext = () => {
    const maxIndex = Math.floor(genreMovies.length / 4) - 1;
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    const totalPages = Math.ceil(genreMovies.length / 4);
    setTotalPages(totalPages);
  }, [genreMovies]);

  const handleTouchStart = (e) => {
    const touchStart = e.touches[0].clientX;
    setStartX(touchStart);
    setIsTouching(true);
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;
    const touchMove = e.touches[0].clientX;
    const delta = touchMove - startX;
    const percentage = (delta / window.innerWidth) * 100;
    e.currentTarget.style.transform = `translateX(-${currentIndex * 100 - percentage}%)`;
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    setIsTouching(false);
    const deltaX = startX - e.changedTouches[0].clientX;
    const moveThreshold = 50;

    const slider = e.currentTarget;

    if (deltaX > moveThreshold && currentIndex < totalPages - 1) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalPages - 1));
    } else if (deltaX < -moveThreshold && currentIndex > 0) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    e.stopPropagation();
  };

  return (
    <>
      <GenreMovieList>
        <Title>장르별 영화 찾기</Title>
        <div className="genreBtn__contianer">
          {genres
            .filter((genre) => genre !== "N/A")
            .map((genre, index) => (
              <GenreBtn
                key={index}
                $isSelected={selectedGenre === genre}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </GenreBtn>
            ))}
        </div>

        <MoreViewText
          onClick={() => handleMoreView(selectedMainCategory, selectedGenre)}
        >
          {selectedGenre} 더보기 {">"}
        </MoreViewText>
        <div
          className="genre__movie--wrapper"
          style={{ touchAction: "none", position: "relative" }}
        >
          {genreMovies.length === 0 ? (
            <p style={{ color: "#ffffff", paddingLeft: "7px" }}>
              해당 영화가 없어요
            </p>
          ) : (
            <>
              <button
                className="prev"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                &lt;
              </button>
              <div
                className="genre__movie"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {genreMovies.map((movie, index) => (
                  <div
                    key={index}
                    className="genre__movie--list"
                    onClick={() => handleMovieClick(movie.id)}
                    style={{
                      pointerEvents: isTouching ? "none" : "auto",
                    }}
                  >
                    <Poster src={movie.poster} alt={movie.title} />
                    <MovieInfo>
                      <Like>
                        <LikeIcon alt="Like Icon" />
                        <Count>{movie.likes}</Count>
                      </Like>
                      <Review>
                        <ReviewIcon alt="Review Icon" />
                        <Count>{movie.reviews}</Count>
                      </Review>
                    </MovieInfo>
                  </div>
                ))}
              </div>
              <button
                className="next"
                onClick={handleNext}
                disabled={currentIndex === totalPages - 1}
              >
                &gt;
              </button>
            </>
          )}
        </div>
      </GenreMovieList>
    </>
  );
}

export default GenreMovie;

const GenreMovieList = styled.div`
  position: relative;
  overflow: hidden;

  /* .genreBtn__contianer {
    margin-bottom: 0.8rem;
  } */

  .genr__movie--wrapper {
    display: flex;
    align-items: center;
    position: relative;
  }

  .genre__movie {
    display: flex;
    transition: transform 1s ease;
    align-items: start;
    pointer-events: auto;
  }
  /* .genre__movie--list {
    pointer-events: none;
  } */
  .prev,
  .next {
    position: absolute;
    top: 50%;
    width: 50px;
    height: 50px;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 50%;
    z-index: 10;
  }

  .prev {
    left: -15px;
  }

  .next {
    right: -15px;
  }

  .prev:disabled,
  .next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  color: #f84b99;
  padding: 2rem 0 0.7rem 0.375rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Poster = styled.img`
  transition: transform 0.3s ease;
  border-radius: 0.65rem;
  width: 8.75rem;
  height: 12.0625rem;
  padding: 0.4rem 0.375rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.3rem;
    width: 6.8rem;
    height: 10rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.3rem;
    width: 6.2rem;
    height: 9.3rem;
  }
  @media (max-width: 393px) {
    padding: 0.4rem 0.3rem;
    width: 5.6rem;
    height: 8.7rem;
  }

  @media (max-width: 390px) {
    padding: 0.4rem 0.3rem;
    width: 5.6rem;
    height: 8.7rem;
  }
`;

const GenreBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 0.4rem 0.3rem 0;
  padding: 0 1rem 1rem 1rem;
  font-size: 1rem;
  color: ${(props) => (props.$isSelected ? "#FF92BC" : "#afafaf")};
  font-weight: ${(props) => (props.$isSelected ? "bold" : "normal")};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ffff;
  }

  @media (max-width: 768px) {
    margin: 0 0.7rem 0.5rem 0;
    font-size: 1rem;
  }
  @media (max-width: 393px) {
    margin: 0 0.3rem 0.5rem 0;
    font-size: 1rem;
  }
`;

const MoreViewText = styled.p`
  color: #ffffff;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  font-size: 0.8rem;
  margin-bottom: 5px;
`;

const Review = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.375rem;
`;

const ReviewIcon = styled.svg`
  width: 15px;
  height: 15px;
  margin-right: 2px;
  background: no-repeat center/cover url(${reivew});
`;

const Count = styled.p`
  font-size: 0.8rem;
  color: #ffffff;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.375rem;
`;

const LikeIcon = styled.svg`
  width: 15px;
  height: 15px;
  margin-right: 2px;
  background: no-repeat center/cover url(${likeHeart});
`;

const MovieInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;
