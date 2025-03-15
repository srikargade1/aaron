# 🚀 Aaron Backend - Remaining Tasks

## ✅ 1. Improve Search & Filtering
### **Feature**
- Users should be able to **search articles by**:
  - **Title**
  - **Difficulty**
  - **Tags**
  - **Uploader (Curator/User)**

### **Tasks**
- Modify `GET /api/articles`
  - Add **query parameters** for filtering.
  - Implement **pagination**.

---
## ✅ 2. User Authentication Improvements
### **Issue**
- Currently, **no role-based authentication**.
- Need to **restrict certain actions** (e.g., only **curator** can delete sample articles).

### **Tasks**
- Implement **role-based authentication** in middleware.
- Restrict **delete/update permissions** based on user roles.

---
---

## 📌 Notes
- **No more `multipart/form-data` for article uploads.** Metadata & content will be sent **separately**.
- **Multer middleware has been removed**.
- **Keep database optimized** by using **indexes** for frequent queries.

---