import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import debounce from "lodash.debounce";
import SearchBar from "../components/searchpage/SearchBar";
import SearchResults from "../components/searchpage/SearchResults";
import TopButton from "../components/searchpage/TopButton";
import serverBaseUrl from "../config/apiConfig";
import GlobalStyle from "../styles/global";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: black;
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 30px;
  }

  @media (max-width: 480px) {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 20px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  background: black;
  border-radius: 10px;
  padding: 0px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 0px;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  background: #4d4c4c;
  border-radius: 1.4rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: -30px;
  }

  @media (max-width: 480px) {
    border-radius: 15px;
    margin-top: -40px;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px 0;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  color: ${({ isActive }) => (isActive ? "white" : "#f9f9f9")};
  background: transparent;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ isActive }) => (isActive ? "white" : "#f84b99")};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px 0;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 10px 0;
  }
`;

const Slider = styled.div`
  position: absolute;
  bottom: 0;
  left: ${({ activeIndex }) => `${activeIndex * 33.33}%`};
  width: 33.33%;
  height: 5px;
  background: #f84b99;
  transition: left 0.3s ease;

  @media (max-width: 480px) {
    height: 3px;
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
  padding-left: 0px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding-left: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding-left: 0px;
  }
`;

const DefaultResultsHeader = styled.div`
  color: #f84b99;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Search = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("movie");
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [defaultResults, setDefaultResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      if (searchTerm.trim()) {
        const response = await axios.get(`${serverBaseUrl}/api/search`, {
          params: { type: activeTab, keyword: searchTerm, page, size: 10 },
        });
        const newResults = response.data || [];
        setResults((prevResults) =>
          page === 0 ? newResults : [...prevResults, ...newResults]
        );
        setHasMore(!response.data?.last);
      } else {
        const response = await axios.get(`${serverBaseUrl}/api/search/default`);
        const defaultResults = response.data.response || [];
        setDefaultResults(defaultResults);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      setPage(0);
      fetchSearchResults();
    } else {
      if (defaultResults.length === 0) {
        fetchSearchResults();
      }
    }
  }, [searchTerm, activeTab]);

  useEffect(() => {
    if (page > 0) {
      fetchSearchResults();
    }
  }, [page]);

  const debouncedScrollHandler = debounce(() => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    setShowTopButton(scrollTop > 200);

    if (
      window.innerHeight + scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, 300); // 300ms delay

  useEffect(() => {
    window.addEventListener("scroll", debouncedScrollHandler);
    return () => window.removeEventListener("scroll", debouncedScrollHandler);
  }, [hasMore, isLoading]);

  const handleTabClick = (tab, index) => {
    setActiveTab(tab);
    setActiveIndex(index);
  };

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container>
      <GlobalStyle />
      <Helmet>
        <title>검색페이지 | Cookie-V2.00</title>
        <meta name="description" content="쿠키 서비스의 검색페이지입니다." />
      </Helmet>
      <SearchInfoText>
        영화 제목, 배우/ 감독명을
        <br />
        입력해주세요.
      </SearchInfoText>
      <ContentWrapper>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={fetchSearchResults}
        />
        <Tabs>
          <TabButton
            isActive={activeTab === "movie"}
            onClick={() => handleTabClick("movie", 0)}
          >
            영화명
          </TabButton>
          <TabButton
            isActive={activeTab === "actor"}
            onClick={() => handleTabClick("actor", 1)}
          >
            배우명
          </TabButton>
          <TabButton
            isActive={activeTab === "director"}
            onClick={() => handleTabClick("director", 2)}
          >
            감독명
          </TabButton>
          <Slider activeIndex={activeIndex} />
        </Tabs>
        {!searchTerm.trim() && (
          <DefaultResultsHeader>박스오피스 TOP 10</DefaultResultsHeader>
        )}
        <SearchResults
          results={results || []}
          onMovieClick={handleMovieClick}
          isLoading={isLoading}
          activeTab={activeTab}
          defaultResults={defaultResults || []}
          searchTerm={searchTerm}
        />
      </ContentWrapper>
      {showTopButton && <TopButton onClick={scrollToTop} />}
    </Container>
  );
};

export default Search;
