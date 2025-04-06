document.addEventListener("DOMContentLoaded", function () {
    function getExpenseData() {
        let expenses = {};
        
        document.querySelectorAll(".expense-item").forEach(item => {
            let category = item.getAttribute("data-category");
            let amountInput = item.querySelector(".initial-amount");
            let limitInput = item.querySelector(".expense-limit");
    
            let amount = parseFloat(amountInput.value) || 0;
            let limit = parseFloat(limitInput.value) || 0;
    
            console.log(`🎯 Data Captured - Category: ${category}, Amount: ${amount}, Limit: ${limit}`);
    
            expenses[category] = { amount, limit };
        });
    
        return expenses;
    }
    

    function checkOverspending() {
        let expenses = getExpenseData();

        Object.keys(expenses).forEach(category => {
            let { amount, limit } = expenses[category];

            if (limit > 0 && amount > limit) {
                sendNudgeRequest(category, amount, limit);
            }
        });
    }

    function sendNudgeRequest(category, amount, limit) {
        console.log(`🚀 Sending Request - Category: ${category}, Limit: ${limit}, Amount: ${amount}`);

        fetch("http://127.0.0.1:5000/check_spending", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: limit, amount: amount }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("✅ Response from Flask:", data);
            if (data.nudge) {
                displayNudge(category, data.nudge);
            }
        })
        .catch(error => console.error("❌ Error:", error));
    }

    function displayNudge(category, message) {
        let nudgeContainer = document.getElementById("nudge-container");

        if (!nudgeContainer) {
            nudgeContainer = document.createElement("div");
            nudgeContainer.id = "nudge-container";
            document.body.appendChild(nudgeContainer);
        }

        let nudgeMessage = document.createElement("div");
        nudgeMessage.classList.add("nudge-message");
        nudgeMessage.innerHTML = `<strong>${category}:</strong> ${message}`;

        nudgeContainer.appendChild(nudgeMessage);

        setTimeout(() => {
            nudgeMessage.remove();
        }, 5000);
    }

    document.querySelectorAll(".edit-input").forEach(input => {
        input.addEventListener("input", checkOverspending);
    });

    document.getElementById("addCategoryButton")?.addEventListener("click", function () {
        setTimeout(checkOverspending, 500);  // Ensure values are updated before checking
    });

    checkOverspending();  // Initial check when the page loads
});
