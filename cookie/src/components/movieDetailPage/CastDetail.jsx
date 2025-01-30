import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import serverBaseUrl from "../../config/apiConfig";
import { Helmet } from "react-helmet-async";

const CastInfo = styled.div`
  padding: 1.25rem;
  background-color: black;
  color: white;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;

  .title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-left: 0.4rem;
    color: #f84b99;
  }
`;

const PrevIcon = styled.svg`
  width: 32px;
  height: 32px;
  background: no-repeat center/cover url("/assets/images/prev-button.svg");
  cursor: pointer;
`;
const CastProfile = styled.div`
  margin: 1rem;
  h2 {
    margin: 2rem 0 0.8rem 0;
  }
`;

const DirectorInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;

  img {
    border-radius: 0.2rem;
    width: 10rem;
    height: auto;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: 0 0 180px 50px rgba(248, 75, 153, 0.2);

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    img {
      border-radius: 0.2rem;
      width: 10rem;
      height: auto;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s ease;
      box-shadow: 0 0 180px 50px rgba(248, 75, 153, 0.2);

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  @media (max-width: 480px) {
    img {
      border-radius: 0.2rem;
      width: 8rem;
      height: auto;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s ease;
      box-shadow: 0 0 180px 50px rgba(248, 75, 153, 0.2);

      &:hover {
        transform: scale(1.1);
      }
    }
  }
`;

const CastFilmography = styled.div`
  margin: 1rem;
  h2 {
    margin: 2rem 0 0.8rem 0;
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
`;

const ScoreSection = styled.div`
  display: flex;
  gap: 0.2rem;
  align-items: center;
  background-color: #fdf8fa;
  border: 1px solid #f84b99;
  border-radius: 0.4rem;
  padding: 0.3rem 0.5rem;

  svg {
    width: 14px;
    height: 14px;
    background: no-repeat center/cover
      url("/assets/images/review/score-macarong.png");
  }

  p {
    font-weight: 500;
    color: #f84b99;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 0.2rem 0.4rem;
    svg {
      width: 10px;
      height: 10px;
      background: no-repeat center/cover
        url("/assets/images/review/score-macarong.png");
    }

    p {
      font-weight: 500;
      color: #f84b99;
      font-size: 0.4rem;
    }
  }
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin: 1rem 0;

  .date {
    font-size: 1rem;
    font-weight: bold;
    color: #f84b99;
    justify-content: flex-end;
    display: flex;
    width: 4rem;
  }

  .card {
    background-color: #222;
    border-radius: 0.7rem;
    padding: 1rem;
    display: flex;
    gap: 1rem;
    width: 100%;
    cursor: pointer;

    img {
      width: 6.5rem;
      height: auto;
      border-radius: 0.2rem;
      object-fit: cover;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;

      h4 {
        margin: 0;
        font-size: 1.3rem;
        cursor: pointer;

        &:hover {
          color: #f84b99;
        }
      }

      p {
        margin: 0;
        font-size: 0.9rem;
      }

      .first-details {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
  @media (max-width: 768px) {
    .date {
      font-size: 0.8rem;
      font-weight: bold;
      color: #f84b99;
      justify-content: flex-end;
      display: flex;
      width: 4rem;
    }
    .card {
      background-color: #222;
      border-radius: 0.7rem;
      padding: 0.7rem;
      display: flex;
      gap: 1rem;
      width: 100%;
      cursor: pointer;

      img {
        width: 5rem;
        height: auto;
        border-radius: 0.2rem;
        object-fit: cover;
      }

      .details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;

        h4 {
          margin: 0;
          font-size: 1rem;
          cursor: pointer;

          &:hover {
            color: #f84b99;
          }
        }

        p {
          margin: 0;
          font-size: 0.9rem;
        }

        .first-details {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
      }
    }
  }

  @media (max-width: 480px) {
  }
`;

const LikeAndReviewCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .likes,
  .reviews {
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
`;

const LikeIcon = styled.svg`
  background: url("/assets/images/review/heart-review.svg") no-repeat center;
  background-size: cover;
  width: 20px;
  height: 20px;
`;

const ReviewIcon = styled.svg`
  background: url("/assets/images/review/reviews-review.svg") no-repeat center;
  background-size: cover;
  width: 20px;
  height: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
`;

function CastDetail() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isActor = location.pathname.includes("actor");
  const isDirector = location.pathname.includes("director");

  useEffect(() => {
    const fetchData = async () => {
      let url = isActor
        ? `${serverBaseUrl}/api/actor/${id}`
        : `${serverBaseUrl}/api/director/${id}`;

      try {
        const response = await axios.get(url);
        console.log(response.data.response);
        setData(response.data.response);
      } catch (err) {
        console.error("API 요청 실패:", err);
      }
    };

    fetchData();
  }, [id, location.pathname]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!data) return null;

  const movieList = isActor ? data.actorMovieList : data.directorMovieList;

  const formatCount = (count) => {
    return count >= 999 ? "999+" : count;
  };

  return (
    <>
      <CastInfo>
        <Helmet>
          <title>
            {data.name
              ? `${data.name} | Cookie-V2.00`
              : "출연진 상세 | Cookie-V2.00"}
          </title>
          <meta
            name="description"
            content={`${data.name ? `${data.name}의 필모그래피와 정보` : "출연진 정보 페이지"}`}
          />
        </Helmet>
        <HeaderContainer>
          <PrevIcon onClick={() => handleNavigate(-1)}></PrevIcon>
          <span className="title">{data.name}</span>
        </HeaderContainer>

        <CastProfile>
          <h2>{isActor ? "배우" : "감독"}</h2>
          <DirectorInfoContainer>
            <img
              src={
                data.profileImage?.endsWith("/null")
                  ? "/images/default.png"
                  : data.profileImage || "/images/default.png"
              }
              alt="profile"
              onClick={() =>
                handleImageClick(
                  data.profileImage?.endsWith("/null")
                    ? "/images/default.png"
                    : data.profileImage || "/images/default.png"
                )
              }
            />
          </DirectorInfoContainer>
        </CastProfile>

        <CastFilmography>
          <h2>영화 필모그래피</h2>

          <TimelineContainer>
            {movieList?.map((movie) => (
              <TimelineItem key={movie.id}>
                <div className="date">
                  {(() => {
                    const date = new Date(movie.releasedAt);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    return `${year}.${month}`;
                  })()}
                </div>
                <div className="card">
                  <img
                    src={movie.poster}
                    alt={`${movie.title} 포스터`}
                    onClick={() => handleNavigate(`/movie/${movie.id}`)}
                  />
                  <div className="details">
                    <div className="first-details">
                      <h4 onClick={() => handleNavigate(`/movie/${movie.id}`)}>
                        {movie.title}
                      </h4>
                      <ScoreSection>
                        <svg />
                        <p>{(Math.round(movie.score * 10) / 10).toFixed(1)}</p>
                      </ScoreSection>
                    </div>

                    <LikeAndReviewCount>
                      <div className="likes">
                        <LikeIcon />
                        <span>{formatCount(movie.likes)}</span>
                      </div>
                      <div className="reviews">
                        <ReviewIcon />
                        <span>{formatCount(movie.reviews || 0)}</span>
                      </div>
                    </LikeAndReviewCount>
                  </div>
                </div>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </CastFilmography>
      </CastInfo>
      <Modal isOpen={isModalOpen} onClick={closeModal}>
        <img src={selectedImage} alt="Enlarged view" />
      </Modal>
    </>
  );
}

export default CastDetail;
