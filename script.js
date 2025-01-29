
let people = [];

function addFields() {
    let num = document.getElementById("numPeople").value;
    let container = document.getElementById("inputFields");
    container.innerHTML = "";
    people = [];
    for (let i = 0; i < num; i++) {
        let div = document.createElement("div");
        div.innerHTML = `<input type="text" placeholder="Name" id="name${i}"> 
                         <input type="number" placeholder="Amount Paid" id="amount${i}">`;
        container.appendChild(div);
    }
}

function calculateSplit() {
    let num = document.getElementById("numPeople").value;
    let total = 0;
    people = [];
    for (let i = 0; i < num; i++) {
        let name = document.getElementById(`name${i}`).value;
        let amount = parseFloat(document.getElementById(`amount${i}`).value) || 0;
        people.push({ name, amount });
        total += amount;
    }
    let perPerson = total / num;
    let balances = people.map(p => ({ name: p.name, balance: p.amount - perPerson }));
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<h3>Balance Overview</h3>" + balances.map(b => `<p>${b.name}: ${b.balance.toFixed(2)}</p>`).join('');
    calculateSettlement(balances);
}

function calculateSettlement(balances) {
    let debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    let creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
    let settlementDiv = document.getElementById("settlement");
    settlementDiv.innerHTML = "<h3>Settlements</h3>";
    while (debtors.length) {
        let debtor = debtors[0];
        let amountOwed = -debtor.balance;
        let splitAmount = amountOwed / creditors.length;
        creditors.forEach(creditor => {
            let amountToPay = Math.min(splitAmount, creditor.balance);
            if (amountToPay > 0) {
                settlementDiv.innerHTML += `<p>${debtor.name} pays ${creditor.name}: Rs. ${amountToPay.toFixed(2)}</p>`;
                debtor.balance += amountToPay;
                creditor.balance -= amountToPay;
            }
        });
        if (debtor.balance === 0) debtors.shift();
        creditors = creditors.filter(c => c.balance > 0);
    }
}
