function loadChat() {

    const pageContent =
        document.getElementById("page-content");


    if (!pageContent) {
        return;
    }


    pageContent.innerHTML = `

        <section class="chat-page">

            <div class="container py-5">

                <div class="chat-page-header">

                    <span class="hero-label">
                        WEATHERGPT
                    </span>


                    <h1>
                        Ask WeatherGPT
                    </h1>


                    <p>
                        Ask about current weather,
                        forecasts, alerts and historical
                        weather conditions.
                    </p>

                </div>


                <!-- CHAT CARD -->

                <div class="chat-container">


                    <!-- CHAT MESSAGES -->

                    <div
                        id="chatMessages"
                        class="chat-messages"
                    >

                        <div class="chat-message bot">

                            <div class="chat-message-name">
                                WeatherGPT
                            </div>

                            <div class="chat-message-text">

                                Hello! Ask me about the
                                weather in any city.

                                <br><br>

                                Example:
                                "What is the weather
                                in Hyderabad today?"

                            </div>

                        </div>

                    </div>


                    <!-- INPUT -->

                    <div class="chat-input-area">

                        <input
                            type="text"
                            id="chatInput"
                            placeholder="Ask WeatherGPT..."
                            autocomplete="off"
                        >


                        <button
                            type="button"
                            id="chatSendButton"
                        >
                            Send
                        </button>

                    </div>


                    <div
                        id="chatStatus"
                        class="chat-status"
                    ></div>

                </div>

            </div>

        </section>

    `;


    initializeChat();

}


/* ==================================================
   CHAT INITIALIZATION
================================================== */

function initializeChat() {

    const input =
        document.getElementById(
            "chatInput"
        );


    const sendButton =
        document.getElementById(
            "chatSendButton"
        );


    const messages =
        document.getElementById(
            "chatMessages"
        );


    const status =
        document.getElementById(
            "chatStatus"
        );


    if (
        !input ||
        !sendButton ||
        !messages
    ) {

        return;

    }


    /* ==================================================
       SEND MESSAGE
    ================================================== */

    async function sendMessage() {

        const question =
            input.value.trim();


        if (!question) {

            return;

        }


        /* Add user message */

        addChatMessage(
            "user",
            question
        );


        input.value = "";


        sendButton.disabled =
            true;


        sendButton.textContent =
            "Thinking...";


        status.textContent =
            "WeatherGPT is checking the weather...";


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:8000/api/chat",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            question:
                                question

                        })

                    }
                );


            const result =
                await response.json();


            console.log(
                "Chat API:",
                result
            );


            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    `Chat request failed (${response.status})`
                );

            }


            if (
                result.status !== "success" ||
                !result.answer
            ) {

                throw new Error(
                    "No answer received from WeatherGPT."
                );

            }


            addChatMessage(
                "bot",
                result.answer
            );


            status.textContent =
                "";


        } catch (error) {

            console.error(
                "Chat error:",
                error
            );


            addChatMessage(
                "bot",
                `Sorry, I could not process that request. ${error.message}`
            );


            status.textContent =
                "Unable to connect to WeatherGPT.";

        }


        finally {

            sendButton.disabled =
                false;


            sendButton.textContent =
                "Send";


            input.focus();

        }

    }


    /* ==================================================
       SEND BUTTON
    ================================================== */

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    /* ==================================================
       ENTER
    ================================================== */

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* ==================================================
       ADD MESSAGE
    ================================================== */

    function addChatMessage(
        type,
        text
    ) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            `chat-message ${type}`;


        const name =
            type === "user"
                ? "You"
                : "WeatherGPT";


        message.innerHTML = `

            <div class="chat-message-name">
                ${name}
            </div>

            <div class="chat-message-text"></div>

        `;


        message.querySelector(
            ".chat-message-text"
        ).textContent =
            text;


        messages.appendChild(
            message
        );


        messages.scrollTop =
            messages.scrollHeight;

    }

}