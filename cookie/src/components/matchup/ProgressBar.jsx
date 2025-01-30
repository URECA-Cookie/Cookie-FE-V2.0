import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

const slideAnimation = keyframes`
  0% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
`;

const BarContainer = styled.div`
  width: 90%;
  max-width: 1000px;
  height: 20px;
  background-color: #d9d9d9;
  border-radius: 15px;
  margin-top: 50px;
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 700px;
    height: 18px;
    margin-top: 40px;
  }

  @media (max-width: 480px) {
    width: 88%;
    max-width: none;
    height: 15px;
    margin-top: 30px;
  }
`;

const FilledBarLeft = styled.div`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background-color: #f44336;
  border-radius: 15px 0 0 15px;
  transition: width 0.5s ease;
`;

const FilledBarRight = styled.div`
  height: 100%;
  width: ${(props) => 100 - props.percentage}%;
  background-color: #4caf50;
  border-radius: 0 15px 15px 0;
  transition: width 0.5s ease;
`;

const SlidingIconContainer = styled.div`
  position: absolute;
  top: -40px;
  left: ${(props) => props.percentage}%;
  transform: translateX(-50%);
  z-index: 10;

  &:hover .tooltip {
    opacity: 1;
    transform: translate(-50%, -40px);
  }
`;

const SlidingIcon = styled.img`
  width: 45px;
  height: 45px;
  animation: ${slideAnimation} 1.5s infinite ease-in-out;
  cursor: pointer;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, -20px);
  background-color: ${(props) =>
    props.isLeftWinning ? "rgb(229, 9, 20)" : "#006400"};
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: ${(props) =>
      props.isLeftWinning
        ? "rgb(229, 9, 20) transparent transparent transparent"
        : "#006400 transparent transparent transparent"};
  }
`;

const ProgressBar = ({ movie1Likes, movie2Likes }) => {
  const totalVotes = movie1Likes + movie2Likes;
  const percentage =
    totalVotes > 0 ? Math.round((movie1Likes / totalVotes) * 100) : 50;
  const isLeftWinning = percentage >= 50;

  const iconSrc = isLeftWinning
    ? "/assets/images/matchup/matchupleftwin.png"
    : "/assets/images/matchup/matchuprightwin.png";

  return (
    <BarContainer>
      <FilledBarLeft percentage={percentage} />
      <FilledBarRight percentage={percentage} />
      <SlidingIconContainer percentage={percentage}>
        <SlidingIcon src={iconSrc} alt="Winning Icon" />
        <Tooltip className="tooltip" isLeftWinning={isLeftWinning}>
          {isLeftWinning ? percentage : 100 - percentage}%
        </Tooltip>
      </SlidingIconContainer>
    </BarContainer>
  );
};

ProgressBar.propTypes = {
  movie1Likes: PropTypes.number.isRequired,
  movie2Likes: PropTypes.number.isRequired,
};

export default ProgressBar;
