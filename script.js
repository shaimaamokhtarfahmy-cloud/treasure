<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helping Verbs Ocean Dive</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            user-select: none;
            background-color: #001f3f;
        }

        #game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Dynamic ocean background gradient */
        #ocean-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, #87CEEB 0%, #1E90FF 25%, #00008B 75%, #000033 100%);
            background-size: 100% 400%;
            background-position: 0% 0%;
            transition: background-position 1.2s ease-in-out;
            z-index: -1;
        }

        #hud {
            position: absolute;
            top: 20px;
            display: flex;
            gap: 20px;
            align-items: center;
            background: rgba(255, 255, 255, 0.95);
            padding: 12px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10;
            flex-wrap: wrap;
            justify-content: center;
        }

        .hud-stat {
            font-weight: bold;
            font-size: 16px;
            color: #001f3f;
        }

        .depth-meter {
            border-left: 2px solid #ccc;
            padding-left: 15px;
            color: #0074d9;
        }

        button.action-btn {
            padding: 10px 20px;
            cursor: pointer;
            background-color: #ff851b;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: 0.2s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }
        button.action-btn:hover:not(:disabled) {
            background-color: #ff6600;
            transform: translateY(-2px);
        }

        /* Submarine and animations */
        #submarine-container {
            position: absolute;
            top: 25%;
            transition: top 1.2s ease-in-out;
        }

        #submarine {
            font-size: 100px;
            filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));
            animation: bobbing 3s ease-in-out infinite;
        }

        .dive-anim { animation: diveDown 1.2s ease-in-out !important; }

        @keyframes bobbing {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
        }

        @keyframes diveDown {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(35px) rotate(18deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }

        #feedback-message {
            position: absolute;
            top: 40%;
            font-size: 32px;
            font-weight: bold;
            color: #ffdc00;
            text-shadow: 2px 2px 6px rgba(0,0,0,0.8);
            z-index: 20;
            opacity: 0;
            pointer-events: none;
        }

        .pop-in {
            animation: popIn 1.5s ease-out forwards;
        }

        @keyframes popIn {
            0% { opacity: 0; transform: scale(0.5); }
            20% { opacity: 1; transform: scale(1.2); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
        }

        /* Quiz Modal Structure */
        .hidden { display: none !important; }

        #quiz-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 30, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 480px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            text-align: center;
        }

        .lesson-box {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 8px;
            border-left: 5px solid #0074d9;
            margin-bottom: 20px;
            text-align: left;
        }

        #lesson-text {
            font-size: 18px;
            line-height: 1.6;
            font-weight: bold;
            color: #001f3f;
            margin: 0 0 8px 0;
        }

        .badge {
            background: #39cccc;
            color: #001f3f;
            padding: 4px 10px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
        }

        #options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
        }

        .opt-btn {
            background-color: #0074d9;
            color: white;
            border: none;
            padding: 12px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
        }

        .opt-btn:hover {
            background-color: #0056b3;
            transform: translateY(-1px);
        }
    </style>
</head>
<body>

<div id="game-container">
    <div id="ocean-bg"></div>

    <div id="hud">
        <div class="hud-stat">Score: <span id="score">0</span></div>
        <div class="hud-stat depth-meter">Depth: <span id="depth">0</span> meters</div>
        <button id="dive-btn" class="action-btn" onclick="openQuiz()">Dive Deeper 🤿</button>
    </div>

    <div id="submarine-container">
        <div id="submarine">🥽 🟡 ⛵ 🎛️</div>
    </div>

    <div id="feedback-message"></div>

    <!-- Quiz Modal Window -->
    <div id="quiz-modal" class="hidden">
        <div class="modal-content">
            <span class="badge" id="level-badge">LEVEL 1</span>
            <div class="lesson-box" style="margin-top: 10px;">
                <p id="lesson-text">Fill in the correct helping verb to complete the sentence.</p>
            </div>
            <h3 id="question-text" style="color: #001f3f; font-size: 20px;">...</h3>
            <div id="options"></div>
        </div>
    </div>
</div>

<script>
    // Helping Verbs Question Database
    const questions = [
        {
            question: "She _____ swimming in the deep ocean right now.",
            options: ["is", "have", "were", "do"],
            answer: 0,
            hint: "Use 'is' for present continuous action with singular subjects (She/He/It)."
        },
        {
            question: "The divers _____ found an ancient underwater cave.",
            options: ["has", "have", "was", "be"],
            answer: 1,
            hint: "Use 'have' with plural subjects (The divers) in present perfect tense."
        },
        {
            question: "We _____ visit the coral reef tomorrow morning.",
            options: ["will", "was", "has", "did"],
            answer: 0,
            hint: "Use 'will' to express future actions."
        },
        {
            question: "They _____ exploring the shipwreck when the storm hit.",
            options: ["are", "were", "have", "do"],
            answer: 1,
            hint: "Use 'were' for past continuous actions with plural subjects."
        },
        {
            question: "_____ you see the giant squid near the trench?",
            options: ["Did", "Has", "Was", "Is"],
            answer: 0,
            hint: "Use 'Did' to ask questions about past actions."
        },
        {
            question: "The submarine _____ descended to the maximum depth.",
            options: ["has", "are", "were", "be"],
            answer: 0,
            hint: "Use 'has' for singular subjects in the present perfect tense."
        }
    ];

    let currentQuestionIndex = 0;
    let depth = 0;
    let score = 0;

    const depthElement = document.getElementById('depth');
    const scoreElement = document.getElementById('score');
    const oceanBg = document.getElementById('ocean-bg');
    const submarine = document.getElementById('submarine');
    const submarineContainer = document.getElementById('submarine-container');
    const quizModal = document.getElementById('quiz-modal');
    const feedbackMessage = document.getElementById('feedback-message');

    function openQuiz() {
        if (currentQuestionIndex >= questions.length) {
            alert("Congratulations! You've completed all depth challenges!");
            return;
        }

        const q = questions[currentQuestionIndex];
        document.getElementById('level-badge').innerText = `DEPTH LEVEL ${currentQuestionIndex + 1}`;
        document.getElementById('lesson-text').innerText = `Grammar Tip: ${q.hint}`;
        document.getElementById('question-text').innerText = q.question;

        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerText = opt;
            btn.onclick = () => handleAnswer(index);
            optionsContainer.appendChild(btn);
        });

        quizModal.classList.remove('hidden');
    }

    function handleAnswer(selectedIndex) {
        quizModal.classList.add('hidden');
        const q = questions[currentQuestionIndex];

        if (selectedIndex === q.answer) {
            score += 100;
            depth += 200;
            scoreElement.innerText = score;
            depthElement.innerText = depth;

            // Trigger dive animations and ocean depth shift
            submarine.classList.add('dive-anim');
            setTimeout(() => submarine.classList.remove('dive-anim'), 1200);

            // Shift background position down to represent deeper waters
            const depthPercentage = Math.min((currentQuestionIndex + 1) * 20, 100);
            oceanBg.style.backgroundPosition = `0% ${depthPercentage}%`;

            showFeedback("Correct Dive! 🌊");
            currentQuestionIndex++;
        } else {
            showFeedback("Oops! Wrong Verb 🧭");
        }
    }

    function showFeedback(msg) {
        feedbackMessage.innerText = msg;
        feedbackMessage.classList.remove('pop-in');
        void feedbackMessage.offsetWidth; // Force CSS reflow
        feedbackMessage.classList.add('pop-in');
    }
</script>

</body>
</html>
