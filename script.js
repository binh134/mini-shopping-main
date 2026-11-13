const nameInput = document.getElementById("item-name-input");
const priceInput = document.getElementById("item-price-input");
const itemList = document.getElementById("item-list");
const remaining = document.getElementById("remaining-count");
const total = document.getElementById("total-price");

let items = [
  { id: 1, name: "Sữa tươi", price: 32000, purchased: false },
  { id: 2, name: "Trứng gà", price: 45000, purchased: true },
  { id: 3, name: "Rau cải", price: 18000, purchased: false },
  { id: 4, name: "Bánh mì", price: 20000, purchased: false },
];
let nextId = 5, filter = "all", tab = "list";

const money = (n) => `${n.toLocaleString("vi-VN")} <div class="currency">đ</div>`;

function renderItems() {
  if (tab === "guide") {
    itemList.innerHTML = "<p>Nhập tên và giá rồi bấm Thêm món. Tick để đánh dấu đã mua, bấm Xóa để xóa, dùng nút lọc để xem theo trạng thái.</p>";
    return;
  }
  const show = items.filter((i) =>
    tab === "done" ? i.purchased :
    filter === "pending" ? !i.purchased :
    filter === "bought" ? i.purchased : true
  );
  itemList.innerHTML = show.map((i) => `
    <div class="item">
      <div class="item-label">
        <input type="checkbox" class="checkbox" ${i.purchased ? "checked" : ""} onchange="togglePurchased(${i.id})" />
        <div class="item-name">${i.name}</div>
      </div>
      <div class="item-price">${money(i.price)}</div>
      <button type="button" class="button delete" onclick="deleteItem(${i.id})">Xóa</button>
    </div>`).join("");
  updateRemainingCount();
  updateTotal();
}

function addItem() {
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  nameInput.classList.toggle("error", name === "");
  priceInput.classList.toggle("error", price === "" || Number(price) < 0);
  if (name === "" || price === "" || Number(price) < 0) return;

  items.push({ id: nextId++, name, price: Number(price), purchased: false });
  nameInput.value = priceInput.value = "";
  renderItems();
}

function togglePurchased(id) {
  const item = items.find((i) => i.id === id);
  item.purchased = !item.purchased;
  renderItems();
}

function deleteItem(id) {
  items = items.filter((i) => i.id !== id);
  renderItems();
}

function filterItems(f) {
  filter = f;
  document.querySelectorAll("#filters-container button").forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === f));
  renderItems();
}

function updateRemainingCount() {
  remaining.textContent = items.filter((i) => !i.purchased).length;
}

function updateTotal(){
  total.innerHTML = money(items.filter((i) => !i.purchased).reduce((s, i) => s + i.price, 0));
}

function switchTab(t) {
  tab = t;
  document.querySelectorAll(".main-nav button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === t));
  document.querySelector(".add-form").hidden = t !== "list";
  document.getElementById("filters-container").hidden = t !== "list";
  document.querySelector(".summary").hidden = t === "guide";
  renderItems();
}

document.getElementById("btn-add").addEventListener("click", addItem);
document.querySelectorAll("#filters-container button").forEach((b) =>
  b.addEventListener("click", () => filterItems(b.dataset.filter)));
document.querySelectorAll(".main-nav button").forEach((b) =>
  b.addEventListener("click", () => switchTab(b.dataset.tab)));

renderItems();