async function checkRewardCondition() {
    try {
        const res = await fetch("http://127.0.0.1:8000/category-monthly-summary");
        const data = await res.json();

        const totalCurrent = data.summary.reduce((sum, item) => sum + item.current, 0);

        if (totalCurrent < 5000) {
            const saved = (5000 - totalCurrent).toFixed(2);
            document.getElementById("reward-message").innerText = `🎉 Congrats! You saved ₹${saved} this month!`;
        } else {
            document.getElementById("reward-message").innerText = "";
        }

    } catch (err) {
        console.error("Error fetching summary:", err);
    }
}

checkRewardCondition();
