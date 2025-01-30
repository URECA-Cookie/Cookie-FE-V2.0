import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/auth/axiosInstance";
import DetailHeader from "../components/searchpage/ReviewDetailHeader";
import ReviewContentSection from "../components/searchpage/ReviewContentSection";

import { FaPaperPlane } from "react-icons/fa";
import useAuthStore from "../stores/useAuthStore";

import Spinner from "../components/common/Spinner";
import useUserStore from "../stores/useUserStore";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
  background-color: var(--dark-gray);
`;

const CommentProfileWrapper = styled.div`
  position: relative; /* 뱃지 배치를 위한 기준 */
  display: inline-block;
  width: 40px !important;
  height: 40px !important;
  marin-right: 10px !important;
`;

const CommentBadgeIcon = styled.img`
  position: absolute;
  bottom: -5px; /* 프로필 이미지 우측 하단 배치 */
  right: -20px;
  width: 30px !important;
  height: 30px !important;
  z-index: 1;
`;

const CommentsSectionContainer = styled.div`
  padding: 0 2rem;

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--text-wh);
  }

  .comment-input {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid var(--sub-pink);
      border-radius: 0.4rem;
      font-size: 1rem;
      outline: none;
      margin-right: 10px;
      height: 40px;
      background-color: var(--sub-pink);
    }

    button {
      background-color: var(--main-pink);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--acc-pink);
      }

      svg {
        width: 20px;
        height: 20px;
        margin-left: -2px;
      }
    }
  }

  .comment {
    margin-bottom: 15px;

    .comment-left {
      display: flex;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .comment-content {
        background-color: #f8e9f5;
        /* background-color: #f8f8f8; */
        border-radius: 8px;
        padding: 0.8rem;
        font-size: 0.9rem;
        box-sizing: border-box;
        position: relative;
        flex: 1;
        margin-left: 15px;

        .comment-user-info {
          display: flex;
          align-items: center;
        }

        .nickname {
          margin-right: 0.5rem;
          font-size: 0.9rem;
        }

        .text {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
          margin-top: 0.4rem;
        }

        .date {
          font-size: 0.8rem;
          color: #666;
        }
      }
    }

    .comment-actions {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 10px;
      button {
        background: none;
        border: none;
        color: #f84b99;
        cursor: pointer;
        &:hover {
          color: #9b7a4c;
        }
      }
    }
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #f8e9f5;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  h2 {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    text-align: center;
  }
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1rem;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    button {
      padding: 8px 15px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
      &.save {
        background-color: #f84b99;
        color: white;
        &:hover {
          background-color: var(--acc-pink);
        }
      }
      &.cancel {
        background-color: #ddd;
        &:hover {
          background-color: #bbb;
        }
      }
    }
  }
