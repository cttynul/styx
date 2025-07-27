# 📊 Styx: Your Digital Sentry Against Vulnerabilities (and Impending Cyber Apocalypse)


Welcome to the **Styx** repository! Are you ready to bid farewell to yellowed Excel sheets and dashboards that look like they were designed by a caveman? Great, because this application is here to save your day (and maybe your job) from the relentless assault of cyber vulnerabilities.

We've crafted this marvel to transform raw asset and vulnerability data into **crisp, digestible KPIs**. Imagine: instead of sweating bullets trying to figure out how many machines are running an obsolete OS, our app spits it out in a blink of an eye. Magic? Nah, it's just Python and a sprinkle of genius! ✨

---

[✨ DEMO LIVE HERE ✨](https://cttynul.github.io/styx)

---

## 🎯 What Does This MIRACLE Do?

In a nutshell, the KPI Monitor App is your best friend for:

* **Tracking Assets & Vulnerabilities**: Who said tracking was boring? We make it sexy.
* **Real-time KPI Calculation**: Instantly discover how many servers are sieves and how many are fortresses.
* **SLA at a Glance**: Are you behind on patching? The app might make you feel a little guilty, but with precise data!
* **Flexible Data Sources**: Whether you're a CSV fanatic, an SQL-addicted dev, or a MongoDB guru, we've got your back. Just a tiny tweak in `config.yml` and you're good to go!


## 🛠️ What You Need to Get This Thing Running (It's Not Magic, It's Tech!)

For an optimal experience (and to avoid frustration), make sure you have:

1.  **Python 3.10+**: Because we're modern, right?
2.  **A Virtual Environment**: If you're not using one, your project neighbors will hate you. And so will we.
    * `python -m venv venv`
    * Activate: `source venv/bin/activate` (macOS/Linux) or `.\venv\Scripts\activate` (Windows)
3.  **Python Dependencies**: The essential ones to prevent everything from collapsing.
    * `pip install -r requirements.txt` (after generating the file, see below!)
4.  **Docker (Optional, but Highly Recommended)**: To run it anywhere, from your toaster to a NASA server.


## 🚀 How to Launch This Rocket? (Prepare for Liftoff)

### 1. Clone the Repository (If you haven't already, shame on you!)

```bash
git clone https://github.com/cttynul/styx.git
```

### 2. Install Dependencies (`requirements.txt`)

If you don't have the `requirements.txt` file yet, ask your friendly neighborhood AI (that's me!) to generate it for you, then install:

```bash
pip install -r requirements.txt
```

### 4. Start the Backend (FastAPI, Your Beating Heart)

In your terminal, make sure you're in the main project directory and launch the rocket:

```bash
uvicorn main:app --reload
```

You should see `Uvicorn running on http://127.0.0.1:8000`. Feel free to click, if you're brave! Or open your browser to `http://127.0.0.1:8000/docs` for FastAPI's automatic (almost magical) documentation.

### 5. Launch with Docker (For the Real Pros!)

If you want to feel like a true hacker (or just want it to work headache-free):

```bash
docker build -t kpi-monitor-app .
docker run -p 8000:8000 kpi-monitor-app
```

And voilà! Your app is ready to conquer the world (or at least monitor your vulnerabilities).


## 📚 API Documentation (For the Curious and Frontend Devs)

Every good backend needs well-documented APIs. For a complete journey through all available endpoints, their parameters, and expected responses, please consult our separate **`docs.md`** file. There you'll find all the juicy details to integrate this marvel with your favorite frontend.

Now, sit back and watch your KPIs shine! 📊✨

## 🔑 License

```
                      Learning Only License License (LOL)

                         Copyright (c) 2024, cttynul
                             All rights reserved.

 *  The intended purpose of this code is educational only, and that purpose
    must be considered in any use or redistribution of the code or any
    modified version of the code. Any permissible change in License
    Agreement to any redistribution of this code, derivative or otherwise,
    must be done in good faith considering the original intent.

 *  You are not permitted to use this code or any modification of the code
    in any situation where original authorship is expected, or authorship
    is not able to be made clear in the use of the code. Use of this code
    directly for a homework assignment is explicitly prohibited.

 *  The Learning Only License is subordinate to any other accompanying License
    Agreement, and as such any prohibition or permission of use by accompanying
    License Agreements supersedes any permission or prohibition, respectively,
    provided by the Learning Only License.

 *  You may use this code freely, as is or modified, for any purpose not
    explicitly prohibited by this or any accompanying License Agreements, 
    including redistributing the original code and/or any modified version,
    provided such use is consistent with any other accompanying License 
    Agreements and you do the following:

    1.  Read through the code completely, including all of its comments.
    2.  Attempt to understand how it works.
    3.  Learn something from it.
    4.  Do not simply copy any portion of the code verbatim into another
        application; at the very least, add comments explaining what you are
        using, why you are using it, and where you obtained it.
    5.  Hold only yourself responsible, and not the original author or the 
        author of any modifications, for any bugs in your application that are
        the result of your failure to understand the code.
    6.  Do not hold the original author or author of any modifications
        responsible for bugs in your application that are the results of the
        author's mistakes.
    7.  Attempt to contact the responsible author and report any bugs found in
        the original code or any modifications, explaining what is wrong with
        the code and why it is a bug, so that the responsible author may learn
        from your experiences.
    8.  Keep the author(s)'s contact info, if provided or available, within the
        original or modified code so you can remember where it came from and to
        whom any bugs should be reported. If contact info is not available,
        keep a record of where the original code was obtained within the
        original or modified code.
    9.  Redistribute the original or modified code only if you have given due
        dilligence to understand it fully and can honestly attempt to answer 
        any questions about the code the person(s) to whom you give it may have.
    10. Redistribute a modified version of the code only after clearly marking
        the modifications you have made and adding your contact info in case
        you have introduced a bug into it and the recipient needs to contact you
        to report it.
    11. Do not get a bad attitude with anybody reporting bugs in your original
        or modified code.
    12. Attempt to fix any bugs for which you are responsible, seeking help to
        do so if necessary.
    13. Include a copy of this license with any source you distribute that
        contains the original or modified code. A copy of this license does not
        have to be included with any binaries if they are not distributed with
        the source code of that binary.
    14. If you make a profit from your application that contains the original
        or modified code, attempt to contact the author(s) and thank them for
        their help.
```