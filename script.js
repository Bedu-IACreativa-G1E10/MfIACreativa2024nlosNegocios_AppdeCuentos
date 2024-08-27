let currentStory = null;

function showScreen(screenId) {
    const screens = ['dashboard', 'storyCreation', 'storyList', 'userProfile', 'settings', 'viewFullStory'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = screen === screenId ? 'block' : 'none';
    });

    // Show/hide Continue Reading button
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
        alert("Story saved successfully!");
        addStoryToList(storyText);
        showScreen('storyList');
    } else {
        alert("Please generate or write a story first.");
    }
}

function addStoryToList(storyText) {
    const storyList = document.getElementById('storyListContainer');
    const storyItem = document.createElement('div');
    storyItem.className = 'story-item';
    const title = storyText.split(' ').slice(0, 3).join(' ') + '...';
    storyItem.innerHTML = `
        <h3>${title}</h3>
        <img src="/api/placeholder/200/150" alt="Story Illustration" class="story-image">
        <p>${storyText.substring(0, 100)}...</p>
        <button onclick="viewFullStory('${title}', '${storyText}')">View Full Story</button>
    `;
    storyList.appendChild(storyItem);
}

function viewFullStory(title, storyText) {
    currentStory = { title, storyText };
    document.getElementById('fullStoryTitle').innerText = title;
    document.getElementById('fullStoryContent').innerText = storyText;
    document.getElementById('fullStoryImage').src = '/api/placeholder/400/300';
    showScreen('viewFullStory');
    document.getElementById('continueReading').style.display = 'block';
}

document.getElementById('continueReading').addEventListener('click', function() {
    if (currentStory) {
        viewFullStory(currentStory.title, currentStory.storyText);
    }
});

// Initialize with some sample stories
addStoryToList("Sunny Day Adventure: Join Alex and his friends on a sunny adventure through the park...");
addStoryToList("Magic Unicorn: Discover the magical land of unicorns with Emily and her magical friend...");
addStoryToList("Space Rocket: Blast off with Sam on an exciting journey through space on his rocket...");
