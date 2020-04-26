const 
allTask = document.querySelector('.all_task'),
searchTask = document.querySelector('.search_task'),
changeTask = document.querySelector('.change_task'),
inputDate = document.querySelector('.input_date'),
textArea = document.querySelector('#textArea'),
inputKategory = document.querySelector('#kategory'),
inputSearchDate = document.querySelector('.input_search_date'),
inputSearch = document.querySelector('.input_search'),
formAddTask = document.querySelector('.form_input'),
formSearch = document.querySelector('.form_search'),
options = document.querySelectorAll('#kategory option'),
taskDisplay = document.querySelector('.task_display');

const getDataOption = (value) => Array.from(options)
.find(item => item.getAttribute('value') === value).dataset;
/*-----id generator-------*/
const getId = () => Math.floor(Math.random()*9e9).toString(16);
// переключает активную вкладку меню
const changeTaskArr = [allTask , searchTask];
changeTask.addEventListener('click' , changeActive);

function changeActive(event , elem) {
    changeTaskArr.forEach(item => item.classList.remove('active'));
    (elem||event.target).classList.add('active');
    init();
}
// END // переключает активную вкладку меню

let dbTask = JSON.parse(localStorage.getItem('dbTask')) || [
    {
        status : 'nonDone',
        id : getId(),
        date : '04.05.2020',
        description : 'Описание задачи',
        category : 'работа',
        color: 'green',
        symbol : '&#163;',
    },
    {
        status : 'nonDone',
        id : getId(),
        category: "work",
        color: "red",
        date: "2020-04-01",
        description: "Надо работать",
        symbol: "ⓦ"
    },
    {
        status : 'nonDone',
        id : getId(),
        category: "sport",
        color: "green",
        date: "2020-04-02",
        description: "Надо побегать",
        symbol: "ⓢ",
    },
    {
        status : 'nonDone',
        id : getId(),
        category: "hobby",
        color: "yellow",
        date: "2020-04-02",
        description: "Пущу ка я самолетик",
        symbol: "Ⓕ",
    },
    {
        status : 'nonDone',
        id : getId(),
        category: "sale",
        color: "orange",
        date: "2020-04-03",
        description: "За пивасиком",
        symbol: "Ⓜ",
    },
    {
        status : 'nonDone',
        id : getId(),
        category: "house",
        color: "blue",
        date: "2020-04-05",
        description: "Помыть посуду",
        symbol: "Ⓗ",
    }

];

/* -------- работа с Задачами из поиска ----*/
let dbTaskOfSearch = [];

function createTaskOfSearch() {
    dbTaskOfSearch = dbTask.filter( item => {
        if (inputSearchDate.value || inputSearch.value) {
            return ( (inputSearchDate.value ? item.date === inputSearchDate.value : true) && (inputSearch.value ? item.description.toLowerCase().includes(inputSearch.value.toLowerCase()):true));
        };
    });
};

formSearch.addEventListener('submit' , ()=> {
    event.preventDefault();
    createTaskOfSearch();
    changeActive('', searchTask);
    inputSearchDate.value = '';
    inputSearch.value = '';
});
/* ----END---- работа с Задачами из поиска ----*/

const addNewTask = (event) => {
    event.preventDefault();
    const newTask = {
        status: 'nonDone',
        id : getId(),
        date : inputDate.value,
        description : textArea.value,
        category : inputKategory.value,
        color: getDataOption(inputKategory.value).color,
        symbol : getDataOption(inputKategory.value).symbol,
    };
    dbTask.push(newTask);
    inputDate.value = '';
    textArea.value = '';
    refreshLocalStorageDbTask();
    init();
};

formAddTask.addEventListener('submit' , addNewTask);

const renderTask = (task) => {
    const listItemTask = document.createElement('li');
    listItemTask.classList.add('task' , task.status);
    listItemTask.innerHTML = `
        <div class="task_header">
        <h3>
        <span class='ind_kategory' style="color: ${task.color}">${task.symbol} </span>
        ${task.date}</h3>
        <p>Done <input type="checkbox" class="doneCheckBox" data-id="${task.id}" ${task.status === 'done' ? 'checked' : ''}></p>
        </div>
        <p>${task.description}</p>
        <button class="delete_button" data-id="${task.id}">x</button>`;
        taskDisplay.prepend(listItemTask);
};

function init(){
    let arrTask = allTask.classList.contains('active') ? dbTask 
                : searchTask.classList.contains('active') ? dbTaskOfSearch : dbTask; 
    taskDisplay.innerHTML = '';
    arrTask.forEach(renderTask);
    operationCheckBox();
    operationDelete();
};

init();

/* --------- удаление задачи и отметка выполнено ---------*/
function operationCheckBox(){
    let doneCheckBox = document.querySelectorAll('.doneCheckBox');
    doneCheckBox.forEach(item => item.addEventListener('change' , checkDone));
    function checkDone(event){
        dbTask.forEach(item => {
            if (item.id === event.target.dataset.id) {
                if (event.target.checked) {
                    item.status = 'done';
                } else {
                    item.status = 'nonDone';
                }
            }
        });
        refreshLocalStorageDbTask();
        init();
    };
}

function operationDelete() {
    let deleteButton = document.querySelectorAll('.delete_button');
    deleteButton.forEach( item => item.addEventListener('mouseup' , 
        ()=> getDeleteBoX(event.clientX, event.clientY, event.path[1])));
};

function deleteTask(target) {
    let newTaskArr = dbTask.filter( item => !(target.dataset.id === item.id) );
    console.log(newTaskArr);
    dbTask.length = 0;
    dbTask = [].concat(newTaskArr);
    createTaskOfSearch();
    refreshLocalStorageDbTask();
    init();
}
/* -----END-----удаление задачи и отметка выполнено----------*/

/*---окно подтверждения удаления---*/
function getDeleteBoX(x,y, place){
    let target = event.target;
    const box = document.createElement('div');
    box.classList.add('box_delete');
    box.setAttribute('style', `
        border: 1px solid #4a4a4a;
        border-radius: 2px;
        position: absolute;
        background-color: rgb(93, 134, 136);
        width: 100px;   
        height: 40px;
        display: flex;
        justify-content: space-around;
        top: ${y}px;
        left : ${x}px;
    `);
    place.append(box);

    let yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    box.append(yesButton);
    yesButton.addEventListener('click', ()=>deleteTask(target) );

    let noButton = document.createElement('button');
    noButton.textContent = 'No';
    box.append(noButton);
    noButton.addEventListener('click', ()=> box.remove() );
    document.addEventListener('mousedown', ()=> {
        if ( event.target!== box && event.target!==yesButton && event.target !== noButton) box.remove()} );
    return box;
}

/*--- LOCAL STORAGE---*/
function refreshLocalStorageDbTask(){
    localStorage.clear();
    localStorage.setItem('dbTask' , JSON.stringify(dbTask));
};