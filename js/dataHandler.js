import { ref, push, update, remove} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { db } from './main.js';

// Add new entry to DB
export function addEntryToDB(topic, content, author, usericon) {
    const topicRef = ref(db, "chat/" + topic);
    const timestamp = new Date(Date.now());
    const formattedTimestamp = timestamp.toLocaleString();

    const data = {
        author: author,
        content: content,
        like: 0,
        timestamp: formattedTimestamp,
        usericon: usericon
    };

    push(topicRef, data)
        .then(() => {
            console.log("Topic added successfully!");
        })
        .catch((error) => {
            console.error("Error adding topic: ", error);
        });
} 


// Add, Remove, Update msg
export function uploadMsg() {
    const topic = $("#currTopic").text();
    const username = $("#username").val().trim();
    const comment = $("#comment").val();
    const usericon = $("input[name='user-icon']:checked").val();
    
    if (typeof topic !== "undefined" && topic !== "" && 
    typeof comment !== "undefined" && comment !== "" && 
    typeof username !== "undefined" && username !== "" && 
    typeof usericon !== "undefined" && usericon !== "") {
        addEntryToDB(topic, comment, username, usericon);
    } else {
        console.error("Error: 'topic' or 'comment' or 'username' is undefined or empty.");
    }
}

export function removeMsg(key) {
    const topic = $("#currTopic").text();
    const remove_item = ref(db, "chat/" + topic + "/" + key);
    remove(remove_item);
    alert('Msg is removed');
}

export function updateMsg(key) {
    const topic = $("#currTopic").text();
    const update_item = ref(db, "chat/" + topic + "/" + key);
    update(update_item, {
        content: $("#" + key + '_update').html()
    });
    alert('Msg is updated');
}

// Add likes
export function increaseLike(key) {
    const topic = $("#currTopic").text();
    const update_item = ref(db, "chat/" + topic + "/" + key);

    var currLikeCount = $('span.like-count[data-key="' + key + '"]').text();
    var formatedCrrLikeCount = parseInt(currLikeCount, 10); 
    const newLikeCount = formatedCrrLikeCount + 1;

    update(update_item, { like: newLikeCount })
        .then(() => {
            console.log("Like count updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating like count: ", error);
        });

}

// Remove Topic
export function removeTopic(topic) {
    const remove_item = ref(db, "chat/" + topic);
    remove(remove_item);
    alert('Topic is removed');
}
