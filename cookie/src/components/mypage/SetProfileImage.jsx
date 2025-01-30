import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 10px;
  }
`;

const BackButton = styled.div`
  width: 32px;
  height: 32px;
  background: no-repeat center/cover url("/assets/images/prev-button.svg");
  cursor: pointer;
  position: absolute;
  top: 30px;
  left: 20px;
  transition:
    transform 0.3s ease,
    opacity 0.2s ease;
`;

const ImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 20px;
  position: relative;
  margin-top: 10px;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  cursor: pointer;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background: #fff;
  color: #000;
  border: 2px solid #000;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

const CameraIcon = styled.img`
  position: absolute;
  right: -10px;
  bottom: -8px;
  width: 44px;
  height: 44px;
`;

const SetProfileImage = ({ profileImage, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setShowModal(false);
      return;
    }

    const validFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validFileTypes.includes(file.type)) {
      toast.error(
        "지원하지 않는 파일 형식입니다. jpg, jpeg, png, svg 파일만 업로드 가능합니다."
      );
      return;
    }

    if (file.size > maxSize) {
      toast.error("파일 크기는 5MB 이하로 업로드 가능합니다.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    onChange({ file, preview: imageUrl });
    setShowModal(false);
  };

  const handleResetImage = () => {
    onChange({
      file: null,
      preview: "/assets/images/mypage/defaultimage.jpeg",
    });
    setShowModal(false);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <ProfileContainer>
      <BackButton onClick={handleBackClick} />
      <ImageWrapper onClick={() => setShowModal(true)}>
        <ProfileImage
          src={
            profileImage?.preview || "/assets/images/mypage/setdefaultImage.svg"
          }
          alt="Profile"
          width="120"
          height="120"
          loading="lazy"
          fetchPriority="high"
        />
        <CameraIcon src="/assets/images/camera.svg" alt="Camera Icon" />
      </ImageWrapper>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>

            <ModalButton onClick={handleFileSelect}>
              앨범에서 파일 선택
            </ModalButton>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <ModalButton onClick={handleResetImage}>
              기본 이미지로 변경
            </ModalButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </ProfileContainer>
  );
};

SetProfileImage.propTypes = {
  profileImage: PropTypes.shape({
    file: PropTypes.object,
    preview: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SetProfileImage;
