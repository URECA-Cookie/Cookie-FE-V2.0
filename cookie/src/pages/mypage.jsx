import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileImage from "../components/mypage/ProfileImage";
import BadgeList from "../components/mypage/BadgeList";
import { Helmet } from "react-helmet-async";

import FavoriteList from "../components/mypage/FavoriteList";
// import ReviewList from "../components/mypage/ReviewList";
import LogoutAndWithdraw from "../components/mypage/LogoutAndWithdraw";
import LoginModal from "../components/common/LoginModal";
import axiosInstance from "../api/auth/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";
import Spinner from "../components/common/Spinner";
import PointHistory from "../components/matchup/PointSection";
import PushNotificationToggle from "../components/mypage/PushNotificationToggle";
import LogoutModal from "../components/mypage/LogoutModal";
import WithdrawModal from "../components/mypage/WithdrawModal";

import { FaChevronRight } from "react-icons/fa";

const MypageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--dark-gray);
  position: relative;
  padding: 0.8rem;
`;

const MyReviewList = styled.div`
  border: 2px solid #000;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1rem;
  color: black;
  font-weight: bold;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #f84b99;
  }
`;

const MypageContent = styled.div`
  background-color: var(--dark-gray);

  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 200px;
  z-index: 1;
  box-sizing: border-box;
  padding: 20px;

  border: 4px solid transparent;
`;

const MyPage = () => {
  const [userData, setUserData] = useState({ nickname: "", profileImage: "" });
  const [badgeData, setBadgeData] = useState([]);
  const [badgePoint, setBadgePoint] = useState(0);
  const [genreScores, setGenreScores] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const logOut = useAuthStore((state) => state.logOut);
  const isLogined = useAuthStore((state) => state.isLogined);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (!isLogined()) {
        openLoginModal();
        return false;
      }
      return true;
    };

    if (!checkLoginStatus()) return;

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/users");

        const {
          nickname,
          profileImage,
          badge,
          badgePoint,
          genreScores,
          reviews,
          pushEnabled,
        } = response.data.response;

        console.log("푸시 알림 상태:", pushEnabled);
        console.log("닉네임:", nickname);

        setUserData({ nickname, profileImage });
        setBadgePoint(badgePoint || 0);
        setPushEnabled(pushEnabled);

        setBadgeData(
          badge?.map((b) => ({
            name: b.name || "배지 없음",
            badgeImage: b.badgeImage || "/assets/images/defaultBadge.png",
            main: b.main || false,
          })) || []
        );

        const genreData =
          genreScores?.length > 0
            ? Object.entries(genreScores[0])
                .filter(([key]) => key !== "id" && key !== "userId")
                .map(([name, points]) => ({ name, points }))
            : [];
        setGenreScores(genreData);

        const transformedReviews =
          reviews?.map((review) => ({
            reviewId: review.reviewId,
            content: review.content,
            movieScore: review.movieScore,
            reviewLike: review.reviewLike,
            createdAt: review.createdAt,
            movie: {
              title: review.movie.title || "영화 제목 없음",
              poster:
                review.movie.poster || "/assets/images/default-poster.png",
            },
            user: {
              nickname: review.user.nickname || "익명",
              profileImage:
                review.user.profileImage || "/assets/images/default-user.png",
            },
          })) || [];

        console.log("변환된 리뷰:", transformedReviews);
        setReviewData(transformedReviews);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    fetchUserData();
  }, [isLogined, openLoginModal]);

  const mainBadge = badgeData.find((badge) => badge.main) || {};
  console.log("MainBadge:", mainBadge);
  const favoriteItems = [{ label: "좋아한 영화" }, { label: "좋아한 리뷰" }];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.delete("/api/notification/fcm-token");
      console.log("FCM 토큰 삭제 성공");

      logOut();
      sessionStorage.clear();
      localStorage.clear();

      toast.success("로그아웃 되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("FCM 토큰 삭제 실패:", error);
      toast.error("로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.delete("/api/users");
      logOut();
      sessionStorage.clear();
      localStorage.clear();
      toast.success("탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("탈퇴 요청 실패:", error);
      toast.error("탈퇴 중 문제가 발생했습니다.\n다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setShowWithdrawModal(false);
    }
  };

  const handleMyAllReviewClick = () => {
    if (!isLogined()) {
      openLoginModal();
    } else {
      navigate("/myAllReviewList");
    }
  };

  const handlePointHistoryClick = () => {
    if (!isLogined()) {
      openLoginModal();
    } else {
      navigate("/point-history");
    }
  };

  return (
    <>
      <Helmet>
        <title>마이페이지 | Cookie-V2.00</title>
        <meta name="description" content="쿠키 서비스의 마이페이지입니다." />
      </Helmet>
      <LoginModal />
      {isLoading && <Spinner />}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          onConfirm={handleWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
      <MypageContainer>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <ProfileImage
            title={mainBadge.name || "배지 없음"}
            name={userData.nickname}
            image={userData.profileImage}
            badgeIcon={
              mainBadge.badgeImage
                ? mainBadge.badgeImage
                : "/assets/images/defaultBadge.png"
            }
          />
        </div>
        <MypageContent>
          <PointHistory
            badgePoint={badgePoint}
            onClick={handlePointHistoryClick}
          />
          <FavoriteList title="좋아요" items={favoriteItems} />
          <PushNotificationToggle pushEnabled={pushEnabled} />

          <MyReviewList onClick={handleMyAllReviewClick}>
            <p>내가 작성한 리뷰</p>
            <FaChevronRight />
          </MyReviewList>

          {isLogined() && (
            <LogoutAndWithdraw
              onLogout={() => setShowLogoutModal(true)}
              onWithdraw={() => setShowWithdrawModal(true)}
            />
          )}
        </MypageContent>
      </MypageContainer>
    </>
  );
};

export default MyPage;
