// ===== data.js =====
// 역할: 모텔의 모든 방 정보와 예약 데이터를 저장하는 데이터 파일
// 이미지 필드:
// - thumbnailLayout: 객실 선택 화면에서 사용할 소형 평면도 (카드에 표시)
// - detailLayout: 객실 상세정보 화면에서 사용할 대형 평면도
// - roomPhoto: 객실 실제 사진 (선택사항, 나중에 추가 가능)

// 객실 정보 데이터
export const roomsData = [
  {
    id: 101,
    name: "101호",
    price: 80000,
    available: true,
    description: "기본 더블룸 - 침대 1개, 침구류 완비",
    // 이미지 경로 - public/images 폴더에 이미지를 배치하면 자동으로 로드됨
    thumbnailLayout: "/images/layouts/room-101-thumbnail.png", // 객실 선택 화면용 (소형)
    detailLayout: "/images/layouts/room-101-detail.png", // 상세정보 화면용 (대형)
    roomPhoto: "/images/photos/room-101-photo.jpg", // 객실 사진 (선택사항)
  },
  {
    id: 202,
    name: "202호",
    price: 80000,
    available: true,
    description: "기본 더블룸 - 침대 1개, 침구류 완비",
    thumbnailLayout: "/images/layouts/room-202-thumbnail.png",
    detailLayout: "/images/layouts/room-202-detail.png",
    roomPhoto: "/images/photos/room-202-photo.jpg",
  },
  {
    id: 303,
    name: "303호",
    price: 90000,
    available: true,
    description: "프리미엄 더블룸 - 침대 1개, 욕조 완비",
    thumbnailLayout: "/images/layouts/room-303-thumbnail.png",
    detailLayout: "/images/layouts/room-303-detail.png",
    roomPhoto: "/images/photos/room-303-photo.jpg",
  },
  {
    id: 404,
    name: "404호",
    price: 50000,
    available: true,
    description: "싱글룸 - 침대 1개, 기본 편의시설",
    thumbnailLayout: "/images/layouts/room-404-thumbnail.png",
    detailLayout: "/images/layouts/room-404-detail.png",
    roomPhoto: "/images/photos/room-404-photo.jpg",
  },
  {
    id: 505,
    name: "505호",
    price: 50000,
    available: false, // 예약된 상태
    description: "싱글룸 - 침대 1개, 기본 편의시설",
    thumbnailLayout: "/images/layouts/room-505-thumbnail.png",
    detailLayout: "/images/layouts/room-505-detail.png",
    roomPhoto: "/images/photos/room-505-photo.jpg",
  },
  {
    id: 606,
    name: "606호",
    price: 50000,
    available: true,
    description: "싱글룸 - 침대 1개, 기본 편의시설",
    thumbnailLayout: "/images/layouts/room-606-thumbnail.png",
    detailLayout: "/images/layouts/room-606-detail.png",
    roomPhoto: "/images/photos/room-606-photo.jpg",
  },
];

// 사전예약 정보 (예약번호: 객실번호)
export const preBookings = {
  PB001: 101,
  PB002: 202,
  PB003: 303,
  PB004: 404,
  PB005: 606,
};
