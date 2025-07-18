const path = require("path");
const express = require("express");
const { request } = require("undici");
const { clientId, clientSecret } = require("../config.json");
const axios = require("axios");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
const tests = [];

app.use(
    session({
        secret: "StrongSecretKeyHere",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use(cookieParser());

const corsOptions = {
    origin: [
        "https://teste-medici.vercel.app",
        "https://teste-medici-fplayt.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encryptedData: encrypted, iv: iv.toString("hex") };
}

function decrypt(encryptedText, ivHex) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, "hex"));
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login/discord", (req, res) => {
    const redirectUri = process.env.VERCEL_URL
        ? `https://teste-medici.vercel.app/auth/discord`
        : `http://localhost:${port}/auth/discord`;
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email+identify+guilds`;
    res.redirect(discordAuthUrl);
});

app.get("/auth/discord", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Authorization code is missing.");
    }

    const redirectUri = process.env.VERCEL_URL
        ? `https://teste-medici.vercel.app/auth/discord`
        : `http://localhost:${port}/auth/discord`;

    try {
        const tokenResponse = await request("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                scope: "identify",
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const tokenData = await tokenResponse.body.json();

        if (!tokenData.access_token) {
            return res.status(400).send("Failed to retrieve access token.");
        }

        const userResponse = await request("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.body.json();

        req.session.user = {
            name: userData.global_name,
            id: userData.id,
        };

        const embed = {
            content: `Conectare noua! DiscordID: ${userData.id}`,
        };

        axios
            .post("https://discordapp.com/api/webhooks/1313459120266805248/-Qua05_SGaw2-P2nZPvvz8iy2FyXlDTqWh8SYe6L6YYzxOFEfL9CdhB0jWJUbFGRcLgM", embed)
        .then(() => {
            res.status(200).send("Test saved and webhook sent successfully.");
        })
        .catch((error) => {
            console.error("Webhook error:", error);
            res.status(500).send("Failed to send webhook.");
        });

        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during authentication.");
    }
});

app.get("/main", (req, res) => {
    console.log(req.session.user)
    if (!req.session.user) {
        const htmlPath = path.join(__dirname, "..", "public", "index.html");
        let html = fs.readFileSync(htmlPath, "utf-8");
        res.send(html);
        return;
    }

    const { name, id } = req.session.user;

    const htmlPath = path.join(__dirname, "..", "public", "select.html");
    let html = fs.readFileSync(htmlPath, "utf-8");
    html = html.replace("{{USER_NAME}}", name).replace("{{USER_ID}}", id);

    res.send(html);
});

app.post("/send-webhook", (req, res) => {
    if (!req.session.user) {
        const htmlPath = path.join(__dirname, "..", "public", "index.html");
        let html = fs.readFileSync(htmlPath, "utf-8");
        res.send(html);
        return;
    }
    const { code, discordId, testType, name } = req.body;

    if (!code || !discordId || !testType) {
        return res.status(400).send("Missing code, discordId, or testType");
    }

    const encryptedCode = encrypt(code);
    const test = {
        name,
        discord: discordId,
        type: testType,
        code: encryptedCode.encryptedData,
        iv: encryptedCode.iv,
    };

    // Add test to the array
    tests.push(test);

    // Save encrypted tests in cookies
    res.cookie("tests", JSON.stringify(tests), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    const webhookURL = "https://discord.com/api/webhooks/1229451562649391104/jkau0MOI4o6SHmgvERblqRiUMrQCSM_qlV-WBnimdEeGGqgbYQ0EVKBUgvhY6c_bJmrg";
    const embed = {
        content: `Solicitare de cod: <@${discordId}> | <@&1231601122523877417>`,
        embeds: [
            {
                title: "Cod Generat",
                description: `Codul generat pentru <@${discordId}> este: **${code}**. \n Test: **${testType}**`,
                color: 16711680,
            },
        ],
    };

    axios
        .post(webhookURL, embed)
        .then(() => {
            res.status(200).send("Test saved and webhook sent successfully.");
        })
        .catch((error) => {
            console.error("Webhook error:", error);
            res.status(500).send("Failed to send webhook.");
        });
});

function formatMilliseconds(ms) {
    const minutes = Math.floor(ms / 60); // 1 minute = 60000 ms
    const seconds = Math.floor((ms % 60) / 1000); // Get remaining seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Pad seconds to 2 digits
}

app.post('/send-test-result', (req, res) => {
    if (!req.session.user) {
        const htmlPath = path.join(__dirname, "..", "public", "index.html");
        let html = fs.readFileSync(htmlPath, "utf-8");
        res.send(html);
        return;
    }
    const { discordId, testType, mistakes, result, mistakeQuestions, message, remainingTime } = req.body;

    if (!discordId || !testType || mistakes == null || !result || !remainingTime) {
        // return res.status(400).send('Missing required fields.');
    }

    const webhookURL = 'https://discord.com/api/webhooks/1229451562649391104/jkau0MOI4o6SHmgvERblqRiUMrQCSM_qlV-WBnimdEeGGqgbYQ0EVKBUgvhY6c_bJmrg';
    const webhookURL2 = 'https://discord.com/api/webhooks/1229451562649391104/jkau0MOI4o6SHmgvERblqRiUMrQCSM_qlV-WBnimdEeGGqgbYQ0EVKBUgvhY6c_bJmrg';
const today = new Date();
const futureDate = new Date(today); // Clone today's date

if (testType === "RADIO" || testType === "BLS") {
    futureDate.setDate(today.getDate() + 3);
} else if (testType === "REZIDENTIAT") {
    futureDate.setDate(today.getDate() + 5);
}

// Format the date to account for Romania's timezone
const formatter = new Intl.DateTimeFormat('ro-RO', {
    timeZone: 'Europe/Bucharest',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

// Extract day and month
const [day, month] = formatter.format(futureDate).split('.');



    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];

        if (test.discord === discordId && test.type === testType) {
            test.discord = "";
            test.type = "";
            break;
        }
    }

    const embed = {
        embeds: [
            {
                title: `Raport Test`,
                description: `Candidat: <@${discordId}>\nTest: **${testType}**\nRezultat: **${result === "ADMIS" ? "ADMIS" : `RESPINS (${day}.${month})`}**`,
                color: result === "ADMIS" ? 65280 : 16711680,
            },
        ],
    };
    let embed2;
    if (message == "Timpul a expirat!") {
        embed2 = {
            embeds: [
                {
                    title: `Raport TIMP EXPIRAT`,
                    description: `Candidat: <@${discordId}>\nTest: **${testType}**\nGreseli: **${mistakes}/3**\nIntrebari gresite:\n${mistakeQuestions.map(m => `${m.questionNumber}. ${m.questionText}`).join('\n')}`,
                    color: 16711680,
                }
            ]
        };
    }  else {
        embed2 = {
            embeds: [
                {
                    title: `Raport Greseli`,
                    description: `Candidat: <@${discordId}>\nTest: **${testType}**\nGreseli: **${mistakes}/3**\nIntrebari gresite:\n${mistakeQuestions.map(m => `${m.questionNumber}. ${m.questionText}`).join('\n')}\nTimp ramas: **${formatMilliseconds(remainingTime)}**`,
                    color: result === "ADMIS" ? 65280 : 16711680,
                }
            ]
        };
    }


    // Send both webhooks
    axios.post(webhookURL, embed)
        .then(() => {
            return axios.post(webhookURL2, embed2);
        })
        .then(() => {
            // res.status(200).send('Webhook sent successfully');
        })
        .catch(error => {
            // res.status(500).send('Webhook error');
        });
});

function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

app.get("/test", (req, res) => {
    if (!req.session.user) {
        const htmlPath = path.join(__dirname, "..", "public", "index.html");
        let html = fs.readFileSync(htmlPath, "utf-8");
        res.send(html);
        return;
    }
    const testType = req.query.testType;
    const code = req.query.code;
    const discordId = req.query.discordId;
    const name = req.query.name || 'Unknown';
    const storedTests = req.cookies.tests ? JSON.parse(req.cookies.tests) : [];

    // Decrypt the codes in stored tests
    const decryptedTests = storedTests.map((test) => {
        return {
            ...test,
            code: decrypt(test.code, test.iv),
        };
    });
    if (!/^[\w-]+$/.test(testType) || !/^[\w-]+$/.test(code) || !/^[\w-]+$/.test(discordId)) {
        // You can handle invalid characters in query parameters here if needed
        return res.status(400).send('Invalid characters in query parameters');
    }

    let found = false;

    for (let i = 0; i < decryptedTests.length; i++) {
        const test = decryptedTests[i];
        if (test.discord === discordId && test.type === testType && test.code === code) {
            found = true;

            res.setHeader("X-Test-Type", testType);
            res.setHeader("X-Test-Code", code);
            res.setHeader("X-Test-Discord", discordId);
            res.setHeader("X-Test-Name", name);

            const htmlPath = path.join(__dirname, "..", "public", "test.html");
            let html = fs.readFileSync(htmlPath, "utf-8");

            html = html.replace("{{TEST_TYPE}}", testType)
                       .replace("{{TEST_CODE}}", code)
                       .replace("{{TEST_NAME}}", name)
                       .replace("{{TEST_DISCORD}}", discordId)
                       .replace("{{TEST_TYPE2}}", testType);

            return res.send(html);
        }
    }

    return res.status(200).send("Codul introdus nu este cel atribuit tie!");
});

// Example route to clear cookies
app.get("/clear-tests", (req, res) => {
    res.clearCookie("tests");
    res.send("Tests cleared!");
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});