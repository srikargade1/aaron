const mongoose = require('mongoose');

// Import models
const User = require('./models/userModel');
const Word = require('./models/wordModel');
const UserWord = require('./models/userWordModel');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/aaronDB');
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Test function
const testSchemas = async () => {
    try {
        // Step 1: Create a test user
        const user = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'securepassword',
            proficiencyLevel: 'Intermediate',
            learningLanguage: 'French',
        });
        await user.save();
        console.log('User created:', user);

        // Step 2: Add a test word
        const word = new Word({
            word: 'Bonjour',
            meanings: [
                { definition: 'Hello', usageExample: 'Bonjour, comment ça va?' },
                { definition: 'Good day', usageExample: 'Bonjour, monsieur!' },
            ],
            grammarNotes: 'Common greeting in French.',
        });
        await word.save();
        console.log('Word created:', word);

        // Step 3: Track user interaction with the word
        const userWord = new UserWord({
            userId: user._id,
            wordId: word._id,
            encounteredCount: 3,
            checkedCount: 1,
            isMarkedForReview: true,
        });
        await userWord.save();
        console.log('UserWord interaction created:', userWord);

        // Step 4: Query the UserWord and populate word details
        const userWordDetails = await UserWord.findOne({ userId: user._id })
            .populate('wordId'); // Populate word details
        console.log('Populated UserWord details:', userWordDetails);

        // Disconnect after testing
        mongoose.disconnect();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error during testing:', error.message);
        process.exit(1);
    }
};

// Run the tests
connectDB().then(() => testSchemas());
