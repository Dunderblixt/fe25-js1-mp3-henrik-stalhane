let quizFormat = document.getElementById("format");
let lastResults = [];
let data = {};
let finishBtn = document.getElementById("finishQuiz");

async function fetchQuizData() {
    questionAmount = document.getElementById("question-amount").value;
    category = document.getElementById("category").value;
    difficulty = document.getElementById("difficulty").value;
    const apiUrl = `https://opentdb.com/api.php?amount=${questionAmount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const quizContainer = document.getElementById("quizContainer");
        quizContainer.innerHTML = "";   
        data.results.forEach((questionData, index) => {
          const questionElement = document.createElement("div");
          questionElement.classList.add("question");
            const answers = [...questionData.incorrect_answers, questionData.correct_answer];
            answers.sort(() => Math.random() - 0.5);
            questionElement.innerHTML = `
              <h3>Question ${index + 1}: ${questionData.question}</h3>
              <form> 
                <radio-buttons>
                    ${answers.map((answer => `
                            <label>
                              <input type="radio" name="question${index}" value="${answer}">
                                ${answer}
                            </label>
                        `))
                        .join("")}
                </radio-buttons>
              </form>
            `;
            quizContainer.appendChild(questionElement);
            return questionElement;
        });
        lastResults = data.results;
        return data;
      }
        )
        .catch((error) => 
          console.error("Error fetching quiz data:", error));
}

document.getElementById("format").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("quizContainer").style.display = "block";
    document.getElementById("finishQuiz").style.display = "block";  
    document.getElementById("results").style.display = "none";
    quizFormat.style.display = "none";
    finishBtn.style.display = "block";
    fetchQuizData();
});

document.getElementById("finishQuiz").addEventListener("click", function(event) {
      event.preventDefault();
        let score = 0;
        const quizContainer = document.getElementById("quizContainer");
        const questions = quizContainer.getElementsByClassName("question");
        Array.from(questions).forEach((questionElement, index) => {
            const selectedAnswer = questionElement.querySelector(`input[name="question${index}"]:checked`);
            if (selectedAnswer.value === lastResults[index].correct_answer) {
                score++;
            }
            quizFormat.style.display = "block";
            document.getElementById("finishQuiz").style.display = "none";
            document.getElementById("format").reset();
            const labels = questionElement.getElementsByTagName("label");
            Array.from(labels).forEach((label) => {
                const input = label.querySelector("input");
                if (input.value === lastResults[index].correct_answer) {
                    label.style.fontWeight = "bold";
                }
            });  
        });
        document.getElementById("results").style.display = "block";
        document.getElementById("results").innerHTML = `Your score: ${score} out of ${questions.length}. correct answers are shown in bold. Choose new format and click the button to start new quiz.`;
 });