const path = require("path");
const express = require("express");
const { request } = require("undici");
const { clientId, clientSecret } = require("../config.json");
const axios = require('axios');
const app = express();
const tests = [];

const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5000", "https://teste-medici.vercel.app", "https://teste-medici-fplayt.vercel.app"],
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
const port = 5000;

app.get("/login/discord", (req, res) => {
    const redirectUri = process.env.VERCEL_URL
        ? `https://teste-medici.vercel.app/auth/discord`
        : `http://localhost:${port}/auth/discord`; // Fallback for local development

    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+guilds+email`;
    res.redirect(discordAuthUrl);
});

function formatDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

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
        console.log("User Data:", userData);

        const webhookURL = 'https://discord.com/api/webhooks/1310239693144723466/ehR7mQySXWJXxCUybPNFqRYayCXeKTCeqEZQEI5KUusz2GADfgWJkJ9u--j8BPiBj2D7';
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
            res.redirect(`/main?name=${encodeURIComponent(userData.global_name)}&id=${userData.id}`);
        } catch (error) {
            console.error("Failed to send webhook:", error);
            res.status(500).send("Failed to send webhook.");
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during authentication.");
    }
});

app.get("/test", (req, res) => {
    const testType = req.query.testType;
    const code = req.query.code;
    const discordId = req.query.discordId;
    const name = req.query.name || 'Unknown';


    if (!/^[\w-]+$/.test(testType) || !/^[\w-]+$/.test(code) || !/^[\w-]+$/.test(discordId)) {
        // return res.status(400).send('Invalid characters in query parameters');
    }
    console.log("salut:", tests)
    let found = false;
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];

        if (test.name === name &&
            test.discord === discordId &&
            test.type === testType &&
            test.code === code) {

            found = true;

            res.setHeader("X-Test-Type", testType);
            res.setHeader("X-Test-Code", code);
            res.setHeader("X-Test-Discord", discordId);
            res.setHeader("X-Test-Name", name);

            res.sendFile(path.join(__dirname, "..", "public", "test.html"));
            break;
        }
    }

    if (!found) {
        return res.status(200).send("Codul introdus nu este cel atribuit tie!");
    }
});

app.get("/main", (req, res) => {
    const { name, id } = req.query;
    res.sendFile(path.join(__dirname, "..", "public", "select.html"), {
        headers: {
            "X-User-Name": name, 
            "X-User-Id": id,
        },
    });
});

app.post('/send-webhook', (req, res) => {
    const { code, discordId, testType, name } = req.body;

    if (!code || !discordId || !testType || !name) {
        return res.status(400).send('Missing discordTag, code, or discordId');
    }

    const webhookURL = 'https://discord.com/api/webhooks/1310193037229428786/E3HkJKeYBLw6mMWuLxKGrcrnuqsEjH99TP7SHDIr3j4KZCQo-oRaZ27WTrW4txf48SII';
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
    const { discordId, testType, mistakes, result, mistakeQuestions, message } = req.body;

    if (!discordId || !testType || mistakes == null || !result) {
        // return res.status(400).send('Missing required fields.');
    }

    const webhookURL = 'https://discord.com/api/webhooks/1310193643960795177/bXHk6qaDHSexs-WHT_FUqtmVWTQNG7DntsGX44vivnN63FcOJAan8JcYzKaLkVEsq_Zn';
    const webhookURL2 = 'https://discord.com/api/webhooks/1310193203965857814/lG2-JTePpEH7R1ROq8r2KVoP9R7uNpamhV1RnIOmuwd2ZxuZ1z1SPw-BgQDhO06Bc1oT'
    const today = new Date();
    const futureDate = new Date();

    if (testType == "RADIO") {
        futureDate.setDate(today.getDate() + 2);
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
                    description: `Candidat: <@${discordId}>\nTest: **${testType}**\nGreseli: **${mistakes}/3**\nIntrebari gresite:\n${mistakeQuestions.map(m => `${m.questionNumber}. ${m.questionText}`).join('\n')}`,
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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`);
});
