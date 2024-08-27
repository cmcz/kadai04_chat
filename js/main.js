// Firebase Basic Setting 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

import { loadTopicList, loadTopicMessages } from './interface.js';
import { addEntryToDB ,uploadMsg, updateMsg,removeMsg, increaseLike, removeTopic } from './dataHandler.js';

$(document).ready(function () {
    /////////////////// Default Setting ///////////////////
    $("#topic-modal").hide();
    $("body").removeClass("modal-active");
    loadTopicList();
    const topic = $("#currTopic").text();
    loadTopicMessages(topic);

    /////////////////// New Topic ///////////////////
    // Show pop-up for adding new topic
    $('#show-modal-btn').on('click', function () {
        $('#topic-modal').show();
    });

    // Close the pop-up without submitting
    $('#close-modal-btn').on('click', function () {
        $('#topic-modal').hide();
    });

    // Submit new topic and close the pop-up
    $("#submit-topic").on("click", function () {
        const topic = $("#new-topic").val().trim();
        const content = $("#new-content").val();
        const author = $("#new-author").val();
        const usericon = $("input[name='new-user-icon']:checked").val();

        // Ensure that topic and content are both defined and not empty
        if (typeof topic !== "undefined" && topic !== "" && 
        typeof content !== "undefined" && content !== "" && 
        typeof author !== "undefined" && author !== "" && 
        typeof usericon !== "undefined" && usericon !== "") {

            addEntryToDB(topic, content, author, usericon);
            loadTopicList();
            $("#topic-modal").hide();  
        } else {
            console.error("Error: 'topic' or 'content' is undefined or empty.");
        }

    });

    /////////////////// Add, Remove and Delete Msg ///////////////////
    $("#send").on("click", function() {
        uploadMsg();
        $("#username").val('');
        $("#comment").val('');
        const topic = $("#currTopic").text();
        loadTopicMessages(topic);
    });

    $("#discussion").on("click", ".delete-btn", function() {
        const key = $(this).attr("data-key");
        removeMsg(key);

        const topic = $("#currTopic").text();
        loadTopicMessages(topic);
    });

    $("#discussion").on("click", ".update-btn", function() {
        const key = $(this).attr("data-key");
        updateMsg(key);

        const topic = $("#currTopic").text();
        loadTopicMessages(topic);
    });


    /////////////////// Remove and Delete Topic ///////////////////
    $("#topic-list").on("click", ".delete-btn", function() {
        const key = $(this).attr("data-key");
        removeTopic(key);
        loadTopicList();
    });


    /////////////////// Increase Like ///////////////////
    // Ensure the event handler is attached once
    $("#discussion").on("click", ".like-btn", function() {
        const key = $(this).attr("data-key");
        increaseLike(key);

        const topic = $("#currTopic").text();
        loadTopicMessages(topic);
    });
    
    /////////////////// Mark only Checked Icon ///////////////////
    $("input[name='user-icon']").change(function() {
        $("input[name='user-icon']").siblings("img").removeClass("border-rose-400");
        $("input[name='user-icon']:checked").siblings("img").addClass("border-rose-400");
    });

    $("input[name='new-user-icon']").change(function() {
        $("input[name='new-user-icon']").siblings("img").removeClass("border-rose-400");
        $("input[name='new-user-icon']:checked").siblings("img").addClass("border-rose-400");
    });

    /////////////////// Load Msg of Topic ///////////////////
    $('#topic-list').on('click', 'li', function () {
        const selectedTopic = $(this).attr("data-topic");

        if (selectedTopic) {
            loadTopicMessages(selectedTopic);
            $("#currTopic").text(selectedTopic);
        } else {
            console.error("selectedTopic is not defined. Please make sure it is set before this action.");
        }

    });
});
