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
        secret: "salut13278dbhfSecretSexVulcanicErozivShivaLazzariAlinRodriguezAlexandruBogdanLorenzoMariusDeLaSalciua", // Change to a strong secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, 
    })
);

app.use(cookieParser());

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

    tests.push(test);

    res.cookie("tests", JSON.stringify(tests), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).send("Test saved successfully.");
});

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

app.get("/clear-tests", (req, res) => {
    res.clearCookie("tests");
    res.send("Tests cleared!");
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
