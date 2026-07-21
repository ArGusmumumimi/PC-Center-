import fs from "fs";
import path from "path";
import { seedUsers, seedProducts, seedCategories, seedOrders, seedReviews } from "./src/lib/data/seed";

const mockDir = path.join(process.cwd(), "src/lib/data/mock");
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

fs.writeFileSync(path.join(mockDir, "users.json"), JSON.stringify(seedUsers, null, 2));
fs.writeFileSync(path.join(mockDir, "products.json"), JSON.stringify(seedProducts, null, 2));
fs.writeFileSync(path.join(mockDir, "categories.json"), JSON.stringify(seedCategories, null, 2));
fs.writeFileSync(path.join(mockDir, "orders.json"), JSON.stringify(seedOrders, null, 2));
fs.writeFileSync(path.join(mockDir, "reviews.json"), JSON.stringify(seedReviews, null, 2));

console.log("Mock data extracted to JSON files successfully.");
