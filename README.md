# ระบบการจัดการค่าใช้จ่าย

## ภาพรวมของโปรเจค

**ระบบการจัดการค่าใช้จ่าย** เป็นระบบที่ออกแบบมาเพื่อช่วยให้ผู้ใช้จัดการการเงินส่วนบุคคลได้อย่างมีประสิทธิภาพ ช่วยให้ผู้ใช้ติดตามรายรับและรายจ่าย จัดหมวดหมู่รายจ่าย และสร้างสรุปเพื่อวิเคราะห์นิสัยทางการเงินของตนเองและช่วยให้ตัดสินใจเกี่ยวกับรายจ่ายของตนได้อย่างชาญฉลาด

## ฟีเจอร์หลัก

- **ระบบ login**
- **ระบบเพิ่ม ลบ บัญชีใช้จ่าย**
- **ระบบเพิ่ม ลบ ประเภทของการใช้จ่าย**
- **ระบบสรุปยอดใช้จ่าย**
- **ระบบ filter เดือน, ปี, ประเภท, บัญชี**
- **ระบบแนบ transaction slip หรือหลักฐานการใช้จ่าย (เป็นไฟล์ภาพ)**
- **ระบบ note วา transaction นั้นทำอะไรและจัดการคำหยาบโดยให้แปลงคำหยาบเป็น *** แทน**

## แนวทางการพัฒนา

โปรเจคนี้พัฒนาโดยใช้ **TypeScript** และ **NodeJS(ExpressJS)** สำหรับBackend และ **MongoDB** สำหรับDatabase **TypeORM** ใช้สำหรับการโต้ตอบกับฐานข้อมูล

## ความคืบหน้าปัจจุบัน

### ฟีเจอร์ที่เสร็จสมบูรณ์ (ไม่มั่นใจว่าสมบูรณ์จริงมั้ย)

- **ระบบ login**
- **ระบบเพิ่ม ลบ บัญชีใช้จ่าย**
- **ระบบเพิ่ม ลบ ประเภทของการใช้จ่าย**
- **ระบบสรุปยอดใช้จ่าย**
- **ระบบ filter เดือน, ปี, ประเภท, บัญชี**
- **ระบบแนบ transaction slip หรือหลักฐานการใช้จ่าย (เป็นไฟล์ภาพ)**
- **ระบบ note วา transaction นั้นทำอะไรและจัดการคำหยาบโดยให้แปลงคำหยาบเป็น *** แทน**

## เป้าหมายความคืบหน้าในอนาคต

- **ระบบรองรับหลายภาษา (ไทย, อังกฤษ, … อื่นๆ.)**
- **ระบบจดจำ device ที่ทำการ login และสามารถกดออกจากระบบทุก device ได้ในการจัดการ security ของ account**

## วิธีเรียกใช้โปรเจ็กต์

1. Clone the repository:
```bash
git clone https://github.com/thiwakonsakunchao/EdVISORY.git
```
2. Directory server floder:
```bash
cd server
```
3. Install Package:
```bash
npm install
```
4. Start Project:
```bash
npm start
```
### คำแนะนำเพิ่มเติม
- **หมายเหตุ**: ต้องมีไฟล์.envด้วย ให้นำไฟล์.envไปไว้ในfolder server

# การทดสอบ API ด้วย Postman

## Login

### 1. User Registration

- **Method**: `POST`
- **Endpoint**: `/api/user/register`
- **Request Body**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
### 2. User Login

- **Method**: `POST`
- **Endpoint**: `/api/user/login`
- **Request Body**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
### 3. Check User Status (Authentication Status)

- **Method**: `GET`
- **Endpoint**: `/api/user/status`
- **Request Body**:
### 4. User Logout

- **Method**: `POST`
- **Endpoint**: `/api/user/logout`

## บัญชีใช้จ่าย

### 1. Add Account

- **Method**: `POST`
- **Endpoint**: `/api/accounts/add`
- **Request Body**:
```json
{
  "account_name": "Savings",
  "initial_balance": 1000
}
```
### 2. Delete Account

- **Method**: `DELETE`
- **Endpoint**: `/api/accounts/delete/:id`
- **URL Parameters**:  
   id = string // ID ของ Account
### 3. Get All Accounts

- **Method**: `GET`
- **Endpoint**: `/api/accounts/?page=&limit=`
- **URL Parameters**:  
  page = integer // เลขหน้า,  
  limit = integer //จำนวนข้อมูลที่จะแสดง

## ประเภทของการใช้จ่าย

### 1. Add Category

- **Method**: `POST`
- **Endpoint**: `/api/category/add`
- **Request Body**:
```json
{
  "category_name": "ของใช้"
}
```
### 2. Delete Category

