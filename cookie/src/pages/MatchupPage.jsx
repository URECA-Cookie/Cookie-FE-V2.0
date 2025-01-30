import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import TitleSection from "../components/matchup/TitleSection";
import Timer from "../components/matchup/Timer";
import PosterList from "../components/matchup/PosterList";
import ProgressBar from "../components/matchup/ProgressBar";
import ChartSection from "../components/matchup/ChartSection";
import ChatUI from "../components/matchup/ChatUI";
import { useParams, useLocation } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import SnowEffect from "../components/common/SnowEffect";
import Spinner from "../components/common/Spinner";
import axiosInstance from "../api/auth/axiosInstance";
import serverBaseUrl from "../config/apiConfig";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: linear-gradient(to bottom, #000000, #292929);
  color: #ffffff;
  padding-top: 10px;
  font-family: "Arial", sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
`;

const MatchupPage = () => {
  const { matchUpId } = useParams();
  const location = useLocation();
  const [matchUpData, setMatchUpData] = useState(null);
  const [isVoteEnded, setIsVoteEnded] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isHistoryPage = location.pathname.includes("/history");

  const fetchMatchUpData = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = `/api/matchups/${matchUpId || 1}`;
      const response = await axiosInstance.get(endpoint);
      setMatchUpData(response.data.response || {});
      console.log("이떄 데이타", response);
    } catch (error) {
      console.error("API 요청 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [matchUpId]);

  useEffect(() => {
    fetchMatchUpData();
  }, [fetchMatchUpData, location.pathname]);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return;

    const socket = new SockJS(`${serverBaseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log("디버깅:", str),
      onConnect: () => {
        console.log("STOMP 연결 성공");
        setStompClient(client);
        setIsConnected(true);
      },
      onStompError: (frame) => {
        console.error("STOMP 오류 발생:", frame);
      },
      onDisconnect: () => {
        console.log("STOMP 연결 끊김");
        setIsConnected(false);
      },
    });

    client.activate();

    return () => client.deactivate();
  }, []);

  const handleVoteEnd = () => setIsVoteEnded(true);

  if (isLoading || !matchUpData) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>매치업페이지 | Cookie-V2.00</title>
        <meta name="description" content="쿠키 서비스의 매치업페이지입니다." />
      </Helmet>
      <SnowEffect />
      <ScrollToTop />
      <TitleSection
        matchUpTitle={matchUpData.matchUpTitle}
        endAt={matchUpData.entAt}
      />
      <Timer endAt={matchUpData.entAt} onVoteEnd={handleVoteEnd} />
      <PosterList
        posters={[
          {
            movieId: matchUpData.movie1.movieId,
            src:
              matchUpData.movie1.moviePoster ||
              "/assets/images/main/cookie_icon.svg",
            title: matchUpData.movie1.movieTitle,
            win: matchUpData.movie1.win,
          },
          {
            movieId: matchUpData.movie2.movieId,
            src:
              matchUpData.movie2.moviePoster ||
              "/assets/images/main/cookie_icon.svg",
            title: matchUpData.movie2.movieTitle,
            win: matchUpData.movie2.win,
          },
        ]}
        matchUpId={matchUpData.matchUpId}
        isVoteEnded={isVoteEnded}
        userVote={matchUpData.userVote}
      />
      <ProgressBar
        movie1Likes={matchUpData.movie1.movieLike}
        movie2Likes={matchUpData.movie2.movieLike}
      />
      <ChartSection movie1={matchUpData.movie1} movie2={matchUpData.movie2} />

      {!isHistoryPage && (
        <ChatUI matchUpId={matchUpId} stompClient={stompClient} />
      )}
    </Container>
  );
};

export default MatchupPage;
