# 🔧 Reflow Profile Board Tracking (PERN Stack)

A full-stack application built using **PostgreSQL, Express.js, React.js, and Node.js (PERN)** for tracking reflow profiling of PCB boards across customers, models, storages, and board types.

---

## 📌 Features

- 🏠 **Home Page**: Overview/dashboard
- 🔍 **Profiler Page**:
  - Select customer, model, storage, and board type
  - Add row/column to the board type table
  - Save and update profile usage (with 80-use constraint) (kept 6 for simplicity)
  - Color indication for row changes (turns pink after 20 changes) (kept 3 for simplicity)
  - "Reuse" button to increment usage
  - Buttons: `New Profiler`, `History`, `Back`, `Reset`
- 📜 **History Page**:
  - Logs all profiling changes with timestamp
  - Displays profiling history by different profilers (P1, P2, P3)
  - Also displays reused logs

---

## 🧱 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Version Control**: Git + GitHub

---

## 🗂️ Database Schema Overview

### Tables

- **Customer**
- **Model**
- **Storage**
- **BoardType**
- **Profiler**
- **ReflowTable**
   - have all previous table values, no-of-times-used and timestamp
- **History**
  - includes all changes that are made using the reflowtable, and any change in the no-of-times-used column has a separate entry in history
  - on retrieval, displayed based on timestamp 

---



## 🔁 Usage Constraints

- Each board type can be reused **up to 80 times**
- UI highlights row in **pink after 20 changes**
- After completion of 80 changes, row highlighted to **red**
- Each update is recorded in **History Table**

---
Deployment is yet to be done...