- **Method**: `DELETE`
- **Endpoint**: `/api/category/delete/:id`
- **URL Parameters**:  
  id = string // ID ของ Category
### 3. Get All Categorys

- **Method**: `GET`
- **Endpoint**: `/api/category/?page=&limit=`
- **URL Parameters**:  
  page = integer // เลขหน้า,  
  limit = integer //จำนวนข้อมูลที่จะแสดง

## Transaction

### 1. Add Transaction

- **Method**: `POST`
- **Endpoint**: `/api/transaction/add`
- **Request Body (form-data)**:  
  Key:  
      - accountId // ID ของ Account  
      - categoryId // ID ของ Category  
      - amount // จำนวณเงิน  
      - slip // ปรับเป็น File แล้วเลือกรูปสลิป *อัพโหลดได้แค่ไฟล์รูป*  
      - description // เขียน description หรือ note เกี่ยวกับ transaciton นั้น
  ### 2. Delete Transaction

- **Method**: `DELETE`
- **Endpoint**: `/api/transaction/delete/:id`
- **URL Parameters**:  
  id = string // ID ของ Transaction
### 3. Get All Transactions

- **Method**: `GET`
- **Endpoint**: `/api/transaction/?year=&categoryId&accountId=&month=&page=&limit=`
- **URL Parameters**:  
  Key:  
      - accountId // ID ของ Account  
      - categoryId // ID ของ Category  
      - year // ปี ที่จะ Filter  
      - month // เดือน ที่จะ Filter  
      - page // เลขหน้า  
      - limit //จำนวนข้อมูลที่จะแสดง  
### 4. Add Image to Transaction

- **Method**: `POST`
- **Endpoint**: `/api/transaction/add-slip/:id`
- **Request Body (form-data)**:
  Key:
      slip // ปรับเป็น File แล้วเลือกรูปสลิป *อัพโหลดได้แค่ไฟล์รูป*
- **URL Parameters**:  
  Key:  
      id // ID ของ Transaction
### 5. Delete Image in Transaction

- **Method**: `DELETE`
- **Endpoint**: `/api/transaction/remove-slip/:id`
- **URL Parameters**:  
  Key:  
      id // ID ของ Transaction
- **Request Body**:
```json
{
  "slipUrl": "URL ของ รูป"
}
```
### 6. Description in Transaction

- **Method**: `POST`
- **Endpoint**: `/api/transaction/:id/description`
- **URL Parameters**:  
  Key:  
      id // ID ของ Transaction
- **Request Body**:
```json
{
  "description": "เหี้ยสัสครับผม"
}
```
### 7. Change Account in Transaction

- **Method**: `PATCH`
- **Endpoint**: `/api/transaction/:id/change/account`
- **URL Parameters**:  
  Key:  
      id // ID ของ Transaction
- **Request Body**:
```json
{
  "accountId": " ID ของ Account ที่ต้องการ"
}
```
### 8. Change Category in Transaction

- **Method**: `PATCH`
- **Endpoint**: `/api/transaction/:id/change/category`
- **URL Parameters**:  
  Key:  
      id // ID ของ Transaction
- **Request Body**:
```json
{
  "categoryId": " ID ของ Category ที่ต้องการ"
}
```
## สรุปยอดใช้จ่าย

### 1. สรุปยอดใช้จ่าย รายวัน รายเดือน รายปี

- **Method**: `GET`
- **Endpoint**: `/api/expense/summary?summaryType=`
- **URL Parameters**:  
  Key:  
      - summaryType // รายวันให้กรอก daily, รายเดือนให้กรอก monthly, รายปีให้กรอก yearly
  
## Export 

### 1. Export เป็นไฟล์ csv, excel, json

- **Method**: `GET`
- **Endpoint**: `/api/port/export?format=`
- **URL Parameters**:  
  Key:  
      format // ต้องการนามสกุลไฟล์อะไรให้กรอกเลย "csv, excel, json"
  
## Import

### 1. Import เป็นไฟล์ csv, json

- **Method**: `POST`
- **Endpoint**: `/api/port/import`
- **Request Body (from-data)**: file = อัพโหลดไฟล์ที่จะimport 

## เฉลี่ยเงินเหลือต่อเดือน

### 1. ฉลี่ยเงินเหลือต่อเดือนที่อิงจากtransactionที่ผูกกับaccountที่เราเลือก

- **Method**: `GET`
- **Endpoint**: `/api/calculate`
- **Request Body**:
```json
{
  "accountId": " ID ของ Account ที่ต้องการ"
}
```
