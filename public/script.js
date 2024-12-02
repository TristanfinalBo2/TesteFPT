document.addEventListener("DOMContentLoaded", () => {
    const blsQuestions = [
        { question: "Ce rol are gulerul cervical?", options: ["Imobilizarea zonei cervicale", "Imobilizarea zonei lombare", "Imobilizarea coloanei vertebrale", "Oprirea sângerării in zona cervicală"], correct: 0 },
        { question: "In caz de căi respiratorii blocate trebuie sa incepem direct manevrele de resurscitare.", options: ["Adevarat", "Fals"], correct: 1 },
        { question: "Daca pacientul se prezinta cu dureri de cap  ce medicament ii prescrie medicul ?", options: ["Morfina", "Nurofen", "Vitamine A,B,C..."], correct: 1 },
        { question: "Care este acțiunea corectă în gestionarea unui pacient înecat în stop cardio-respirator?", options: ["Administrarea de NUROFEN", "Începe manevrele de resuscitare cardio-respiratorie (CPR)", "Îi administrezi antibiotice"], correct: 1 },
        { question: "Cum tratezi durerile insuportabile ale pacientului după un accident?", options: ["Aplici guler cervical", "Monteazi atela și o strângi pe piciorul pacientului", "Injectezi intra-venos 0.25-0.50 ml de morfina"], correct: 2 },
        { question: "Cum acționezi în cazul unui pacient în stare de șoc anafilactic din cauza alergiilor?", options: ["Aplici compresii reci pentru a reduce inflamatia", "Injectezi hidrocortizon intra venos", "Începi masajul cardiac oferind 30 de compresii cu 2 ventilatii"], correct: 1 },
        { question: "Te prezenti la un accident de motocicleta si constatati ca pacientul este in stop cardio respirator?", options: ["Faci masajul cardiac 15 compresii", "Încrucisezi mainile pe pieptul lui si incepi masajul cardiac oferind 20 compresii cu 3 ventilatii", "Începi masajul cardiac oferind 30 compresii cu 2 ventilatii"], correct: 2 },
        { question: "Ce faci dacă după ce examinezi pacientul, constați că are arsuri de gradul 1?", options: ["Aplici BETADINA peste arsuri", "Ia din geantă DERMAZIN și îi aplică cremă în strat generos", "Ii injectam MORFINA pentru dureri insuportabile"], correct: 1 },
        { question: "Cum elimini obiectul neidentificat care blocheaza caiile respiratorii ?", options: ["Îi deschizi gura pacientul si incerci cu doua degete sa extragi obiectul", "Aplici guler cervical", "Intorduci degetele pe gatul pacientului si incerci sa scoti obiectul"], correct: 0 },
        { question: "Ce faci dacă pacientul are genunchiul luxat?", options: ["Cureți și dezinfecteazi răniile", "Îi administreazi morfină", "Montezi atelă și o strângi pe piciorul pacientului"], correct: 2 },
        { question: "Morfina se utilizeaza pentru tratarea durerilor insuportabile in urmatoarele cantitati:", options: ["0,20-0,5 ml", "0,25-0,5 ml", "0,24-0,5 ml"], correct: 1 },
        { question: "In caz de alergii se va administra Hidrocortizon injectabil in cantatitate de 100-501 mg", options: ["Adevarat", "Fals"], correct: 1 },
        { question: "Raceala se trateaza cu Parasinus sau Paracetamol.", options: ["Adevarat", "Fals"], correct: 0 },
        { question: "In cazul unei arsuri de grad 1 se va aplica Dermazin?", options: ["Adevarat", "Fals"], correct: 0 },
        { question: "In cazul unui stop cardio-respirator se vor aplica 30 de compresii toracice si o ventilatie.", options: ["Adevarat", "Fals"], correct: 1 },
        { question: "Cu ce se pot curata ranile?", options: ["Alcool Sanitar", "Betadina","Betadina si apa carbogazoasa"], correct: 1 },
        { question: "Ce inseamna metoda P.A.S ?", options: ["Priveste, Asculta, Simte", "Palpeaza, Analizeaza, Simte","Priveste, Analizeaza, Simte"], correct: 0 },
    ];
    const radioQuestions = [
        { question: "radio", options: ["Fier", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
    ];
    const rezidentiatQuestions = [
        { question: "rezi", options: ["Fier", "Hidrocortizon", "Paracetamol", "Vitamina C"], correct: 0 },
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
