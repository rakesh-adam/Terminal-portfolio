const config = {
    "help": [
        { "title": "help", "description": "for a list of commands", "info": ["help or ls command gives the list of commands"] },
        { "title": "clear", "description": "to clear the terminal", "info": ["clear or cls command clears the terminal"] },
        { "title": "about", "description": "to learn more about me", "info": ["use about command to learn more about me"] },
        { "title": "social", "description": "to see my social links", "info": ["use social command to see my social links"] },
        { "title": "projects", "description": "to see my projects", "info": ["use projects command to see my projects"] },
        { "title": "contact", "description": "to enquire about my services", "info": ["use contact command to see my contact details"] },
        { "title": "download", "description": "to download my pdf resume", "info": ["use download command to download my pdf resume"] },
        { "title": "experience", "description": "to see my work experience", "info": ["use experience command to see my work experience"] },
        { "title": "skills", "description": "to see my skills", "info": ["use skills command to see my skills"] }
    ],
    "terminal": { "user": "$Rakesh", "host": "sudo", "path": "~/guest" },
    "about": "👋 Hi, I'm Rakesh Matta! \n 🎓 I am a Computer Science and Engineering student (2023-2027) at Bonam Venkata Chalamayya Engineering College (CGPA: 8.08). \n 💻 Objective: To obtain a Software Developer role where I can leverage my skills in Python, front-end, and back-end development to build efficient applications and support technological growth. \n 📜 Certifications: Full Stack Web Development (Talentshine), FreeCodeCamp Python Certification.",
    "social": [
        { "title": "LinkedIn", "link": "https://www.linkedin.com/in/rakesh-matta-722b11330" },
        { "title": "Github", "link": "https://github.com/rakesh-adam" }
    ],
    "projects": [
        { "title": "3D Portfolio", "link": "https://your-live-server-link.com", "description": "A 3D book-type portfolio created using HTML, CSS, and JS to showcase my projects in an interactive way." },
        { "title": "Budget App", "link": "https://github.com/rakesh-adam", "description": "Python-based budget app with transaction tracking, category management, and spending analysis using OOP principles." },
        { "title": "Shape Calculator App", "link": "https://github.com/rakesh-adam", "description": "Python app with Rectangle and Square classes, calculating area, perimeter, diagonal, and generating ASCII art visualization." },
        { "title": "Email Client App", "link": "https://github.com/rakesh-adam", "description": "Python-based email client using User, Email, and Inbox classes to send, receive, and delete emails with timestamp tracking." }
    ],
    "contact": { "email": "rakeshmatta110305@gmail.com", "phone": "+91 9177820572" },
    "experience": [
        { "title": "Java Full Stack Web Development Intern at Talentshine", "description": "▪️ Completed a 2-month internship gaining hands-on experience in Java, front-end, and back-end development. \n ▪️ Worked on building web applications using Java, enhancing problem-solving and full-stack skills. \n ▪️ Collaborated on projects, learned industry best practices, and applied tech solutions." }
    ],
    "skills": [
        { "title": "Technical Skills: ", "description": "HTML5, CSS, JavaScript, Python, C, Java, Bootstrap, MySQL, DSA, Git, Github, VS Code" },
        { "title": "Soft Skills:", "description": "Creative Thinking, Problem Solving" }
    ]
};

function greenBtn() {
    const container = document.querySelector("#screenContainer");
    container.classList.contains("maximized") ? container.classList.remove("maximized") : container.classList.add("maximized");
}
function yellowBtn() {
    const bodyContainer = document.querySelector("#bodyContainer");
    bodyContainer.classList.contains("minimized") ? bodyContainer.classList.remove("minimized") : bodyContainer.classList.add("minimized");
}
function redBtn() { window.close(); }

let commandsList = ["help", "ls", "clear", "cls", "about", "social", "projects", "contact", "download", "experience", "skills"];

function compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, '');
    second = second.replace(/\s+/g, '');
    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;
    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
        firstBigrams.set(bigram, count);
    }
    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
        if (count > 0) {
            firstBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }
    return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

