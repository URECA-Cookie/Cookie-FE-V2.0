import { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../api/auth/axiosInstance";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 2rem;
  background-color: #000;
  min-height: 100vh;
  color: white;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 800px;
`;

const BackButton = styled.img`
  position: absolute;
  top: 20px;
  left: 4%;
  width: 24px;
  height: 24px;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`;

const HistoryItem = styled.li`
  background: #121212;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 8px #00d6e8;

  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
`;

const MovieName = styled.h3`
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 0.5rem;
`;

const HistoryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .action-name {
    font-size: 1rem;
    color: #00d6e8;
  }

  .points {
    font-size: 1rem;
    color: #00ff00;
  }

  .date {
    font-size: 0.9rem;
    color: #999;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #999;
  margin-top: 2rem;
`;

const BadgeHistory = () => {
  const [badgeHistory, setBadgeHistory] = useState([]);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchBadgeHistory = async () => {
    try {
      const response = await axiosInstance.get("/api/users/badgeHistory");
      const historyData = response.data.response || [];

      const sortedHistory = historyData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBadgeHistory(sortedHistory);
    } catch (error) {
      console.error("뱃지 내역 로딩 실패:", error);
      setBadgeHistory([]);
    }
  };

  useEffect(() => {
    fetchBadgeHistory();
  }, []);

  return (
    <Container>
      <Title>뱃지 포인트 내역</Title>

      <BackButton
        src="/assets/images/mypage/ic_back.svg"
        alt="뒤로가기"
        onClick={handleBackClick}
      />

      {badgeHistory.length > 0 ? (
        <HistoryList>
          {badgeHistory.map((item, index) => (
            <HistoryItem key={index}>
              <MovieName>{item.movieName}</MovieName>
              <HistoryDetails>
                <p className="action-name">액션: {item.actionName}</p>
                <p className="points">포인트: +{item.point}P</p>
                <p className="date">날짜: {item.createdAt}</p>
              </HistoryDetails>
            </HistoryItem>
          ))}
        </HistoryList>
      ) : (
        <EmptyMessage>뱃지 포인트를 획득한 내역이 없습니다.</EmptyMessage>
      )}
    </Container>
  );
};

export default BadgeHistory;
