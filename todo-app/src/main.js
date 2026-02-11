//Görev yazılan input
const todoInput = document.getElementById("todo-input");
//Görev ekleme butonu
const addBtn = document.getElementById("add-btn");
//Görevlerin listeleneceği alan
const todoList = document.getElementById("todo-list");
//Görev sayısını gösteren yazı
const taskCount = document.getElementById("task-count");
//Görev listesini temizleme butonu
const clearBtn = document.getElementById("clear-btn");


function addTask(){
  //Input'un içindeki değeri al ve sağındaki/solundaki boşlukları temizle (.trim())
  const taskText = todoInput.value.trim();
  //Eğer input boşsa hiçbir şey yapma, fonksiyonu durdur
  if (taskText === ""){
    alert("Lütfen bir görev giriniz");
    return;
  }
  //Yeni bir <li> elementi oluştur
  const li = document.createElement("li");
  //Liste elemanında ayarlanan Tailwind sınıflarını ekle
  li.className = "group flex items-center justify-between bg-slate-800/40 p-3 rounded-lg border border-transparent hover:border-slate-700 hover:bg-slate-800 transition-all"
  //Liste elemanının içindeki HTML'i ayarla, görev metni ve silme butonu içerecek şekilde
  li.innerHTML = `
    <div class="flex items-center gap-3 flex-1">
      <div class="w-4 h-4 rounded-full border border-slate-500 hover:border-blue-400 flex items-center justify-center cursor-pointer transition-colors check-btn">
        <i class="fa-solid fa-check text-white text-xs opacity-0 transition-opacity"></i>
      </div>
      <span class="text-slate-300 text-sm group-hover:text-white transition-colors flex-1 cursor-text select-none task-text">${taskText}</span>
    </div>
    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
      <button class="text-slate-500 hover:text-blue-400 transition-colors p-1 edit-btn" title="Edit">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      </button>

      <button class="text-slate-500 hover:text-red-400 transition-colors p-1 delete-btn" title="Delete">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>  
  `;
  
  //Hazırlanan yeni satırı listenin başına ekle (append yerine prepend)
  todoList.prepend(li);
  //Input'u temizle
  todoInput.value = "";
  //Görev sayısını güncelle
  updateTaskCount();
}


//"Add" butonuna tıklandığında addTask fonksiyonunu çalıştır
addBtn.addEventListener("click", addTask);
//Input'ta "Enter" tuşuna basıldığında da addTask fonksiyonunu çalıştır
todoInput.addEventListener("keypress", function(e){
  if (e.key === "Enter"){
    addTask();
  }
});

//Görev sayısını güncelleyen fonksiyon
function updateTaskCount(){
  const count = todoList.children.length;
  taskCount.innerText = `${count} Task Awaiting`;
}

//Görev listesini yönetmek için event delegation tekniği kullanarak tıklama olaylarını dinle
todoList.addEventListener("click", function(e){
  const target = e.target; //Tıklanan element
  const deleteBtn = target.closest(".delete-btn"); //Silme butonu
  if (deleteBtn){
    const li = deleteBtn.closest("li"); 
    li.remove();
    updateTaskCount();
    return;
  }

  const checkBtn = target.closest(".check-btn"); //Tik butonu
  if (checkBtn){
    const li = checkBtn.closest("li");
    const taskText = li.querySelector(".task-text");
    const checkIcon = checkBtn.querySelector("i");

    checkBtn.classList.toggle("border-slate-500");
    checkBtn.classList.toggle("border-blue-500");
    checkBtn.classList.toggle("bg-blue-500");

    checkBtn.classList.toggle("opacity-0");

    taskText.classList.toggle("line-through");
    taskText.classList.toggle("text-slate-500");
    return;
  }

  const editBtn = target.closest(".edit-btn"); //Edit butonu
  if (editBtn){
    const li = editBtn.closest("li");
    const taskTextElement = li.querySelector(".task-text");
    const currentText = taskTextElement.innerText;

    if (li.querySelector("edit-input")) return;

    taskTextElement.classList.add("hidden");

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input flex-1 bg-slate-900 border border-blue-500 rounded px-2 py-1 text-white text-sm outline-none";

    taskTextElement.parentNode.insertBefore(input, taskTextElement);
    input.focus();

    function saveEdit() {
      const newText = input.value.trim();
      if (newText !== "") {
        taskTextElement.innerText = newText;
      }
      input.remove();
      taskTextElement.classList.remove("hidden");
    }
    //Kaydetme olayları
    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveEdit();
    });
  }
});