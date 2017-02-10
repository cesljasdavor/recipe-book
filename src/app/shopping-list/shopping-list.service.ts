
import {Ingredient} from "../shared/ingredient";

export class ShoppingListService {
  private items: Ingredient[] = [];
  constructor() { }

  getItems() {
    return this.items;
  }

  addItems(items: Ingredient[]) {
    //konkatenira dva polja i stavlja ih u prvo
    //Array.prototype.push.apply(this.items, items);
    //gore je ok ali stvara jedno dodatno polje, ovo mora biti brže
    for(let item of items) {
      this.items.push(item);
    }
  }

  addItem(item: Ingredient) {
    this.items.push(item);
  }

  editItem(oldItem: Ingredient, newItem: Ingredient) {
    this.items[this.items.indexOf(oldItem)] = newItem;
  }

  deleteItem(item: Ingredient) {
    this.items.splice(this.items.indexOf(item),1);
  }

}
