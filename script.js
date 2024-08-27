let currentStory = null;
let stories = [];
let favoriteStories = [];
let currentUser = null;

function showScreen(screenId) {
    const screens = ['dashboard', 'storyCreation', 'storyList', 'userProfile', 'settings', 'viewFullStory'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = screen === screenId ? 'block' : 'none';
    });

    document.getElementById('continueReading').style.display = currentStory ? 'block' : 'none';
}

function generateStory() {
    const storyStart = document.getElementById('storyText').value;
    const generatedStory = storyStart + " The brave young boy embarked on an exciting adventure through the enchanted forest, meeting magical creatures and solving puzzles along the way...";
    document.getElementById('generatedStory').innerText = generatedStory;
}

function saveStory() {
    const storyText = document.getElementById('generatedStory').innerText || document.getElementById('storyText').value;
    if (storyText) {
        const newStory = {
            storyId: stories.length + 1,
            storyText: storyText,
            imageStoryId: stories.length + 1,
            userId: currentUser.userId
        };
        stories.push(newStory);
        localStorage.setItem('stories', JSON.stringify(stories));
        alert("Story saved successfully!");
        loadStories();
        showScreen('storyList');
    } else {
        alert("Please generate or write a story first.");
    }
}

function loadStories() {
    const savedStories = localStorage.getItem('stories');
    if (savedStories) {
        stories = JSON.parse(savedStories);
    } else {
        // If no stories in localStorage, load from CSV
        fetch('storiesDB.csv')
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                stories = lines.slice(1).map(line => {
                    const [storyId, storyText, imageStoryId, userId] = line.split(',');
                    return { storyId: parseInt(storyId), storyText, imageStoryId: parseInt(imageStoryId), userId: parseInt(userId) };
                });
                localStorage.setItem('stories', JSON.stringify(stories));
                displayStories();
            })
            .catch(error => console.error('Error loading stories:', error));
    }
    displayStories();
}

function displayStories() {
    const storyList = document.getElementById('storyListContainer');
    storyList.innerHTML = '';
    stories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';
        const title = story.storyText.split(' ').slice(0, 3).join(' ') + '...';
        storyItem.innerHTML = `
            <h3>${title}</h3>
            <img src="imageStory${story.imageStoryId}.png" alt="Story Illustration" class="story-image">
            <p>${story.storyText.substring(0, 100)}...</p>
            <button onclick="viewFullStory(${story.storyId})">View Full Story</button>
        `;
        storyList.appendChild(storyItem);
    });
}

function viewFullStory(storyId) {
    const story = stories.find(s => s.storyId == storyId);
    if (story) {
        currentStory = story;
        const title = story.storyText.split(' ').slice(0, 3).join(' ') + '...';
        document.getElementById('fullStoryTitle').innerText = title;
        document.getElementById('fullStoryContent').innerText = story.storyText;
        document.getElementById('fullStoryImage').src = `imageStory${story.imageStoryId}.png`;
        showScreen('viewFullStory');
        document.getElementById('continueReading').style.display = 'block';
    }
}

function loadFavoriteStories() {
    fetch('favoriteStoriesDB.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            favoriteStories = lines.slice(1).map(line => {
                const [favoritesId, storyId, userId, orderOfImportance] = line.split(',');
                return { favoritesId: parseInt(favoritesId), storyId: parseInt(storyId), userId: parseInt(userId), orderOfImportance: parseInt(orderOfImportance) };
            });
            localStorage.setItem('favoriteStories', JSON.stringify(favoriteStories));
        })
        .catch(error => console.error('Error loading favorite stories:', error));
}

function loadUserProfile() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        displayUserProfile();
    } else {
        fetch('userDB.csv')
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                const users = lines.slice(1).map(line => {
                    const [userId, username, mail, age, schoolGrade, achievements] = line.split(',');
                    return { 
                        userId: parseInt(userId), 
                        username, 
                        mail, 
                        age: parseInt(age), 
                        schoolGrade: parseInt(schoolGrade), 
                        achievements: JSON.parse(achievements.replace(/'/g, '"'))
                    };
                });
                currentUser = users[0]; // For this example, we'll use the first user
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                displayUserProfile();
            })
            .catch(error => console.error('Error loading user profile:', error));
    }
}

function displayUserProfile() {
    if (currentUser) {
        document.querySelector('#userProfile .avatar').src = `avatar${currentUser.userId}.png`;
        document.querySelector('#userProfile p:nth-of-type(1)').textContent = `Username: ${currentUser.username}`;
        document.querySelector('#userProfile p:nth-of-type(2)').textContent = `Age: ${currentUser.age}`;
        
        const achievementsList = document.querySelector('#userProfile #achievementsList');
        achievementsList.innerHTML = '';
        for (const [achievement, value] of Object.entries(currentUser.achievements)) {
            if (value === true) {
                const li = document.createElement('li');
                li.textContent = achievement.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                achievementsList.appendChild(li);
            }
        }

        displayFavoriteStories();
    }
}

function displayFavoriteStories() {
    const favoriteStoriesList = document.querySelector('#userProfile #favoriteStoriesList');
    favoriteStoriesList.innerHTML = '';
    favoriteStories
        .filter(fs => fs.userId === currentUser.userId)
        .sort((a, b) => a.orderOfImportance - b.orderOfImportance)
        .forEach(fs => {
            const story = stories.find(s => s.storyId === fs.storyId);
            if (story) {
                const li = document.createElement('li');
                li.textContent = story.storyText.split(' ').slice(0, 3).join(' ') + '...';
                favoriteStoriesList.appendChild(li);
            }
        });
}

document.getElementById('continueReading').addEventListener('click', function() {
    if (currentStory) {
        viewFullStory(currentStory.storyId);
    }
});

// Load data when the page loads
window.onload = function() {
    loadStories();
    loadFavoriteStories();
    loadUserProfile();
};