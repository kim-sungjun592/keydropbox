// ===== src/components/RoomStructureEdit.js =====
import React, { useState } from "react";

// 🖼️ 이미지 압축 유틸리티 함수
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

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };
    };
  });
};

function RoomStructureEdit({ room, onBack, isAdmin = true, onSaveStructure }) {
  const [structures, setStructures] = useState(
    room.structures && room.structures.length > 0
      ? room.structures
      : [
          {
            id: 1,
            name: "침실 (Bedroom)",
            image: "",
            description: "킹사이즈 침대 및 최고급 가구 배치",
          },
          {
            id: 2,
            name: "욕실 (Bathroom)",
            image: "",
            description: "독립형 욕조, 샤워 부스 및 어메니티 구비",
          },
        ],
  );

  // 🔑 구역 사진 선택 시 자동 압축 적용
  const handleZoneImageUpload = async (id, e) => {
    if (!isAdmin) return;
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedUrl = await compressImage(file);
        setStructures((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, image: compressedUrl } : item,
          ),
        );
      } catch (err) {
        alert("이미지 파일 압축 실패");
      }
    }
  };

  const handleZoneDescChange = (id, text) => {
    if (!isAdmin) return;
    setStructures((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, description: text } : item,
      ),
    );
  };

  const handleZoneNameChange = (id, name) => {
    if (!isAdmin) return;
    setStructures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item)),
    );
  };

  const handleAddZone = () => {
    if (!isAdmin) return;
    const newZone = {
      id: Date.now(),
      name: `새 공간 구역 ${structures.length + 1}`,
      image: "",
      description: "구역 설명을 입력해 주세요.",
    };
    setStructures([...structures, newZone]);
  };

  const handleDeleteZone = (id) => {
    if (!isAdmin) return;
    setStructures((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (typeof onSaveStructure === "function") {
      onSaveStructure(room.id, structures);
    }
    alert("객실 세부 구조 저장이 완료되었습니다.");
    onBack();
  };

  return (
    <div style={{ padding: "30px", maxWidth: "960px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "2px solid #2b5c6b",
          paddingBottom: "12px",
        }}
      >
        <h2>
          🏛️ {room.id}호 객실 세부 공간 구조{" "}
          {isAdmin ? (
            <span style={{ fontSize: "16px", color: "#d32f2f" }}>
              (관리자 편집 모드)
            </span>
          ) : (
            <span style={{ fontSize: "16px", color: "#2b5c6b" }}>
              (상세보기)
            </span>
          )}
        </h2>
        <button
          onClick={onBack}
          style={{
            padding: "8px 18px",
            backgroundColor: "#555",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← 돌아가기
        </button>
      </div>

      {!isAdmin && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          ℹ️ 일반 사용자 조회 모드입니다. 관리자가 등록한 세부 구조 사진과
          설명을 확인할 수 있습니다.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        {structures.map((zone) => (
          <div
            key={zone.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "14px",
              padding: "20px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            {isAdmin ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) =>
                    handleZoneNameChange(zone.id, e.target.value)
                  }
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#2b5c6b",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    flex: 1,
                    marginRight: "8px",
                  }}
                />
                <button
                  onClick={() => handleDeleteZone(zone.id)}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            ) : (
              <h3 style={{ marginTop: 0, color: "#2b5c6b" }}>{zone.name}</h3>
            )}

            <div
              style={{
                width: "100%",
                height: "220px",
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "12px",
                border: "1px dashed #ccc",
              }}
            >
              {zone.image ? (
                <img
                  src={zone.image}
                  alt={zone.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#888", fontSize: "14px" }}>
                  등록된 세부 사진이 없습니다.
                </span>
              )}
            </div>

            {isAdmin && (
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "4px",
                    color: "#444",
                  }}
                >
                  📷 구역 사진 등록:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleZoneImageUpload(zone.id, e)}
                  style={{ fontSize: "12px" }}
                />
              </div>
            )}

            {isAdmin ? (
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "4px",
                    color: "#444",
                  }}
                >
                  📝 구역 설명:
                </label>
                <textarea
                  value={zone.description}
                  onChange={(e) =>
                    handleZoneDescChange(zone.id, e.target.value)
                  }
                  style={{
                    width: "100%",
                    height: "70px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ) : (
              <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.5" }}>
                {zone.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleAddZone}
            style={{
              padding: "12px 20px",
              backgroundColor: "#666",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + 구역 추가하기
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "12px 28px",
              backgroundColor: "#2b5c6b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            💾 구조 데이터 저장 완료
          </button>
        </div>
      )}
    </div>
  );
}

export default RoomStructureEdit;
