import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/auth/axiosInstance";
import useAuthStore from "../stores/useAuthStore";
import LoginModal from "../components/common/LoginModal";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  padding: 2rem;
  background-color: #1e1e1e;
  min-height: 100vh;
  color: #fff;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
  color: #f84b99;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const BackButton = styled.div`
  width: 32px;
  height: 32px;
  background: no-repeat center/cover url("/assets/images/prev-button.svg");
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 4%;
  transition:
    transform 0.3s ease,
    opacity 0.2s ease;
`;

const HistoryTable = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #222;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
`;

const TableHeader = styled.thead`
  background-color: #f84b99;
  color: white;

  th {
    padding: 0.8rem;
    text-align: center;
    font-weight: bold;
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 0.6rem;
      font-size: 0.85rem;
    }

    @media (max-width: 480px) {
      padding: 0.5rem;
      font-size: 0.75rem;
    }
  }
`;

const TableRow = styled.tr`
  background-color: #fff;
  border-bottom: 1px solid #555;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableData = styled.td`
  padding: 0.8rem;
  font-size: 0.9rem;
  color: black;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const formatTextWithEllipsis = (text, maxLength = 8) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString)
    .toLocaleDateString("ko-KR", options)
    .replace(/\.$/, "");
};

const BadgeHistory = () => {
  const [badgeHistory, setBadgeHistory] = useState([]);
  const navigate = useNavigate();
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const isLogined = useAuthStore((state) => state.isLogined);

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
    if (isLogined()) {
      fetchBadgeHistory();
    }
  }, [isLogined]);

  const formatActionName = (actionName) => {
    switch (actionName) {
      case "review":
        return "리뷰";
      case "matchup":
        return "매치업";
      default:
        return actionName;
    }
  };

  const handleHistoryItemClick = () => {
    if (!isLogined()) {
      openLoginModal();
    }
  };

  return (
    <Container>
      <BackButton onClick={handleBackClick} />
      <Helmet>
        <title>뱃지 포인트 내역 | Cookie-V2.00</title>
        <meta
          name="description"
          content="쿠키 서비스의 뱃지 포인트 내역페이지입니다."
        />
      </Helmet>
      <Title>뱃지 포인트 내역</Title>
      {badgeHistory.length > 0 ? (
        <HistoryTable>
          <table>
            <TableHeader>
              <tr>
                <th>영화 제목</th>
                <th>획득 출처</th>
                <th>포인트</th>
                <th>날짜</th>
              </tr>
            </TableHeader>
            <tbody>
              {badgeHistory.map((item, index) => (
                <TableRow key={index} onClick={handleHistoryItemClick}>
                  <TableData>
                    {formatTextWithEllipsis(item.movieName)}
                  </TableData>
                  <TableData>
                    {formatTextWithEllipsis(formatActionName(item.actionName))}
                  </TableData>
                  <TableData>+{item.point}P</TableData>
                  <TableData>{formatDate(item.createdAt)}</TableData>
                </TableRow>
              ))}
            </tbody>
          </table>
        </HistoryTable>
      ) : (
        <EmptyMessage>뱃지 포인트를 획득한 내역이 없습니다.</EmptyMessage>
      )}
      <LoginModal />
    </Container>
  );
};

export default BadgeHistory;
