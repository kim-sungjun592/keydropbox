// ===== src/components/RoomDetail.js =====
import React, { useState } from "react";

// 🖼️ 이미지 압축 유틸리티 함수 (최대 800px, JPEG Quality 0.7 적용)
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // 용량을 약 90% 이상 절감하는 JPEG 포맷으로 압축
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };
    };
  });
};

function RoomDetail({
  room,
  onBack,
  onPaymentSuccess,
  initialPaidSuccess,
  isAdmin = true,
  onUpdateRoomImage,
  onNavigateToStructure,
}) {
  const [isPaidSuccess, setIsPaidSuccess] = useState(
    initialPaidSuccess || false,
  );
  const [showKakaoModal, setShowKakaoModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const qrData = encodeURIComponent(
    `https://kakaopay.com/pay?orderId=ORDER_${room.id}_${Date.now()}&amount=${room.price || 80000}`,
  );
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

  // 🔑 이미지 업로드 시 압축 후 부모 컴포넌트에 전달
  const handleImageChange = async (e) => {
    if (!isAdmin) return;
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file);
        if (typeof onUpdateRoomImage === "function") {
          onUpdateRoomImage(room.id, compressedDataUrl);
        }
      } catch (error) {
        alert("이미지 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const handleImageClick = () => {
    if (typeof onNavigateToStructure === "function") {
      onNavigateToStructure(room.id);
    }
  };

  const handleOpenKakaoPay = () => {
    setShowKakaoModal(true);
  };

  const handleCompleteKakaoPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowKakaoModal(false);

      if (typeof onPaymentSuccess === "function") {
        onPaymentSuccess(room.id);
      }

      setIsPaidSuccess(true);
    }, 1200);
  };

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof onBack === "function") {
      onBack();
    }
  };

  return (
    <div className="screen room-detail-screen">
      <div className="room-detail-content">
        <div className="room-detail-header">
          <h2>
            객실 상세정보{" "}
            {isAdmin && (
              <span style={{ fontSize: "14px", color: "#d32f2f" }}>
                (관리자 모드)
              </span>
            )}
          </h2>
          <p
            className="back-btn"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
          >
            ← 돌아가기
          </p>
        </div>

        {isPaidSuccess ? (
          <div
            style={{
              maxWidth: "480px",
              margin: "50px auto",
              padding: "40px 30px",
              backgroundColor: "#fff",
              border: "2px solid #2e7d32",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <h1
              style={{
                color: "#2e7d32",
                marginBottom: "15px",
                fontSize: "28px",
              }}
            >
              결제가 완료되었습니다
            </h1>
            <p
              style={{ fontSize: "18px", color: "#333", marginBottom: "20px" }}
            >
              <strong>{room.id}호</strong> 객실 카카오페이 결제가 정상
              완료되었습니다.
            </p>
            <p
              style={{
                color: "#d32f2f",
                fontSize: "14px",
                marginBottom: "30px",
              }}
            >
              * 해당 객실 상태가 <strong>'이용중'</strong>으로 변경됩니다.
            </p>
            <button
              onClick={handleBack}
              style={{
                padding: "14px 32px",
                backgroundColor: "#2b5c6b",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              확인 (객실 목록으로 이동)
            </button>
          </div>
        ) : (
          <div className="detail-main">
            <div className="detail-left">
              <div className="photo-container-main">
                <h3>
                  객실 대표 사진{" "}
                  <span style={{ fontSize: "13px", color: "#666" }}>
                    (
                    {isAdmin
                      ? "클릭 시 세부 구조 편집"
                      : "클릭 시 세부 구조 보기"}
                    )
                  </span>
                </h3>
                <div
                  className="room-photo-main"
                  style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "260px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    border: "2px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={`${room.id}호 대표 사진`}
                      onClick={handleImageClick}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      title="클릭하여 객실 세부 공간 구조 페이지로 이동"
                    />
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#777",
                        padding: "20px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "6px",
                        }}
                      >
                        등록된 대표 사진이 없습니다.
                      </p>
                      {isAdmin ? (
                        <p style={{ fontSize: "13px", color: "#d32f2f" }}>
                          아래 파일 선택 버튼으로 관리자 전용 사진을 등록하세요.
                        </p>
                      ) : (
                        <p style={{ fontSize: "13px", color: "#999" }}>
                          관리자가 사진을 등록할 때까지 대기해주세요.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: "#fff8e1",
                      borderRadius: "8px",
                      border: "1px solid #ffe082",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginBottom: "6px",
                        color: "#333",
                      }}
                    >
                      📷 [관리자 전용] 대표 사진 파일 선택/변경:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="detail-right">
              <div className="info-group large-info">
                <div className="room-header">
                  <h3 className="room-number-large">{room.id}호</h3>
                  <div
                    className={`status ${
                      room.available ? "available" : "unavailable"
                    }`}
                  >
                    {room.available ? "이용 가능" : "이용중"}
                  </div>
                </div>
              </div>

              <div className="info-group">
                <label>가격</label>
                <div className="room-price-large">
                  ₩{room.price ? room.price.toLocaleString() : "0"}
                  <span className="price-unit"> / Night</span>
                </div>
              </div>

              <div className="info-group">
                <label>객실정보</label>
                <p className="description">{room.description}</p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <button
                  onClick={handleImageClick}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#2b5c6b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  🏛️ 객실 세부 공간 및 구조{" "}
                  {isAdmin ? "편집/등록하기" : "상세보기"}
                </button>
              </div>

              <div className="detail-buttons">
                <button
                  className="btn-continue"
                  onClick={handleOpenKakaoPay}
                  disabled={!room.available}
                  style={{
                    backgroundColor: "#FEE500",
                    color: "#191919",
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "8px",
                    padding: "16px 24px",
                    cursor: room.available ? "pointer" : "not-allowed",
                    boxShadow: "0 4px 12px rgba(254, 229, 0, 0.4)",
                  }}
                >
                  결제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showKakaoModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "360px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 16px 32px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "2px solid #FEE500",
                paddingBottom: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    backgroundColor: "#FEE500",
                    color: "#000",
                    fontWeight: "900",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  pay
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#222",
                  }}
                >
                  카카오페이 결제
                </span>
              </div>
              <button
                onClick={() => setShowKakaoModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "13px", color: "#666" }}>
                상품명: M-TEL {room.id}호 예약
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#111",
                  marginTop: "4px",
                }}
              >
                ₩{room.price ? room.price.toLocaleString() : "80,000"}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                border: "2px solid #eee",
                borderRadius: "16px",
                padding: "16px",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              <img
                src={qrCodeUrl}
                alt="KakaoPay QR Code"
                style={{ width: "180px", height: "180px", display: "block" }}
              />
            </div>

            <div
              style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}
            >
              카카오톡 카메라/QR스캐너로 스캔 후<br />
              <strong>[결제 완료하기]</strong>를 눌러주세요.
            </div>

            <button
              onClick={handleCompleteKakaoPayment}
              disabled={isProcessing}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#FEE500",
                color: "#191919",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {isProcessing
                ? "카카오톡 결제 승인 중..."
                : "카카오페이 결제 완료하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetail;
