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

// Middleware for session management
app.use(
    session({
        secret: "StrongSecretKeyHere", // Change this to a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set secure to true in production
    })
);

// Middleware for cookies
app.use(cookieParser());

// CORS settings
const corsOptions = {
    origin: [
        "http://localhost:5000",
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

// Encryption helper functions
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Secure encryption key
const iv = crypto.randomBytes(16); // Initialization vector

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

// Routes
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

        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during authentication.");
    }
});

app.get("/main", (req, res) => {
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

// Store tests in cookies and send webhook
app.post("/send-webhook", (req, res) => {
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

    const webhookURL = "https://discordapp.com/api/webhooks/1313459520357400627/FxZK4fWMHaFro0Tu8EvIK4jgt3u0qWQSSMo47DhAk48IIgs7gTXxwgfgmhhPI8lmmJPg";
    const embed = {
        content: `Solicitare de cod: <@${discordId}>`,
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
    const minutes = Math.floor(ms / 60000); // 1 minute = 60000 ms
    const seconds = Math.floor((ms % 60000) / 1000); // Get remaining seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Pad seconds to 2 digits
}

app.post('/send-test-result', (req, res) => {
    const { discordId, testType, mistakes, result, mistakeQuestions, message, remainingTime } = req.body;

    if (!discordId || !testType || mistakes == null || !result || !remainingTime) {
        // return res.status(400).send('Missing required fields.');
    }

    const webhookURL = 'https://discordapp.com/api/webhooks/1313458958622785546/iJ6oCqddzeYIBgyJTceWPuaxKx2ArUe-T8t0JoRmMgWyLJg-5Ozu3fV0T70ewZJwqIYO';
    const webhookURL2 = 'https://discordapp.com/api/webhooks/1313459120266805248/-Qua05_SGaw2-P2nZPvvz8iy2FyXlDTqWh8SYe6L6YYzxOFEfL9CdhB0jWJUbFGRcLgM';
    const today = new Date();
    const futureDate = new Date();

    if (testType == "RADIO") {
        futureDate.setDate(today.getDate() + 3);
    } else if (testType == "BLS") {
        futureDate.setDate(today.getDate() + 3);
    } else if (testType == "REZIDENTIAT") {
        futureDate.setDate(today.getDate() + 5);
    }

    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');

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

// Load tests from cookies
app.get("/load-tests", (req, res) => {
    const storedTests = req.cookies.tests ? JSON.parse(req.cookies.tests) : [];

    // Decrypt the codes in stored tests
    const decryptedTests = storedTests.map((test) => {
        return {
            ...test,
            code: decrypt(test.code, test.iv),
        };
    });

    res.json(decryptedTests);
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
