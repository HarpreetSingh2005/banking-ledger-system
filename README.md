# 🏦 Banking Ledger System (Backend)

A backend system that simulates how real-world banking transactions work — focusing on **ledger-based accounting, consistency, and reliability** instead of simple balance updates.

🔗 **Live API**: https://banking-ledger-system-bo45.onrender.com/  
📦 **Repository**: https://github.com/HarpreetSingh2005/banking-ledger-system  

---

## 🚀 Overview

This project models how banking systems actually handle transactions internally.

- No direct balance storage  
- Every transaction follows a strict validation flow  
- **Ledger is the single source of truth**

> 💡 Balance = Total Credits − Total Debits

---

## ⚙️ Core Features

- Structured **10-step transaction flow**
- **Idempotency** to prevent duplicate transactions  
- **Ledger-based system** (no hardcoded balances)  
- Support for **transfers + cash deposits**  
- **Token blacklisting with TTL**  
- **Email notifications** via Gmail API  
- Designed with **ACID principles**

---

## 🔄 Transaction Flow
    [Request]
       │
       ▼
    [Validate Request]
       │
       ▼
    [Check Idempotency Key]
       │
       ▼
    [Check Account Status]
       │
       ▼
    [Derive Balance from Ledger]
       │
       ▼
    [Create Transaction (Pending)]
       │
       ▼
    [Debit Entry Created]
       │
       ▼
    [Credit Entry Created]
       │
       ▼
    [Mark Transaction Completed]
       │
       ▼
    [Commit DB Session]
       │
       ▼
    [Send Email Notification]


---

## 🧠 Key Insight

> In real systems, **balance is not stored — it is derived.**

This approach:
- Prevents inconsistency  
- Maintains financial correctness  
- Scales better under concurrent transactions

  
 ## Ledger Entries
        
           +--------------------------+
           |  Type     |   Amount     |
           |--------------------------|
           |  Credit   |   +500       |
           |  Debit    |   -200       |
           |  Credit   |   +300       |
           +--------------------------+

   Balance = Total Credits - Total Debits

           = (500 + 300) - (200)
           = 600
---

## 🛠️ Tech Stack

- Node.js, Express.js  
- MongoDB (Transactions + TTL Indexes)  
- Mongoose  
- JWT Authentication  
- Gmail API  

---

## 📌 What's Next

- Frontend dashboard  
- Better monitoring & logging  
- Fraud detection / rate limiting  

---

## ⭐ Final Note

This project goes beyond CRUD APIs and focuses on **real-world system design**.

If you found it interesting, consider giving it a ⭐
