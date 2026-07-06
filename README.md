# 🖥️ PC Center – ศูนย์รวมคอมพิวเตอร์และอุปกรณ์ไอที

## 📌 CSI204 Project Hub
ระบบเว็บไซต์ขายคอมพิวเตอร์และอุปกรณ์ไอทีออนไลน์ (E-Commerce Platform)

---

## 📚 สารบัญ (Table of Contents)

1. [ข้อเสนอโครงงาน (Project Proposal)](#1-ข้อเสนอโครงงาน-project-proposal)
2. [Persona Design](#2-persona-design)
3. [Use Case Diagram](#3-use-case-diagram)
4. [Class Diagram](#4-class-diagram)
5. [แผนภาพลำดับการทำงาน (Sequence Diagram)](#5-แผนภาพลำดับการทำงาน-sequence-diagram)
6. [Wireframe](#6-wireframe)
7. [System Architecture](#7-system-architecture)
8. [Tools & Technologies](#8-tools--technologies)
9. [Data Schema (JSON)](#9-data-schema-json)
10. [Progress Report](#10-progress-report)

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
| 1 | [รหัส] | [ชื่อ-สกุล] | Project Manager |
| 2 | 67090746 | นายธนากร ธิติพุทธปราสาท | full stack dev |
| 3 | 66097807 | นายเป็นไท ศรีไชยมูล | [หน้าที่] |
| 4 | [รหัส] | [ชื่อ-สกุล] | [หน้าที่] |
| 5 | [รหัส] | [ชื่อ-สกุล] | [หน้าที่] |

### 🎯 วัตถุประสงค์ (Objectives)
1. เพื่อออกแบบและพัฒนาเว็บไซต์อีคอมเมิร์ซสำหรับจำหน่ายอุปกรณ์คอมพิวเตอร์ ที่มีดีไซน์ทันสมัย ใช้งานง่าย
2. เพื่อพัฒนาระบบหน้าร้าน (Storefront) ที่ช่วยอำนวยความสะดวกให้ลูกค้าสามารถค้นหา กรองหมวดหมู่สินค้า จัดการตะกร้า และทำรายการสั่งซื้อได้อย่างรวดเร็ว
3. เพื่อพัฒนาระบบจัดการหลังบ้าน (Dashboard) ที่มีการแบ่งระดับสิทธิ์การเข้าถึง (Role-based Access Control) เพื่อให้ทีมงานสามารถบริหารจัดการสินค้า คำสั่งซื้อ และข้อมูลผู้ใช้ได้อย่างมีประสิทธิภาพ

### 🔍 ขอบเขตของโครงงาน (Project Scope)
* **Customer (ลูกค้า):** สามารถเข้าสู่ระบบ, ค้นหาและกรองสินค้าตามหมวดหมู่ (เช่น CPU, GPU), ดูรายละเอียด, จัดการตะกร้าสินค้า, ทำรายการสั่งซื้อ (ระบบจำลองการชำระเงิน) และติดตามสถานะคำสั่งซื้อของตนเองได้
* **Staff (พนักงาน):** สามารถเข้าสู่ระบบจัดการหลังบ้าน, ดูภาพรวมแดชบอร์ด (Dashboard), จัดการและอัปเดตสถานะคำสั่งซื้อของลูกค้า และดูฐานข้อมูลลูกค้าได้
* **Manager (ผู้จัดการ):** มีสิทธิ์สูงสุดครอบคลุมการทำงานของพนักงาน และสามารถจัดการเพิ่ม/ลด/แก้ไขข้อมูลสินค้า, หมวดหมู่สินค้า, บริหารจัดการสิทธิ์ผู้ใช้งาน (Role) ของบุคคลอื่นในระบบได้

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

## 3. Use Case Diagram

```mermaid
flowchart LR
    Customer(("👤 ลูกค้า\n(Customer)"))

    subgraph OnlineStore_Customer["ฟังก์ชันสำหรับลูกค้า"]
        UC1([สมัครสมาชิก])
        UC2([เข้าสู่ระบบ])
        UC3([ค้นหาสินค้า])
        UC4([ดูรายละเอียดสินค้า])
        UC5([เพิ่มสินค้าลงตะกร้า])
        UC6(["จัดการตะกร้าสินค้า\n(แก้ไข / ลบ / ดูรายการ)"])
        UC7([สั่งซื้อสินค้า])
        UC8([ชำระเงิน])
        UC9([ติดตามสถานะคำสั่งซื้อ])
        UC10([ประวัติการสั่งซื้อ])
        UC11(["ติดต่อสอบถาม / รีวิวสินค้า"])
    end

    subgraph extend_include[" "]
        UC3E(["ตัวกรองการค้นหา\n(แบรนด์ / รุ่น / ราคา\nประเภท / คุณสมบัติอื่น ๆ)"])
        UC7I([ยืนยันข้อมูลคำสั่งซื้อ])
        UC8I([เลือกช่องทางชำระเงิน])
        UC8I2([ชำระเงิน])
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
    Customer --- UC11

    UC3 -. "≪extend≫" .-> UC3E
    UC7 -. "≪include≫" .-> UC7I
    UC8 -. "≪include≫" .-> UC8I
    UC8I -. "≪include≫" .-> UC8I2
    UC8 --- EXT1
```

### 3.2 ฟังก์ชันสำหรับพนักงาน (Staff)

```mermaid
flowchart LR
    Staff(("👤 พนักงาน\n(Staff)"))

    subgraph OnlineStore_Staff["ฟังก์ชันสำหรับพนักงาน"]
        US1([เข้าสู่ระบบ])
        US2([ดูรายการคำสั่งซื้อทั้งหมด])
        US3([ตรวจสอบและยืนยันคำสั่งซื้อ])
        US4(["จัดเตรียมสินค้า / แพ็คสินค้า"])
        US5([อัปเดตสถานะคำสั่งซื้อ])
        US6([จัดการสต็อกสินค้า])
    end

    subgraph include_stock[" "]
        US6I1([ตรวจสอบสต็อก])
        US6I2([รับสินค้าเข้า])
        US6I3([ปรับปรุงสต็อก])
    end

    subgraph ExtServices_2[" "]
        EXT2[("🚚 ระบบขนส่ง\n(EMS / Kerry / Flash)")]
    end

    Staff --- US1
    Staff --- US2
    Staff --- US3
    Staff --- US4
    Staff --- US5
    Staff --- US6

    US6 -. "≪include≫" .-> US6I1
    US6 -. "≪include≫" .-> US6I2
    US6 -. "≪include≫" .-> US6I3
    US5 --- EXT2
```

### 3.3 ฟังก์ชันสำหรับผู้จัดการ (Manager)

```mermaid
flowchart LR
    Manager(("👤 ผู้จัดการ\n(Manager)"))

    subgraph OnlineStore_Manager["ฟังก์ชันสำหรับผู้จัดการ"]
        UM1(["จัดการสินค้า\n(เพิ่ม / แก้ไข / ลบ)"])
        UM2(["จัดการหมวดหมู่สินค้า\n(เพิ่ม / แก้ไข / ลบ)"])
        UM3(["ดูแลแดชบอร์ดภาพรวม\n(Dashboard)"])
        UM4(["รายงานยอดขาย\n(รายวัน / รายเดือน / รายปี / ตามช่วง)"])
        UM5(["จัดการผู้ใช้ระบบ\n(เพิ่ม / แก้ไข / ลบ / สิทธิ์)"])
    end

    subgraph include_dashboard[" "]
        UM3I1([ยอดขายรวม])
        UM3I2([สินค้ายอดนิยม])
        UM3I3([คำสั่งซื้อรอจัดส่ง])
        UM3I4([สถิติให้คะแนน])
    end

    subgraph include_report[" "]
        UM4I1([รายงานสินค้าคงเหลือ])
        UM4I2([รายงานผลประกอบการ])
    end

    Manager --- UM1
    Manager --- UM2
    Manager --- UM3
    Manager --- UM4
    Manager --- UM5

    UM3 -. "≪include≫" .-> UM3I1
    UM3 -. "≪include≫" .-> UM3I2
    UM3 -. "≪include≫" .-> UM3I3
    UM3 -. "≪include≫" .-> UM3I4
    UM4 -. "≪include≫" .-> UM4I1
    UM4 -. "≪include≫" .-> UM4I2
```

---

## 4. Class Diagram

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
        +createOrder() Order
        +updateOrderStatus() void
        +checkStock() void
    }

    class Manager {
        -int managerId
        -string firstName
        -string lastName
        -string department
        +viewDashboard() void
        +viewReport() void
        +manageInventory() void
        +manageItem() void
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
        -string genre
        -string colorSize
        -string movement
        -string warranty
        -string status
        -datetime createdAt
        +getImages() List~ProductImage~
        +getCurrentPrice() decimal
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
        -int reorderLevel
        -datetime lastUpdated
        +addStockChange() void
        +checkReserveQty() int
        +checkReorderLevel() boolean
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
        -decimal discount
        +getSubTotal() decimal
    }

    class Order {
        -int orderId
        -string orderNo
        -int customerId
        -datetime orderDate
        -string status
        -decimal totalAmount
        -decimal discountPrice
        -decimal shippingAmount
        -datetime createdAt
        +confirmOrder() void
        +calculateTotal() decimal
    }

    class Promotion {
        -int promotionId
        -string code
        -string name
        -string type
        -decimal value
        -decimal minOrderAmount
        -decimal discountPrice
        -datetime startDate
        -datetime endDate
        -string status
        +isValid() boolean
        +calculateDiscountAmount() decimal
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

    class Report {
        <<abstract>>
        -int reportId
        -string reportType
        -date startDate
        -date endDate
        -datetime generatedAt
        +generate() void
        +reportType() void
    }

    class SalesReport {
        -decimal totalSales
        -int totalOrders
        -List topProducts
        +generate() void
    }

    class InventoryReport {
        -int totalItems
        -int lowStockCount
        -List topProducts
        +generate() void
    }

    class ProfitReport {
        -decimal totalCost
        -decimal totalRevenue
        -decimal netProfit
        +generate() void
    }

    User <|-- Customer
    User <|-- Staff
    User <|-- Manager

    Report <|-- SalesReport
    Report <|-- InventoryReport
    Report <|-- ProfitReport

    Brand "1" --> "1..*" Model
    Brand "1" --> "1..*" Product
    Model "1" --> "1..*" Product
    Category "1" --> "1..*" Product

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

    Promotion "0..*" ..> Order : applies to
```

---

## 5. แผนภาพลำดับการทำงาน (Sequence Diagram)

### 5.1 กระบวนการของลูกค้า : ค้นหาสินค้าและสั่งซื้อ

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

    C->>WEB: 2. ค้นหาสินค้า (กรุณาใส่ชื่อ แบรนด์/รุ่น/ราคา/ประเภท)
    WEB->>SEARCH: 2.1.1 ส่งข้อมูลการค้นหา
    SEARCH->>PROD: 2.1.1.1 สืบค้นสินค้า
    PROD->>INV: 2.1.1.1.1 ดึงข้อมูลสต็อกสินค้า
    INV-->>PROD: 2.1.1.1.2 ข้อมูลสต็อก
    PROD-->>SEARCH: 2.1.1.2 ผลการค้นหาและสต็อก
    SEARCH-->>WEB: 2.1.2 แสดงรายการสินค้า
    WEB-->>C: 2.2 แสดงผลรายการสินค้า

    C->>WEB: 3. เลือกสินค้าและเพิ่มลงตะกร้า
    WEB->>CART: 3.1 เพิ่มสินค้าเข้าตะกร้า
    CART->>DB: 3.1.1 บันทึกรายการตะกร้า
    DB-->>CART: 3.1.2 ยืนยันการเพิ่มสินค้า
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

### 5.2 กระบวนการของพนักงาน : จัดการออเดอร์และสต็อกสินค้า

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#d5f5e3', 'actorTextColor': '#333', 'actorBorder': '#27ae60', 'signalColor': '#333', 'signalTextColor': '#333', 'labelBoxBkgColor': '#d5f5e3', 'labelBoxBorderColor': '#27ae60', 'labelTextColor': '#333', 'activationBkgColor': '#eafaf1', 'activationBorderColor': '#27ae60', 'sequenceNumberColor': '#fff', 'background': '#ffffff'}}}%%
sequenceDiagram
    autonumber
    actor S as พนักงาน (Staff)
    participant SUI as Staff UI (Frontend)
    participant ORD as Order Service
    participant INV as Inventory Service
    participant PROD as Product Service
    participant SHIP as Shipping Service
    participant NOTI as Notification Service
    participant DB as Database

    S->>SUI: 1. เข้าสู่ระบบ (พนักงาน)
    SUI-->>S: 1.1 แสดงหน้าจัดการ

    S->>SUI: 2. ดูรายการคำสั่งซื้อใหม่
    SUI->>ORD: 2.1 ดึงรายการคำสั่งซื้อ (สถานะ: รอจัดส่ง)
    ORD->>DB: 2.1.1 ดึงข้อมูลคำสั่งซื้อ
    DB-->>ORD: 2.1.2 ข้อมูลคำสั่งซื้อ
    ORD-->>SUI: 2.2 แสดงรายการ

    S->>SUI: 3. ตรวจสอบและยืนยันคำสั่งซื้อ
    SUI->>INV: 3.1 ตรวจสอบสต็อก/ของสินค้า
    INV->>DB: 3.1.1 ตรวจสอบจำนวนสต็อก
    DB-->>INV: 3.1.2 ผลการตรวจสอบ
    INV-->>SUI: 3.2 แสดงผลการตรวจสอบ

    S->>SUI: 4. บันทึกการจัดเตรียมสินค้า
    SUI->>SHIP: 4.1 บันทึกข้อมูลการจัดเตรียม
    SHIP->>DB: 4.1.1 บันทึกข้อมูลการจัดส่ง
    DB-->>SHIP: 4.1.2 ยืนยันการบันทึก

    S->>SUI: 5. อัปเดตสถานะออเดอร์
    SUI->>ORD: 5.1 อัปเดตสถานะ (เป็น จัดส่งแล้ว)
    ORD->>DB: 5.1.1 อัปเดตสถานะคำสั่งซื้อ
    DB-->>ORD: 5.2 สถานะเปลี่ยนแปลงสำเร็จ
    ORD->>NOTI: 5.2.1 ส่งอีเมล/แจ้งเตือนลูกค้าการจัดส่ง

    S->>SUI: 6. ปรับปรุงสต็อกสินค้า
    SUI->>INV: 6.1 ดึงข้อมูลสินค้า
    INV->>DB: 6.1.1 อัปเดตสต็อกสินค้า
    DB-->>INV: 6.1.2 ยืนยันการอัปเดต
```

### 5.3 กระบวนการของผู้จัดการ : ดูรายงานและแดชบอร์ด

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#e8daef', 'actorTextColor': '#333', 'actorBorder': '#8e44ad', 'signalColor': '#333', 'signalTextColor': '#333', 'labelBoxBkgColor': '#e8daef', 'labelBoxBorderColor': '#8e44ad', 'labelTextColor': '#333', 'activationBkgColor': '#f4ecf7', 'activationBorderColor': '#8e44ad', 'sequenceNumberColor': '#fff', 'background': '#ffffff'}}}%%
sequenceDiagram
    autonumber
    actor M as ผู้จัดการ (Manager)
    participant MUI as Manager UI (Dashboard)
    participant RPT as Report Service
    participant ORD as Order Service
    participant INV as Inventory Service
    participant PAY as Payment Service
    participant DB as Database

    M->>MUI: 1. เข้าสู่ระบบ (ผู้จัดการ)
    MUI-->>M: 1.1 แสดงหน้าแดชบอร์ด

    M->>MUI: 2. เลือกดูรายงาน/ช่วงเวลาที่ต้องการ
    MUI->>RPT: 2.1 ขอข้อมูลรายงานตามช่วงเวลาที่เลือก
    RPT->>ORD: 2.1.1 ดึงข้อมูลคำสั่งซื้อ
    ORD->>DB: 2.1.1.1 ข้อมูลคำสั่งซื้อ
    DB-->>ORD: ข้อมูลคำสั่งซื้อ
    ORD-->>RPT: ข้อมูลคำสั่งซื้อ
    RPT->>INV: 2.1.2 ข้อมูลสินค้าคงเหลือ
    INV->>DB: 2.1.2.1 ข้อมูลสต็อกสินค้า
    DB-->>INV: ข้อมูลสต็อก
    INV-->>RPT: ข้อมูลสินค้าคงเหลือ
    RPT->>PAY: 2.1.3 ดึงข้อมูลการชำระเงินในช่วงนั้น
    PAY->>DB: 2.1.3.1 ข้อมูลรายการเงิน
    DB-->>PAY: ข้อมูลการเงิน
    PAY-->>RPT: ข้อมูลการชำระเงิน
    RPT-->>MUI: 2.1.4 ส่งข้อมูลสรุป
    MUI-->>M: 2.2 แสดงรายงาน/แดชบอร์ด

    M->>MUI: 3. ส่งออกรายงาน
    MUI-->>M: 3.2 ดาวน์โหลดไฟล์รายงาน
```

---

## 6. Wireframe

*(ระบุลิงก์ Figma หรือแทรกรูปภาพ Wireframe ของคุณที่นี่)*

---

## 7. System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#dce6f5', 'primaryTextColor': '#333', 'primaryBorderColor': '#7b9fd4', 'lineColor': '#666', 'background': '#ffffff', 'mainBkg': '#ffffff'}}}%%
flowchart TB
    subgraph Client["🖥️ Client (Browser)"]
        direction LR
        NEXT["Next.js (React)\nFrontend"]
        TW["Tailwind CSS\nshadcn/ui"]
    end

    subgraph Server["⚙️ Server (Next.js API Routes)"]
        direction LR
        API["API Routes\n(/api/*)"]
        AUTH["Authentication\n(Session/JWT)"]
        RBAC["Role-Based\nAccess Control"]
    end

    subgraph Data["💾 Data Layer"]
        direction LR
        LS["LocalStorage\n(Browser)"]
        MOCK["Mock Data\n(JSON)"]
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
    API --- AUTH
    AUTH --- RBAC
    LS --- MOCK
```

---

## 8. Tools & Technologies

* **Frontend Framework:** Next.js (React), TypeScript
* **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide React
* **Design:** Figma
* **Version Control:** Git, GitHub
* **Storage / Data:** LocalStorage (Browser) / Client-side Mock Data

---

## 9. Data Schema (JSON)

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

**🛒 Cart**
```json
{
  "cart_id": 1,
  "user_id": 1,
  "items": []
}
```

**📑 Order**
```json
{
  "order_id": 1,
  "user_id": 1,
  "total_price": 599,
  "status": "pending"
}
```

---

## 10. Progress Report
