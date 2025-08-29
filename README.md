# LINE Dictionary Bot (Next.js)

โปรเจ็กต์นี้เป็นตัวอย่างการพัฒนา LINE Messaging API Bot ด้วย Next.js

## การติดตั้ง (Installation)

1. ติดตั้ง [Node.js](https://nodejs.org/) เวอร์ชัน 20 ขึ้นไป
2. ดาวน์โหลดโปรเจ็กต์และติดตั้งแพ็กเกจ

```bash
npm install
```

## ตัวแปรสภาพแวดล้อม (.env)

สร้างไฟล์ `.env` ในรากโปรเจ็กต์ พร้อมตัวอย่างค่าดังนี้

```bash
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_BOT_BASIC_ID=@your_bot_basic_id
```

- `LINE_CHANNEL_SECRET` และ `LINE_CHANNEL_ACCESS_TOKEN` สามารถดูได้จากหน้า **Messaging API** ใน LINE Developers Console
- `LINE_BOT_BASIC_ID` คือรหัสบอทพื้นฐานที่ใช้ให้ผู้ใช้เพิ่มเพื่อน

## คำสั่งรัน (Scripts)

| คำสั่ง | คำอธิบาย |
|--------|-----------|
| `npm run dev` | รันเซิร์ฟเวอร์โหมดพัฒนา |
| `npm run build` | สร้างไฟล์สำหรับรันในโหมดผลิตจริง |
| `npm start` | รันเซิร์ฟเวอร์จากไฟล์ที่ build แล้ว |
| `npm run lint` | ตรวจสอบโค้ดด้วย ESLint |

## วิธีค้นหา Line Bot ID และ QR Code

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. เลือก *Provider* และ *Messaging API channel* ของคุณ
3. ในเมนู **Basic settings** จะเห็นช่อง **Bot basic ID** สามารถนำค่าไปใช้ใน `.env`
4. ในเมนู **Messaging API** จะมีส่วน **QR code** ให้ดาวน์โหลดหรือคัดลอกลิงก์เพื่อให้ผู้ใช้เพิ่มเพื่อน

> QR Code และ Bot ID เป็นข้อมูลสำคัญในการเผยแพร่บอท หากต้องการใส่รูป QR code ในโปรเจ็กต์ ให้บันทึกรูปไว้ในโฟลเดอร์ `public/` แล้วใช้ในหน้าเว็บตามต้องการ
