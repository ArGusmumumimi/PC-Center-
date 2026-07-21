# 🔄 Sequence Diagram – Order Flow

```
Customer        Website        System        Database
   |               |              |              |
   | Login        ->|              |              |
   |               | Validate     ->             |
   |               |<-------------|              |
   | Search Product->|             |              |
   |               | Get Data     -> DB          |
   |               |<-------------|              |
   | Add to Cart  ->|              |              |
   | Checkout     ->| Create Order-> DB          |
   |               |<-------------|              |
   | Order Success<-|              |              |
```
