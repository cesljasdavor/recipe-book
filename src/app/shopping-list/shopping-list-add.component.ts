import {Component, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {Ingredient} from "../shared/ingredient";
import {ShoppingListService} from "./shopping-list.service";

@Component({
  selector: 'rb-shopping-list-add',
  templateUrl: './shopping-list-add.component.html'
})
export class ShoppingListAddComponent implements OnChanges{
  //za raliku između editiranja i dodavanja
  @Input() item: Ingredient;
  @Output() cleared = new EventEmitter();
  isAdd = true;

  constructor(private sls: ShoppingListService) { }

  //on changes prati svaku promjenu, a nas zanima je li se promijenio item i kako točno!!!
  //to nam onda triggera promjenu isAdd što tranzitivno triggera paljenje gumba save,delete...
  //,a gašenje gumba add
  ngOnChanges(changes): void {
    if(changes.item.currentValue === null) {
      this.isAdd = true;
      this.item = {name: null, amount: null}
    } else {
      this.isAdd = false;
    }
  }

  onSubmit(ingredient: Ingredient) {
    const newIngredient = new Ingredient(ingredient.name, ingredient.amount);
    if(!this.isAdd) {
      this.sls.editItem(this.item, newIngredient);
      this.onClear();
    } else {
      this.item = newIngredient;
      this.sls.addItem(this.item);
    }
  }

  onDelete() {
    this.sls.deleteItem(this.item);
    this.onClear();
  }

  onClear() {
    this.isAdd = true;
    this.cleared.emit(null);
  }

}
