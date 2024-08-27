import { ref, onChildAdded, onValue} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { db } from './main.js';

// Load List of all Topics
export function loadTopicList() {
    $("#topic-list").empty();
    const allTopicRef = ref(db, "chat/");
    onChildAdded(allTopicRef, function(snapshot) {
        const topic = snapshot.key;
        let h = ''
        h += '<div>'
        h += '<li class="topic-item cursor-pointer" data-topic="' + topic + '">';
        h += topic;

        // Delete Button
        h += '<button class="delete-btn px-1" data-key="' + topic + '">';
        h += '<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
        h += '<path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>';
        h += '</svg>';
        h += '<span class="sr-only">Delete</span>';
        h += '</button>';
        h += '</li>';
        h += '</div>'
            
        $("#topic-list").append(h);
    });
}

// Load Msg of Selected Topic
export function loadTopicMessages(topic) {
    $("#discussion").empty();
    const topicRef = ref(db, "chat/" + topic);

    // Retrieve all messages at once
    onValue(topicRef, function(snapshot) {
        const messages = [];
        
        snapshot.forEach(function(childSnapshot) {
            const messageData = childSnapshot.val();
            const key = childSnapshot.key;
            messages.push({ key, ...messageData });
        });

        // Sort messages by like count in descending order
        messages.sort(function(a, b) {
            return b.like - a.like;
        });

        // Display messages
        messages.forEach(function(message) {
            const { key, usericon, author, timestamp, content, like } = message;

            let h = '<div id="' + key + '" class="comment-card">';
            
            // Icon
            h += ' <div class="userblock"><img src="' + usericon + '" class="w-20 h-auto object-cover border-2 border-transparent rounded-full">';
            // Author 
            h += '<p class="username">' + author + '</p>';
            
            // Timestamp
            h += '<p class="timestamp">' + timestamp + '</p></div>';
            
            // Content (Editable)
            h += '<p contentEditable="true" id="' + key + '_update" class="comment-content">';
            h += content;
            h += '</p>';
            
            // Buttons Group
            h += '<div class="actions">';
            
            // Like Button
            h += '<button class="like-btn" data-key="' + key + '">';
            h += '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
            h += '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>';
            h += '</svg>';
            h += '<span class="sr-only">Like</span>';
            h += '</button>';
            
            // Like Count
            h += '<span class="like-count"  data-key="' + key + '">';
            h += like + '</span>';
            
            // Update Button
            h += '<button class="update-btn" data-key="' + key + '">';
            h += '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
            h += '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>';
            h += '<polyline points="22 4 12 14.01 9 11.01"/>';
            h += '</svg>';
            h += '<span class="sr-only">Update</span>';
            h += '</button>';
            
            // Delete Button
            h += '<button class="delete-btn" data-key="' + key + '">';
            h += '<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
            h += '<path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>';
            h += '</svg>';
            h += '<span class="sr-only">Delete</span>';
            h += '</button>';
            
            h += '</div>';
            h += '</div>';

            $("#discussion").append(h);
        });
    });
}

