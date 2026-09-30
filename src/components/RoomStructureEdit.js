// ===== src/components/RoomStructureEdit.js =====
import React, { useState } from "react";

function RoomStructureEdit({ room, onBack, isAdmin = false, onSaveStructure }) {
  const [structures, setStructures] = useState(room.structures || []);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemImage, setNewItemImage] = useState("");

  // 관리자 전용: 이미지 업로드 시 Canvas 압축 적용
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
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

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setNewItemImage(compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // 공간/구조 항목 추가
  const handleAddStructure = () => {
    if (!newItemName.trim()) {
      alert("공간 또는 물품 이름을 입력해 주세요.");
      return;
    }

    const updated = [
      ...structures,
      {
        id: Date.now(),
        name: newItemName,
        description: newItemDesc,
        image: newItemImage,
      },
    ];

    setStructures(updated);
    if (typeof onSaveStructure === "function") {
      onSaveStructure(room.id, updated);
    }

    setNewItemName("");
    setNewItemDesc("");
    setNewItemImage("");
  };

  // 공간/구조 항목 삭제
  const handleDeleteStructure = (id) => {
    const updated = structures.filter((item) => item.id !== id);
    setStructures(updated);
    if (typeof onSaveStructure === "function") {
      onSaveStructure(room.id, updated);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "30px 20px 120px 20px",
        boxSizing: "border-box",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* 🚀 [스마트 고정 뒤로가기 버튼] 스크롤해도 우측 하단에 항상 고정 */}
      <button
        onClick={onBack}
        style={{
          position: "fixed",
          bottom: "35px",
          right: "35px",
          backgroundColor: "#2b5c6b",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "16px 28px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.backgroundColor = "#1d414d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#2b5c6b";
        }}
      >
        <span style={{ fontSize: "20px" }}>←</span> 이전 화면으로 돌아가기
      </button>

      {/* 상단 헤더 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          borderBottom: "2px solid #eee",
          paddingBottom: "16px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "26px", color: "#2b5c6b" }}>
            {room.id}호 세부 공간 및 내부 보기
          </h2>
          <p style={{ margin: "6px 0 0 0", color: "#666", fontSize: "14px" }}>
            객실 내부의 배치, 가구, 편의시설 사진을 확인하실 수 있습니다.
          </p>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: "10px 18px",
            backgroundColor: "#f0f4f5",
            color: "#2b5c6b",
            border: "1px solid #2b5c6b",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← 돌아가기
        </button>
      </div>

      {/* 🛠️ 관리자 전용: 세부 공간/사진 추가 폼 */}
      {isAdmin && (
        <div
          style={{
            backgroundColor: "#fff8e1",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #ffe082",
            marginBottom: "30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{ margin: "0 0 14px 0", fontSize: "16px", color: "#d32f2f" }}
          >
            🛠️ [관리자 기능] 객실 내부 공간/사진 추가하기
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder="공간명 (예: 침실, 침대, 욕실, 테라스)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
            <input
              type="text"
              placeholder="공간 설명 (예: 퀸사이즈 침대 및 최고급 거위털 이불 구비)"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                📷 사진 등록:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ fontSize: "13px" }}
              />
            </div>

            {newItemImage && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={newItemImage}
                  alt="미리보기"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <button
              onClick={handleAddStructure}
              style={{
                marginTop: "10px",
                padding: "12px",
                backgroundColor: "#2b5c6b",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              + 공간 등록하기
            </button>
          </div>
        </div>
      )}

      {/* 🖼️ 세부 공간 카드 목록 보기 */}
      {structures.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "16px",
            color: "#888",
            border: "2px dashed #ddd",
          }}
        >
          <p style={{ fontSize: "18px", margin: 0 }}>
            등록된 세부 공간 사진이 없습니다.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {structures.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: "#aaa", fontSize: "13px" }}>
                    사진 없음
                  </span>
                )}
              </div>

              <div style={{ padding: "18px", flex: 1 }}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    color: "#111",
                  }}
                >
                  {item.name}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#555",
                    lineHeight: "1.5",
                  }}
                >
                  {item.description || "상세 설명이 없습니다."}
                </p>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteStructure(item.id)}
                    style={{
                      marginTop: "16px",
                      padding: "8px 12px",
                      backgroundColor: "#ffebee",
                      color: "#d32f2f",
                      border: "1px solid #ffcdd2",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    🗑️ 삭제하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomStructureEdit;
