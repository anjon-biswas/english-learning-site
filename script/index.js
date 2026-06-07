
const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class='btn'> ${el} </span>`);
    return (htmlElements.join(" "));
}


const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    }
    else {
        document.getElementById('word-container').classList.remove('hidden')
        document.getElementById('spinner').classList.add('hidden')
    }
}


const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLessons(json.data))
};



const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    lessonButtons.forEach(btn => btn.classList.remove('active'))
}



const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive(); //remove all active class
            const clickedBtn = document.getElementById(`lesson-btn-${id}`);
            // console.log(clickedBtn)
            clickedBtn.classList.add('active')
            displayLevelWord(data.data)


        });
};



const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url)
    const details = await res.json();
    displayWordDetails(details.data);
};


const displayWordDetails = (word) => {
    console.log(word);
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `<div class="">
                    <h2 class="text-2xl font-bold">${word.word}
                    (<i class="fa-solid fa-microphone-lines"></i> : 
                    ${word.pronunciation})</h2>
                </div>
                <div class="">
                    <h2 class="font-bold"> Meaning</h2>
                    <p>${word.meaning}</p>
                </div>
                <div class="">
                    <h2 class="font-bold"> Example</h2>
                    <p>${word.sentence}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">Synonym</h2>
                    <div class=''>${createElements(word.synonyms)}</div>
                </div>`;
    document.getElementById('word_modal').showModal();

};




const displayLevelWord = (words) => {
    // console.log(words)
    // the 4 steps for showing the data
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = '';

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center font-bangla col-span-full rounded-xl bg-gray-200 py-10 space-y-6">
            <img class="mx-auto" src="./assets/alert-error.png"/>
            <p class="text-xl font-medium text-gray-500 ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl text-gray-700">নেক্সট Lesson এ যান</h2>
        </div>
        `
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        // console.log(word)
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class=" font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায় নি"
            }</h2>
            <p class="font-semibold">Meaning / Pronounciation</p>
            <div class="font-bangla font-medium text-2xl">
                ${word.meaning ? word.meaning : 'No meaning found'} / 
                ${word.pronunciation ? word.pronunciation : 'No Pronouunciation found'}
            </div>

            <div class="flex justify-between items-center">
                <button onClick='loadWordDetail(${word.id})'  class="btn bg-[#1a91ff10] hover:bg-[#1a91ff80]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1a91ff10] hover:bg-[#1a91ff80]"><i class="fa-solid fa-volume-low"></i></button>
            </div>
        </div>
        `;

        wordContainer.append(card)
    });
    manageSpinner(false);

}



const displayLessons = (lessons) => {

    // 1. Get the container
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = ''
    // 2. Get into every lesson
    for (let lesson of lessons) {
        // 3. Create element
        const btnDiv = document.createElement('div')
        btnDiv.innerHTML = `
        <button id='lesson-btn-${lesson.level_no}' onClick = "loadLevelWord(${lesson.level_no})" 
        class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;

        // 4. append into container
        levelContainer.append(btnDiv)
    }

};



loadLessons();