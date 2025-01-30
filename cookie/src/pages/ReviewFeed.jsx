import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/auth/axiosInstance";
import { Helmet } from "react-helmet-async";
// import { symbol } from "prop-types";

const ReviewFeedWrapper = styled.div`
  width: 100%;
  background-color: #000000;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 40px;
  min-height: 100vh;

  @media (max-width: 480px) {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
  }
`;

const SearchInfoText = styled.p`
  color: #f84b99;
  font-size: 2rem;
  font-weight: bold;
  text-align: left;
  width: 100%;
  max-width: 600px;
  margin-bottom: 10px;
  line-height: 1.5;
  padding-left: 0rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding-left: 0px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding-left: 0px;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  padding-left: 0rem;

  button {
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    border: none;
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
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0rem;
`;

const ReviewTicket = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #fdf8fa;
  justify-content: space-between;
  border-radius: 8px;
  margin: 0.4rem 0;
  padding: 1.5rem;
  height: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const ReviewLeft = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 100%; /* 부모 컨테이너에 맞춤 */
    max-width: 120px; /* 데스크톱 최대 크기 */
    height: auto; /* 비율 유지 */
    object-fit: contain; /* 원본 비율 유지 */
    border-radius: 5px;

    @media (max-width: 768px) {
      max-width: 90px; /* 태블릿에서는 이미지 크기 축소 */
    }

    @media (max-width: 480px) {
      max-width: 70px; /* 모바일에서는 이미지 크기 축소 */
    }
  }
`;

const ReviewCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 1rem; /* 왼쪽 여백 줄이기 */
  width: 14rem;
  height: 100%;
  position: relative;

  @media (max-width: 768px) {
    width: 12rem; /* 태블릿에서는 너비를 더 줄임 */
  }

  @media (max-width: 480px) {
    width: 11rem; /* 모바일에서는 너비를 더욱 줄임 */
  }

  .profile {
    display: flex;
    align-items: center;

    img:not(.badge-icon) {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      margin-right: 8px;

      @media (max-width: 480px) {
        width: 30px;
        height: 30px;
      }
    }

    .user-info {
      .name {
        font-size: 0.9rem;

        @media (max-width: 480px) {
          font-size: 0.7rem;
        }
      }
      .date {
        font-size: 0.8rem;
        color: #888;

        @media (max-width: 480px) {
          font-size: 0.6rem;
        }
      }
    }
  }

  .comment {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    line-height: 1.5;

    &.blurred {
      filter: blur(5px);
      pointer-events: none;
      user-select: none;
    }

    @media (max-width: 480px) {
      font-size: 0.6rem;
      margin-top: 0.3rem;
    }
  }

  .movie-title {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    color: #f84b99;

    @media (max-width: 480px) {
      font-size: 0.5rem;
    }
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative; /* BadgeIcon의 기준이 되는 부모 컨테이너 */
  display: inline-block;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 8px;

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const BadgeIcon = styled.img`
  position: absolute;
  bottom: -5px; /* 프로필 이미지 우측 하단에 배치 */
  right: 0px;
  width: 30px !important; /* 뱃지 크기 명확히 조정 */
  height: 30px !important;
  z-index: 2;

  @media (max-width: 480px) {
    width: 25px !important;
    height: 25px !important;
  }
`;

const ReviewRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 5px;

  .score img {
    width: 20px;
    height: 20px;
    margin-top: 3px;
    margin-right: 0.1rem;

    @media (max-width: 480px) {
      width: 14px;
      height: 14px;
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
      padding-top: 120px;

      @media (max-width: 480px) {
        padding-top: 60px;
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

const ReviewFeed = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [showSpoilerOnly, setShowSpoilerOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // 추가 로딩 가능 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [initialLoad, setInitialLoad] = useState(true); // 초기 로딩 여부

  const badgeImages = {
    영화새싹: "/assets/images/mypage/lv1.svg",
    나쵸쟁이: "/assets/images/mypage/lv2.svg",
    영화매니아: "/assets/images/mypage/lv3.svg",
  };

  // 초기 데이터 로드 및 페이지네이션
  const fetchReviews = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true); // 로딩 시작
      const endpoint = showSpoilerOnly
        ? "/api/reviews/spoiler"
        : "/api/reviews";

      console.log(`Fetching page ${page}…`);

      const response = await axiosInstance.get(endpoint, {
        params: { page, size: 10 },
      });

      const newReviews = response.data.response.reviews;

      setReviews((prevReviews) =>
        page === 0 ? newReviews : [...prevReviews, ...newReviews]
      ); // 초기 페이지일 경우 덮어쓰기, 아닐 경우 추가

      // 더 이상 데이터가 없는지 확인
      if (
        newReviews.length < 10 ||
        page + 1 === response.data.response.totalReviewPages
      ) {
        setHasMore(false); // 더 이상 로딩하지 않음
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  }, [page, showSpoilerOnly, isLoading, hasMore]);

  // 초기 로드
  useEffect(() => {
    if (initialLoad) {
      fetchReviews();
      setInitialLoad(false); // 초기 로딩 완료
    }
  }, [initialLoad, fetchReviews]);

  // 페이지 변경 시 추가 로드
  useEffect(() => {
    if (!initialLoad) {
      fetchReviews();
    }
  }, [page]);

  const toKST = (utcDate) => {
    const date = new Date(utcDate);
    date.setHours(date.getHours() + 9);
    return date;
  };

  // 리뷰 클릭 시 상세 페이지로 이동
  const handleReviewClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`, {
      state: { fromReviewFeed: true },
    });
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !isLoading) {
        console.log("Triggering next page load…");
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [hasMore, isLoading]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const filterReviews = (showSpoilers) => {
    setShowSpoilerOnly(showSpoilers);
    setPage(0);
    setReviews([]);
    setHasMore(true);
    setInitialLoad(true);
  };

  return (
    <ReviewFeedWrapper>
      <Helmet>
        <title>리뷰페이지 | Cookie-V2.00</title>
        <meta name="description" content="쿠키 서비스의 리뷰페이지입니다." />
      </Helmet>
      <SearchInfoText>
        영화 리뷰
        <br />
        한눈에 보기
      </SearchInfoText>
      <FilterButtons>
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
      </FilterButtons>

      <ReviewContainer>
        {reviews.map((review, index) => (
          <ReviewTicket
            key={`${review.reviewId}-${index}`} // 고유 키 생성
            onClick={() => handleReviewClick(review.reviewId)}
          >
            <ReviewLeft>
              <img src={review.movie.poster} alt={review.movie.title} />
            </ReviewLeft>
            <ReviewCenter>
              <div className="profile">
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
                <div className="user-info">
                  <div className="name">{review.user.nickname}</div>
                  <div className="date">
                    {toKST(review.createdAt)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\./g, "-")
                      .replace(/-$/, "")
                      .replace(/-\s/g, "-")}{" "}
                    {toKST(review.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <p className="movie-title">{review.movie.title}</p>
              <div
                className={`comment ${
                  !showSpoilerOnly && review.spoiler ? "blurred" : ""
                }`}
              >
                {review.content.length > 90
                  ? `${review.content.slice(0, 90)}…`
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

export default ReviewFeed;