function levenshteinDistance(str1 = '', str2 = '') {
    const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) { track[0][i] = i; }
    for (let j = 0; j <= str2.length; j += 1) { track[j][0] = j; }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
        }
    }
    return track[str2.length][str1.length];
}

function suggestFurtherCommand(inputString) {
    let similarityList = [];
    for (let i = 0; i < commandsList.length; ++i) {
        similarityList.push([compareTwoStrings(inputString, commandsList[i]) - (levenshteinDistance(inputString, commandsList[i]) / 100), commandsList[i]]);
    }
    similarityList.sort((a, b) => a[0] - b[0]).reverse();
    return similarityList[0][1];
}

async function commandHistory() {
    let record = JSON.parse(localStorage.getItem("history")) || [];
    if (record.length === 0) {
        await createText("No History Found!");
    } else {
        await createText("Previously used commands are: ");
        for (let i = 0; i < record.length; ++i) { await createText((i + 1).toString() + ".) " + record[i]); }
        await createText("To run a specific cmd from history, run history {id} where id is the id of that cmd in histroy")
    }
}

async function runSpecificHistoryCmd(id) {
    let record = JSON.parse(localStorage.getItem("history")) || [];
    if (id < 1 || id > record.length) {
        await createText("No History Found for this id!");
    } else {
        await createText(`Running command: ${record[id - 1]}`);
        await getInputValue(record, false, record[id - 1]);
    }
}

function saveHistory(value) {
    let record = JSON.parse(localStorage.getItem("history")) || [];
    if (value.startsWith('history')) return;
    if (record.length > 9) { record.shift(); record.push(value); } else { record.push(value); }
    localStorage.setItem("history", JSON.stringify(record));
}

async function clearHistory() {
    let record = JSON.parse(localStorage.getItem("history")) || [];
    await createText("Clearing your history");
    record = [];
    localStorage.setItem("history", JSON.stringify(record));
}

function popInvalidCommand() {
    let record = JSON.parse(localStorage.getItem("history")) || [];
    record.pop();
    localStorage.setItem("history", JSON.stringify(record));
}

const app = document.querySelector("#app");
let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const resumeUrl = "Resume.docx";

function neofetch() {
    const data = config.neofetch;
    const container = document.createElement("div");
    container.classList.add("fetch-container");
    const fimg = document.createElement("div");
    fimg.classList.add("fetch-img-container");
    fimg.innerHTML = "<img class='fetch-img' src='js.png' />";
    const info = document.createElement("div");
    info.classList.add("info");
    container.appendChild(fimg);
    container.appendChild(info);
    for (const [key, value] of Object.entries(data)) {
        const p = document.createElement("p");
        p.innerHTML = `<span class="key">${key}</span>: <span class="value">${value}</span>`;
        info.appendChild(p);
    }
    app.appendChild(container);
}

function removeNeoFetch() {
    const element = document.querySelector(".fetch-container");
    if (element) element.remove();
}

