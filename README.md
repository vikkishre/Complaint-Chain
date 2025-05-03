# 🛠️ Complaint-Chain: Decentralized Complaint Registry System

**Complaint-Chain** is a decentralized complaint registry system designed to ensure **transparency**, **immutability**, and **traceability** in handling user complaints. It uses **blockchain technology** to securely store and manage complaints in a tamper-proof and verifiable way, simulating a real-world decentralized application.

> ⚡ This project was developed as part of an **academic mini project** for the *Blockchain Technology* course. The goal was to design a backend API capable of interacting with a local blockchain to simulate complaint registration and resolution using decentralized principles.

---

## 📌 Features

- 🧾 **Complaint Submission:** Users can register complaints through a responsive frontend.
- 📊 **Complaint Tracking:** Users can monitor the status of their complaints in real-time.
- 🛠️ **Admin Panel:** An admin dashboard allows complaint handlers to view and update complaint statuses.
- 🔁 **Instant Updates:** Status changes are reflected instantly on the user's dashboard after updates.
- 🔐 **Blockchain Storage:** All complaints are securely stored on the blockchain, ensuring immutability and integrity.
- 🧩 **Authentication with CAPTCHA:** Integrated `svg-captcha` to prevent bot submissions.
- 🌐 **Frontend Integration:** Built using React, Context API, and localStorage for a seamless UI/UX.
- ⚙️ **Backend API with ethers.js:** Uses `ethers.js` to interact with deployed smart contracts on the blockchain.

---

## 🧱 Tech Stack

| Layer         | Technology                            |
|---------------|----------------------------------------|
| Frontend      | React, Context API, localStorage       |
| Backend       | Node.js, Express, svg-captcha          |
| Blockchain    | Solidity, Hardhat (local dev env)      |
| Testing       | Ganache (local blockchain simulation)  |
| Communication | **ethers.js**                          |
| Security      | CAPTCHA (svg-captcha), (JWT optional)  |

> 🧪 This project **is not integrated with public blockchain networks**. All testing and deployment were done using **Ganache** and **Hardhat** for local development.

---


