(function () {
    let quizId = 1;
    let questions = [];
    window.addEventListener('pageshow', init);
    function init() {
        let URL = "/api/quiz/" + quizId + "/questions";
        fetch(URL)
            .then(statusCheck)
            .then(res => res.json())
            .then(data => {

                // let qNo = 1;
                // let letters = ['A', 'B', 'C', 'D'];
                // questions.forEach(q => {
                //     let qDiv = document.createElement('div');
                //     qDiv.id = `qs${q.id}`;
                //     qDiv.classList.add('question');
                //     let qText = document.createElement('div');
                //     qText.classList.add('questionText');
                //     qText.innerHTML = `<strong>Question ${qNo}:</strong> ${q.question}`;
                //     qDiv.appendChild(qText);
                //     let qChoices = document.createElement('div');
                //     qChoices.classList.add('choices');
                //     q.choices.forEach((v, k) => {
                //         let choiceDiv = document.createElement('div');
                //         choiceDiv.classList.add('choice');
                //         let inputElem = document.createElement('input');
                //         inputElem.type = "radio";
                //         inputElem.name = `qa${q.id}`;
                //         choiceDiv.appendChild(inputElem);
                //         choiceDiv.appendChild(document.createTextNode(` ${letters[k]}. ${v}`));
                //         qChoices.appendChild(choiceDiv);
                //     });
                //     qDiv.appendChild(qChoices);
                //     document.getElementById('quizContainer').appendChild(qDiv);
                //     qNo++;
                questions = data;
                let qNo = 1;
                let letters = ['A', 'B', 'C', 'D'];
                questions.forEach(q => {
                    let qHtml = `<div id="qs${q.id}" class="question">
                                <div class="questionText">
                                    <strong>Question ${qNo}:</strong>
                                    ${q.question}
                                </div>
                                <div class="choices">`;
                    q.choices.forEach((v, k) => {
                        qHtml += `<div class="choice">
                                    <input type="radio" value="${k}" name="qa${q.id}" />
                                    ${letters[k]}. ${v}
                                </div>`;
                    });
                    qHtml += `</div>
                        </div>`;
                    document.getElementById('quizContainer').innerHTML += qHtml;
                    qNo++;
                });
            })
            .catch(console.log)
        document.getElementById('submitBtn').addEventListener('click', e => {
            e.preventDefault();
            let studentAnswers = [];
            questions.forEach(q => {
                let inp = document.querySelector('input[name=qa' + q.id + ']:checked');
                if (inp) {
                    studentAnswers.push({ qid: q.id, ans: parseInt(inp.value) });
                } else {
                    studentAnswers.push({ qid: q.id, ans: -1 });
                }
            });
            fetch('/api/doquiz/' + quizId, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(studentAnswers)
            }).then(statusCheck)
                .then(res => res.text())
                .then(console.log)
                .catch(console.log);
        });
    }

    async function statusCheck(res) {
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return res;
    }
})();