async function getInputValue(historyList, remove = false, cmd = undefined) {
    const val = cmd || document.querySelector("input").value.trim().toLowerCase();
    saveHistory(val);
    const a = val.split(" ");
    const flag = a[1];
    const value = a[0];
    const flags = [...a];

    flags.shift();
    if (value.substring(0, 5) === "cheer") { value.substring(0, 5).toLowerCase(); } else { value.replace(/\s+/g, "").toLowerCase(); }

    historyList.push(cmd || document.querySelector("input").value);
    if (remove) removeInput();

    switch (value) {
        case "help":
        case "ls":
            config.help.sort((a, b) => { return a.title.localeCompare(b.title); });
            trueValue(value);
            let titles = config.help.map(item => item.title);
            let titlesString = titles.join(', ');
            await createText(titlesString);
            await createText("write help {command name} to know about specific command like 'help about'");
            if (flag) {
                let isCmd = false;
                for (let x of config.help) {
                    if (flag === x.title) {
                        for (let i = 0; i < x.info.length; i++) await createText(x.info[i]);
                        isCmd = true;
                        break;
                    }
                }
                if (!isCmd) {
                    await createText(`${flag} is not a valid command`);
                    let commands = suggestFurtherCommand(flag);
                    await createText("Are you looking for this: " + commands);
                }
            }
            break;
        case "about": trueValue(value); await createText(config.about); break;
        case "social":
            trueValue(value);
            config.social.forEach((item) => { createText(`<a href=${item.link} target="_blank">${item.title}</a>`, false); });
            break;
        case "projects":
            trueValue(value); await createText("Projects:");
            config.projects.forEach(async (item) => { await createText(`<a href="${item.link}" target="_blank">${item.title}</a> - ${item.description}`, false); });
            break;
        case "experience":
            trueValue(value); await createText("My Work Experience:");
            config.experience.forEach((item) => { createText(`${item.title}`); createText(`${item.description} `); });
            break;
        case "skills":
            trueValue(value);
            config.skills.forEach((item) => { createText(`${item.title}`); createText(`${item.description} `); });
            break;
        case "contact":
            trueValue(value);
            createText(`Hey! Would love to get in touch.<br>Email: <a href="mailto:${config.contact.email}">${config.contact.email}</a><br>Phone: ${config.contact.phone}`, false);
            break;
        case "download": trueValue(value); downloadFile(); break;
        case "clear":
        case "cls":
            document.querySelectorAll("p").forEach((e) => e.parentNode.removeChild(e));
            document.querySelectorAll("section").forEach((e) => e.parentNode.removeChild(e));
            removeInput(); await delay(150);
            break;
        default:
            falseValue(value);
            await createText(`${value} is not a valid command`);
            let commands = suggestFurtherCommand(value);
            await createText("Are you looking for this: " + commands);
    }
}

function new_line() {
    const p = document.createElement("p");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    p.setAttribute("class", "path");
    p.textContent = config.terminal.user + " ";
    span.textContent = config.terminal.host + " ";
    span2.textContent = config.terminal.path + " ";
    p.appendChild(span); p.appendChild(span2); app.appendChild(p);
    const div = document.createElement("div"); div.setAttribute("class", "type");
    const i = document.createElement("span"); i.setAttribute("class", "icone"); i.textContent = ">";
    const input = document.createElement("input");
    div.appendChild(i); div.appendChild(input); app.appendChild(div);
    input.focus();
}

function removeInput() {
    const div = document.querySelector(".type");
    if (div) app.removeChild(div);
}

function trueValue(value) {
    const div = document.createElement("section"); div.setAttribute("class", "type2");
    const i = document.createElement("span"); i.setAttribute("class", "icone"); i.textContent = ">";
    const msg = document.createElement("h2"); msg.textContent = `${value}`;
    div.appendChild(i); div.appendChild(msg); app.appendChild(div);
}

function falseValue(value) {
    const div = document.createElement("section"); div.setAttribute("class", "type2");
    const i = document.createElement("span"); i.setAttribute("class", "icone error"); i.textContent = ">";
    const msg = document.createElement("h2"); msg.setAttribute("class", "error"); msg.textContent = `${value}`;
    div.appendChild(i); div.appendChild(msg); app.appendChild(div);
}

async function createText(text, typingOn = true) {
    const p = document.createElement("p"); app.appendChild(p);
    p.scrollIntoView({ behavior: 'smooth' });
    const typing = localStorage.getItem("typing");
    if (!typingOn || (typing && typing === "off")) { p.innerHTML = text; return; }
    const typingSpeed = localStorage.getItem("typingSpeed") || 20;
    let index = 0;
    async function writeText() {
        while (index < text.length) {
            p.innerHTML += text[index++];
            await new Promise((writeText) => setTimeout(writeText, typingSpeed));
        }
        return;
    }
    await writeText();
}

async function createCode(code, text, typingOn = true) {
    const p = document.createElement("p"); app.appendChild(p);
    const typing = localStorage.getItem("typing");
    if (!typingOn || (typing && typing === "off")) {
        p.innerHTML = `<span class="code">${code} =></span> ${text}`; return;
    }
    const typingSpeed = localStorage.getItem("typingSpeed") || 20;
    const span = document.createElement("span"); span.className = "code";
    p.appendChild(span); p.scrollIntoView({ behavior: 'smooth' });
    let index = 0;
    async function writeCode() {
        while (index < code.length) {
            span.innerHTML += code[index++];
            await new Promise((writeCode) => setTimeout(writeCode, typingSpeed));
        }
        return;
    }
    await writeCode();
    p.innerHTML += " ";
    index = 0;
    async function writeText() {
        while (index < text.length) {
            p.innerHTML += text[index++];
            await new Promise((writeText) => setTimeout(writeText, typingSpeed));
        }
        return;
    }
    await writeText();
}

