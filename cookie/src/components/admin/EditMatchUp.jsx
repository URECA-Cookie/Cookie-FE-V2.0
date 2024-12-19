import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchModal from "./SearchModal";
import axiosInstance from "../../api/auth/axiosInstance";

const DefalutContainer = styled.div`
  width: 1239px;
  background-color: #ffff;
  margin: 20px 0;
  border-radius: 12px;
  padding: 20px 0;
`;

const MatchUpType = styled.div`
  margin-bottom: 20px;
  padding: 0 40px;
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const AddMatchUpContainer = styled.div`
  margin: 20px auto;
  background-color: #f9f9f9;
  width: 1150px;
  height: 720px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const MatchUpForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
`;

const Label = styled.label`
  font-weight: bold;
  flex-basis: 15%;
  text-align: left;
  font-size: 24px;
`;

const Input = styled.input`
  flex-grow: 0.5;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 20px;
  width: 20px;
`;

const Select = styled.select`
  flex-grow: 0.5;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 20px;
  width: 20px;
`;

const MoviePosters = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  width: 43.6%;
  div {
    width: 160px;
    height: 230px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MovieIonfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const PosterUpload = styled.div`
  border: 1px solid var(--sub-text);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;

  .upload__poster {
    object-fit: cover;
    width: 160px;
    height: 230px;
    border-radius: 12px;
  }

  .upload_btn1,
  .upload_btn2 {
    border: 1px solid var(--sub-text);
    padding: 5px 20px;
    cursor: pointer;
    background-color: var(--sub-tex);
    color: #000000;
    border-radius: 12px;
    position: absolute;
    right: 12px;
    transform: translateX(-50%);
    z-index: 10;
    &:hover {
      background-color: #ffffff;
      color: #000000;
    }
  }
`;

const CloseButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 30px;
  font-size: 18px;
  margin-left: auto;

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
`;

const EditMatchUp = ({ matchUpData, closeModal, fetchMatchUpData }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const dateParts = dateString.split("-");
    if (dateParts.length < 3) return "";
    const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2].slice(0, 2)}T${dateParts[3].slice(0, 5)}`;
    return formattedDate;
  };
  const {
    matchId,
    matchUpTitle,
    startTime,
    endTime,
    movieMatchInfo = [],
    matchUpType,
  } = matchUpData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [matchTitle, setMatchTitle] = useState(matchUpTitle || "");
  const [selectedPoster1, setSelectedPoster1] = useState(
    movieMatchInfo[0] || null // 첫 번째 영화의 정보로 초기화
  );
  const [selectedPoster2, setSelectedPoster2] = useState(
    movieMatchInfo[1] || null // 두 번째 영화의 정보로 초기화
  );
  const [matchType, setMatchType] = useState(matchUpType || "");
  const [startDate, setStartDate] = useState(formatDateForInput(startTime));
  const [endDate, setEndDate] = useState(formatDateForInput(endTime));

  useEffect(() => {
    if (matchUpData) {
      setMatchTitle(matchUpData.matchUpTitle || "");
      setStartDate(formatDateForInput(matchUpData.startTime) || "");
      setEndDate(formatDateForInput(matchUpData.endTime) || "");
      setSelectedPoster1(
        matchUpData.matchUpMovies && matchUpData.matchUpMovies[0]
          ? matchUpData.matchUpMovies[0]
          : null
      );
      setSelectedPoster2(
        matchUpData.matchUpMovies && matchUpData.matchUpMovies[1]
          ? matchUpData.matchUpMovies[1]
          : null
      );
      setMatchType(matchUpData.matchUpType || "");
    }
  }, [matchUpData]);

  const formatDate = (date) => {
    return date ? date.replace("T", "-") + ":00" : "";
  };

  const handleEditSave = async () => {
    try {
      const matchUpMovies = [
        {
          poster: selectedPoster1 ? selectedPoster1.posterPath : "",
          movieTitle: selectedPoster1 ? selectedPoster1.title : "",
        },
        {
          poster: selectedPoster2 ? selectedPoster2.posterPath : "",
          movieTitle: selectedPoster2 ? selectedPoster2.title : "",
        },
      ];

      const data = {
        matchTitle,
        matchUpMovies,
        matchUpType: matchType,
        startTime: formatDate(startDate),
        endTime: formatDate(endDate),
      };

      const response = await axiosInstance.put(
        `/api/admin/match-up/${matchId}`,
        data
      );
      console.log("Match-Up Updated:", response.data);
      alert("매치업이 수정되었어요!");
      fetchMatchUpData();
      setMatchTitle("");
      setSelectedPoster1(null);
      setSelectedPoster2(null);
      setMatchType("");
      setStartDate("");
      setEndDate("");
      setSearchTerm("");
      closeModal();
    } catch (error) {
      console.error("Error updating match-up:", error);
    }
  };

  const handleSelectMovie = (movie) => {
    if (selectedPoster1 === null) {
      setSelectedPoster1(movie);
    } else {
      setSelectedPoster2(movie);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectMovie={handleSelectMovie}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <DefalutContainer>
        <MatchUpType>
          <h2>매치업 수정</h2>
        </MatchUpType>
        <AddMatchUpContainer>
          <MatchUpForm>
            <InfoRow>
              <Label>타이틀:</Label>
              <Input
                type="text"
                placeholder="타이틀을 입력하세요"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
              />
            </InfoRow>

            <InfoRow>
              <Label>매치영화:</Label>
              <MoviePosters>
                <MovieIonfo>
                  <PosterUpload>
                    <button
                      className="upload_btn1"
                      onClick={() => setIsModalOpen(true)}
                    >
                      선택
                    </button>
                    {selectedPoster1 && (
                      <img
                        className="upload__poster"
                        src={selectedPoster1.posterPath}
                        alt={selectedPoster1.title}
                      />
                    )}
                  </PosterUpload>
                  <p>{selectedPoster1 ? selectedPoster1.title : ""}</p>
                </MovieIonfo>
                <MovieIonfo>
                  <PosterUpload>
                    <button
                      className="upload_btn2"
                      onClick={() => setIsModalOpen(true)}
                    >
                      선택
                    </button>
                    {selectedPoster2 && (
                      <img
                        className="upload__poster"
                        src={selectedPoster2.posterPath}
                        alt={selectedPoster2.title}
                      />
                    )}
                  </PosterUpload>
                  <p>{selectedPoster2 ? selectedPoster2.title : ""}</p>
                </MovieIonfo>
              </MoviePosters>
            </InfoRow>

            <InfoRow>
              <Label>매치타입:</Label>
              <Select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value)}
              >
                <option value="">선택</option>
                <option value="SHOW">SHOW</option>
                <option value="GENRE">GENRE</option>
              </Select>
            </InfoRow>

            <InfoRow>
              <Label>시작일:</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </InfoRow>

            <InfoRow>
              <Label>종료일:</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </InfoRow>
          </MatchUpForm>
          <CloseButton onClick={handleEditSave}>수정하기</CloseButton>
        </AddMatchUpContainer>
      </DefalutContainer>
    </>
  );
};

export default EditMatchUp;
