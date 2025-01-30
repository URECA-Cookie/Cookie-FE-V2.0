import PropTypes from "prop-types";
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const skeletonLoading = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(150px, 1fr)
  ); /* 고정된 최소 너비 설정 */
  gap: 15px;
  width: 100%;
  max-width: 1200px; /* 부모 너비 제한 */
  margin: 0 auto; /* 가운데 정렬 */
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    padding: 8px;
  }
`;

const ResultItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%; /* 부모 컨테이너 너비 */
  aspect-ratio: 2/3; /* 비율 유지 */
  border-radius: 8px; /* 둥근 모서리 적용 */
  overflow: hidden; /* 이미지 넘치는 부분 잘라냄 */
  position: relative;

  &:hover {
    transform: scale(1.05);
  }
`;

const PosterSkeleton = styled.div`
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${skeletonLoading} 1.5s infinite;
  border-radius: 8px;
  min-height: 250px;
  display: ${(props) => (props.isLoading ? "block" : "none")};
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율 유지하며 잘라냄 */
  background-color: #2c2c2c; /* 로딩 중일 때 배경 색상 */
  display: ${(props) => (props.isLoading ? "none" : "block")};
`;

const Message = styled.p`
  font-size: 16px;
  color: white;
  text-align: center;
  margin-top: 20px;
`;

const EndMessage = styled.p`
  font-size: 16px;
  color: #aaaaaa; /* Softer color for less visual disruption */
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  width: 100%; /* Ensure full width */
  padding: 10px;
  box-sizing: border-box; /* Include padding in width calculation */
  position: relative; /* For better layout stability */
`;

const SearchResults = ({
  results,
  onMovieClick,
  isLoading,
  activeTab,
  defaultResults,
  searchTerm,
  hasMore,
  fetchMoreResults,
}) => {
  useEffect(() => {
    if (hasMore && !isLoading) {
      fetchMoreResults();
    }
  }, [hasMore, isLoading]);

  if (!isLoading && searchTerm.trim() && results.length === 0) {
    return <Message>검색 결과가 없습니다.</Message>;
  }

  const displayResults = results.length > 0 ? results : defaultResults;

  return (
    <div>
      {isLoading && <Message>로딩 중...</Message>}
      <ResultsContainer>
        {displayResults.map((result) => (
          <ResultItem
            key={result.id || result.movieId}
            onClick={() => onMovieClick(result.id || result.movieId)}
          >
            <Poster
              src={
                result.poster ||
                result.profileImage ||
                "/assets/images/default.png"
              }
              alt={result.title || result.name || "기본 이미지"}
            />
          </ResultItem>
        ))}
      </ResultsContainer>
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.array.isRequired, // 검색 결과 배열
  defaultResults: PropTypes.array.isRequired, // 기본 검색 결과 배열
  onMovieClick: PropTypes.func.isRequired, // 영화 클릭 핸들러
  isLoading: PropTypes.bool.isRequired, // 로딩 상태
  activeTab: PropTypes.string.isRequired, // 현재 활성화된 탭
  searchTerm: PropTypes.string.isRequired, // 검색어
  hasMore: PropTypes.bool.isRequired, // 추가 데이터를 더 불러올 수 있는지 여부
  fetchMoreResults: PropTypes.func.isRequired, // 더 많은 결과를 불러오는 함수
};

export default SearchResults;