`;

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { openLoginModal } = useAuthStore();
  const [reviewData, setReviewData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedByUser, setLikedByUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const fromLikedReviews = location.state?.fromLikedReviews || false;
  const fromMyPage = location.state?.fromMyPage || false;
  const { userInfo } = useUserStore(); // 전역 상태의 유저 정보 가져오기
  const loggedInUserId = userInfo?.userId; // 로그인된 유저 ID 추출

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const badgeImages = {
    영화새싹: "/assets/images/mypage/lv1.svg",
    나쵸쟁이: "/assets/images/mypage/lv2.svg",
    영화매니아: "/assets/images/mypage/lv3.svg",
  };

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        const review = response.data.response;
        setReviewData(review);
        setLikedByUser(review.likedByUser);
      } catch (error) {
        console.error("Failed to fetch review data:", error);
        toast.error("리뷰 상세보기 삭제되거나 존재하지 않는 리뷰입니다!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [reviewId]);

  /*
  const toggleLike = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      await axiosInstance.post(`/api/users/review-like/${reviewId}`, {
        userId,
      });

      setReviewData((prevData) => ({
        ...prevData,
        likedByUser: !prevData.likedByUser,
        reviewLike: prevData.likedByUser
          ? prevData.reviewLike - 1
          : prevData.reviewLike + 1,
      }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  const getUserIdFromToken = () => {
    let token = sessionStorage.getItem("accessToken");

    if (!token) {
      token = localStorage.getItem("refreshToken");
    }

    if (!token) {
      openLoginModal();
      return null;
    }
    try {
      const payload = jwtDecode(token);
      return payload.id;
    } catch (error) {
      console.error("Invalid token:", error);
      toast.error("로그인 정보가 유효하지 않습니다.");
      return null;
    }
  };

  */

  const toKST = (utcDate) => {
    const date = new Date(utcDate);
    date.setHours(date.getHours() + 9);
    return date;
  };

  const handleEditComment = async () => {
    if (!editingComment?.text.trim()) {
      toast.error("수정할 댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.put(`/api/reviews/comments/${editingComment.id}`, {
        reviewId,
        comment: editingComment.text,
      });

      setReviewData((prevData) => ({
        ...prevData,
        comments: prevData.comments.map((comment) =>
          comment.commentId === editingComment.id
            ? { ...comment, comment: editingComment.text }
            : comment
        ),
      }));

      setEditingComment(null);
      toast.success("댓글이 수정되었습니다!");
    } catch (error) {
      console.error("Failed to edit comment:", error);
      toast.error("댓글 수정에 실패했습니다.");
    }
  };

  const handleOpenEditModal = (comment) => {
    setEditingComment({ id: comment.commentId, text: comment.comment });
  };

  const handleCloseEditModal = () => {
    setEditingComment(null);
  };

  const handleDeleteComment = async (commentId) => {
    console.log("삭제 요청 - commentId:", commentId);

    if (!commentId) {
      toast.error("삭제할 댓글 ID가 존재하지 않습니다.");
      return;
    }

    try {
      await axiosInstance.delete(`/api/reviews/comments/${commentId}`, {
        data: { reviewId, commentId },
      });

      setReviewData((prevData) => ({
        ...prevData,
        comments: prevData.comments.filter(
          (comment) => comment.commentId !== commentId
        ),
      }));

      toast.success("댓글이 삭제되었습니다!");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`);
      toast.success("리뷰가 성공적으로 삭제되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      toast.error("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleAddComment = async () => {
    if (isSubmitting || !newComment.trim()) return;

    const userId = loggedInUserId;
    if (!userId) {
      openLoginModal();
      return;
    }
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        `/api/reviews/${reviewId}/comments`,
        {
          userId,
          comment: newComment,
        }
      );

      console.log(response.data.response);

      const updatedComment = response.data.response;

      setReviewData((prevData) => ({
        ...prevData,
        comments: [...prevData.comments, updatedComment],
      }));

      setNewComment("");
      toast.success("댓글이 작성되었습니다!");
      window.location.reload();
    } catch (error) {
      console.error("Error during comment submission:", error);
      openLoginModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner />; // 페이지 전체 로딩 시 스피너 표시
  }

  if (!reviewData) {
    return <Container>No review found.</Container>;
  }

  const handleUpdateReview = async (updatedData) => {
    try {
      await axiosInstance.put(`/api/reviews/${reviewId}`, updatedData);
      toast.success("리뷰가 성공적으로 업데이트되었습니다.");
      navigate("/myAllReviewList");
    } catch (error) {
      console.error("리뷰 업데이트 실패:", error);
      toast.error("리뷰 업데이트에 실패했습니다.");
    }
  };

  const handlePosterClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <Container>
      <DetailHeader
        onBack={() => navigate(-1)}
        movieTitle={reviewData.movie?.title || "Untitled Movie"}
      />
      <ReviewContentSection
        posterSrc={reviewData.movie?.poster || "/default-poster.png"}
        profileSrc={reviewData.user?.profileImage || "/default-profile.png"}
        badgeSrc={
          reviewData.user?.mainBadgeImage
            ? badgeImages[reviewData.user.mainBadgeImage] ||
              reviewData.user.mainBadgeImage
            : null
        }
        name={reviewData.user?.nickname || "Unknown User"}
        date={`${toKST(reviewData.createdAt)
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\./g, "-")
          .replace(/-$/, "")
          .replace(/-\s/g, "-")} ${toKST(
          reviewData.createdAt
        ).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`}
        reviewLikeCount={reviewData.reviewLike || 0}
        cookieScoreCount={(reviewData.movie.score || 0).toFixed(1)}
        reviewScore={reviewData.movieScore}
        handleDelete={handleDeleteReview}
        handleUpdateReview={handleUpdateReview}
        isMenuOpen={isMenuOpen && !fromLikedReviews}
        toggleMenu={fromLikedReviews ? undefined : toggleMenu}
        onPosterClick={() => handlePosterClick(reviewData.movie?.movieId)}
        reviewId={reviewId}
        reviewContent={reviewData.content}
        openLoginModal={openLoginModal}
        likedByUser={likedByUser}
        userId={reviewData.user?.userId || null}
      />

      <CommentsSectionContainer>
        <h3>
          {reviewData.comments.length > 0
            ? `${reviewData.comments.length}개의 댓글`
            : "댓글"}
        </h3>
        <div className="comment-input">
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            onClick={() => {
              handleAddComment();
            }}
          >
            <FaPaperPlane />
          </button>
        </div>
        {reviewData.comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="comment-left">
              <CommentProfileWrapper>
                <img
                  src={comment.user.profileImage}
                  alt={`${comment.user.nickname} 프로필`}
                />
                {comment.user.mainBadgeImage && (
                  <CommentBadgeIcon
                    src={
                      badgeImages[comment.user.mainBadgeImage] ||
                      comment.user.mainBadgeImage
                    }
                    alt="댓글 작성자 뱃지"
                  />
                )}
              </CommentProfileWrapper>

              <div className="comment-content">
                <div className="comment-user-info">
                  <div className="nickname">{comment.user.nickname}</div>
                  <div className="date">
                    {toKST(comment.createdAt)
                      .toLocaleDateString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\./g, "-")
                      .replace(/-$/, "")
                      .replace(/-\s/g, "-")}
                  </div>
                </div>
                <div className="text">{comment.comment}</div>

                {(() => {
                  const userId = loggedInUserId;
                  return (
                    comment.user.userId === userId && (
                      <div className="comment-actions">
                        <button onClick={() => handleOpenEditModal(comment)}>
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          삭제
                        </button>
                      </div>
                    )
                  );
                })()}
              </div>
            </div>
          </div>
        ))}

        {editingComment && (
          <ModalWrapper>
            <ModalContent>
              <h2>댓글 수정</h2>
              <textarea
                value={editingComment.text}
                onChange={(e) =>
                  setEditingComment((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
              />
              <div className="modal-actions">
                <button className="cancel" onClick={handleCloseEditModal}>
                  취소
                </button>
                <button className="save" onClick={handleEditComment}>
                  저장
                </button>
              </div>
            </ModalContent>
          </ModalWrapper>
        )}
      </CommentsSectionContainer>
    </Container>
  );
};

export default ReviewDetail;
