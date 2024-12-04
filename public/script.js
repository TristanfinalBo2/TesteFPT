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
        { question: "Te afli alături de un coleg intr-un echipaj si ai preluat ultimul apel. Cum anunti pe statie?", options: ["M-callsign+1 10-1", "M-callsign 10-1", "M-callsign+1 10-11", "M-callsign 10-55"], correct: 0 },
        { question: "Esti impreuna cu doi colegi spre un apel, intre timp ati facut accident si nu mai puteti continua drumul spre apel. PE STATIE ANUNTI: M-callsign+1 am facut 10-50(major/minor) solicit un 10-78 la urmatorul 10-20?", options: ["Adevarat", "Fals"], correct: 0 },
        { question: "Te afli singur in masina in zona Groove, iar doua persoane mascate trag focuri de arma in directia ta, punandu-te in pericol. Cum anunti aceasta actiune pe statie?", options: ["M-callsign +1 10-0 la 10-20 Groove", "M-callsign 10-0 la 10-20 Groove", "M-callsign 10-11 la 10-20 Groove", "M-callsign 10-39 la 10-20 Groove"], correct: 1 },
        { question: "Ai mers la un apel, ai preluat pacientul si acum te indrepti spre spital. Cum anunti aceasta actiune pe statie?", options: ["M-callsign am un 10-95 constient/inconstient, 10-76 catre Spital Viceroy", "M-callsign 10-76 catre Spital Viceroy", "M-callsign am un 10-95 constient/inconstient", "M-callsign 10-55, am un 10-95 constient/inconstient, 10-76 catre Spital Viceroy"], correct: 0 },
        { question: "Un politist a intrat pe statie si solicita un echipaj medical la ultimul cod 4, dupa ce a raspuns gradul superior medical pe statie si a solicitat un medic sa mearga la cod 4,cum raspunzi pe statie ca preiei codul 4?", options: ["M-callsign 10-13", "M-callsign 10-1", "M-callsign 10-55", "M-callsign 10-20"], correct: 0 },
        { question: "Pe statie a intrat un politist si solicita un medic la un cod 4, cum raspunzi? (esti cel mai mare grad de pe tura/niciun grad superior nu raspunde pe statie)", options: ["M-callsign+ GRAD +NUME 10-4 10-13", "M-callsign +NUME 10-4 10-13", "M-callsign +GRAD 10-4 10-13", "GRAD+NUME 10-4 10-13"], correct: 0 },
        { question: "Te afli la un apel alaturi de un coleg, iar dupa ce ati stabilizat pacientul si i-ati acordat primul ajutor la fata locului, acesta va spune ca NU doreste transport la spital. Cum anunti pe statie?", options: ["M-callsign 10-55", "M-callsign+1 10-55", "M-callsign+1 10-76", "M-callsign+1 10-95 constient/inconstient, 10-76 Spital Viceroy"], correct: 1 },
        { question: "Cum se anunta o regrupare pe dispecer si statie? (Aceasta este anuntata de medicii ce detin gradul de Supervizor Regrupari)", options: ["M-callsign 10-39 10-20 helipad", "M-callsign 10-33 10-20 helipad", "M-callsign 10-20 helipad", "M-callsign 10-39", "M-callsign 10-33"], correct: 0 },
        { question: "Este un cod 0 in desfasurare si nu se intelege nimic pe statie , in acest caz tu vrei sa faci liniste, cum spui pe statie?", options: ["M-callsign 10-33", "M-callsign 10-39", "M-callsign 10-41", "M-callsign 10-9"], correct: 0 },
        { question: "Care dintre urmatoarele coduri se folosesc pe dispecer?", options: ["M-callsign 10-4", "M-callsign 10-9", "M-callsign 10-100"], correct: 2 },
    ];
    const rezidentiatQuestions = [
        { question: "Care aparat folosim pentru operația de scoatere a unui tatuaj?", options: ["Laser", "Bisturiu", "Camera video in miniatura", "Pensa chirugicala"], correct: 0 },
        { question: "Ce substanță este utilizată pentru anestezia locală în operația de scoatere a glonțului?", options: ["Xilina", "Propofol", "Ketamina", "Morfina"], correct: 0 },
        { question: "Cum se tratează o coastă ruptă în timpul unei intervenții chirurgicale?", options: ["Umplem fisurile cu oseina", "Montam placuta de titan"], correct: 1 },
        { question: "Ce instrument este folosit pentru a observa meniscul în timpul operației de ruptură a meniscului?", options: ["o cameră video mică", "Raze X", "RMN", "Poze cu telefonul"], correct: 0 },
        { question: "Ce substanță este utilizată pentru anestezia totală în operația de hernie de disc la nivelul vertebrei L4?", options: ["Propofol", "Xilina", "Atropina", "Paracetamol"], correct: 0 },
        { question: "Ce instrument folosim pentru a observa fisuri  pe o coastă ruptă în timpul unei intervenții chirurgicale?", options: ["2 departatoare", "Port ac si fir de sutura", "Tija metalica", "Nimic"], correct: 0 },
        { question: "Care anestezie se foloseste in cazul unei operatii de indepartare a tatuajelor?", options: ["Nu se foloseste", "Anestezie locala", "Anestezie rahiala", "Anestezie totala"], correct: 0 },
        { question: "Ce substanță este injectată în coloana vertebrală pentru anestezia rahianestezică în operația de apendicită?", options: ["Tetracaina", "Morfina", "Calciu in perfuzie"], correct: 0 },
        { question: "Cum se tratează un tendon fisurat în timpul unei intervenții chirurgicale la nivelul umărului?", options: ["Suturam tendonul cu ajutorul unui port-ac si fir de sutura", "Capsator medicinal", "Lampa UV"], correct: 0 },
        { question: "La nivelul carei vertebre se face incizia in cazul unei operatii pentru hernia de disc?", options: ["Vertebra L4", "Vertebra C1", "Vertebra X2", "Vertebra L3"], correct: 0 },
        { question: "Ce instrumentar medical se foloseste pentru a extrage glontul in cazul unei plagi impuscate?", options: ["Pensa chirurgicala", "Port ac si fir de sutura", "Foarfeca", "Cu mana"], correct: 0 },
        { question: "Ce se foloseste pentru a cuprinde cele doua capete rupte in cazul unei coaste rupte?", options: ["Tija", "Atela gipsata", "Bandaj steril", "2 departatoare"], correct: 0 },
        { question: "In cazul unei operatii de apendicita, ce trebuie sa asteptam dupa ce bandajam si finalizam operatia?", options: ["Sa se trezeasca pacientul", "Adminsitram morfina", "Ii punem perfuzie", "Ii dam doua palme"], correct: 0 },
        { question: "In cazul oricai operatii care are loc sub anestezie totala, ce este important sa ii montam pacientului?", options: ["Masca de oxigen", "Masca cu dioxid de carbon", "Tuburi cu apa", "Tuburi cu apa"], correct: 0 },
        { question: "In cazul unei fracturi, ce aparatura medicale folosim pentru a diagnostica pacientul?", options: ["Radiografie", "Ecografie", "Endoscopie", "RMN"], correct: 0 },
        { question: "In cazul carei interventii chirurgicale folosesti anestezia locala?", options: ["Ruptura de menisc", "Hernie de disc", "Fisuri osoase"], correct: 0 },
        { question: "In cazul carei interventii chirurgicale folosesti anestezia generala?", options: ["Coasta rupta", "Tendon fisurat", "Ruptura de menisc"], correct: 0 },
        { question: "Unde este situata apendicita?", options: ["In zona abdomenului", "In zona spatelui", "In zona pieptului"], correct: 0 },
        { question: "Ce antibiotice se prescriu post-operator?", options: ["Tetracilina", "Voltaren", "Maltofer"], correct: 0 },
        { question: "Cu ce dezinfectezi rănile?", options: ["Compersii nesterile", "Betadina si apa oxigenta", "Apa distiliata"], correct: 1 },
        { question: "Ce se ofera pentru dureri de spate?", options: ["No-Spa", "Diclofenac Sodic", "Paracetamol"], correct: 1 },
        { question: "Cu ce aparat se face Radiografia?", options: ["Aparat cu raze UV", "Aparat cu raze X", "Aparat cu UR"], correct: 1 },
        { question: "Cum se numeste procedura de scanare a organelor cu ajutorul undelor radio?", options: ["RMN", "Radiografie", "EKG"], correct: 0 },
        { question: "Pentru ce folosesti garoul?", options: ["Pentru strangerea antebrațului", "Pentru imobilizarea spatelui", "Pentru imobilizarea gatului"], correct: 0 },
        { question: "Cum faci staza pe rana?", options: ["Folosesti compresii sterile si apesi tare pe rana", "Folosesti compresii sterile si apesi incet pe rana", "Folosesti apa oxigenata"], correct: 0 },

    ];
    const urlParams = new URLSearchParams(window.location.search);
    const testType = urlParams.get("testType");
    let countDownDate;
    let questions;
    let time;
    let discordId = urlParams.get("discordId");
    switch (testType) {
        case "RADIO":
            questions = radioQuestions;
            time = 180000;
            break;
        case "BLS":
            questions = blsQuestions;
            time = 300000;
            break;
        case "REZIDENTIAT":
            questions = rezidentiatQuestions;
            time = 420000;
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
    countDownDate = new Date().getTime() + time;

    let currentIndex = 0;
    let mistakes = 0;
    let userMistakes = [];
    let completedQuestions = [];

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

    let timeInterval; // To store the interval ID
    let remainingTime = countDownDate - new Date().getTime(); // Store remaining time
    
    function startInterval() {
        timeInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;
    
            if (distance <= 0) {
                clearInterval(timeInterval); // Stop the interval
                endTest("Timpul a expirat!", false);
                return;
            }
    
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("timp").textContent = `${minutes}m ${seconds}s`;
        }, 1000);
    }
    
    function stopInterval() {
        clearInterval(timeInterval);
        remainingTime = countDownDate - new Date().getTime(); // Save remaining time
    }
    
    function resumeInterval() {
        countDownDate = new Date().getTime() + remainingTime; // Adjust the countdown date
        startInterval(); // Restart the interval
    }

    startInterval()

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
