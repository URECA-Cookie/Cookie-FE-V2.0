import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderSection from "../components/movieDetailPage/HeaderSection";
import DetailsSection from "../components/movieDetailPage/DetailsSection";
import CastSection from "../components/movieDetailPage/CastSection";
import VideoSection from "../components/movieDetailPage/VideoSection";
import GallerySection from "../components/movieDetailPage/GallerySection";
import ReviewSection from "../components/movieDetailPage/ReviewSection";
import { useEffect, useState } from "react";
import axiosInstance from "../api/auth/axiosInstance";
import Spinner from "../components/common/Spinner";
import MovieDetailHeader from "../components/searchpage/MovieDetailHeader";
import { Helmet } from "react-helmet-async";

const ContentWrapper = styled.div`
  width: 100%;
  min-width: 320px;
  margin: 0 auto;
  padding-left: 40px;
  padding-right: 40px;
  background-color: black;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (max-width: 480px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/movies/${id}`);
        console.log("영화 데이터 로드 성공:", response.data.response);
        setMovieData(response.data.response);
      } catch (error) {
        console.error("영화 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const runtimeString = movieData.runtime
    ? `${movieData.runtime}분`
    : "정보 없음";

  const handleViewAllReviews = () => {
    navigate(`/reviews/movie/${id}`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ContentWrapper>
      <Helmet>
        <title>{movieData.title} | Cookie-V2.00</title>
        <meta
          name="description"
          content="쿠키 서비스의 영화 상세보기 페이지입니다."
        />
      </Helmet>
      <MovieDetailHeader onBack={() => navigate(-1)} title={movieData.title} />
      {movieData.images && movieData.images.length > 0 && (
        <HeaderSection
          title={movieData.title}
          releasedAt={movieData.releasedAt}
          country={movieData.country}
          runtime={runtimeString}
          certification={movieData.certification}
          mainImage={movieData.images[0]}
        />
      )}
      <DetailsSection
        posterUrl={movieData.poster}
        categories={movieData.categories}
        description={movieData.plot}
        likes={movieData.likes}
        score={movieData.score}
        movie={movieData}
        liked={movieData.liked}
      />
      <CastSection director={movieData.director} actors={movieData.actors} />
      {movieData.video !== "N/A" && <VideoSection videoUrl={movieData.video} />}
      {movieData.images && movieData.images.length > 0 && (
        <GallerySection
          images={movieData.images}
          onImageClick={handleImageClick}
        />
      )}
      {movieData.reviews && (
        <ReviewSection
          reviews={movieData.reviews}
          totalReviews={movieData.totalReviews}
          onViewAllReviews={handleViewAllReviews}
          movie={movieData}
        />
      )}
    </ContentWrapper>
  );
};

export default MovieDetail;
