import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/auth/axiosInstance";
import MovieDetailHeader from "../components/searchpage/MovieDetailHeader";

const ReviewFeedWrapper = styled.div`
  width: 100%;
  background-color: #000000;
  padding-left: 40px;
  padding-right: 40px;
  min-height: 100vh;
  padding-bottom: 40px;

  @media (max-width: 480px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;

  img {
    width: 150px;
    height: auto;
    border-radius: 8px;
  }

  p {
    color: #f84b99;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.5;
    max-width: 600px;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .filter-toggle {
    display: flex;
    gap: 10px; /* 전체 리뷰와 스포일러 리뷰 사이 간격 추가 */
  }

  button {
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    gap: 10px;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &.active {
      background-color: #000000;
      color: #f84b99;
    }

    &.inactive {
      background-color: #000000;
      color: #ffffff;
    }
  }

  .sort-toggle {
    display: flex;
    gap: 10px;

    button {
      font-size: 1rem;
      border: none;
      background: none;
      color: #ffffff;
      cursor: pointer;
      font-weight: bold;

      &.selected {
        color: #f84b99;
      }
    }
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const ReviewTicket = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #fdf8fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  flex-direction: row;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
  }
`;

const ReviewLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;

    @media (max-width: 480px) {
      width: 40px;
      height: 40px;
    }
  }

  .name {
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative; /* BadgeIcon의 기준이 되는 부모 컨테이너 */
  display: inline-block;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 8px;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const BadgeIcon = styled.img`
  position: absolute;
  bottom: -5px; /* 프로필 이미지 우측 하단에 배치 */
  right: 0px;
  width: 40px !important; /* 뱃지 크기 명확히 조정 */
  height: 40px !important;
  z-index: 2;

  @media (max-width: 480px) {
    width: 26px !important;
    height: 26px !important;
  }
`;

const ReviewCenter = styled.div`
  flex: 1;
  padding: 0 1rem;

  .comment {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;

    &.blurred {
      filter: blur(5px) !important;
      pointer-events: none;
      user-select: none;
    }

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }
`;

const ReviewRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 5px;

  .score img {
    width: 16px;
    height: 16px;
    margin-right: 0.1rem;

    @media (max-width: 480px) {
      width: 12px;
      height: 12px;
    }
  }

  .interactions {
    display: flex;
    align-items: center;
    gap: 8px;

    .likes,
    .comments {
      display: flex;
      align-items: center;
      gap: 4px;
      padding-top: 40px;

      @media (max-width: 480px) {
        padding-top: 30px;
      }

      svg {
        width: 20px;
        height: 20px;

        @media (max-width: 480px) {
          width: 14px;
          height: 14px;
        }
      }

      span {
        font-size: 1rem;
        color: #888;

        @media (max-width: 480px) {
          font-size: 0.8rem;
        }
      }
    }
  }
`;

const LikeIcon = styled.svg`
  background: url("/assets/images/review/heart-review-feed.svg") no-repeat
    center;
  background-size: cover;
`;

const CommentIcon = styled.svg`
  background: url("/assets/images/review/comment-review-feed.svg") no-repeat
    center;
  background-size: cover;
`;

const MovieReviewFeed = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [poster, setPoster] = useState("");
  const [title, setTitle] = useState("");
  const [showSpoilerOnly, setShowSpoilerOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const badgeImages = {
    영화새싹: "/assets/images/mypage/lv1.svg",
    나쵸쟁이: "/assets/images/mypage/lv2.svg",
    영화매니아: "/assets/images/mypage/lv3.svg",
  };

  const buildEndpoint = () => {
    let endpoint = `/api/movies/${movieId}/reviews`;

    if (showSpoilerOnly) {
      endpoint += "/spoiler";
    }

    if (sortOrder === "popular") {
      endpoint += "/most-liked";
    }

    return endpoint;
  };

  const fetchReviews = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);

      const endpoint = buildEndpoint();

      const response = await axiosInstance.get(endpoint, {
        params: { page, size: 10 },
      });

      const { poster: moviePoster, title: movieTitle } = response.data.response;

      setPoster(moviePoster);
      setTitle(movieTitle);

      const newReviews = response.data.response.reviews;

      setReviews((prevReviews) =>
        page === 0 ? newReviews : [...prevReviews, ...newReviews]
      );

      if (
        newReviews.length < 10 ||
        page + 1 === response.data.response.totalReviewPages
      ) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [movieId, showSpoilerOnly, sortOrder, page, isLoading, hasMore]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  const filterReviews = (showSpoilers) => {
    setShowSpoilerOnly(showSpoilers);
    setPage(0);
    setReviews([]);
    setHasMore(true);
  };

  const changeSortOrder = (order) => {
    setSortOrder(order);
    setPage(0);
    setReviews([]);
    setHasMore(true);
  };

  return (
    <ReviewFeedWrapper>
      <MovieDetailHeader onBack={() => navigate(-1)} title={title} />
      <HeaderSection>
        <img src={poster || "/default-poster.png"} alt={title} />
        <p>
          {title} <br />
          리뷰 모아보기
        </p>
      </HeaderSection>

      <FilterButtons>
        <div className="filter-toggle">
          <button
            className={!showSpoilerOnly ? "active" : "inactive"}
            onClick={() => filterReviews(false)}
          >
            전체 리뷰
          </button>
          <button
            className={showSpoilerOnly ? "active" : "inactive"}
            onClick={() => filterReviews(true)}
          >
            스포일러 리뷰
          </button>
        </div>
        <div className="sort-toggle">
          <button
            className={sortOrder === "latest" ? "selected" : ""}
            onClick={() => changeSortOrder("latest")}
          >
            최신순
          </button>
          <button
            className={sortOrder === "popular" ? "selected" : ""}
            onClick={() => changeSortOrder("popular")}
          >
            인기순
          </button>
        </div>
      </FilterButtons>

      <ReviewContainer>
        {reviews.map((review) => (
          <ReviewTicket
            key={review.reviewId}
            onClick={() => handleReviewClick(review.reviewId)}
          >
            <ReviewLeft>
            <ProfileImageWrapper>
                  <ProfileImage
                    src={review.user.profileImage}
                    alt={review.user.nickname}
                  />
                  {review.user.mainBadgeImage && (
                    <BadgeIcon
                      className="badge-icon"
                      src={
                        badgeImages[review.user.mainBadgeImage] ||
                        review.user.mainBadgeImage
                      }
                      alt={review.user.mainBadgeImage}
                    />
                  )}
                </ProfileImageWrapper>
              <div className="name">{review.user?.nickname || "Anonymous"}</div>
            </ReviewLeft>
            <ReviewCenter>
              <div
                className={`comment ${
                  !showSpoilerOnly && review.spoiler ? "blurred" : ""
                }`}
              >
                {review.content.length > 100
                  ? `${review.content.slice(0, 100)}...`
                  : review.content}
              </div>
            </ReviewCenter>
            <ReviewRight>
              <div className="score">
                {Array.from({ length: Math.round(review.movieScore) }).map(
                  (_, i) => (
                    <img
                      key={`${review.reviewId}-score-${i}`}
                      src="/assets/images/review/score-macarong.png"
                      alt="score"
                    />
                  )
                )}
              </div>
              <div className="interactions">
                <div className="likes">
                  <LikeIcon />
                  <span>{review.reviewLike}</span>
                </div>
                <div className="comments">
                  <CommentIcon />
                  <span>{review.comments || 0}</span>
                </div>
              </div>
            </ReviewRight>
          </ReviewTicket>
        ))}
      </ReviewContainer>
    </ReviewFeedWrapper>
  );
};

export default MovieReviewFeed;
