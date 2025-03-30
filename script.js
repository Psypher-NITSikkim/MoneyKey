document.addEventListener("DOMContentLoaded", function () {
    const summaryTable = document.getElementById("summary-table");
    const summaryBody = document.getElementById("summary-body");
    const questionInput = document.getElementById("question-input");
    const askButton = document.getElementById("ask-button");
    const answerContainer = document.getElementById("answer-container");
    
    // Function to fetch spending summary from backend
    async function fetchSpendingSummary() {
        try {
            const response = await fetch("http://localhost:3000/spending-summary");
            const data = await response.json();
            
            // Clear existing rows
            summaryBody.innerHTML = "";
            
            data.forEach(({ category, total }) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${category}</td>
                    <td>$${total.toFixed(2)}</td>
                `;
                summaryBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching spending summary:", error);
        }
    }
    
    // Function to send financial questions to AI
    async function askFinancialQuestion() {
        const question = questionInput.value.trim();
        if (!question) return;
        
        try {
            const response = await fetch("http://localhost:3000/ask-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            });
            const data = await response.json();
            
            answerContainer.textContent = `AI Answer: ${data.answer}`;
        } catch (error) {
            console.error("Error asking AI:", error);
            answerContainer.textContent = "Error fetching AI response.";
        }
    }
    
    // Event listener for Ask AI button
    askButton.addEventListener("click", askFinancialQuestion);
    
    // Fetch summary on page load
    fetchSpendingSummary();
});
