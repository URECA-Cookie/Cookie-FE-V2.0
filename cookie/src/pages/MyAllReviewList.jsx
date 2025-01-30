import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/auth/axiosInstance";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const ReviewSection = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 2rem;
  background-color: black;
  min-height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  .title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f84b99;
    margin-left: 0.8rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }

    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }
`;

const PrevIcon = styled.svg`
  width: 32px;
  height: 32px;
  background: url("/assets/images/prev-button.svg") no-repeat center/cover;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewTicket = styled.div`
  display: flex;
  padding: 1rem;
  background-color: #fdf8fa;
  border-radius: 0.5rem;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
  }
`;

const ReviewLeft = styled.div`
  img {
    width: 8rem;
    height: 11rem;
    object-fit: cover;
    border-radius: 0.4rem;

    @media (max-width: 768px) {
      width: 7rem;
      height: 10rem;
    }

    @media (max-width: 480px) {
      width: 6rem;
      height: 9rem;
    }
  }
`;

const ReviewInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-left: 1.5rem;

  @media (max-width: 768px) {
    margin-left: 1rem;
  }

  @media (max-width: 480px) {
    margin-left: 0.8rem;
  }
`;

const ReviewInfoFirst = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 수평으로 맞추기 */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ReviewCenter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .profile {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      margin-right: 10px;
      border: 1.5px solid #b3afb1;

      @media (max-width: 768px) {
        width: 40px;
        height: 40px;
      }

      @media (max-width: 480px) {
        width: 36px;
        height: 36px;
      }
    }

    .user-info {
      .name {
        font-size: 1rem;
        font-weight: bold;

        @media (max-width: 768px) {
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          font-size: 0.8rem;
        }
      }

      .date {
        font-size: 0.9rem;
        color: #888;

        @media (max-width: 768px) {
          font-size: 0.8rem;
        }

        @media (max-width: 480px) {
          font-size: 0.7rem;
        }
      }
    }
  }

  .comment {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }

  .movie-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #f84b99;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
`;

const ReviewRight = styled.div`
  display: flex;
  align-self: flex-start;
  margin-left: 1rem;

  .score {
    display: flex;
    gap: 0.2rem;

    img {
      width: 16px;
      height: 16px;

      @media (max-width: 768px) {
        width: 14px;
        height: 14px;
      }
    }
  }

  @media (max-width: 768px) {
    margin-left: 0.05rem;
  }

  @media (max-width: 480px) {
    margin-left: 0.05rem;
  }
`;

const ReviewInfoSecond = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const LikeIcon = styled.svg`
  width: 14px;
  height: 14px;
  background: url("/assets/images/review/heart-review-feed.svg") no-repeat
    center/cover;

  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

const ReviewLike = styled.p`
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const CommentIcon = styled.svg`
  width: 14px;
  height: 14px;
  background: url("/assets/images/review/comment-review-feed.svg") no-repeat
    center/cover;

  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

const ReviewComment = styled.p`
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f84b99;
  margin: 20px 0;
`;

const MyAllReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get("/api/users/myReviews", {
        params: {
          page,
          size: 5,
        },
      });

      const { reviews: newReviews, totalPages: fetchedTotalPages } =
        response.data.response;

      setReviews((prevReviews) => [...prevReviews, ...newReviews]);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      console.error("리뷰 데이터 로딩 실패:", error);
      toast.error("리뷰 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && page < totalPages - 1 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observerInstance = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });

    if (observer.current) observerInstance.observe(observer.current);

    return () => {
      if (observer.current) observerInstance.unobserve(observer.current);
    };
  }, [reviews]);

  useEffect(() => {
    if (page > 0) {
      fetchReviews();
    }
  }, [page]);

  const handleReviewClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`, {
      state: { fromMyAllReviewList: true },
    });
  };

  const handleBack = () => {
    navigate(-1); // 뒤로 가기
  };

  return (
    <ReviewSection>
      <Helmet>
        <title>내가 작성한 리뷰 | Cookie-V2.00</title>
        <meta
          name="description"
          content="쿠키 서비스의 내가 작성한 리뷰 페이지입니다."
        />
      </Helmet>
      <HeaderContainer>
        <PrevIcon onClick={handleBack} />
        <span className="title">내가 작성한 리뷰</span>
      </HeaderContainer>

      <ReviewContainer>
        {reviews.map((review, index) => (
          <ReviewTicket
            key={`${review.reviewId}-${index}`}
            onClick={() => handleReviewClick(review.reviewId)}
          >
            <ReviewLeft>
              <img src={review.movie.poster} alt={review.movie.title} />
            </ReviewLeft>
            <ReviewInfoSection>
              <ReviewInfoFirst>
                <ReviewCenter>
                  <div className="profile">
                    <img
                      src={review.user.profileImage}
                      alt={review.user.nickname}
                    />
                    <div className="user-info">
                      <div className="name">{review.user.nickname}</div>
                      <div className="date">
                        {new Date(review.createdAt)
                          .toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\./g, "-")
                          .replace(/-$/, "")
                          .replace(/-\s/g, "-")}{" "}
                        {new Date(review.createdAt).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="movie-title">{review.movie.title}</p>
                  <div className="comment">
                    {review.content.length > 100
                      ? `${review.content.slice(0, 105)}...`
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
                </ReviewRight>
              </ReviewInfoFirst>

              <ReviewInfoSecond>
                <LikeIcon />
                <ReviewLike>{review.reviewLike}</ReviewLike>
                <CommentIcon />
                <ReviewComment>{review.comments}</ReviewComment>
              </ReviewInfoSecond>
            </ReviewInfoSection>
          </ReviewTicket>
        ))}
        <div ref={observer} />
      </ReviewContainer>

      {loading && <LoadingIndicator>로딩 중...</LoadingIndicator>}
    </ReviewSection>
  );
};

export default MyAllReviewList;
