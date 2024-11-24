document.addEventListener("DOMContentLoaded", () => {
    const blsQuestions = [
        { question: "g", options: ["Fier", "Hidrocortizon", "3", "Vitamina C"], correct: 0 },
        { question: "v", options: ["Fier", "Hidrocortizon", "5", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f4", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f5", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["6", "sc", "a", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f6", "Hidrocortizon", "g", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["y", "c", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["g", "Hidrocortizon", "t", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["b", "v", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["1", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["4", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["6", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
    ];
    const radioQuestions = [
        { question: "radio", options: ["Fier", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "asd", options: ["Fier", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "ve", options: ["Fier", "Hidrocortizon", "v", "Vitamina C"], correct: 0 },
        { question: "d", options: ["Fier", "Hidrocortizon", "a", "Vitamina C"], correct: 0 },
        { question: "g", options: ["Fier", "Hidrocortizon", "3", "Vitamina C"], correct: 0 },
        { question: "v", options: ["Fier", "Hidrocortizon", "5", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f4", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f5", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["6", "sc", "a", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f6", "Hidrocortizon", "g", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["y", "c", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["g", "Hidrocortizon", "t", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["b", "v", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["1", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["4", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["6", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
    ];
    const rezidentiatQuestions = [
        { question: "rezi", options: ["Fier", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "asd", options: ["Fier", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "ve", options: ["Fier", "Hidrocortizon", "v", "Vitamina C"], correct: 0 },
        { question: "d", options: ["Fier", "Hidrocortizon", "a", "Vitamina C"], correct: 0 },
        { question: "g", options: ["Fier", "Hidrocortizon", "3", "Vitamina C"], correct: 0 },
        { question: "v", options: ["Fier", "Hidrocortizon", "5", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f4", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f5", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["6", "sc", "a", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["f6", "Hidrocortizon", "g", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["y", "c", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["g", "Hidrocortizon", "t", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["b", "v", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["1", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["4", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
        { question: "Ce medicament administrezi unui pacient aflat în stare de anemie?", options: ["6", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
    ];
    const urlParams = new URLSearchParams(window.location.search);
    const testType = urlParams.get("testType");

    let questions;
    let time;
    let discordId = urlParams.get("discordId");
    switch (testType) {
        case "RADIO":
            questions = radioQuestions;
            time = 300000;
            break;
        case "BLS":
            questions = blsQuestions;
            time = 600000;
            break;
        case "REZIDENTIAT":
            questions = rezidentiatQuestions;
            time = 900000;
            break;
        default:
            Toastify({
                text: "Testul nu a fost găsit.",
                duration: 5000, 
                gravity: "top", 
                position: "right", 
                backgroundColor: "#eb2d2d",
                style: {
                    fontFamily: "Gilroy-Medium", 
                    boxShadow: "none"
                }
            }).showToast();
            return;
    }

    let currentIndex = 0;
    let mistakes = 0;
    let userMistakes = [];
    let completedQuestions = [];
    let countDownDate = new Date().getTime() + time;

    const questionElement = document.querySelector(".question");
    const optionsContainer = document.querySelector(".test-options");
    const questionIndexElement = document.querySelector(".question-index");
    const mistakesCountElement = document.querySelector(".mistakes-count");
    const resultElement = document.querySelector(".test-result");

    function renderQuestion(index) {
        const { question, options } = questions[index];
        questionElement.textContent = question;
        optionsContainer.innerHTML = options
            .map((opt, i) => `
                <div class="option" data-index="${i}">
                    <div class="ball"></div>
                    <span>${opt}</span>
                </div>
            `)
            .join("");
        questionIndexElement.textContent = `${index + 1}/${questions.length}`;
    }

    setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        if (distance < 0) {
            endTest("Timpul a expirat!", false);
            return;
        }
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timp").textContent = `${minutes}m ${seconds}s`;
    }, 1000);

    function handleOptionClick(e) {
        const option = e.target.closest(".option");
        if (!option) return;

        const active = optionsContainer.querySelector(".option.active");
        if (active) {
            Toastify({
                text: "Trebuie să ștergeți răspunsul înainte de a selecta altă opțiune!",
                duration: 5000, 
                gravity: "top", 
                position: "right", 
                backgroundColor: "#eb2d2d",
                style: {
                    fontFamily: "Gilroy-Medium", 
                    boxShadow: "none"
                }
            }).showToast();
            return;
        }

        option.classList.add("active");
        option.querySelector(".ball").classList.add("active");
    }

    function handleClearAnswer() {
        optionsContainer.querySelectorAll(".option").forEach(opt => opt.classList.remove("active"));
        optionsContainer.querySelectorAll(".ball").forEach(ball => ball.classList.remove("active"));
    }

    function handleSendAnswer() {
        const selected = optionsContainer.querySelector(".option.active");
        if (!selected) {
            Toastify({
                text: "Selectați un răspuns!",
                duration: 5000, 
                gravity: "top", 
                position: "right", 
                backgroundColor: "#eb2d2d",
                style: {
                    fontFamily: "Gilroy-Medium", 
                    boxShadow: "none"
                }
            }).showToast();
            return;
        }
        const selectedIndex = parseInt(selected.dataset.index);
    
        if (selectedIndex !== questions[currentIndex].correct) {
            mistakes++;
            mistakesCountElement.textContent = `${mistakes}/3`;
    
            userMistakes.push({
                questionNumber: currentIndex + 1, // Indexul întrebării (+1 pentru a începe de la 1)
                questionText: questions[currentIndex].question,
            });
    
            if (mistakes >= 3) {
                return endTest("Din păcate nu ai reușit să promovezi testul.", false);
            }
        }
    
        completedQuestions.push(currentIndex);
        goToNextQuestion();
    }

    function goToNextQuestion() {
        currentIndex++;
        if (currentIndex >= questions.length) {
            endTest("Felicitări! Ai promovat testul!", true);
            return;
        }
        renderQuestion(currentIndex);
    }

    
    function endTest(message, isPassed) {
        document.querySelector(".test-wrapper").style.display = "none";
        resultElement.style.display = "flex";
        resultElement.querySelector("span").textContent = message;

        const resultData = {
            discordId: discordId,
            testType: testType,
            mistakes: userMistakes.length,
            mistakeQuestions: userMistakes, // Array complet cu întrebări greșite
            result: isPassed ? "ADMIS" : "RESPINS",
            message: message
        };

        // Trimite datele către serverul Express
        fetch("/send-test-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resultData), // Trimite datele în format JSON
        })
            .then(response => response.json())
            .then(data => console.log("Test result sent:", data))
            .catch(error => console.error("Error sending test result:", error));
    }

    optionsContainer.addEventListener("click", handleOptionClick);
    document.querySelector(".clear-answer").addEventListener("click", handleClearAnswer);
    document.querySelector(".send-answer").addEventListener("click", handleSendAnswer);

    questions = questions.sort(() => Math.random() - 0.5);

    questions = questions.map(q => {
        const shuffledOptions = q.options.map((option, index) => ({ option, index }))
                                        .sort(() => Math.random() - 0.5);
        const newCorrectIndex = shuffledOptions.findIndex(opt => opt.index === q.correct);
        return {
            question: q.question,
            options: shuffledOptions.map(opt => opt.option),
            correct: newCorrectIndex,
        };
    });

    renderQuestion(currentIndex);
});
