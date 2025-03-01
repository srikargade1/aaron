# 🚀 Aaron Backend - Remaining Tasks
## ✅ 1. Fix Read History Tracking
### **Issue**
- Currently, article reads are **not being recorded** in the database.
- We need to track **which users read which articles** and **when**.

### **Tasks**
- Modify `GET /api/articles/:id` to **update the article's read history**.
- Add a `readHistory` field in the `Article` schema:
  ```js
  readHistory: [{ userId: mongoose.Schema.Types.ObjectId, timestamp: Date } ]
  ```
- When a user fetches an article, **append** `{ userId, timestamp: Date.now() }` to `readHistory`.

---

## ✅ 2. Implement Word Lookup & Tracking
### **Feature**
- Users should be able to **look up words** and track their progress.

### **Tasks**
- **Create Route:** `GET /api/words/:word`
  - Fetch translation & grammar notes.
- **Create Route:** `POST /api/userwords/check`
  - Log a user **checking a word’s meaning**.
- Update `UserWord` schema to track:
  ```js
  checkedCount: { type: Number, default: 0 }
  ```

---

## ✅ 3. Fix Progress Dashboard
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

## ✅ 4. Implement Translation API (Core Feature)
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

## ✅ 5. Improve Search & Filtering
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

## ✅ 6. Data Deduplication (Remove Redundant Files)
### **Issue**
- Users may **upload duplicate articles** or **redundant files**.
- We need a **mechanism** to check for **existing content** before saving.

### **Tasks**
- Implement **hash-based file checking** to detect duplicate uploads.
- Before saving an article, **check** if **similar content exists**.
- **Modify upload logic** to prevent storing **duplicate articles**.

---

## ✅ 7. Automatic Tagging for Articles (LDA Algorithm)
### **Feature**
- When a user uploads an article, **auto-generate tags** based on its content.

### **Tasks**
- Implement **Latent Dirichlet Allocation (LDA)** or **TF-IDF** for keyword extraction.
- Modify `POST /api/articles` to **auto-assign tags**.

---

## ✅ 8. User Authentication Improvements
### **Issue**
- Currently, **no role-based authentication**.
- Need to **restrict certain actions** (e.g., only **curator** can delete sample articles).

### **Tasks**
- Implement **role-based authentication** in middleware.
- Restrict **delete/update permissions** based on user roles.

---

## 🎯 **Priority Order**
1. **Fix Read History Tracking**
2. **Implement Word Lookup & Tracking**
3. **Fix Progress Dashboard**
4. **Implement Translation API**
5. **Improve Search & Filtering**
6. **Data Deduplication**
7. **Automatic Tagging (LDA)**
8. **User Authentication Improvements**

---

## 📌 Notes
- **No more `multipart/form-data` for article uploads.** Metadata & content will be sent **separately**.
- **Multer middleware has been removed**.
- **Keep database optimized** by using **indexes** for frequent queries.

---