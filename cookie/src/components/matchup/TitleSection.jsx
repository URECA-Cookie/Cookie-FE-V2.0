import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import TopicImage from "/src/assets/images/matchup/topic_image.svg";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/auth/axiosInstance";
import Spinner from "../common/Spinner";

Modal.setAppElement("#root");

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const MatchUpTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const TitleImage = styled.img`
  width: 60px;
  height: 60px;

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const DDay = styled.div`
  font-size: 1.7rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-left: 0.1rem;
  }
`;

const modalCustomStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "black",
    borderRadius: "15px",
    padding: "20px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "auto",
    minHeight: "400px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: 0,
  },
};

const ModalHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
`;

const ModalList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

const ModalListItem = styled.li`
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  background-color: #ffffff;
  color: #006400;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
`;

const bounceEvent = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const MatchUpHistory = styled.div`
  width: 80px;
  height: auto;
  border-radius: 30px 0 0 30px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 480px) {
    right: 5px;
    top: 200px;
    position: fixed;
    right: 0;
    z-index: 1;
    width: 70px;
  }
`;

const HistoryIcon = styled.img`
  width: 35px;
  height: 35px;
  animation: ${bounceEvent} 0.5s ease-in-out infinite;
`;

const HistoryText = styled.p`
  margin: 0;
  font-size: 10px;
  color: brown;
`;

const TitleSection = ({ matchUpTitle, endAt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/matchups/history");
      setHistoryData(response.data.response);
      console.log("히스토리 데이터", response);
    } catch (error) {
      console.error("히스토리 데이터 요청 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchHistoryData();
    }
  }, [isModalOpen]);

  const calculateDDay = () => {
    const now = new Date();
    const endDate = new Date(endAt);
    const difference = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) - 1;

    if (difference < 0) return "투표 종료";
    if (difference === 0) return "D-Day";
    return `D-${difference}`;
  };

  const handleNavigate = (matchUpId) => {
    setIsModalOpen(false);
    navigate(`/matchup/${matchUpId}/history`);
  };

  return (
    <>
      <TitleContainer>
        <MatchUpTitle>
          <TitleImage src={TopicImage} alt="Topic Icon" />
          <Title>{matchUpTitle}</Title>
          <DDay>{calculateDDay()}</DDay>
          <TitleImage src={TopicImage} alt="Topic Icon" />
        </MatchUpTitle>

        <InfoContainer>
          <MatchUpHistory onClick={handleModalToggle}>
            <HistoryIcon src="/assets/images/matchup/history.png"></HistoryIcon>
            <HistoryText>히스토리</HistoryText>
          </MatchUpHistory>
        </InfoContainer>
      </TitleContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalToggle}
        style={modalCustomStyles}
      >
        <ModalHeader>히스토리 목록</ModalHeader>
        <ModalList>
          {isLoading ? (
            <Spinner />
          ) : historyData.length > 0 ? (
            historyData.map((item) => (
              <ModalListItem
                key={item.matchUpId}
                onClick={() => handleNavigate(item.matchUpId)}
              >
                {item.matchUpId}. {item.matchUpTitle} (
                {new Date(item.startAt).toISOString().split("T")[0]} ~{" "}
                {new Date(item.endAt).toISOString().split("T")[0]})
              </ModalListItem>
            ))
          ) : (
            <ModalListItem>히스토리 데이터가 없습니다.</ModalListItem>
          )}
        </ModalList>
        <CloseButton onClick={handleModalToggle}>닫기</CloseButton>
      </Modal>
    </>
  );
};

TitleSection.propTypes = {
  matchUpTitle: PropTypes.string.isRequired,
  endAt: PropTypes.string.isRequired,
};

export default TitleSection;
