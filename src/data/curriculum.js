export const CURRICULUM = {
  grade4: {
    id: 'grade4',
    title: 'Toán Học Lớp 4',
    badge: 'Khám Phá Số Lớn & Phân Số',
    color: 'from-blue-500 to-indigo-600',
    topics: [
      {
        id: 'g4-numbers',
        name: 'Số Tự Nhiên & 4 Phép Tính',
        icon: 'Calculator',
        desc: 'Số có nhiều chữ số, triệu và lớp triệu, làm tròn số và các phép tính nhanh',
        questions: [
          {
            id: 'g4-q1',
            question: 'Số "Bảy mươi hai triệu không trăm linh năm nghìn bốn trăm" được viết là:',
            options: ['72 050 400', '72 005 400', '72 500 400', '7 205 400'],
            answerIndex: 1,
            hint: 'Lớp triệu có 72, lớp nghìn có 005 (không trăm linh năm), lớp đơn vị có 400.',
            explanation: 'Viết số theo từng lớp từ trái sang phải: Lớp triệu (72) -> Lớp nghìn (005) -> Lớp đơn vị (400) => 72 005 400.',
            visualType: 'place-value',
            visualData: { millions: 72, thousands: '005', units: '400' }
          },
          {
            id: 'g4-q2',
            question: 'Tính nhanh biểu thức: 25 × 78 × 4 = ?',
            options: ['7 800', '780', '19 500', '78 000'],
            answerIndex: 0,
            hint: 'Hãy nhóm 25 × 4 lại trước để được số tròn trăm (100).',
            explanation: 'Áp dụng tính chất kết hợp của phép nhân: (25 × 4) × 78 = 100 × 78 = 7 800.',
            visualType: 'tip-card',
            visualData: { rule: '25 × 4 = 100' }
          },
          {
            id: 'g4-q3',
            question: 'Làm tròn số 8 463 812 đến hàng trăm nghìn ta được số nào?',
            options: ['8 400 000', '8 500 000', '8 460 000', '9 000 000'],
            answerIndex: 1,
            hint: 'Chữ số hàng trăm nghìn là 4. Chữ số liền sau (hàng chục nghìn) là 6 (lớn hơn 5) nên ta làm tròn lên.',
            explanation: 'Xét chữ số hàng chục nghìn là 6 ≥ 5, ta cộng 1 vào chữ số hàng trăm nghìn (4 + 1 = 5) và thay các chữ số sau bằng 0 => 8 500 000.',
            visualType: 'round-num'
          },
          {
            id: 'g4-q4',
            question: 'Một xe tải chở 125 bao gạo, mỗi bao nặng 50 kg. Hỏi xe tải đó chở tất cả bao nhiêu tạ gạo?',
            options: ['62,5 tạ', '625 tạ', '6 250 tạ', '62 tạ'],
            answerIndex: 0,
            hint: 'Tính tổng khối lượng bằng kilôgam trước (125 × 50), sau đó đổi từ kg sang tạ (1 tạ = 100 kg).',
            explanation: 'Tổng số kg gạo xe chở là: 125 × 50 = 6 250 kg. Đổi sang tạ: 6 250 : 100 = 62,5 tạ (hoặc 62 tạ 50 kg).',
            visualType: 'unit-conv'
          }
        ]
      },
      {
        id: 'g4-fractions',
        name: 'Phân Số Kỳ Diệu',
        icon: 'PieChart',
        desc: 'Quy đồng, rút gọn và cộng trừ nhân chia phân số',
        questions: [
          {
            id: 'g4-q5',
            question: 'Rút gọn phân số 36/48 về phân số tối giản:',
            options: ['6/8', '9/12', '3/4', '4/5'],
            answerIndex: 2,
            hint: 'Cả tử số 36 và mẫu số 48 đều chia hết cho 12 (Ước chung lớn nhất).',
            explanation: 'Ta chia cả tử số và mẫu số cho 12: 36 : 12 = 3; 48 : 12 = 4. Vậy phân số tối giản là 3/4.',
            visualType: 'fraction',
            visualData: { num: 3, den: 4 }
          },
          {
            id: 'g4-q6',
            question: 'Tính: 2/5 + 3/10 = ?',
            options: ['5/15', '7/10', '1/2', '4/10'],
            answerIndex: 1,
            hint: 'Quy đồng mẫu số chung là 10: 2/5 = 4/10.',
            explanation: 'Quy đồng mẫu số: 2/5 = (2 × 2) / (5 × 2) = 4/10. Khi đó: 4/10 + 3/10 = 7/10.',
            visualType: 'fraction-math'
          },
          {
            id: 'g4-q7',
            question: 'Tìm phân số: 3/4 của 60 kg là bao nhiêu kilôgam?',
            options: ['45 kg', '40 kg', '50 kg', '35 kg'],
            answerIndex: 0,
            hint: 'Muốn tìm phân số của một số, ta lấy số đó nhân với phân số (hoặc lấy 60 chia 4 rồi nhân 3).',
            explanation: '60 × 3/4 = (60 : 4) × 3 = 15 × 3 = 45 kg.',
            visualType: 'fraction-word'
          },
          {
            id: 'g4-q8',
            question: 'Tính: (5/6) : (2/3) = ?',
            options: ['10/18', '5/4', '4/5', '15/12'],
            answerIndex: 1,
            hint: 'Chia một phân số cho một phân số là nhân với phân số đảo ngược.',
            explanation: '5/6 : 2/3 = 5/6 × 3/2 = (5 × 3) / (6 × 2) = 15/12 = 5/4.',
            visualType: 'fraction-div'
          }
        ]
      },
      {
        id: 'g4-geometry',
        name: 'Hình Học & Đo Lường Lớp 4',
        icon: 'Shapes',
        desc: 'Hình bình hành, hình thoi, góc nhọn, góc tù và góc bẹt',
        questions: [
          {
            id: 'g4-q9',
            question: 'Hình bình hành có độ dài đáy là 18 cm và chiều cao tương ứng là 10 cm. Diện tích của hình bình hành là:',
            options: ['90 cm²', '180 cm²', '360 cm²', '56 cm²'],
            answerIndex: 1,
            hint: 'Công thức diện tích hình bình hành: S = a × h (đáy nhân chiều cao cùng đơn vị đo).',
            explanation: 'Diện tích hình bình hành là: S = 18 × 10 = 180 (cm²).',
            visualType: 'parallelogram',
            visualData: { base: 18, height: 10 }
          },
          {
            id: 'g4-q10',
            question: 'Một hình thoi có độ dài hai đường chéo lần lượt là 12 cm và 16 cm. Diện tích hình thoi đó là:',
            options: ['192 cm²', '96 cm²', '48 cm²', '28 cm²'],
            answerIndex: 1,
            hint: 'Diện tích hình thoi bằng tích độ dài hai đường chéo chia cho 2: S = (m × n) : 2.',
            explanation: 'Diện tích hình thoi là: S = (12 × 16) : 2 = 192 : 2 = 96 (cm²).',
            visualType: 'rhombus',
            visualData: { d1: 12, d2: 16 }
          },
          {
            id: 'g4-q11',
            question: 'Góc tạo bởi hai kim đồng hồ lúc 3 giờ đúng là loại góc gì?',
            options: ['Góc nhọn', 'Góc vuông', 'Góc tù', 'Góc bẹt'],
            answerIndex: 1,
            hint: 'Lúc 3 giờ, kim ngắn chỉ số 3, kim dài chỉ số 12 tạo thành góc 90 độ.',
            explanation: 'Hai kim vuông góc với nhau tạo thành góc vuông (90°).',
            visualType: 'clock-angle'
          }
        ]
      },
      {
        id: 'g4-wordmath',
        name: 'Giải Toán Có Lời Văn (Tổng - Tỉ & Tổng - Hiệu)',
        icon: 'FileQuestion',
        desc: 'Bài toán kinh điển: Tìm 2 số khi biết Tổng & Tỉ số hoặc Tổng & Hiệu',
        questions: [
          {
            id: 'g4-q12',
            question: 'Hai bạn Lan và Mai có tất cả 45 quyển vở. Số vở của Lan bằng 2/3 số vở của Mai. Hỏi Mai có bao nhiêu quyển vở?',
            options: ['18 quyển', '27 quyển', '30 quyển', '15 quyển'],
            answerIndex: 1,
            hint: 'Vẽ sơ đồ: Lan 2 phần, Mai 3 phần. Tổng số phần bằng nhau là 2 + 3 = 5 phần.',
            explanation: 'Tổng số phần bằng nhau: 2 + 3 = 5 (phần). Giá trị 1 phần là: 45 : 5 = 9 (quyển). Số vở của Mai là: 9 × 3 = 27 (quyển).',
            visualType: 'ratio-bars',
            visualData: { p1: 2, p2: 3, total: 45 }
          },
          {
            id: 'g4-q13',
            question: 'Tổng của hai số là 150, hiệu của hai số đó là 30. Số lớn là bao nhiêu?',
            options: ['60', '75', '90', '120'],
            answerIndex: 2,
            hint: 'Công thức tìm số lớn khi biết tổng và hiệu: Số lớn = (Tổng + Hiệu) : 2.',
            explanation: 'Số lớn là: (150 + 30) : 2 = 180 : 2 = 90. (Số bé là: 90 - 30 = 60).',
            visualType: 'sum-diff'
          }
        ]
      }
    ]
  },
  grade5: {
    id: 'grade5',
    title: 'Toán Học Lớp 5',
    badge: 'Chinh Phục Số Thập Phân & Chuyển Động',
    color: 'from-amber-500 to-rose-600',
    topics: [
      {
        id: 'g5-decimals',
        name: 'Thế Giới Số Thập Phân',
        icon: 'Percent',
        desc: 'Đọc, viết, so sánh và 4 phép tính với số thập phân',
        questions: [
          {
            id: 'g5-q1',
            question: 'Chữ số 7 trong số thập phân 45,372 có giá trị là bao nhiêu?',
            options: ['7', '7/10', '7/100', '7/1000'],
            answerIndex: 2,
            hint: 'Sau dấu phẩy, vị trí thứ nhất là phần mười, vị trí thứ hai là phần trăm.',
            explanation: 'Chữ số 7 đứng ở hàng phần trăm nên có giá trị là 7/100 (tức 0,07).',
            visualType: 'decimal-place'
          },
          {
            id: 'g5-q2',
            question: 'Tính nhẩm: 4,75 × 100 = ?',
            options: ['47,5', '475', '4750', '0,0475'],
            answerIndex: 1,
            hint: 'Khi nhân một số thập phân với 100, ta chuyển dấu phẩy sang bên phải 2 chữ số.',
            explanation: 'Dịch dấu phẩy sang phải 2 chữ số: 4,75 -> 475.',
            visualType: 'shift-dot'
          },
          {
            id: 'g5-q3',
            question: 'Tính: 35,4 - 18,76 = ?',
            options: ['16,64', '16,74', '17,64', '16,36'],
            answerIndex: 0,
            hint: 'Viết thẳng cột dấu phẩy: coi 35,4 là 35,40 rồi trừ 18,76.',
            explanation: '35,40 - 18,76 = 16,64.',
            visualType: 'vertical-math'
          },
          {
            id: 'g5-q4',
            question: 'Tính: 15,6 : 6 = ?',
            options: ['2,4', '2,6', '26', '0,26'],
            answerIndex: 1,
            hint: '15 chia 6 được 2 dư 3, đánh dấu phẩy vào thương rồi hạ 6: 36 chia 6 được 6.',
            explanation: '15,6 : 6 = 2,6.',
            visualType: 'step-div'
          }
        ]
      },
      {
        id: 'g5-percentage',
        name: 'Tỉ Số Phần Trăm & Ứng Dụng',
        icon: 'TrendingUp',
        desc: 'Tính toán % chiết khấu, lãi suất, tỉ lệ tăng trưởng',
        questions: [
          {
            id: 'g5-q5',
            question: 'Lớp 5A có 40 học sinh, trong đó có 24 bạn nữ. Hỏi số bạn nữ chiếm bao nhiêu phần trăm học sinh cả lớp?',
            options: ['50%', '60%', '64%', '70%'],
            answerIndex: 1,
            hint: 'Tìm thương của số nữ và tổng học sinh: 24 : 40, rồi nhân với 100 và thêm ký hiệu %.',
            explanation: '24 : 40 = 0,6 = 60%. Vậy số học sinh nữ chiếm 60% cả lớp.',
            visualType: 'percent-circle',
            visualData: { percent: 60 }
          },
          {
            id: 'g5-q6',
            question: 'Một chiếc balo có giá niêm yết 250 000 đồng, nhân dịp khai giảng được giảm giá 20%. Số tiền được giảm là:',
            options: ['20 000 đồng', '50 000 đồng', '200 000 đồng', '25 000 đồng'],
            answerIndex: 1,
            hint: 'Tìm 20% của 250 000 đồng: lấy 250 000 × 20 : 100.',
            explanation: 'Số tiền giảm = 250 000 × 20% = 250 000 × 0,2 = 50 000 (đồng). Khách chỉ cần trả 200 000 đồng.',
            visualType: 'discount-tag'
          },
          {
            id: 'g5-q7',
            question: 'Tìm một số biết 30% của số đó là 72:',
            options: ['216', '240', '180', '21,6'],
            answerIndex: 1,
            hint: 'Muốn tìm số đó, ta lấy 72 chia cho 30 rồi nhân với 100 (hoặc 72 : 0,3).',
            explanation: 'Số cần tìm là: 72 : 30 × 100 = 2,4 × 100 = 240.',
            visualType: 'reverse-percent'
          }
        ]
      },
      {
        id: 'g5-geometry',
        name: 'Hình Học & Thể Tích Khối',
        icon: 'Box',
        desc: 'Hình thang, hình tròn, diện tích xung quanh & thể tích hình khối',
        questions: [
          {
            id: 'g5-q8',
            question: 'Một mảnh đất hình thang có đáy lớn 20 m, đáy bé 14 m và chiều cao 10 m. Diện tích mảnh đất đó là:',
            options: ['340 m²', '170 m²', '280 m²', '200 m²'],
            answerIndex: 1,
            hint: 'Muốn tính diện tích hình thang: Đáy lớn đáy nhỏ ta đem cộng vào, cộng vào nhân với chiều cao, chia đôi lấy nửa thế nào cũng ra.',
            explanation: 'Diện tích mảnh đất: S = ((20 + 14) × 10) : 2 = (34 × 10) : 2 = 170 (m²).',
            visualType: 'trapezoid',
            visualData: { a: 20, b: 14, h: 10 }
          },
          {
            id: 'g5-q9',
            question: 'Một hình tròn có bán kính r = 5 cm. Diện tích của hình tròn đó là:',
            options: ['31,4 cm²', '78,5 cm²', '15,7 cm²', '25 cm²'],
            answerIndex: 1,
            hint: 'Công thức diện tích hình tròn: S = r × r × 3,14.',
            explanation: 'Diện tích hình tròn: S = 5 × 5 × 3,14 = 25 × 3,14 = 78,5 (cm²).',
            visualType: 'circle',
            visualData: { r: 5 }
          },
          {
            id: 'g5-q10',
            question: 'Một bể nước dạng hình hộp chữ nhật có chiều dài 2 m, chiều rộng 1,5 m và chiều cao 1,2 m. Bể đó chứa được tối đa bao nhiêu lít nước? (Biết 1 dm³ = 1 lít)',
            options: ['3,6 lít', '360 lít', '3 600 lít', '36 000 lít'],
            answerIndex: 2,
            hint: 'Thể tích hình hộp chữ nhật: V = a × b × c (đổi kích thước ra đề-xi-mét hoặc tính m³ rồi đổi sang lít, 1 m³ = 1000 lít).',
            explanation: 'Thể tích bể = 2 × 1,5 × 1,2 = 3,6 (m³). Đổi 3,6 m³ = 3 600 dm³ = 3 600 lít nước.',
            visualType: 'cuboid',
            visualData: { l: 2, w: 1.5, h: 1.2 }
          }
        ]
      },
      {
        id: 'g5-motion',
        name: 'Toán Chuyển Động Đều (s = v × t)',
        icon: 'Activity',
        desc: 'Vận tốc, quãng đường, thời gian, hai chuyển động cùng chiều và ngược chiều',
        questions: [
          {
            id: 'g5-q11',
            question: 'Một ô tô đi quãng đường 135 km hết 2 giờ 30 phút. Vận tốc của ô tô đó là:',
            options: ['50 km/h', '54 km/h', '60 km/h', '45 km/h'],
            answerIndex: 1,
            hint: 'Đổi 2 giờ 30 phút = 2,5 giờ. Áp dụng công thức: v = s : t.',
            explanation: 'Đổi 2 giờ 30 phút = 2,5 giờ. Vận tốc của ô tô: v = 135 : 2,5 = 54 (km/h).',
            visualType: 'motion-car',
            visualData: { s: 135, t: '2.5h', v: 54 }
          },
          {
            id: 'g5-q12',
            question: 'Hai thành phố A và B cách nhau 180 km. Cùng lúc 7 giờ sáng, một ô tô đi từ A đến B với vận tốc 50 km/h và một xe máy đi từ B về A với vận tốc 40 km/h. Hai xe gặp nhau lúc mấy giờ?',
            options: ['8 giờ', '9 giờ', '9 giờ 30 phút', '10 giờ'],
            answerIndex: 1,
            hint: 'Hai chuyển động ngược chiều: Tổng vận tốc = 50 + 40 = 90 km/h. Thời gian gặp = Quãng đường : Tổng vận tốc.',
            explanation: 'Tổng vận tốc hai xe là: 50 + 40 = 90 (km/h). Thời gian hai xe đi để gặp nhau: 180 : 90 = 2 (giờ). Thời điểm gặp nhau: 7 giờ + 2 giờ = 9 giờ sáng.',
            visualType: 'meet-motion',
            visualData: { dist: 180, v1: 50, v2: 40 }
          }
        ]
      }
    ]
  }
};
