# 💾 Data Schema – PC Center

## 👤 User
```
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@gmail.com",
  "role": "customer"
}
```

---

## 📦 Product
```
{
  "product_id": 1,
  "name": "Gaming Mouse",
  "price": 599,
  "stock": 20,
  "category": "Mouse"
}
```

---

## 🛒 Cart
```
{
  "cart_id": 1,
  "user_id": 1,
  "items": []
}
```

---

## 📑 Order
```
{
  "order_id": 1,
  "user_id": 1,
  "total_price": 599,
  "status": "pending"
}
```