function downloadFile() {
    createText(`Click the link to get my resume: <a href="${resumeUrl}" download="Resume.docx" style="text-decoration: underline; color: #00ffc6; font-weight: bold;"><i class="fas fa-file-download"></i> Download CV</a>`, false);
}

async function calc(flag) {
    try {
        if (flag === "" || flag === " " || flag === undefined) {
            falseValue(flag); await createText("Please Enter a Valid Expression");
        } else {
            trueValue(flag);
            function parse(str) { return Function(`'use strict'; return (${str})`)(); }
            await createText(flag + " = " + parse(flag));
        }
    } catch (e) {
        falseValue(flag); await createText(flag + " is an Invalid Expression");
    }
}

const typingCmd = async (flag) => {
    const typing = localStorage.getItem("typing");
    let typingSpeed = localStorage.getItem("typingSpeed");
    if (flag == "-on") {
        localStorage.setItem("typing", "on"); createText("Typing animation is turned on");
    } else if (flag == "-off") {
        localStorage.setItem("typing", "off"); createText("Typing animation is turned off");
    } else if (Number(flag)) {
        localStorage.setItem("typingSpeed", Number(flag)); typingSpeed = localStorage.getItem("typingSpeed");
        await createText(`Typing animation speed is set to ${typingSpeed ? typingSpeed : 20}ms`);
    } else {
        await createText(`Typing animation is currently ${typing ? typing : "on"} and speed is set to ${typingSpeed ? typingSpeed : 20}ms`);
        await createText("Turn typing animation on and off by adding -on or -off flags respectively");
        await createText("Also u can write a number(in ms) to set typing custom animation speed");
    }
}

let historyList = JSON.parse(localStorage.getItem("history")) || [];
let count = historyList.length;

app.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        await delay(150);
        await getInputValue(historyList, true);
        await delay(150);
        new_line();
        count = historyList.length;
    }
    if (event.key === "ArrowUp") {
        if (count > 0) {
            await delay(0.005);
            const input = document.querySelector("input");
            input.value = historyList[--count];
            const end = input.value.length;
            input.setSelectionRange(end, end);
        }
    }
    if (event.key === "ArrowDown") {
        if (count < historyList.length - 1) {
            const input = document.querySelector("input");
            input.value = historyList[++count];
        } else {
            if (count === historyList.length - 1) { count++; }
            const input = document.querySelector("input"); input.value = "";
        }
    }
    if (event.key === "Tab") {
        event.preventDefault();
        const input = document.querySelector("input");
        const toComplete = input.value;
        const completed = commandsList.find((command) => command.startsWith(toComplete));
        if (toComplete && completed) { input.value = completed; }
    }
    if (event.ctrlKey) {
        if (event.key === "l" || event.key === "L") {
            document.querySelectorAll("p").forEach((e) => e.parentNode.removeChild(e));
            document.querySelectorAll("section").forEach((e) => e.parentNode.removeChild(e));
            removeInput();
            await delay(150);
            new_line();
            count = historyList.length;
        }
    }
});

app.addEventListener("click", function () {
    const input = document.querySelector("input");
    if (input) input.focus();
});
const greenButton = document.querySelector("#greenButton");
greenButton.addEventListener("click", greenBtn);
const yellowButton = document.querySelector("#yellowButton");
yellowButton.addEventListener("click", yellowBtn);
const redButton = document.querySelector("#redButton");
redButton.addEventListener("click", redBtn);

async function openTerminal() {
    await createText("Welcome to the Terminal");
    await delay(500);
    await createText("Starting up...");
    await delay(800);
    await createText("You can now interact with the Terminal");
    await createCode("Type help", "for a list of commands");
    await delay(500);
    new_line();
}

openTerminal();