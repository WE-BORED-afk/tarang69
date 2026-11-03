---
name: ตารางเรียน ม.6/9 Design System
description: Visual design tokens and component guidelines for Room 6/9 High School Schedule
colors:
  primary: "#4f46e5"
  primary-hover: "#4338ca"
  ink-heavy: "#0f172a"
  ink-body: "#334155"
  ink-muted: "#64748b"
  surface-card: "#ffffff"
  surface-backdrop: "rgba(255, 255, 255, 0.88)"
  border-subtle: "#e2e8f0"
  mon-yellow: "#fde047"
  tue-pink: "#f9a8d4"
  wed-green: "#86efac"
  thu-orange: "#fdba74"
  fri-blue: "#7dd3fc"
  break-purple: "#d8b4fe"
  lunch-rose: "#fecdd3"
typography:
  display:
    fontFamily: "'Kanit', sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Kanit', sans-serif"
    fontSize: "clamp(1rem, 1.5vw, 1.25rem)"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Kanit', 'Sarabun', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Kanit', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.02em"
rounded:
  sm: "0.5rem"
  md: "0.85rem"
  lg: "1.25rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
components:
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "1rem 1.25rem"
  badge:
    rounded: "{rounded.full}"
    padding: "0.15rem 0.6rem"
---

## 1. Overview

ระบบการออกแบบ (Design System) ของตารางเรียนห้อง ม.6/9 มุ่งเน้นการให้ข้อมูลตารางเรียนที่อ่านง่าย คมชัด และสดใสในสไตล์ Pastel Modern ผสมผสานความเป็นระเบียบทางวิชาการเข้ากับความสะดวกสบายในการใช้งานบนอุปกรณ์พกพา

## 2. Colors

- **Primary Accent (`#4f46e5`):** ใช้สำหรับปุ่มแอ็กชันหลัก, สถานะ In Progress, และไฮไลท์สำคัญ
- **Ink & Neutral (`#0f172a`, `#334155`, `#64748b`):** คอนทราสต์คมชัด อ่านง่ายบนพื้นหลังขาวและสีพาสเทล
- **Day Accents (สีประจำวัน):**
  - วันจันทร์ (Monday): เหลืองพาสเทล (`#fde047`, `#fef08a`)
  - วันอังคาร (Tuesday): ชมพูพาสเทล (`#f9a8d4`, `#fbcfe8`)
  - วันพุธ (Wednesday): เขียวพาสเทล (`#86efac`, `#bbf7d0`)
  - วันพฤหัสบดี (Thursday): ส้มพาสเทล (`#fdba74`, `#fed7aa`)
  - วันศุกร์ (Friday): ฟ้าพาสเทล (`#7dd3fc`, `#bae6fd`)
- **Event Tokens:** ม่วงพาสเทลสำหรับช่วงพักเบรกสั้น 20 นาที และชมพูพีช/โรสสำหรับช่วงพักกลางวัน 50 นาที

## 3. Typography

- **ฟอนต์หลัก:** Google Font **'Kanit'** สำหรับหัวข้อ คาบเรียน รหัสวิชา และปุ่มกด
- **ฟอนต์รอง:** **'Sarabun'** สำหรับคำอธิบายรายละเอียด เพื่อให้อ่านตัวหนังสือขนาดเล็กได้อย่างสบายตา
- **สัดส่วน:** หัวข้อชัดเจน เน้นน้ำหนัก Bold (700) และ SemiBold (600) แยกแยะความสำคัญของข้อมูลได้ในชั่วพริบตา

## 4. Elevation

- **พื้นผิว (Surface):** กระจกฝ้าโมเดิร์น (Backdrop blur 12px) ผสมพื้นหลังสีขาวโปร่งแสง 85-95%
- **เงา (Shadow):** เงาฟุ้งนุ่มนวล `0 10px 30px -5px rgba(0, 0, 0, 0.06)` พร้อมเส้นขอบขาวบาง 1-2px ให้มิติเหมือนกระจกลอย
- **ความลึกเมื่อ Hover/Active:** ขยายตัวเล็กน้อย (`scale-101`) พร้อมเงายกตัว เพื่อตอบสนองการแตะหรือคลิก

## 5. Components

- **Subject Cell (ช่องวิชาในตาราง):** มุมโค้งมน 0.85rem ขอบสีประจำวัน และจัดวางรหัสวิชา, ชื่อวิชา, ครูผู้สอนให้อยู่ตรงกลางอย่างสมดุล
- **Daily Timeline Item (การ์ดไทม์ไลน์รายวัน):** Step Indicator วงกลมทางซ้ายเชื่อมต่อด้วยเส้นแนวตั้ง พร้อมป้ายสถานะ `Completed` (เขียว), `In Progress` (ฟ้า), และ `Pending` (เทา)
- **Room Badge (ป้ายห้องเรียนเดินเรียน):** ป้าย Pill สีส้ม/เหลืองอ่อนระบุห้องเรียนเฉพาะ (เช่น 📍 ห้อง Lab 327, 📍 ห้องคอม 6)

## 6. Do's and Don'ts

- **Do:** ใช้สีพาสเทลที่กำหนดตามวันเสมอ เพื่อรักษาความคุ้นเคยและจดจำง่าย
- **Do:** ให้ความสำคัญกับความคมชัดของข้อความกับพื้นหลังเสมอ โดยเฉพาะเมื่ออยู่บนมือถือกลางแจ้ง
- **Don't:** อย่าใช้ขอบสีเข้มทึบหรือสีนีออนฉูดฉาดจนเสียสมดุลความเป็นพาสเทล
- **Don't:** อย่าลดขนาดตัวอักษรต่ำกว่า 12px บนสมาร์ตโฟน เพื่อป้องกันไม่ให้นักเรียนต้องคอยซูมหน้าจอ
