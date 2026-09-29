// ===== src/data.js =====
// 역할: 객실 정보 및 이미지 데이터 관리

// 객실 기본 정보
export const roomsData = [
  {
    id: 101,
    name: "101호",
    price: 80000,
    available: true,
    description: "기본 더블룸 - 침대 2개, 침구류 완비",
    thumbnailLayout: "/images/layouts/room-101-thumbnail.png",
    roomPhoto: "/101.png",
    floorPlan: "/101_floor.png",
    amenities: [
      "에어컨/난방",
      "침구류 완비",
      "욕실용품",
      "WiFi 무료",
      "TV",
      "냉장고",
    ],
  },
  {
    id: 202,
    name: "202호",
    price: 80000,
    available: true,
    description: "기본 더블룸 - 침대 2개, 침구류 완비",
    thumbnailLayout: "/images/layouts/room-202-thumbnail.png",
    roomPhoto: "/202.png",
    floorPlan: "/202_floor.png",
    amenities: [
      "에어컨/난방",
      "침구류 완비",
      "욕실용품",
      "WiFi 무료",
      "TV",
      "냉장고",
    ],
  },
  {
    id: 303,
    name: "303호",
    price: 90000,
    available: true,
    description: "프리미엄 더블룸 - 침대 1개, 욕조 완비",
    thumbnailLayout: "/images/layouts/room-303-thumbnail.png",
    roomPhoto: "/303.png",
    floorPlan: "/303_floor.png",
    amenities: [
      "에어컨/난방",
      "침구류 완비",
      "욕실용품",
      "WiFi 무료",
      "TV",
      "냉장고",
      "욕조",
    ],
  },
  {
    id: 404,
    name: "404호",
    price: 50000,
    available: true,
    description: "싱글룸 - 침대 1개, 기본 편의시설",
    thumbnailLayout: "/images/layouts/room-404-thumbnail.png",
    roomPhoto: "/404.png",
    floorPlan: "/404_floor.png",
    amenities: [
      "에어컨/난방",
      "침구류 완비",
      "욕실용품",
      "WiFi 무료",
      "TV",
      "냉장고",
    ],
  },
  {
    id: 505,
    name: "505호",
    price: 50000,
    available: false,
    description: "싱글룸 - 침대 1개, 기본 편의시설",
    thumbnailLayout: "/images/layouts/room-505-thumbnail.png",
    roomPhoto: "/505.png",
    floorPlan: "/505_floor.png",
    amenities: [
      "에어컨/난방",
      "침구류 완비",
      "욕실용품",
      "WiFi 무료",
      "TV",
      "냉장고",
    ],
  },
  {
    id: 606,
    name: "606호",
    price: 50000,
    available: true,
    description: "싱글룸 - 침대 1개, 기본 편의시설",
    thumbnailLayout: "/images/layouts/room-606-thumbnail.png",
    roomPhoto: "/606.png",
    floorPlan: "/606_floor.png",
    amenities: [
      "에어컨/난방",
      "침구류 완비",
      "욕실용품",
      "WiFi 무료",
      "TV",
      "냉장고",
    ],
  },
];

// 사전예약 정보
export const preBookings = {
  PB001: 101,
  PB002: 202,
  PB003: 303,
  PB004: 404,
  PB005: 606,
};

// 관리자 저장 이미지 (localStorage에서 로드됨)
export const getAdminImages = () => {
  return JSON.parse(localStorage.getItem("adminRoomImages") || "{}");
};

export const saveAdminImages = (images) => {
  localStorage.setItem("adminRoomImages", JSON.stringify(images));
};
