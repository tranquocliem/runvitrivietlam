// Phụ lục 3: Bảng tham khảo định mức giờ lao động trực tiếp cho sản phẩm công việc
// (Kèm theo Hướng dẫn số 13-HD/BTCTU ngày 26/10/2026 của Ban Tổ chức Thành ủy Cần Thơ)
// Đơn vị tính gốc: giờ/sản phẩm (tự động quy đổi x 60 = phút/sản phẩm khi áp dụng vào Biểu B1)

export const PHU_LUC_3_NORMS = [
  // I. Văn bản tham mưu, chính sách
  { id: 1, group: "I. Văn bản tham mưu, chính sách", name: "Đề án, nghị quyết, chỉ thị, quy chế, quy định, văn bản QPPL (xây dựng mới)", unit: "văn bản", simple: 40, normal: 80, complex: 160 },
  { id: 2, group: "I. Văn bản tham mưu, chính sách", name: "Sửa đổi, bổ sung các văn bản nêu tại mục 1", unit: "văn bản", simple: 16, normal: 32, complex: 80 },
  { id: 3, group: "I. Văn bản tham mưu, chính sách", name: "Chương trình, kế hoạch, hướng dẫn, phương án", unit: "văn bản", simple: 8, normal: 20, complex: 40 },
  { id: 4, group: "I. Văn bản tham mưu, chính sách", name: "Báo cáo sơ kết, tổng kết, chuyên đề", unit: "báo cáo", simple: 16, normal: 40, complex: 80 },
  { id: 5, group: "I. Văn bản tham mưu, chính sách", name: "Báo cáo 6 tháng, năm", unit: "báo cáo", simple: 8, normal: 16, complex: 32 },
  { id: 6, group: "I. Văn bản tham mưu, chính sách", name: "Báo cáo tháng, quý, đột xuất ngắn", unit: "báo cáo", simple: 2, normal: 4, complex: 8 },
  { id: 7, group: "I. Văn bản tham mưu, chính sách", name: "Tờ trình (kèm dự thảo văn bản)", unit: "tờ trình", simple: 4, normal: 8, complex: 16 },
  { id: 8, group: "I. Văn bản tham mưu, chính sách", name: "Quyết định cá biệt (kèm thẩm định hồ sơ)", unit: "quyết định", simple: 2, normal: 4, complex: 8 },
  { id: 9, group: "I. Văn bản tham mưu, chính sách", name: "Công văn chỉ đạo, hướng dẫn; thông báo, kết luận", unit: "văn bản", simple: 2, normal: 4, complex: 8 },
  { id: 10, group: "I. Văn bản tham mưu, chính sách", name: "Công văn trả lời, góp ý dự thảo", unit: "văn bản", simple: 1, normal: 2, complex: 4 },
  { id: 11, group: "I. Văn bản tham mưu, chính sách", name: "Ý kiến thẩm định, thẩm tra, phản biện chuyên môn", unit: "ý kiến", simple: 4, normal: 8, complex: 24 },

  // II. Hồ sơ nghiệp vụ, thủ tục hành chính
  { id: 12, group: "II. Hồ sơ nghiệp vụ, thủ tục hành chính", name: "Tiếp nhận, kiểm tra, trả kết quả hồ sơ (bộ phận một cửa, văn thư)", unit: "hồ sơ", simple: 0.5, normal: 1, complex: 2 },
  { id: 13, group: "II. Hồ sơ nghiệp vụ, thủ tục hành chính", name: "Giải quyết hồ sơ thủ tục hành chính, cấp phép, chứng nhận", unit: "hồ sơ", simple: 1, normal: 3, complex: 8 },
  { id: 14, group: "II. Hồ sơ nghiệp vụ, thủ tục hành chính", name: "Thẩm định dự án, quy hoạch, thiết kế, phương án kỹ thuật", unit: "hồ sơ", simple: 8, normal: 16, complex: 40 },
  { id: 15, group: "II. Hồ sơ nghiệp vụ, thủ tục hành chính", name: "Hồ sơ hợp tác, thỏa thuận, đối ngoại", unit: "hồ sơ", simple: 4, normal: 8, complex: 24 },

  // III. Tổ chức, cán bộ, đảng viên, đoàn viên, hội viên
  { id: 16, group: "III. Tổ chức, cán bộ, đảng viên, đoàn viên, hội viên", name: "Nhận xét, đánh giá, cập nhật hồ sơ cán bộ, công chức, viên chức", unit: "hồ sơ", simple: 2, normal: 4, complex: 8 },
  { id: 17, group: "III. Tổ chức, cán bộ, đảng viên, đoàn viên, hội viên", name: "Tuyển dụng, quy hoạch, bổ nhiệm, điều động, luân chuyển", unit: "hồ sơ", simple: 8, normal: 16, complex: 40 },
  { id: 18, group: "III. Tổ chức, cán bộ, đảng viên, đoàn viên, hội viên", name: "Giải quyết chế độ, chính sách", unit: "hồ sơ", simple: 1, normal: 3, complex: 6 },
  { id: 19, group: "III. Tổ chức, cán bộ, đảng viên, đoàn viên, hội viên", name: "Hồ sơ đảng viên, tổ chức đảng; đoàn viên, hội viên", unit: "hồ sơ", simple: 1, normal: 3, complex: 8 },
  { id: 20, group: "III. Tổ chức, cán bộ, đảng viên, đoàn viên, hội viên", name: "Thẩm tra, xác minh, bảo vệ chính trị nội bộ", unit: "hồ sơ", simple: 8, normal: 16, complex: 40 },

  // IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư
  { id: 21, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Cuộc kiểm tra, giám sát, thanh tra", unit: "cuộc", simple: 8, normal: 16, complex: 40 },
  { id: 22, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Kết luận, kiến nghị sau kiểm tra, giám sát", unit: "văn bản", simple: 4, normal: 8, complex: 24 },
  { id: 23, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Theo dõi, đôn đốc thực hiện kết luận", unit: "đợt", simple: 1, normal: 2, complex: 6 },
  { id: 24, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Khảo sát, kiểm tra thực tế, hiện trường", unit: "đợt", simple: 4, normal: 8, complex: 24 },
  { id: 25, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Tiếp công dân; tiếp nhận, phân loại đơn thư", unit: "lượt/đơn", simple: 0.5, normal: 1, complex: 2 },
  { id: 26, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Giải quyết khiếu nại, tố cáo, phản ánh, vụ việc", unit: "vụ việc", simple: 8, normal: 24, complex: 80 },
  { id: 27, group: "IV. Kiểm tra, giám sát, thanh tra, giải quyết đơn thư", name: "Xử lý kỷ luật, xử lý vi phạm hành chính", unit: "hồ sơ", simple: 2, normal: 6, complex: 16 },

  // V. Tài chính, tài sản
  { id: 28, group: "V. Tài chính, tài sản", name: "Dự toán, quyết toán, kế hoạch tài chính", unit: "hồ sơ", simple: 4, normal: 8, complex: 24 },
  { id: 29, group: "V. Tài chính, tài sản", name: "Mua sắm, đấu thầu, hợp đồng, nghiệm thu", unit: "hồ sơ", simple: 2, normal: 6, complex: 16 },
  { id: 30, group: "V. Tài chính, tài sản", name: "Chứng từ kế toán, thanh toán", unit: "chứng từ", simple: 0.25, normal: 0.5, complex: 1.5 },
  { id: 31, group: "V. Tài chính, tài sản", name: "Kiểm kê, điều chuyển, thanh lý tài sản", unit: "hồ sơ", simple: 1, normal: 2, complex: 6 },

  // VI. Số liệu, văn thư, lưu trữ
  { id: 32, group: "VI. Số liệu, văn thư, lưu trữ", name: "Tổng hợp, xử lý số liệu thống kê", unit: "bộ số liệu", simple: 2, normal: 4, complex: 12 },
  { id: 33, group: "VI. Số liệu, văn thư, lưu trữ", name: "Lập bảng, danh sách; cập nhật cơ sở dữ liệu", unit: "bảng/đợt", simple: 0.5, normal: 1.5, complex: 4 },
  { id: 34, group: "VI. Số liệu, văn thư, lưu trữ", name: "Lập hồ sơ, chỉnh lý, lưu trữ tài liệu", unit: "hồ sơ", simple: 1, normal: 2, complex: 6 },
  { id: 35, group: "VI. Số liệu, văn thư, lưu trữ", name: "Tra cứu, cung cấp thông tin, tài liệu", unit: "lượt", simple: 0.25, normal: 0.5, complex: 2 },

  // VII. Hội nghị, vận động, tuyên truyền, đào tạo
  { id: 36, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Tổ chức hội nghị, cuộc họp (đơn vị chủ trì)", unit: "cuộc", simple: 4, normal: 8, complex: 16 },
  { id: 37, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Đại hội, kỳ họp, sự kiện, phong trào lớn", unit: "sự kiện", simple: 8, normal: 24, complex: 80 },
  { id: 38, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Tiếp xúc cử tri, đối thoại với nhân dân", unit: "cuộc", simple: 4, normal: 8, complex: 16 },
  { id: 39, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Tổ chức lớp tập huấn, bồi dưỡng", unit: "lớp", simple: 8, normal: 16, complex: 40 },
  { id: 40, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Bài phát biểu, tham luận phục vụ lãnh đạo", unit: "bài", simple: 2, normal: 4, complex: 8 },
  { id: 41, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Tin, bài, ấn phẩm, tài liệu tuyên truyền", unit: "sản phẩm", simple: 1, normal: 2, complex: 6 },
  { id: 42, group: "VII. Hội nghị, vận động, tuyên truyền, đào tạo", name: "Đoàn công tác, tiếp khách, đối ngoại", unit: "đoàn/cuộc", simple: 2, normal: 4, complex: 12 },

  // VIII. Hỗ trợ, phục vụ
  { id: 43, group: "VIII. Hỗ trợ, phục vụ", name: "Ca trực, bảo vệ, vận hành hệ thống", unit: "ca", simple: 4, normal: 8, complex: 12 },
  { id: 44, group: "VIII. Hỗ trợ, phục vụ", name: "Lái xe, phục vụ, hậu cần", unit: "lượt", simple: 1, normal: 2, complex: 4 },
  { id: 45, group: "VIII. Hỗ trợ, phục vụ", name: "Hỗ trợ kỹ thuật, CNTT, bảo trì thiết bị", unit: "lượt", simple: 0.5, normal: 1, complex: 2 },
];

export const UNIT_TYPES = [
  {
    code: "MN",
    id: 1,
    name: "Trường Mầm non (công lập thuộc UBND cấp xã)",
    shortName: "Trường Mầm non",
    prefixA1: "XXX-SN-A1-MN-",
    prefixVTVL: "XXX-MN-",
    description: "Nuôi dưỡng, chăm sóc, giáo dục trẻ từ 03 tháng đến 06 tuổi; phổ cập GDMN",
    defaultHoursNote: "Giáo viên MN: Định mức giờ dạy/ngày theo TT 06/2015/TTLT-BGDĐT-BNV (quy đổi ~1.760 - 1.904 giờ/năm); Hành chính/Hỗ trợ: 1.904 giờ/năm",
  },
  {
    code: "TH",
    id: 2,
    name: "Trường Tiểu học (công lập thuộc UBND cấp xã)",
    shortName: "Trường Tiểu học",
    prefixA1: "XXX-SN-A1-TH-",
    prefixVTVL: "XXX-TH-",
    description: "Dạy học, giáo dục cấp tiểu học (23 tiết/tuần × 35 tuần); phổ cập GD tiểu học",
    defaultHoursNote: "Giáo viên TH: Chế độ làm việc 40 giờ/tuần (định mức 23 tiết/tuần theo TT 28/2009 & TT 05/2025/TT-BGDĐT); Hành chính/Hỗ trợ: 1.904 giờ/năm",
  },
  {
    code: "THCS",
    id: 3,
    name: "Trường Trung học cơ sở (công lập thuộc UBND cấp xã)",
    shortName: "Trường THCS",
    prefixA1: "XXX-SN-A1-THCS-",
    prefixVTVL: "XXX-THCS-",
    description: "Dạy học, giáo dục cấp THCS (19 tiết/tuần × 35 tuần); hướng nghiệp, phân luồng",
    defaultHoursNote: "Giáo viên THCS: Chế độ làm việc 40 giờ/tuần (định mức 19 tiết/tuần theo TT 05/2025/TT-BGDĐT); Hành chính/Hỗ trợ: 1.904 giờ/năm",
  },
  {
    code: "DVTH",
    id: 4,
    name: "Trung tâm Dịch vụ tổng hợp",
    shortName: "Trung tâm Dịch vụ tổng hợp",
    prefixA1: "XXX-SN-A1-DVTH-",
    prefixVTVL: "XXX-DVTH-",
    description: "Văn hóa, thể thao, truyền thanh, thư viện, khuyến nông, môi trường, công ích cấp xã",
    defaultHoursNote: "Mức chung phổ biến 40 giờ/tuần (1.904 giờ/người/năm)",
  },
  {
    code: "TYT",
    id: 5,
    name: "Trạm Y tế",
    shortName: "Trạm Y tế xã, phường",
    prefixA1: "XXX-SN-A1-TYT-",
    prefixVTVL: "XXX-TYT-",
    description: "Y tế dự phòng, khám chữa bệnh ban đầu, dân số, ATTP, bảo trợ xã hội tại xã/phường",
    defaultHoursNote: "Mức chung 1.904 giờ/năm (hoặc chế độ trực y tế đặc thù có văn bản xác nhận)",
  },
  {
    code: "BQLDA",
    id: 6,
    name: "Ban Quản lý dự án đầu tư xây dựng",
    shortName: "Ban QLDA đầu tư xây dựng",
    prefixA1: "XXX-SN-A1-BQLDA-",
    prefixVTVL: "XXX-BQLDA-",
    description: "Chủ đầu tư, quản lý dự án, giám sát thi công, quyết toán dự án đầu tư xây dựng",
    defaultHoursNote: "Mức chung phổ biến 40 giờ/tuần (1.904 giờ/người/năm)",
  },
];

export const SELF_CHECKLIST = [
  "Đã dùng đúng danh mục và tệp Excel chính thức; không tự sửa công thức, mã, hoặc các trang tính ẩn.",
  "Đã đối chiếu nguồn chức năng, nhiệm vụ, thẩm quyền còn hiệu lực; nội dung chuyển giao ghi rõ thời điểm.",
  "Nhiệm vụ A1, phần việc A2, sản phẩm và VTVL liên kết được; không cộng trùng hồ sơ và nhiệm vụ mẹ–con.",
  "Sản lượng B1 đúng kỳ 01/10/2025–30/9/2026; phút lao động có nguồn; không lấy thời hạn giải quyết thủ tục làm phút lao động.",
  "B2 chỉ tính tác động thực tế đã được kiểm chứng; không trừ giờ chuyển đổi số hai lần.",
  "C1, C2 phân biệt danh mục khung, vị trí phê duyệt và đề xuất; đối chiếu riêng công chức, viên chức.",
  "C3 có căn cứ cho PP1/PP2/PP3; không làm tròn cơ học hoặc lấy số người đang có thành nhu cầu.",
  "D1 ghi một người tại một nơi quản lý; phần giờ kiêm nhiệm có giải trình, thông tin cá nhân được bảo vệ (chỉ ghi mã nguồn lực).",
  "D2 thể hiện từng năm 2027–2031; đã xét bố trí lại, điều chuyển, đào tạo, dùng chung và dịch vụ thuê trước khi đề xuất tăng.",
  "Có danh sách phần chưa đủ căn cứ, người phụ trách và hạn bổ sung; có xác nhận của người đứng đầu đơn vị.",
  "Đặt tên file đúng quy định: Mã cơ quan_K2526_v[số phiên bản]_[ngày gửi].xlsx."
];

export const DROPDOWN_OPTIONS = {
  A1_STATUS: [
    "Tiếp tục thực hiện",
    "Mới tiếp nhận",
    "Đã chuyển giao",
    "Không còn thực hiện"
  ],
  B1_TIME_BASIS: [
    "Kiểm đếm, ước lượng thực tế",
    "Có định mức"
  ],
  B2_IMPACT_TYPE: [
    "Số hóa",
    "Cải tiến quy trình",
    "Thuê dịch vụ/đặt hàng",
    "Tự chủ",
    "Xã hội hóa",
    "Công việc mới phát sinh"
  ],
  B2_B1_BASIS: [
    "Đã đo sau thay đổi (không trừ)",
    "Trước thay đổi, có điều chỉnh"
  ],
  B2_STATUS: [
    "Ước lượng tham khảo",
    "Chưa kiểm chứng",
    "Đã kiểm chứng"
  ],
  B2_DEDUP: [
    "Chờ đối chiếu",
    "Đã đối chiếu"
  ],
  C1_STATUS: [
    "Tiếp tục sử dụng",
    "Cần cập nhật",
    "Đề nghị bổ sung",
    "Đề nghị sửa đổi",
    "Đề nghị bãi bỏ"
  ],
  C1_WORK_MODE: [
    "Phổ biến (40 giờ/tuần)",
    "Đặc thù"
  ],
  C1_VERIFY: [
    "Chưa kiểm chứng",
    "Đã kiểm chứng"
  ],
  C3_METHODS: [
    "PP1",
    "PP2",
    "PP3",
    "PP1+PP2",
    "PP1+PP3",
    "PP2+PP3",
    "PP1+PP2+PP3"
  ],
  C3_STATUS: [
    "Chưa đủ dữ liệu",
    "Tính thử",
    "Đã kiểm chứng",
    "Không áp dụng"
  ],
  D1_STATUS: [
    "Chưa kiểm chứng",
    "Đã kiểm chứng"
  ],
  D2_YEARS: [2027, 2028, 2029, 2030, 2031],
  D2_STATUS: [
    "Đang xây dựng",
    "Đã hoàn thành ở đơn vị",
    "Đã thẩm định",
    "Đã được quyết định"
  ]
};

