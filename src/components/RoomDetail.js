// ===== src/components/RoomDetail.js =====
import React, { useState, useEffect } from "react";

function RoomDetail({
  room,
  onBack,
  onPaymentSuccess,
  initialPaidSuccess,
  isAdmin = true,
  onUpdateRoomImage,
  onUpdateRoomStatus, // 🆕 객실 상태 변경 콜백 함수
  onNavigateToStructure,
}) {
  const [isPaidSuccess, setIsPaidSuccess] = useState(
    initialPaidSuccess || false,
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("kakaopay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(180);

  // 💡 상태값 호환 처리 (기존 room.available 기준 하위호환)
  const currentStatus =
    room.status || (room.available ? "available" : "occupied");

  // 결제수단 목록
  const paymentMethods = [
    { id: "card", name: "신용카드", icon: "💳", color: "#333" },
    { id: "bank", name: "무통장 입금", icon: "🏦", color: "#333" },
    { id: "phone", name: "휴대폰 결제", icon: "📱", color: "#333" },
    {
      id: "naverpay",
      name: "네이버페이",
      icon: "N Pay",
      isTextLogo: true,
      logoColor: "#03C75A",
    },
    {
      id: "payco",
      name: "페이코",
      icon: "PAYCO",
      isTextLogo: true,
      logoColor: "#E61C24",
    },
    {
      id: "kakaopay",
      name: "카카오페이",
      icon: "💬 pay",
      isTextLogo: true,
      logoColor: "#FFEB00",
      textColor: "#000",
    },
    {
      id: "toss",
      name: "토스",
      icon: "🔵 toss",
      isTextLogo: true,
      logoColor: "#0064FF",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: "🍎Pay",
      isTextLogo: true,
      logoColor: "#000",
    },
  ];

  // ⏱️ QR 제한시간 타이머
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    let interval = null;
    if (showQrModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      alert("결제 시간이 초과되었습니다. 다시 시도해주세요.");
      setShowQrModal(false);
    }
    return () => clearInterval(interval);
  }, [showQrModal, timer]);

  // 🛠️ 관리자: 객실 상태 변경 처리
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (typeof onUpdateRoomStatus === "function") {
      onUpdateRoomStatus(room.id, newStatus);
    }
  };

  // 🟢 상태별 뱃지 스타일 & 라벨 정의
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return {
          label: "이용 가능",
          bg: "#e8f5e9",
          color: "#2e7d32",
          border: "#a5d6a7",
        };
      case "reserved":
        return {
          label: "예약 중",
          bg: "#fff3e0",
          color: "#ed6c02",
          border: "#ffe0b2",
        };
      case "occupied":
        return {
          label: "이용 중",
          bg: "#ffebee",
          color: "#d32f2f",
          border: "#ffcdd2",
        };
      default:
        return {
          label: "이용 가능",
          bg: "#e8f5e9",
          color: "#2e7d32",
          border: "#a5d6a7",
        };
    }
  };

  const statusStyle = getStatusBadge(currentStatus);

  // 결제 관련 동작
  const handleOpenPaymentFlow = () => setShowPaymentModal(true);

  const handleStartQrPayment = () => {
    setShowPaymentModal(false);
    setTimer(180);
    setShowQrModal(true);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowQrModal(false);

      if (typeof onPaymentSuccess === "function") {
        onPaymentSuccess(room.id);
      }
      setIsPaidSuccess(true);
    }, 1000);
  };

  // 🖼️ [수정됨] 이미지 자동 리사이징 및 압축 후 저장 (LocalStorage 용량 초과 방지)
  const handleImageChange = (e) => {
    if (!isAdmin) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Canvas를 이용해 이미지를 최대 너비/높이 800px로 압축 리사이징
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // 0.7 품질의 JPEG로 변환하여 용량을 획기적으로 줄임
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          if (typeof onUpdateRoomImage === "function") {
            onUpdateRoomImage(room.id, compressedBase64);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (typeof onNavigateToStructure === "function") {
      onNavigateToStructure(room.id);
    }
  };

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof onBack === "function") onBack();
  };

  const currentMethodObj = paymentMethods.find((m) => m.id === selectedMethod);

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
              <strong>{room.id}호</strong> 객실 결제가 정상 완료되었습니다.
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
                <h3>객실 대표 사진</h3>
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
                    />
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#777",
                        padding: "20px",
                      }}
                    >
                      등록된 대표 사진이 없습니다.
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
                      }}
                    >
                      📷 [관리자 전용] 대표 사진 변경:
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

                  {/* 🟢 객실 상태 뱃지 및 관리자 제어 셀렉터 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                      }}
                    >
                      {statusStyle.label}
                    </span>

                    {/* ⚙️ 관리자 전용 상태 조절 선택창 */}
                    {isAdmin && (
                      <select
                        value={currentStatus}
                        onChange={handleStatusChange}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          border: "1px solid #2b5c6b",
                          backgroundColor: "#f4f9fa",
                          color: "#2b5c6b",
                          cursor: "pointer",
                        }}
                      >
                        <option value="available">🟢 이용 가능</option>
                        <option value="reserved">🟠 예약 중</option>
                        <option value="occupied">🔴 이용 중</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-group">
                <label>가격</label>
                <div className="room-price-large">
                  ₩{room.price ? room.price.toLocaleString() : "0"}
                  <span className="price-unit"> </span>
                </div>
              </div>

              <div className="info-group">
                <label>객실정보</label>
                <p className="description">{room.description}</p>
              </div>

              <div className="detail-buttons" style={{ marginTop: "30px" }}>
                <button
                  onClick={handleOpenPaymentFlow}
                  disabled={currentStatus !== "available"}
                  style={{
                    width: "100%",
                    backgroundColor:
                      currentStatus === "available" ? "#2b5c6b" : "#ccc",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "10px",
                    padding: "18px",
                    cursor:
                      currentStatus === "available" ? "pointer" : "not-allowed",
                    boxShadow:
                      currentStatus === "available"
                        ? "0 4px 12px rgba(43, 92, 107, 0.3)"
                        : "none",
                  }}
                >
                  {currentStatus === "available"
                    ? "💳 예약 및 결제하기"
                    : currentStatus === "reserved"
                      ? "⏳ 현재 예약 중인 객실입니다"
                      : "🔒 현재 이용 중인 객실입니다"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 💳 1단계: 결제수단 선택 모달 */}
      {showPaymentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              width: "440px",
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "24px 20px",
              boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#111",
                }}
              >
                결제수단 선택
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
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
                backgroundColor: "#e8f3ff",
                borderRadius: "12px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                border: "1px solid #d0e4ff",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  backgroundColor: "#0066ff",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                5%
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#111",
                  }}
                >
                  간편결제 진행 안내
                </div>
                <div style={{ fontSize: "11px", color: "#555" }}>
                  결제 버튼 선택 후 QR 스캔을 통해 안전하게 결제됩니다.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {paymentMethods.map((item) => {
                const isSelected = selectedMethod === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMethod(item.id)}
                    style={{
                      height: "85px",
                      backgroundColor: "#fff",
                      border: isSelected
                        ? "2px solid #2b5c6b"
                        : "1px solid #e0e0e0",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 4px 10px rgba(43, 92, 107, 0.15)"
                        : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.isTextLogo ? (
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: "900",
                          color: item.logoColor || "#333",
                        }}
                      >
                        {item.icon}
                      </span>
                    ) : (
                      <span style={{ fontSize: "22px" }}>{item.icon}</span>
                    )}

                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isSelected ? "bold" : "500",
                        color: isSelected ? "#2b5c6b" : "#444",
                      }}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleStartQrPayment}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#2b5c6b",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {currentMethodObj?.name}(으)로 ₩
              {(room.price || 80000).toLocaleString()} 결제하기
            </button>
          </div>
        </div>
      )}

      {/* 📱 2단계: QR 코드 스캔 모달 */}
      {showQrModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10001,
          }}
        >
          <div
            style={{
              width: "380px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "28px 24px",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              ✕
            </button>

            <div
              style={{
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: "#f5f5f5",
                fontSize: "15px",
                fontWeight: "bold",
                marginBottom: "12px",
                color: currentMethodObj?.logoColor || "#2b5c6b",
              }}
            >
              {currentMethodObj?.name} 결제
            </div>

            <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>
              ₩{(room.price || 80000).toLocaleString()}
            </h3>
            <p
              style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}
            >
              스마트폰 카메라 또는 앱으로 QR코드를 스캔하세요.
            </p>

            <div
              style={{
                width: "200px",
                height: "200px",
                margin: "0 auto 16px auto",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "16px",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PAYMENT_ROOM_${room.id}_${selectedMethod}`}
                alt="결제 QR코드"
                style={{ width: "100%", height: "100%", borderRadius: "8px" }}
              />
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#d32f2f",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              ⏱️ 결제 남은시간: {formatTime(timer)}
            </p>

            <button
              onClick={handleCompletePayment}
              disabled={isProcessing}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#2b5c6b",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(43, 92, 107, 0.3)",
              }}
            >
              {isProcessing
                ? "결제 승인 확인 중..."
                : "📲 모바일에서 결제 완료했습니다"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetail;
