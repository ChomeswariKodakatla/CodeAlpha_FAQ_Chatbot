const faqs = [
{
question: "What is your return policy",
answer: "You can return products within 30 days of purchase."
},
{
question: "How can I track my order",
answer: "You can track your order using the tracking link sent to your email."
},
{
question: "Do you offer cash on delivery",
answer: "Yes, cash on delivery is available in selected locations."
},
{
question: "How can I contact customer support",
answer: "You can contact us at support@example.com."
},
{
question: "What payment methods are accepted",
answer: "We accept credit cards, debit cards, UPI and net banking."
}
];

function preprocess(text){
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g,"")
        .split(" ");
}

function getWordFreq(words){
    let freq = {};

    words.forEach(word=>{
        freq[word] = (freq[word] || 0) + 1;
    });

    return freq;
}

function cosineSimilarity(text1,text2){

    let words1 = preprocess(text1);
    let words2 = preprocess(text2);

    let freq1 = getWordFreq(words1);
    let freq2 = getWordFreq(words2);

    let uniqueWords = new Set([
        ...Object.keys(freq1),
        ...Object.keys(freq2)
    ]);

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    uniqueWords.forEach(word=>{

        let a = freq1[word] || 0;
        let b = freq2[word] || 0;

        dotProduct += a*b;
        mag1 += a*a;
        mag2 += b*b;
    });

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if(mag1===0 || mag2===0)
        return 0;

    return dotProduct/(mag1*mag2);
}

function getBestAnswer(userQuestion){

    let bestScore = 0;
    let bestAnswer =
        "Sorry, I couldn't find a matching answer.";

    faqs.forEach(faq=>{

        let score =
            cosineSimilarity(
                userQuestion,
                faq.question
            );

        if(score > bestScore){
            bestScore = score;
            bestAnswer = faq.answer;
        }
    });

    return bestAnswer;
}

function addMessage(text,className){

    const chatBox =
        document.getElementById("chatBox");

    const div =
        document.createElement("div");

    div.classList.add("message");
    div.classList.add(className);

    div.innerText = text;

    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}

function sendMessage(){

    const input =
        document.getElementById("userInput");

    const question =
        input.value.trim();

    if(question==="") return;

    addMessage(question,"user");

    const answer =
        getBestAnswer(question);

    setTimeout(()=>{
        addMessage(answer,"bot");
    },500);

    input.value="";
}

document
.getElementById("userInput")
.addEventListener("keypress",function(e){
    if(e.key==="Enter"){
        sendMessage();
    }
});