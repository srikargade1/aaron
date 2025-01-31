# Aaron Language Learning Application

Aaron is a comprehensive language learning application designed to help users improve their skills through interactive reading, vocabulary practice, and grammar analysis. This repository contains the backend implementation of Aaron, developed using Node.js, Express.js, and MongoDB. The frontend, a work in progress, will be developed using modern web technologies to deliver a seamless and intuitive user experience.

---

## **Features**

### **1. User Management**
- User registration and authentication.
- Track user goals, proficiency level, and progress.

### **2. Article Features**
- Supports sample and custom articles.
- Provides word-by-word translations.
- Grammar analysis for each article.
- Difficulty-level tagging (Beginner, Intermediate, Advanced).

### **3. Vocabulary Practice**
- Tracks user interactions with words (e.g., encounters and checks).
- Allows users to mark words for review.
- Provides a word revision quiz based on tracked words.

### **4. Additional Features**
- Drag-and-drop option for uploading custom articles.
- Audio support for pronunciation practice.
- Offline access to downloaded articles.
- Search history and article filtering by tags.
- Progress dashboard for tracking improvement.
- Automatic labelling of custom articles to optimise search. This is achieved by the implementation of the LDA algorithm.
- Redundant articles will be removed and only a single copy of the article will be saved using data deduplication algorithms.
- CLT based teaching techniques will be incorporated in later versions, after the MVP is built and deployed.
- Should develop new APIs for document tagging and integrate existing APIs to access French meanings instantly among others. 
- Finish all server features by the end of this month
---

## **Technologies Used**

### **Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- Postman

### **Frontend**
- React.js
- Redux for state management
- Tailwind CSS for responsive design

### **APIs**
- Third-party translation and grammar analysis APIs.

---

## **Installation**

### **Prerequisites**
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/Aaron.git
   cd Aaron/aaron-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/aaronDB
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Test the API endpoints using Postman or curl.

---

## **API Endpoints**

### **User Routes**
- **GET /api/users**: Fetch all users
- **POST /api/users**: Create a new user
- **PUT /api/users/:id**: Update a user by ID
- **DELETE /api/users/:id**: Delete a user by ID

### **Word Routes**
- **GET /api/words**: Fetch all words
- **POST /api/words**: Add a new word
- **GET /api/words/:id**: Fetch a word by ID
- **PUT /api/words/:id**: Update a word by ID
- **DELETE /api/words/:id**: Delete a word by ID

### **User-Word Interaction Routes**
- **GET /api/userwords/:userId**: Fetch all user-word interactions for a user
- **POST /api/userwords**: Create or update a user-word interaction
- **PATCH /api/userwords/:id**: Update a specific user-word interaction
- **DELETE /api/userwords/:id**: Delete a specific user-word interaction

---

## **Planned Frontend Features**

The frontend for Aaron is under development and will include:

1. **User Interface**:
   - A clean and intuitive dashboard to track progress, goals, and interactions.
   - A customizable reading interface with translation and grammar notes.

2. **Responsive Design**:
   - Fully responsive to work on desktops, tablets, and mobile devices.

3. **Interactive Features**:
   - Real-time word translations and grammar highlights.
   - Integrated quizzes based on user interactions with words and articles.

4. **Progress Tracking**:
   - A detailed progress dashboard to visualize improvements in vocabulary and reading skills.

5. **Settings**:
   - Dark and light mode.
   - User preferences for learning pace and difficulty levels.

6. **Offline Mode**:
   - Save articles for offline access.

---

## **Folder Structure**

```
Aaron/
├── aaron-backend/
│   ├── index.js         # Entry point for the backend
│   ├── models/          # Mongoose schemas for MongoDB collections
│   │   ├── userModel.js
│   │   ├── wordModel.js
│   │   ├── userWordModel.js
│   ├── routes/          # API route definitions
│   │   ├── userRoutes.js
│   │   ├── wordRoutes.js
│   │   ├── userWordRoutes.js
│   ├── .env             # Environment variables
│   ├── package.json     # Project dependencies
├── aaron-frontend/      # Placeholder for frontend code (to be added)
```

---

## **Contributing**

Contributions are welcome! If you’d like to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with detailed changes.

---

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**
For questions or suggestions, feel free to contact:
- **Name**: Venkata Narasimha Srikar Gade
- **Email**: vngade@syr.edu
- **GitHub**: https://github.com/srikargade1

---

