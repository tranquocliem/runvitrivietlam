"use client";

import React, { useState } from "react";
import { explainJobInDetail } from "@/utils/smartPreset";
import {
  BookOpen,
  Calculator,
  MousePointerClick,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Users,
  Clock,
  Award,
  Printer,
  Search,
  Sparkles,
} from "lucide-react";

export default function UserGuideTab({
  a1Rows = [],
  a2Rows = [],
  b1EvaluatedRows = [],
  c1Rows = [],
  onUpdateB1,
  onGoToStep,
}) {
  const [guideSection, setGuideSection] = useState("BEGINNER"); // "BEGINNER" | "FORMULA" | "JOBS_DICTIONARY"
  const [jobQuery, setJobQuery] = useState("");

  const b1Map = {};
  for (const r of b1EvaluatedRows) {
    if (r.A) b1Map[r.A] = r;
  }

  const c1Map = {};
  for (const r of c1Rows) {
    if (r.A) c1Map[r.A] = r;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Hướng dẫn */}
      <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg border border-blue-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Biên soạn: Trần Quốc Liêm – Chuyên viên TT DVTH xã Trường Long
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold leading-snug">
              Cẩm Nang Hướng Dẫn Sử Dụng Phần Mềm & Giải Thích Chi Tiết Cách Tính Từng Công Việc
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Được viết theo ngôn ngữ bình dân, dễ hiểu nhất dành cho anh/chị/em cán bộ, viên chức{" "}
              <strong className="text-white">không rành công nghệ hoặc không rành công thức Excel</strong>. Xem trực tiếp ngay trên phần mềm để biết mình đang nhập cái gì, đếm ở đâu và máy tính toán ra sao.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => onGoToStep && onGoToStep("A1_A2_B1")}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition cursor-pointer"
            >
              <span>Vào màn hình nhập liệu ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In hướng dẫn này / Lưu PDF</span>
            </button>
          </div>
        </div>

        {/* 3 nút chuyển chuyên mục hướng dẫn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-white/15">
          <button
            onClick={() => setGuideSection("BEGINNER")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              guideSection === "BEGINNER"
                ? "bg-white text-slate-950 shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <MousePointerClick className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Phần 1: Hướng dẫn thao tác từng bước (Cho người mới)</span>
          </button>

          <button
            onClick={() => setGuideSection("FORMULA")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              guideSection === "FORMULA"
                ? "bg-white text-slate-950 shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Phần 2: Giải thích các ô cần nhập & Công thức tính</span>
          </button>

          <button
            onClick={() => setGuideSection("JOBS_DICTIONARY")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              guideSection === "JOBS_DICTIONARY"
                ? "bg-white text-slate-950 shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Phần 3: Giải thích từng Nhiệm vụ & Công việc ({a2Rows.length} việc)
            </span>
          </button>
        </div>
      </div>

      {/* PHẦN 1: HƯỚNG DẪN SỬ DỤNG CHO NGƯỜI KHÔNG RÀNH CÔNG NGHỆ */}
      {guideSection === "BEGINNER" && (
        <div className="space-y-5">
          {/* Nguyên tắc vàng cho người sợ bấm nhầm */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
              <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>3 Điều Yên Tâm Tuyệt Đối Khi Dùng Phần Mềm Này (Không sợ bấm sai!)</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <li>
                <strong>Không bao giờ làm hỏng công thức Excel:</strong> Trong file Excel gốc có rất nhiều công thức ẩn. Nhưng trên phần mềm này, bạn chỉ việc gõ con số vào ô trắng, phần mềm sẽ tự cộng nhân chia giúp bạn.
              </li>
              <li>
                <strong>Tự động lưu ngay lập tức:</strong> Bạn gõ tới đâu, phần mềm tự động nhớ tới đó trên máy hoặc điện thoại của bạn. Lỡ tay tắt trình duyệt mở lại vẫn còn nguyên.
              </li>
              <li>
                <strong>Bấm nhầm có thể khôi phục ngay:</strong> Nếu muốn làm lại từ đầu, chỉ cần bấm nút có biểu tượng mũi tên xoay tròn <strong>(Khôi phục ban đầu)</strong> ở góc phải trên cùng.
              </li>
            </ul>
          </div>

          {/* 5 Bước Cầm Tay Chỉ Việc */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Quy Trình 5 Thao Tác Đơn Giản Nhất Để Hoàn Thành Hồ Sơ</span>
            </h2>

            <div className="space-y-4">
              {/* Thao tác 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Chọn Cơ quan / Đơn vị và Chọn Phần Việc của mình (Tại Bước 0)
                  </h3>
                </div>
                <div className="pl-9 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p>
                    • Khi mới mở phần mềm, bạn đang ở màn hình <strong>&ldquo;0. Chọn Đơn vị & Phạm vi&rdquo;</strong>. Mặc định hệ thống đã chọn sẵn <strong>Trung tâm Dịch vụ tổng hợp xã Trường Long</strong> (nếu làm cho Trường học, Trạm Y tế, Ban QLDA thì bấm vào thẻ tương ứng).
                  </p>
                  <p>
                    • <strong>Quan trọng nhất:</strong> Kéo xuống mục số 3 <em>(Chọn Phạm vi nhập liệu)</em>:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>
                      Nếu bạn là <strong>người tổng hợp chung cả đơn vị</strong>: Chọn <strong>&ldquo;Chế độ 1: Toàn bộ Đơn vị&rdquo;</strong>.
                    </li>
                    <li>
                      Nếu bạn là <strong>chuyên viên phụ trách 1 mảng / 1 Vị trí việc làm</strong> (ví dụ: Khuyến nông, Văn hóa - Thể thao, Kế toán...): Chọn <strong>&ldquo;Chế độ 2: Theo Vị trí việc làm&rdquo;</strong> rồi bấm vào tên vị trí của mình.
                    </li>
                    <li>
                      Nếu bạn <strong>chỉ muốn nhập cho đúng 1 công việc duy nhất</strong>: Chọn <strong>&ldquo;Chế độ 3: Chọn từng Công việc&rdquo;</strong> và tích vào công việc đó.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Thao tác 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Nhập Số lượng sản phẩm & Thời gian làm việc (Tại Bước 1–3: A1, A2, B1)
                  </h3>
                </div>
                <div className="pl-9 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p>
                    • Bấm vào thanh <strong>&ldquo;1–3. Nhiệm vụ & Khối lượng (A1, A2, B1)&rdquo;</strong> (trên điện thoại thì bấm nút <strong>A1–B1</strong> ở dưới đáy màn hình).
                  </p>
                  <p>
                    • Ở mỗi công việc, bạn chỉ cần điền <strong>4 ô quan trọng nhất</strong>:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                    <li>
                      <strong>Số SP/năm (Cột C):</strong> Trong 1 năm vừa qua (từ 01/10/2025 đến 30/9/2026), công việc này làm ra bao nhiêu văn bản / kế hoạch / hồ sơ / cuộc họp? Gõ con số vào (Ví dụ: <code>24</code>).
                    </li>
                    <li>
                      <strong>Phút/SP (Cột D):</strong> Trung bình để làm xong <strong>1 sản phẩm</strong> đó mất bao nhiêu phút? (Có thể bấm chữ <strong>&ldquo;Tra Phụ lục 3&rdquo;</strong> màu xanh ngay bên trên ô để chọn mức giờ chuẩn của Thành ủy, máy sẽ tự đổi ra số phút cho bạn!).
                    </li>
                    <li>
                      <strong>Giờ bổ sung/năm (Cột E):</strong> Cả năm có tốn thêm mấy giờ họp hành, đi cơ sở, rà soát phát sinh không? Nếu không có thì gõ số <code>0</code>, nếu có thì gõ số giờ (Ví dụ: <code>12</code>).
                    </li>
                    <li>
                      <strong>Nguồn xác định thời gian (Cột I):</strong> Ghi ngắn gọn căn cứ lấy số giờ (Nếu thấy khó viết, chỉ cần bấm vào <strong>nút chọn mẫu có sẵn</strong> ngay bên dưới ô đó là chữ tự nhảy vào!).
                    </li>
                  </ol>
                  <p className="text-emerald-800 font-semibold">
                    👉 Ngay khi bạn điền đủ 4 ô này, nhãn màu vàng <em>&ldquo;CHƯA NHẬP&rdquo;</em> bên góc phải sẽ lập tức biến thành màu xanh lá cây <strong>&ldquo;ĐẠT&rdquo;</strong>!
                  </p>
                </div>
              </div>

              {/* Thao tác 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Bước 4 (Biểu B2 – Chuyển đổi số): Giữ nguyên mặc định nếu đã đo thực tế
                  </h3>
                </div>
                <div className="pl-9 space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p>
                    • Tại <strong>Bước 4 (Tác động CĐS - B2)</strong>, mặc định phần mềm đã để trạng thái <strong>&ldquo;Ước lượng tham khảo&rdquo;</strong> (hiện chữ <em>THAM KHẢO – KHÔNG TÍNH</em>). Theo đúng Hướng dẫn 13-HD/BTCTU, trạng thái này đã <strong>Hợp lệ 100%</strong>, bạn không cần phải sửa gì thêm trừ khi đơn vị muốn trừ bớt giờ do áp dụng phần mềm mới.
                  </p>
                </div>
              </div>

              {/* Thao tác 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Chốt Số người cần bố trí (Tại Bước 5–6: C1, C2, C3) & Tạo Phương án 5 năm (Tại Bước 7: D1, D2)
                  </h3>
                </div>
                <div className="pl-9 space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p>
                    • Sang <strong>Bước 5–6 (C1, C2, C3)</strong>: Bạn chỉ cần bấm nút màu xanh lá <strong>&ldquo;Chuẩn hóa & Điền kết luận mẫu cho toàn bộ VTVL (C1 & C3 ĐẠT 100%)&rdquo;</strong> ở góc trên bên phải. Phần mềm sẽ tự động lấy tổng giờ ở Bước B1 chia cho <strong>1.904 giờ/năm</strong> để tính ra số người và điền sẵn câu giải trình chuẩn cho bạn. Bạn có thể sửa lại ô <strong>&ldquo;Kết luận cần bố trí (Cột J)&rdquo;</strong> theo đúng số người thực tế.
                  </p>
                  <p>
                    • Sang <strong>Bước 7 (D1, D2)</strong>: Bấm nút màu xanh lá <strong>&ldquo;Khởi tạo tự động Biểu D1 & Phương án 5 năm D2 từ kết quả C3&rdquo;</strong>. Phần mềm sẽ tự động sinh danh sách nhân sự ẩn danh (D1) và kế hoạch 5 năm 2027–2031 (D2) trong 1 giây!
                  </p>
                </div>
              </div>

              {/* Thao tác 5 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Xuất ra file Excel chuẩn để nộp (Tại Bước 8: Kiểm tra & Xuất Excel)
                  </h3>
                </div>
                <div className="pl-9 space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p>
                    • Sang <strong>Bước 8</strong>: Kiểm tra xem 6 thẻ biểu đã báo <strong>ĐẠT 100%</strong> chưa (nếu chưa, bấm nút <em>&ldquo;Tự động hoàn thiện...&rdquo;</em>).
                  </p>
                  <p>
                    • Sau đó bấm nút màu xanh lá <strong>&ldquo;Xuất file ...xlsx&rdquo;</strong>. Máy sẽ tải về đúng tệp Excel chuẩn của Ban Tổ chức Thành ủy / Sở Nội vụ đã được điền đầy đủ số liệu để bạn in ra trình ký hoặc gửi đi!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN 2: GIẢI THÍCH CÁC Ô NHẬP & CÔNG THỨC TÍNH TOÁN */}
      {guideSection === "FORMULA" && (
        <div className="space-y-5">
          {/* Giải thích ý nghĩa từng cột B1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>1. Giải Thích Chi Tiết Cách Tính Giờ Lao Động Tại Biểu B1 (Bước Quan Trọng Nhất)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mục đích của Biểu B1 là trả lời câu hỏi: <strong>&ldquo;Trong 1 năm (từ 01/10/2025 đến 30/9/2026), công việc này tốn tổng cộng bao nhiêu giờ làm việc?&rdquo;</strong>
            </p>

            {/* Hộp Công thức trực quan */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-950 text-white space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Công thức chuẩn trong file Excel (Tự động tính ở Cột F và Cột G):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="font-bold text-amber-300 mb-1">
                    Bước A: Tính Giờ theo Sản phẩm (Cột F)
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    Giờ SP (Cột F) = (Số SP/năm × Số phút/1 SP) ÷ 60
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    <em>Giải thích:</em> Lấy số lượng sản phẩm cả năm nhân với số phút làm 1 sản phẩm để ra tổng số phút, sau đó chia cho 60 phút để đổi ra <strong>giờ</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="font-bold text-emerald-300 mb-1">
                    Bước B: Tính Tổng Giờ Lao Động Cả Năm (Cột G)
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    Tổng giờ (Cột G) = Giờ SP (Cột F) + Giờ bổ sung (Cột E)
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    <em>Giải thích:</em> Cộng thêm số giờ họp hành, đi kiểm tra thực tế, chỉnh sửa nhiều vòng (Cột E) để ra tổng số giờ thực sự bỏ ra cho công việc đó trong 1 năm.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs sm:text-sm text-emerald-100">
                <strong>Ví dụ thực tế dễ hiểu:</strong> Công việc <em>&ldquo;Lập báo cáo định kỳ&rdquo;</em> một năm làm <strong>24 báo cáo</strong> (Cột C = 24). Mỗi báo cáo soạn mất <strong>180 phút</strong> tức 3 tiếng (Cột D = 180). Ngoài ra cả năm mất thêm <strong>12 giờ</strong> họp rà soát số liệu (Cột E = 12).
                <br />👉 Máy sẽ tự tính: <strong>Giờ SP = (24 × 180) ÷ 60 = 72 giờ</strong>. Cộng thêm 12 giờ bổ sung = <strong>Tổng cộng 84 giờ/năm (Cột G)</strong>.
              </div>
            </div>

            {/* Bảng giải thích từng ô nhập ở B1 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <th className="py-2.5 px-3 w-44">Tên ô trên màn hình</th>
                    <th className="py-2.5 px-3">Hiểu nôm na là gì?</th>
                    <th className="py-2.5 px-3">Lấy số ở đâu / Nhập thế nào để ĐẠT?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-800">
                      Số SP/năm (Cột C - B1)
                    </td>
                    <td className="py-3 px-3">
                      Số lượng đầu ra thực tế đã làm trong 1 năm (01/10/2025 – 30/9/2026).
                    </td>
                    <td className="py-3 px-3">
                      Đếm từ sổ công văn đi/đến, sổ kế hoạch, báo cáo tổng kết năm. Nhập số <strong>&ge; 0</strong> (không được để trống).
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-800">
                      Phút/SP (Cột D - B1)
                    </td>
                    <td className="py-3 px-3">
                      Thời gian trung bình (tính bằng <strong>phút</strong>) để làm hoàn chỉnh 01 sản phẩm.
                    </td>
                    <td className="py-3 px-3">
                      1 giờ = 60 phút (VD: 2 giờ thì nhập <code>120</code>; 4 giờ nhập <code>240</code>; 1 ngày 8 tiếng nhập <code>480</code>). Bấm nút <strong>&ldquo;Tra Phụ lục 3&rdquo;</strong> để chọn khung giờ chuẩn.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-800">
                      Giờ bổ sung/năm (Cột E - B1)
                    </td>
                    <td className="py-3 px-3">
                      Số <strong>giờ</strong> phụ thêm trong cả năm ngoài thời gian làm sản phẩm chính (họp triển khai, đi khảo sát thực địa, phối hợp...).
                    </td>
                    <td className="py-3 px-3">
                      Tính bằng <strong>giờ/năm</strong> (VD: <code>8</code>, <code>12</code>, <code>24</code>...). Nếu không phát sinh giờ phụ thì bắt buộc gõ số <code>0</code> (không để trống).
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-blue-800">
                      Nguồn số lượng SP (Cột H - B1)
                    </td>
                    <td className="py-3 px-3">
                      Nơi lưu trữ minh chứng cho con số ở Cột C.
                    </td>
                    <td className="py-3 px-3">
                      Ghi tên sổ/hệ thống (VD: <em>&ldquo;Sổ theo dõi văn bản đi/đến, báo cáo tổng kết kỳ 01/10/2025–30/9/2026&rdquo;</em>).
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-amber-800 bg-amber-50/50">
                      Nguồn xác định thời gian (Cột I - B1) *Bắt buộc
                    </td>
                    <td className="py-3 px-3 bg-amber-50/50">
                      Căn cứ vì sao bạn xác định số phút ở Cột D và số giờ ở Cột E.
                    </td>
                    <td className="py-3 px-3 bg-amber-50/50">
                      <strong>Không được để trống!</strong> Chỉ cần bấm vào nút <strong>&ldquo;Chọn mẫu 1&rdquo;</strong> hoặc <strong>&ldquo;+ Gợi ý nhanh dòng này&rdquo;</strong> ngay dưới ô nhập.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Giải thích cách quy đổi từ Giờ ra Số Người ở Biểu C1 & C3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>2. Cách Tính Quy Đổi Từ &ldquo;Tổng Giờ Làm Việc&rdquo; Sang &ldquo;Số Người Cần Bố Trí&rdquo; (Biểu C1 & C3)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  1 Người làm 1 năm được bao nhiêu giờ? (Biểu C1)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Theo quy định chung (làm việc 40 giờ/tuần, trừ ngày nghỉ lễ, phép năm), <strong>01 viên chức hành chính/chuyên môn làm việc chuẩn là 1.904 giờ/năm</strong>. (Đối với giáo viên Mầm non, Tiểu học, THCS có định mức tiết dạy riêng sẽ chọn chế độ <em>Đặc thù = 1.760 giờ/năm</em>).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  Công thức quy đổi Số người theo Giờ (PP2 - Biểu C3)
                </div>
                <div className="p-2 rounded-lg bg-white border border-indigo-200 font-mono font-bold text-indigo-900 text-center">
                  Số người (Cột G) = Tổng giờ VTVL ÷ 1.904
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Ví dụ: Vị trí <em>Viên chức Văn hóa - Thể thao</em> có 4 công việc, cộng lại hết <strong>3.808 giờ/năm</strong>. Lấy <code>3.808 ÷ 1.904 = 2,00 người</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  3 Phương pháp tính ở Biểu C3 (PP1, PP2, PP3)
                </div>
                <ul className="space-y-1 text-slate-700 leading-relaxed">
                  <li>
                    • <strong>PP1 (Định mức pháp lý):</strong> Tính theo khung cứng của Bộ/Ngành (VD: 1 Giám đốc, 2 Phó Giám đốc, hoặc định mức giáo viên/lớp).
                  </li>
                  <li>
                    • <strong>PP2 (Đo khối lượng giờ):</strong> Lấy Tổng giờ B1 chia cho 1.904 giờ.
                  </li>
                  <li>
                    • <strong>PP3 (Bố trí tối thiểu):</strong> Vị trí trực ca, y tế, văn thư bắt buộc phải có tối thiểu 1 người duy trì.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN 3: TỪ ĐIỂN GIẢI THÍCH TỪNG NHIỆM VỤ & TỪNG CÔNG VIỆC ĐANG CÓ TRONG ĐƠN VỊ */}
      {guideSection === "JOBS_DICTIONARY" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Giải Thích Chi Tiết & Hướng Dẫn Nhập Cho Từng Nhiệm Vụ (A1) & Công Việc (A2, B1)
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Giải nghĩa cụ thể cho toàn bộ <strong>{a1Rows.length} nhiệm vụ</strong> và <strong>{a2Rows.length} công việc</strong> đang hiển thị: đang đếm cái gì, khoảng số lượng hợp lý là bao nhiêu và công thức tính ra sao.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                placeholder="Tìm tên công việc để xem hướng dẫn..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-5">
            {a1Rows.map((a1, tIdx) => {
              const jobs = a2Rows.filter((a2) => {
                if (a2.B !== a1.A) return false;
                if (!jobQuery.trim()) return true;
                const q = jobQuery.toLowerCase();
                return (
                  String(a2.A || "").toLowerCase().includes(q) ||
                  String(a2.D || "").toLowerCase().includes(q) ||
                  String(a2.E || "").toLowerCase().includes(q)
                );
              });
              if (jobs.length === 0) return null;

              return (
                <div
                  key={a1.A}
                  className="rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/30 border border-blue-400/40 font-mono text-xs font-bold text-blue-200">
                          Nhiệm vụ {tIdx + 1}: {a1.A}
                        </span>
                        <span className="text-xs text-slate-300">({a1.C})</span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base mt-1">
                        {a1.B}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        <strong>Căn cứ pháp lý thực hiện:</strong> {a1.D} •{" "}
                        <strong>Tần suất:</strong> {a1.E}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {jobs.map((a2) => {
                      const b1 = b1Map[a2.A] || {};
                      const c1 = c1Map[a2.C] || {};
                      const detail = explainJobInDetail(a2);

                      const hasEntered = b1.C !== "" && b1.C !== undefined && b1.D !== "" && b1.D !== undefined;
                      const c = hasEntered ? Number(b1.C) || 0 : detail.suggested.C;
                      const d = hasEntered ? Number(b1.D) || 0 : detail.suggested.D;
                      const e = hasEntered ? Number(b1.E) || 0 : detail.suggested.E;
                      const f = Math.round(((c * d) / 60) * 100) / 100;
                      const g = Math.round((f + e) * 100) / 100;
                      const quyGio = Number(c1.E) || 1904;
                      const fte = Math.round((g / quyGio) * 1000) / 1000;

                      return (
                        <div key={a2.A} className="p-4 bg-white space-y-3 text-xs sm:text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold text-xs">
                                {a2.A}
                              </span>
                              <span className="font-bold text-slate-900">
                                {a2.D}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
                                VTVL: {c1.B || a2.C} ({a2.C})
                              </span>
                              {onUpdateB1 && b1.rowNum && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateB1(b1.rowNum, b1.A, {
                                      C: detail.suggested.C,
                                      D: detail.suggested.D,
                                      E: detail.suggested.E,
                                      H:
                                        b1.H ||
                                        "Hồ sơ/sổ/hệ thống nghiệp vụ của đơn vị; thống kê thực tế kỳ 01/10/2025–30/9/2026; người phụ trách xác nhận",
                                      I: detail.suggested.I,
                                      J: detail.suggested.J,
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  Áp dụng số gợi ý này
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">
                                📌 1. Đang nhập cái gì? (Sản phẩm đầu ra)
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                • <strong>Sản phẩm cụ thể:</strong> {a2.E}
                                <br />• <strong>Đơn vị đếm (Cột C):</strong> Đếm theo{" "}
                                <strong className="text-blue-700">{a2.F}</strong>
                                <br />• <strong>Yêu cầu:</strong> {a2.G}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">
                                ✍️ 2. Cách đếm & Gợi ý số liệu hợp lý
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                • <strong>Cột C (Số SP/năm):</strong> {detail.howToCountC}{" "}
                                <span className="text-emerald-700 font-semibold">
                                  ({detail.rangeC})
                                </span>
                                <br />• <strong>Cột D (Phút/1 SP):</strong> {detail.howToEstimateD}{" "}
                                <span className="text-blue-700 font-semibold">
                                  ({detail.rangeD})
                                </span>
                                <br />• <strong>Cột E (Giờ bổ sung):</strong> {detail.howToEstimateE}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1">
                              <div className="font-bold text-blue-950">
                                🧮 3. Minh họa phép tính ({hasEntered ? "Số bạn đã nhập" : "Theo số gợi ý"})
                              </div>
                              <p className="text-blue-900 leading-relaxed font-mono text-[11px]">
                                • <strong>Giờ SP (Cột F)</strong> = ({c} {a2.F} × {d} phút) ÷ 60 ={" "}
                                <strong>{f} giờ</strong>
                                <br />• <strong>Tổng giờ (Cột G)</strong> = {f}h + {e}h bổ sung ={" "}
                                <strong className="text-blue-700">{g} giờ/năm</strong>
                                <br />• <strong>Quy đổi người (PP2)</strong> = {g} ÷ {quyGio} ={" "}
                                <strong className="text-indigo-700">~{fte} người</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
