# 🖥️ PC Center – ศูนย์รวมคอมพิวเตอร์และอุปกรณ์ไอที

## 📌 CSI204 Project Hub
ระบบเว็บไซต์ขายคอมพิวเตอร์และอุปกรณ์ไอทีออนไลน์ (E-Commerce Platform)

---

## 📚 สารบัญ (Table of Contents)

1. [ข้อเสนอโครงงาน (Project Proposal)](#1-ข้อเสนอโครงงาน-project-proposal)
2. [Persona Design](#2-persona-design)
3. [การประยุกต์ใช้เครื่องมือในกระบวนการ SDLC](#3-การประยุกต์ใช้เครื่องมือในกระบวนการ-sdlc)
4. [Use Case Diagram](#4-use-case-diagram)
5. [Class Diagram](#5-class-diagram)
6. [แผนภาพลำดับการทำงาน (Sequence Diagram)](#6-แผนภาพลำดับการทำงาน-sequence-diagram)
7. [Wireframe และ Prototype](#7-wireframe-และ-prototype)
8. [System Architecture](#8-system-architecture)
9. [Tools & Technologies](#9-tools--technologies)
10. [Data Schema (JSON)](#10-data-schema-json)
11. [User Acceptance Testing](#11-user-acceptance-testing)

---

## 1. ข้อเสนอโครงงาน (Project Proposal)

* **ชื่อกลุ่ม:** PC Center
* **ชื่อโครงงาน (ภาษาไทย):** PC Center – ศูนย์รวมคอมพิวเตอร์และอุปกรณ์ไอที
* **ชื่อโครงงาน (ภาษาอังกฤษ):** PC Center – Online PC & IT Equipment Store

### 📝 ความเป็นมาและความสำคัญ (Background & Significance)
ปัจจุบันคอมพิวเตอร์และอุปกรณ์ไอทีมีความสำคัญอย่างมาก แต่ร้านค้าหลายแห่งยังขาดช่องทางออนไลน์ที่ช่วยให้ลูกค้าค้นหาและสั่งซื้อได้อย่างสะดวกรวดเร็ว โครงงานนี้จึงพัฒนาเว็บไซต์จำหน่ายอุปกรณ์ไอทีแบบครบวงจร ที่มีหน้าร้านทันสมัย ใช้งานง่าย เพื่อให้ลูกค้าเลือกซื้อสินค้าได้ตลอด 24 ชั่วโมง พร้อมทั้งพัฒนาระบบจัดการหลังบ้าน (Dashboard) ที่มีการแบ่งระดับสิทธิ์ผู้ใช้งานอย่างเป็นระบบ ซึ่งจะช่วยให้ร้านค้าสามารถบริหารจัดการสต็อกสินค้าและคำสั่งซื้อได้อย่างมีประสิทธิภาพ

### 👥 สมาชิกในกลุ่ม (Group Members)

| ลำดับ | รหัสนักศึกษา | ชื่อ-สกุล | หน้าที่รับผิดชอบ |
| :---: | :---: | :--- | :--- |
| 1 | 67090746 | นายธนากร ธิติพุทธปราสาท | Project Manager |
| 2 | 66097958 |นายยศพล เปี่ยมบางแวก | full stack dev |
| 3 | 66097807 | นายเป็นไท ศรีไชยมูล | full stack dev |

### 🎯 วัตถุประสงค์ (Objectives)
1. เพื่อออกแบบและพัฒนาเว็บไซต์อีคอมเมิร์ซสำหรับจำหน่ายอุปกรณ์คอมพิวเตอร์ ที่มีดีไซน์ทันสมัย ใช้งานง่าย
2. เพื่อพัฒนาระบบหน้าร้าน (Storefront) ที่ช่วยอำนวยความสะดวกให้ลูกค้าสามารถค้นหา กรองหมวดหมู่สินค้า จัดการตะกร้า และทำรายการสั่งซื้อได้อย่างรวดเร็ว
3. เพื่อพัฒนาระบบจัดการหลังบ้าน (Dashboard) ที่มีการแบ่งระดับสิทธิ์การเข้าถึง (Role-based Access Control) เพื่อให้ทีมงานสามารถบริหารจัดการสินค้า คำสั่งซื้อ และข้อมูลผู้ใช้ได้อย่างมีประสิทธิภาพ

### 🔍 ขอบเขตของโครงงาน (Project Scope)
* **Customer (ลูกค้า):**
  - ระบบสมัครสมาชิกและเข้าสู่ระบบ
  - ระบบค้นหาและกรองสินค้าตามหมวดหมู่
  - ระบบดูรายละเอียดสินค้า
  - ระบบจัดการตะกร้าสินค้า
  - ระบบสั่งซื้อสินค้าและชำระเงิน
  - ระบบติดตามสถานะคำสั่งซื้อและประวัติการสั่งซื้อ
  - ระบบติดต่อสอบถามและรีวิวสินค้า
* **Staff (พนักงาน):**
  - ระบบเข้าสู่ระบบ
  - ระบบดูรายการคำสั่งซื้อทั้งหมด
  - ระบบอัปเดตสถานะคำสั่งซื้อ
* **Manager (ผู้จัดการ):**
  - ระบบจัดการหมวดหมู่สินค้า (เพิ่ม / แก้ไข / ลบ)
  - ระบบจัดการสต็อกสินค้า
  - ระบบดูข้อมูลลูกค้า (เช่น ที่อยู่ การติดต่อ)
  - ระบบจัดการผู้ใช้ระบบ (เพิ่ม / แก้ไข / ลบ / สิทธิ์)

### 📊 ความเป็นไปได้ของโครงงาน (Project Feasibility)
* **ด้านเทคนิค:** ใช้เทคโนโลยี Next.js ที่ผู้พัฒนาคุ้นเคยและมีแหล่งข้อมูลสนับสนุนครบถ้วน
* **ด้านงบประมาณ:** ใช้เครื่องมือฟรีทั้งหมด
* **ด้านเวลา:** สามารถพัฒนาให้เสร็จภายในระยะเวลาของรายวิชา

---

## 2. Persona Design

### 👤 Persona 1: Customer
Name: ลูกค้าทั่วไป / นักศึกษา / ผู้ใช้งานทั่วไป
Age: 18 - 35
Occupation: Student / Freelancer / Office Worker

Goals:
- ค้นหาและเปรียบเทียบสินค้า (CPU, GPU และอุปกรณ์คอมพิวเตอร์)
- สั่งซื้อสินค้าออนไลน์ได้สะดวก
- ติดตามสถานะคำสั่งซื้อของตนเอง

Pain Points:
- เดินทางไปร้านค้าไม่สะดวก
- ข้อมูลสินค้าไม่ครบถ้วน
- ไม่สามารถตรวจสอบสถานะคำสั่งซื้อได้ง่าย

Needs:
- เว็บไซต์ใช้งานง่าย
- ค้นหาและกรองสินค้าตามหมวดหมู่ได้
- มีรายละเอียดสินค้าชัดเจน
- จัดการตะกร้าสินค้าและสั่งซื้อออนไลน์ได้
- ติดตามสถานะคำสั่งซื้อได้

### 🧑‍💼 Persona 2: Staff
Name: พนักงานขาย / เจ้าหน้าที่ดูแลระบบ
Age: 22 - 40
Occupation: Sales Staff

Goals:
- ตรวจสอบคำสั่งซื้อของลูกค้า
- อัปเดตสถานะคำสั่งซื้อได้อย่างรวดเร็ว
- ดูข้อมูลลูกค้าเพื่อให้บริการได้สะดวก

Pain Points:
- การติดตามคำสั่งซื้อหลายรายการทำได้ยาก
- การค้นหาข้อมูลลูกค้าใช้เวลานาน

Needs:
- Dashboard แสดงภาพรวมของระบบ
- ระบบจัดการคำสั่งซื้อที่ใช้งานง่าย
- สามารถดูข้อมูลลูกค้าและอัปเดตสถานะคำสั่งซื้อได้

### 👨‍💼 Persona 3: Manager
Name: ผู้จัดการร้าน
Age: 30 - 50
Occupation: Store Manager / Business Owner

Goals:
- จัดการข้อมูลสินค้าและหมวดหมู่สินค้า
- บริหารจัดการสิทธิ์ผู้ใช้งานในระบบ
- ตรวจสอบการดำเนินงานของพนักงานและคำสั่งซื้อ

Pain Points:
- การจัดการสินค้าและผู้ใช้งานจำนวนมากใช้เวลานาน
- ต้องการควบคุมสิทธิ์การเข้าถึงของผู้ใช้งานแต่ละระดับ

Needs:
- ระบบหลังบ้านที่ใช้งานง่าย
- เพิ่ม แก้ไข และลบข้อมูลสินค้าและหมวดหมู่ได้
- จัดการสิทธิ์ผู้ใช้งาน (Role Management) ได้
- เข้าถึงทุกฟังก์ชันของ Staff และตรวจสอบข้อมูลภาพรวมของระบบได้

---

## 3. การประยุกต์ใช้เครื่องมือในกระบวนการ SDLC

ทีมของเราเลือกใช้เครื่องมือต่างๆ ในแต่ละขั้นตอนของการพัฒนาโปรเจกต์ (SDLC) ดังนี้:

### 3.1 Planning (การวางแผน)
* **เครื่องมือที่ใช้:** GitHub Projects, Discord
* **เหตุผล:** เราต้องการระบบที่ช่วยแบ่งงานให้คนในทีมและอัปเดตงานได้ง่ายๆ รวมถึงมีช่องทางไว้แชทคุยและประชุมงานกัน
* **การนำไปใช้งาน:** เราใช้ GitHub Projects เพื่อลิสต์ว่าใครต้องทำอะไรบ้าง และงานถึงไหนแล้ว ส่วน Discord เอาไว้พูดคุยและอัปเดตความคืบหน้าของทีม

### 3.2 Analysis & Design (การวิเคราะห์และออกแบบ)
* **เครื่องมือที่ใช้:** Figma, Mermaid.js
* **เหตุผล:** Figma ใช้งานง่ายและเหมาะกับการออกแบบหน้าจอเว็บ ส่วน Mermaid.js ช่วยให้เราเขียนแผนภาพระบบผ่านการเขียนโค้ดง่ายๆ (Markdown)
* **การนำไปใช้งาน:** เราใช้ Mermaid.js วาดแผนภาพการทำงานของระบบ (เช่น Use Case, Class, Sequence Diagram) และใช้ Figma ออกแบบโครงร่างเว็บ (Wireframe) รวมถึงทำตัวต้นแบบเว็บที่กดโต้ตอบได้จริง (Prototype)

### 3.3 Development (การพัฒนา)
* **เครื่องมือที่ใช้:** VS Code, Git/GitHub, Next.js, Tailwind CSS
* **เหตุผล:** เป็นกลุ่มเครื่องมือยอดฮิตที่ช่วยให้เราสร้างเว็บได้เร็วขึ้น และสามารถแชร์โค้ดทำงานร่วมกันหลายคนได้อย่างเป็นระบบ
* **การนำไปใช้งาน:** ทีมใช้ VS Code เพื่อเขียนโค้ดตัวเว็บด้วยเฟรมเวิร์ก Next.js แล้วตกแต่งความสวยงามด้วย Tailwind CSS จากนั้นจะส่งโค้ดทั้งหมดไปรวมและเก็บรักษาไว้บน GitHub

### 3.4 Testing (การทดสอบ)
* **เครื่องมือที่ใช้:** Chrome DevTools, Postman
* **เหตุผล:** เป็นเครื่องมือพื้นฐานในการใช้ตรวจเช็กความเรียบร้อยของหน้าเว็บ และเช็กการทำงานของระบบหลังบ้าน (API)
* **การนำไปใช้งาน:** เราใช้ Chrome DevTools เพื่อทดสอบว่าหน้าเว็บแสดงผลบนมือถือได้พอดีไหม และเช็กระบบตะกร้าสินค้าในเบราว์เซอร์ ส่วน Postman เราใช้จำลองการส่งข้อมูลไปที่ระบบหลังบ้านเพื่อดูว่าตอบกลับมาถูกต้องหรือไม่

### 3.5 Deployment (การนำเว็บขึ้นออนไลน์)
* **เครื่องมือที่ใช้:** Vercel
* **เหตุผล:** ใช้งานฟรี สะดวก และทำงานเข้ากับ Next.js ได้อย่างไร้รอยต่อ
* **การนำไปใช้งาน:** เราเชื่อมต่อ Vercel เข้ากับ GitHub ของโปรเจกต์ เมื่อมีคนในทีมอัปเดตโค้ดเวอร์ชันใหม่ลงในระบบ Vercel จะทำการประมวลผลและอัปเดตเว็บไซต์ออนไลน์ให้ใหม่โดยอัตโนมัติ

---

## 4. Use Case Diagram

```mermaid
flowchart LR
    Customer(("👤 ลูกค้า\n(Customer)"))

    subgraph OnlineStore_Customer["ฟังก์ชันสำหรับลูกค้า"]
        UC1([สมัครสมาชิก])
        UC2([เข้าสู่ระบบ])
        UC3([ค้นหาสินค้า])
        UC4([ดูรายละเอียดสินค้า])
        UC5(["จัดการตะกร้าสินค้า\n(เพิ่ม / แก้ไข / ลบ / ดูรายการ)"])
        UC6([สั่งซื้อสินค้า])
        UC7([ชำระเงิน])
        UC8([ติดตามสถานะคำสั่งซื้อ])
        UC9([ประวัติการสั่งซื้อ])
        UC10(["ติดต่อสอบถาม / รีวิวสินค้า"])
    end

    subgraph extend_include[" "]
        UC3E(["ตัวกรองการค้นหา\n(แบรนด์ / รุ่น / ราคา\nประเภท / คุณสมบัติอื่น ๆ)"])
        UC7I([เลือกช่องทางชำระเงิน])
        UC7I2([ชำระเงิน])
    end

    subgraph ExtServices_1[" "]
        EXT1[("💳 ระบบชำระเงินออนไลน์\n(Credit Card / PromptPay)")]
    end

    Customer --- UC1
    Customer --- UC2
    Customer --- UC3
    Customer --- UC4
    Customer --- UC5
    Customer --- UC6
    Customer --- UC7
    Customer --- UC8
    Customer --- UC9
    Customer --- UC10

    UC3 -. "≪extend≫" .-> UC3E
    UC7 -. "≪include≫" .-> UC7I
    UC7I -. "≪include≫" .-> UC7I2
    UC7 --- EXT1
```

### 4.2 ฟังก์ชันสำหรับพนักงาน (Staff)

```mermaid
flowchart LR
    Staff(("👤 พนักงาน\n(Staff)"))

    subgraph OnlineStore_Staff["ฟังก์ชันสำหรับพนักงาน"]
        US1([เข้าสู่ระบบ])
        US2([ดูรายการคำสั่งซื้อทั้งหมด])
        US3([อัปเดตสถานะคำสั่งซื้อ])
    end

    subgraph ExtServices_2[" "]
        EXT2[("🚚 ระบบขนส่ง\n(EMS / Kerry / Flash)")]
    end

    Staff --- US1
    Staff --- US2
    Staff --- US3

    US3 --- EXT2
```

### 4.3 ฟังก์ชันสำหรับผู้จัดการ (Manager)

```mermaid
flowchart LR
    Manager(("👤 ผู้จัดการ\n(Manager)"))

    subgraph OnlineStore_Manager["ฟังก์ชันสำหรับผู้จัดการ"]
        UM1(["จัดการสินค้าและสต็อกสินค้า\n(เพิ่ม / แก้ไข / ลบ / สต็อก)"])
        UM2(["จัดการหมวดหมู่สินค้า\n(เพิ่ม / แก้ไข / ลบ)"])
        UM4(["ดูข้อมูลลูกค้า\n(เช่น ที่อยู่ การติดต่อ)"])
        UM5(["จัดการผู้ใช้ระบบ\n(เพิ่ม / แก้ไข / ลบ / สิทธิ์)"])
    end

    subgraph include_stock[" "]
        UM1I1([ตรวจสอบสต็อก])
        UM1I2([รับสินค้าเข้า])
        UM1I3([ปรับปรุงสต็อก])
    end

    Manager --- UM1
    Manager --- UM2
    Manager --- UM4
    Manager --- UM5

    UM1 -. "≪include≫" .-> UM1I1
    UM1 -. "≪include≫" .-> UM1I2
    UM1 -. "≪include≫" .-> UM1I3
```

---

## 5. Class Diagram

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#dce6f5', 'primaryTextColor': '#333', 'primaryBorderColor': '#7b9fd4', 'lineColor': '#666', 'background': '#ffffff', 'mainBkg': '#ffffff', 'classText': '#333'}}}%%
classDiagram
    direction TB

    class User {
        <<abstract>>
        -int userId
        -string username
        -string email
        -string passwordHash
        -string phone
        -string status
        -datetime createdAt
        -datetime updatedAt
        +login(email, password) boolean
        +logout() void
        +updateProfile() void
        +changePassword() void
    }

    class Customer {
        -int customerId
        -string firstName
        -string lastName
        -date dateOfBirth
        -string gender
        -datetime registeredAt
        +viewProfile() void
        +viewOrders() List~Order~
        +addAddress() void
    }

    class Staff {
        -int staffId
        -string firstName
        -string lastName
        -string position
        +viewOrders() List~Order~
        +updateOrderStatus() void
    }

    class Manager {
        -int managerId
        -string firstName
        -string lastName
        -string department
        +manageProduct() void
        +manageCategory() void
        +manageStock() void
        +viewCustomerInfo() void
        +manageUser() void
    }

    class Brand {
        -int brandId
        -string country
        -string logoUrl
        -string description
        -string status
        +getProducts() List~Product~
    }

    class Model {
        -int modelId
        -int brandId
        -string name
        -string series
        -string description
        -string status
        +getProducts() List~Product~
    }

    class Category {
        -int categoryId
        -string name
        -string description
        -string status
        +getSubCategories() List~Category~
    }

    class ProductSearch {
        <<Criteria>>
        -string keyword
        -int brandId
        -int modelId
        -int categoryId
        -decimal minPrice
        -decimal maxPrice
        -string sortBy
        -boolean inStockOnly
        +search() List~Product~
        +clear() void
    }

    class Product {
        -int productId
        -int modelId
        -string sku
        -string name
        -text description
        -decimal price
        -string status
        -datetime createdAt
        +getImages() List~ProductImage~
    }

    class ProductItem {
        -int itemId
        -int productId
        -string serialNumber
        -string warranty
        -string status
    }

    class ProductImage {
        -int imageId
        -int productId
        -string imageUrl
        -boolean isPrimary
        -int sortOrder
    }

    class Inventory {
        -int inventoryId
        -int productId
        -int quantityOnHand
        -datetime lastUpdated
        +addStock() void
        +reduceStock() void
    }

    class Cart {
        -int cartId
        -int customerId
        -string status
        -datetime updatedAt
        +addItem(productId, qty) void
        +updateItemQty(productId, qty) void
        +removeItem(productId) void
        +clear() void
        +getTotal() decimal
    }

    class Review {
        -int reviewId
        -int productId
        -int customerId
        -int rating
        -text comment
        -datetime createdAt
        +updateComment() void
    }

    class OrderItem {
        -int orderItemId
        -int orderId
        -int productId
        -int quantity
        -decimal unitPrice
        +getSubTotal() decimal
    }

    class Order {
        -int orderId
        -string orderNo
        -int customerId
        -datetime orderDate
        -string status
        -decimal totalAmount
        -decimal shippingAmount
        -datetime createdAt
        +calculateTotal() decimal
    }

    class Payment {
        -int paymentId
        -int orderId
        -string method
        -decimal amount
        -string carrier
        -datetime paymentDate
        -string transactionId
        +confirmPayment() void
    }

    class Shipping {
        -int shippingId
        -int orderId
        -string trackingNo
        -string shippingAddress
        -string shippingMethod
        -decimal shippingFee
        -string status
        -datetime shippedAt
        +updateStatus() void
    }

    class Address {
        -int addressId
        -int userId
        -string type
        -string fullName
        -string phone
        -string addressLine
        -string district
        -string city
        -string postalCode
        -boolean isDefault
    }

    User <|-- Customer
    User <|-- Staff
    User <|-- Manager

    Brand "1" --> "1..*" Model
    Brand "1" --> "1..*" Product
    Model "1" --> "1..*" Product
    Category "1" --> "1..*" Product

    Product "1" --> "1..*" ProductItem
    Product "1" --> "1" Inventory
    Product "1" --> "1..*" ProductImage
    Product "1" --> "0..*" Review

    ProductSearch ..> Product : uses

    Customer "1" --> "0..1" Cart
    Customer "1" --> "0..*" Order
    Customer "1" --> "0..*" Review
    Customer "1" --> "0..*" Address

    Cart "1" o-- "0..*" OrderItem

    Order "1" *-- "1..*" OrderItem
    Order "1" --> "1" Payment
    Order "1" --> "1" Shipping
    Order "1" --> "0..1" Address
```

---

## 6. แผนภาพลำดับการทำงาน (Sequence Diagram)

### 6.1 กระบวนการของลูกค้า : ค้นหาสินค้าและสั่งซื้อ

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#dce6f5', 'actorTextColor': '#333', 'actorBorder': '#7b9fd4', 'signalColor': '#333', 'signalTextColor': '#333', 'labelBoxBkgColor': '#dce6f5', 'labelBoxBorderColor': '#7b9fd4', 'labelTextColor': '#333', 'loopTextColor': '#333', 'noteBkgColor': '#fff3cd', 'noteTextColor': '#333', 'noteBorderColor': '#ffc107', 'activationBkgColor': '#e8f0fe', 'activationBorderColor': '#7b9fd4', 'sequenceNumberColor': '#fff', 'background': '#ffffff'}}}%%
sequenceDiagram
    autonumber
    actor C as ลูกค้า (Customer)
    participant WEB as Web UI (Frontend)
    participant SEARCH as Search Service
    participant PROD as Product Service
    participant INV as Inventory Service
    participant CART as Cart Service
    participant ORD as Order Service
    participant PAY as Payment Gateway
    participant NOTI as Notification Service
    participant DB as Database

    C->>WEB: 1. เข้าสู่เว็บไซต์
    WEB-->>C: 1.1 แสดงหน้าแรก

    C->>WEB: 2. ค้นหาสินค้า (กรองแบรนด์/รุ่น/ราคา)
    WEB->>SEARCH: 2.1.1 ส่งข้อมูลการค้นหา
    SEARCH->>PROD: 2.1.1.1 สืบค้นสินค้า
    PROD->>INV: 2.1.1.1.1 ดึงข้อมูลสต็อกสินค้า
    INV-->>PROD: 2.1.1.1.2 ข้อมูลสต็อก
    PROD-->>SEARCH: 2.1.1.2 ผลการค้นหาและสต็อก
    SEARCH-->>WEB: 2.1.2 แสดงรายการสินค้า
    WEB-->>C: 2.2 แสดงผลรายการสินค้า

    C->>WEB: 3. จัดการตะกร้าสินค้า (เพิ่ม/แก้ไข)
    WEB->>CART: 3.1 อัปเดตข้อมูลตะกร้า
    CART->>DB: 3.1.1 บันทึกรายการตะกร้า
    DB-->>CART: 3.1.2 ยืนยันการเปลี่ยนแปลง
    CART-->>WEB: 3.2 แสดงตะกร้าสินค้า

    C->>WEB: 4. ดำเนินการสั่งซื้อ
    WEB->>ORD: 4.1 สร้างคำสั่งซื้อ
    ORD->>DB: 4.1.1 บันทึกคำสั่งซื้อ (สถานะ: รอชำระเงิน)
    DB-->>ORD: 4.1.2 ยืนยันการบันทึก
    ORD-->>WEB: 4.2 แสดงข้อมูลคำสั่งซื้อ

    C->>WEB: 5. ชำระเงิน
    WEB->>PAY: 5.1 ส่งข้อมูลการชำระเงิน
    PAY->>PAY: 5.1.1 ตรวจสอบและดำเนินการชำระเงิน
    PAY-->>WEB: 5.1.2 ผลการชำระเงิน
    WEB->>ORD: 5.3 อัปเดตสถานะคำสั่งซื้อ (ชำระเงินสำเร็จ)
    WEB->>NOTI: 5.4 ส่งการแจ้งเตือนยืนยันคำสั่งซื้อ
    NOTI->>C: 5.4.1 ส่งอีเมล/ข้อความ
    WEB-->>C: 5.5 แสดงผลยืนยันการสั่งซื้อสำเร็จ
```

### 6.2 กระบวนการของพนักงาน : จัดการออเดอร์

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#d5f5e3', 'actorTextColor': '#333', 'actorBorder': '#27ae60', 'signalColor': '#333', 'signalTextColor': '#333', 'labelBoxBkgColor': '#d5f5e3', 'labelBoxBorderColor': '#27ae60', 'labelTextColor': '#333', 'activationBkgColor': '#eafaf1', 'activationBorderColor': '#27ae60', 'sequenceNumberColor': '#fff', 'background': '#ffffff'}}}%%
sequenceDiagram
    autonumber
    actor S as พนักงาน (Staff)
    participant SUI as Staff UI (Frontend)
    participant ORD as Order Service
    participant NOTI as Notification Service
    participant DB as Database

    S->>SUI: 1. เข้าสู่ระบบ (พนักงาน)
    SUI-->>S: 1.1 แสดงหน้าจัดการ

    S->>SUI: 2. ดูรายการคำสั่งซื้อ
    SUI->>ORD: 2.1 ดึงรายการคำสั่งซื้อ
    ORD->>DB: 2.1.1 ดึงข้อมูล
    DB-->>ORD: 2.1.2 ข้อมูลคำสั่งซื้อ
    ORD-->>SUI: 2.2 แสดงรายการ

    S->>SUI: 3. อัปเดตสถานะคำสั่งซื้อ (เช่น จัดส่งแล้ว)
    SUI->>ORD: 3.1 ส่งข้อมูลอัปเดตสถานะ
    ORD->>DB: 3.1.1 บันทึกสถานะคำสั่งซื้อ
    DB-->>ORD: 3.1.2 สถานะเปลี่ยนแปลงสำเร็จ
    ORD->>NOTI: 3.2 ส่งการแจ้งเตือนสถานะให้ลูกค้า
    NOTI-->>SUI: 3.3 แจ้งเตือนสำเร็จ
    SUI-->>S: 3.4 แสดงผลอัปเดตสำเร็จ
```

### 6.3 กระบวนการของผู้จัดการ : จัดการข้อมูลลูกค้า สินค้า และผู้ใช้ระบบ

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#e8daef', 'actorTextColor': '#333', 'actorBorder': '#8e44ad', 'signalColor': '#333', 'signalTextColor': '#333', 'labelBoxBkgColor': '#e8daef', 'labelBoxBorderColor': '#8e44ad', 'labelTextColor': '#333', 'activationBkgColor': '#f4ecf7', 'activationBorderColor': '#8e44ad', 'sequenceNumberColor': '#fff', 'background': '#ffffff'}}}%%
sequenceDiagram
    autonumber
    actor M as ผู้จัดการ (Manager)
    participant MUI as Manager UI (Dashboard)
    participant INV as Inventory Service
    participant CUST as Customer Service
    participant USR as User Management Service
    participant DB as Database

    M->>MUI: 1. เข้าสู่ระบบ (ผู้จัดการ)
    MUI-->>M: 1.1 แสดงหน้าระบบจัดการ

    M->>MUI: 2. ดูข้อมูลลูกค้า
    MUI->>CUST: 2.1 ดึงข้อมูลลูกค้า
    CUST->>DB: 2.1.1 ขอข้อมูล (ที่อยู่, การติดต่อ)
    DB-->>CUST: 2.1.2 คืนค่าข้อมูล
    CUST-->>MUI: 2.2 แสดงรายชื่อและข้อมูลลูกค้า

    M->>MUI: 3. จัดการสินค้าและสต็อก (เพิ่ม/ลด)
    MUI->>INV: 3.1 ส่งข้อมูลอัปเดตสินค้าและสต็อก
    INV->>DB: 3.1.1 บันทึกข้อมูลสินค้าและสต็อก
    DB-->>INV: 3.1.2 ยืนยันการอัปเดต
    INV-->>MUI: 3.2 แสดงผลอัปเดตสำเร็จ

    M->>MUI: 4. จัดการผู้ใช้ระบบและสิทธิ์
    MUI->>USR: 4.1 ส่งข้อมูลผู้ใช้ (แก้ไข Role/สิทธิ์)
    USR->>DB: 4.1.1 บันทึกข้อมูลสิทธิ์ผู้ใช้งาน
    DB-->>USR: 4.1.2 ยืนยันการเปลี่ยนแปลงสิทธิ์
    USR-->>MUI: 4.2 แสดงผลอัปเดตผู้ใช้สำเร็จ
```

---

## 7. Wireframe และ Prototype

**Figma Design & Prototype:** [PC-Center Figma](https://www.figma.com/design/IYlNf0A4R423lRC0onIuXK/PC-Center?node-id=0-1&t=R5KfjKv478bxXQKn-1)


---

## 8. System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#dce6f5', 'primaryTextColor': '#333', 'primaryBorderColor': '#7b9fd4', 'lineColor': '#666', 'background': '#ffffff', 'mainBkg': '#ffffff'}}}%%
flowchart TB
    subgraph Client["🖥️ Client (Browser)"]
        direction LR
        NEXT["Next.js (React)\nFrontend"]
        TW["Tailwind CSS\nshadcn/ui"]
        LS["LocalStorage\n(State/Cart)"]
    end

    subgraph Server["⚙️ Server (Next.js API Routes)"]
        direction LR
        API["API Routes\n(/api/*)"]
        AUTH["Authentication\n(Session/JWT)"]
        RBAC["Role-Based\nAccess Control"]
    end

    subgraph Data["💾 Data Layer"]
        direction LR
        MOCK["Mock Data\n(JSON Files)"]
    end

    subgraph Roles["👥 User Roles"]
        direction LR
        R1(["👤 Customer"])
        R2(["🧑‍💼 Staff"])
        R3(["👨‍💼 Manager"])
    end

    R1 & R2 & R3 --> Client
    Client --> Server
    Server --> Data
    NEXT --- TW
    NEXT -.-> LS
    API --- AUTH
    AUTH --- RBAC
```

---

## 9. Tools & Technologies

* **Frontend Framework:** Next.js (React), TypeScript
* **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide React
* **Design:** Figma
* **Version Control:** Git, GitHub
* **Storage / Data:** LocalStorage (Browser) / Client-side Mock Data

---

## 10. Data Schema (JSON)

**👤 User**
```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@gmail.com",
  "role": "customer"
}
```

**📦 Product**
```json
{
  "product_id": 1,
  "name": "Gaming Mouse",
  "price": 599,
  "stock": 20,
  "category": "Mouse"
}
```

**🏷️ Product Item (Warranty)**
```json
{
  "item_id": 101,
  "product_id": 1,
  "serial_number": "SN-123456789",
  "warranty": "1 Year",
  "status": "Available"
}
```

**🛒 Cart**
```json
{
  "cart_id": 1,
  "user_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 599
    }
  ]
}
```

**📑 Order**
```json
{
  "order_id": 1,
  "user_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 599
    }
  ],
  "total_price": 1198,
  "status": "pending",
  "created_at": "2024-10-25T10:00:00Z"
}
```
