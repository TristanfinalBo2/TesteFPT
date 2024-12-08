const path = require("path");
const express = require("express");
const { request } = require("undici");
const { clientId, clientSecret } = require("../config.json");
const axios = require("axios");
const cors = require("cors");
const session = require("express-session");
const tests = [];
const app = express();

// Middleware pentru sesiuni
app.use(
    session({
        secret: "salut13278dbhfSecretSexVulcanicErozivShivaLazzariAlinRodriguezAlexandruBogdanLorenzoMariusDeLaSalciua", // Schimbă cu un secret puternic
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Pune `secure: true` în producție
    })
);

// Setări pentru CORS
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

function formatDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

// Ruta de autentificare
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

        const webhookURL =
            "https://discord.com/api/webhooks/1310239693144723466/ehR7mQySXWJXxCUybPNFqRYayCXeKTCeqEZQEI5KUusz2GADfgWJkJ9u--j8BPiBj2D7";
        const embed = {
            embeds: [
                {
                    title: "Conectare noua!",
                    description: `Email: **${userData.email}** \n Data/Ora: **${formatDate()}**`,
                    color: 16711680,
                },
            ],
        };

        try {
            await axios.post(webhookURL, embed);

            // Stocăm datele utilizatorului în sesiune
            req.session.user = {
                name: userData.global_name,
                id: userData.id,
            };

            res.redirect("/main");
        } catch (error) {
            console.error("Failed to send webhook:", error);
            res.status(500).send("Failed to send webhook.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during authentication.");
    }
});

const fs = require("fs");

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


app.get("/test", (req, res) => {
    const testType = req.query.testType;
    const code = req.query.code;
    const discordId = req.query.discordId;
    const name = req.query.name || 'Unknown';

    if (!/^[\w-]+$/.test(testType) || !/^[\w-]+$/.test(code) || !/^[\w-]+$/.test(discordId)) {
        // You can handle invalid characters in query parameters here if needed
        return res.status(400).send('Invalid characters in query parameters');
    }

    console.log("Test details:", { testType, code, discordId, name });

    let found = false;

    // Loop through the tests to find a match
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];

        if (test.name === name && test.discord === discordId && test.type === testType && test.code === code) {
            found = true;

            // Set the necessary headers
            res.setHeader("X-Test-Type", testType);
            res.setHeader("X-Test-Code", code);
            res.setHeader("X-Test-Discord", discordId);
            res.setHeader("X-Test-Name", name);

            // Read the HTML template
            const htmlPath = path.join(__dirname, "..", "public", "test.html");
            let html = fs.readFileSync(htmlPath, "utf-8");

            // Replace placeholders in the HTML with the data from the session and query parameters
            html = html.replace("{{TEST_TYPE}}", testType)
                       .replace("{{TEST_CODE}}", code)
                       .replace("{{TEST_NAME}}", name)
                       .replace("{{TEST_DISCORD}}", discordId)
                       .replace("{{TEST_TYPE2}}", testType);

            // Send the modified HTML to the client
            return res.send(html);
        }
    }

    // If no matching test was found
    return res.status(200).send("Codul introdus nu este cel atribuit tie!");
});


app.post('/send-webhook', (req, res) => {
    const { code, discordId, testType, name } = req.body;

    if (!code || !discordId || !testType || !name) {
        return res.status(400).send('Missing discordTag, code, or discordId');
    }

    const webhookURL = 'https://discordapp.com/api/webhooks/1313459520357400627/FxZK4fWMHaFro0Tu8EvIK4jgt3u0qWQSSMo47DhAk48IIgs7gTXxwgfgmhhPI8lmmJPg';
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
    
    const tData = {
        name: name,
        discord: discordId,
        type: testType,
        code: code
    }
    console.log("asdasd:",tData)
    tests.push(tData);
    
    axios.post(webhookURL, embed)
        .then(response => {
            res.status(200).send('Webhook sent successfully');
        })
        .catch(error => {
            res.status(500).send('Failed to send webhook');
        });
});

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
                description: `Candidat: <@${discordId}>\nTest: **${testType}**\nRezultat: **${result === "ADMIS" ? "ADMIS" : `RESPINS (${day}.${month})`}**\nTimp ramas: **${remainingTime}**`,
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
                    description: `Candidat: <@${discordId}>\nTest: **${testType}**\nGreseli: **${mistakes}/3**\nIntrebari gresite:\n${mistakeQuestions.map(m => `${m.questionNumber}. ${m.questionText}`).join('\n')}\nTimp ramas: **${remainingTime}**`,
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

const port = 5000;
app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`);
});