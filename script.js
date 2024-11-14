document.addEventListener("DOMContentLoaded", () => {
    const correctAnswers = {
        q1: "ბ",
        q2: "ა",
        q3: "ა",
        q4: "ბ",
        q5: "ბ",
        q6: "დ",
        q7: "გ",
        q8: "ა",
        q9: "დ",
        q10: "ა",
        q11: "ბ",
        q12: "დ",
        q13: "ბ",
        q14: "გ",
        q15: "ა"
    };

    let timerElement = document.getElementById("timer");
    let timeLeft = localStorage.getItem("timeLeft") ? parseInt(localStorage.getItem("timeLeft")) : 1800;

    function startTimer() {
        let timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitQuiz(); // Automatically submit the quiz when time is up
            } else {
                let minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                timerElement.innerText = `დარჩენილია: ${minutes} წუთი და ${seconds} წამი`;
                localStorage.setItem("timeLeft", timeLeft);
                timeLeft--;
            }
        }, 1000);
    }

    function submitQuiz() {
        let score = 0;
        let tableContent = ""; // To store rows of the table

        for (let i = 1; i <= 15; i++) {
            const studentAnswer = document.querySelector(`input[name="q${i}"]:checked`);
            const correctAnswer = correctAnswers[`q${i}`];
            const studentResponse = studentAnswer ? studentAnswer.value : "გამოტოვებული";
            
            const isCorrect = studentResponse === correctAnswer;
            if (isCorrect) score++;

            // Create a row in the table content
            tableContent += `
                <tr>
                    <td>კითხვა ${i}</td>
                    <td>${correctAnswer}</td>
                    <td>${studentResponse}</td>
                    <td style="color: ${isCorrect ? 'green' : 'red'};">
                        ${isCorrect ? "სწორია" : "არასწორია"}
                    </td>
                </tr>
            `;
        }

        // Display the score and table
        document.getElementById("result").innerText = `შენ დააგროვე ${score} ქულა 15-დან.`;
        document.getElementById("result-section").style.display = "block";
        document.getElementById("quizForm").style.display = "none";
        document.getElementById("submit-button").disabled = true;
        document.getElementById("timer").style.display = "none";

        // Insert the table content into the result-table div
        const tableHTML = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>კითხვა</th>
                        <th>სწორი პასუხი</th>
                        <th>შენი პასუხი</th>
                        <th>სტატუსი</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        `;
        document.getElementById("result-table").innerHTML = tableHTML;

        // Clear the stored time and answers
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("studentAnswers");
    }

    function saveAnswers() {
        let studentAnswers = {};
        for (let i = 1; i <= 15; i++) {
            const studentAnswer = document.querySelector(`input[name="q${i}"]:checked`);
            studentAnswers[`q${i}`] = studentAnswer ? studentAnswer.value : null;
        }
        localStorage.setItem("studentAnswers", JSON.stringify(studentAnswers));
    }

    function loadAnswers() {
        let studentAnswers = JSON.parse(localStorage.getItem("studentAnswers"));
        if (studentAnswers) {
            for (let i = 1; i <= 15; i++) {
                const answer = studentAnswers[`q${i}`];
                if (answer) {
                    document.querySelector(`input[name="q${i}"][value="${answer}"]`).checked = true;
                }
            }
        }
    }

    document.getElementById("submit-button").addEventListener("click", submitQuiz);
    document.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.addEventListener("change", saveAnswers);
    });

    loadAnswers();
    startTimer();
});
