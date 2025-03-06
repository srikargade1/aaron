# 🚀 Aaron Backend - Remaining Tasks

## ✅ 1. Fix Progress Dashboard
### **Issue**
- **Old progress system** tracked **targets** (e.g., words per day).
- We **removed** targets, but progress should still track:
  - **Total words checked**
  - **Total articles read**

### **Tasks**
- Modify `GET /api/users/:id/progress`
  - Count **words checked** from `UserWord` collection.
  - Count **articles read** from `readHistory`.

---

## ✅ 2. Implement Translation API (Core Feature)
### **Feature**
- Users should be able to **translate**:
  - **Single words**
  - **Sentences**
  
### **Options**
1. **Google Translate API** (Paid)
2. **LibreTranslate** (Self-hosted, Free)
3. **Linguee API / DeepL API** (For contextual translations)

### **Tasks**
- **Create Route:** `GET /api/translate/word/:word`
  - Fetch word translation & grammar notes.
- **Create Route:** `GET /api/translate/sentence`
  - Translate full sentences.

---

## ✅ 3. Improve Search & Filtering
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

## ✅ 4. Data Deduplication (Remove Redundant Files. Least Priority)
### **Issue**
- Users may **upload duplicate articles** or **redundant files**.
- We need a **mechanism** to check for **existing content** before saving.

### **Tasks**
- Implement **hash-based file checking** to detect duplicate uploads.
- Before saving an article, **check** if **similar content exists**.
- **Modify upload logic** to prevent storing **duplicate articles**.
---

## ✅ 5. User Authentication Improvements
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