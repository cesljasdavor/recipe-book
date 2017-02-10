import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Recipe} from "../recipe";
import {RecipeService} from "../recipe.service";
import {ShoppingListService} from "../../shopping-list/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'rb-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  //stavi input da bi vartio svoje
  selectedRecipe: Recipe;
  private recipeIndex: number;

  private subs: Subscription;
  constructor( private sls: ShoppingListService, private route: ActivatedRoute
              ,private recipeService: RecipeService, private router: Router) {  }

  ngOnInit() {
    //moja izmjena koda
    //this.recipeService.recipeSelected.subscribe(data => this.selectedRecipe = data);
    this.subs = this.route.params.subscribe(
      (param: any)=> {
        this.recipeIndex = param['id'];
        this.selectedRecipe = this.recipeService.getRecipe(this.recipeIndex);
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onAddToShoppingList() {
    this.sls.addItems(this.selectedRecipe.ingredients);
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.selectedRecipe);
    this.router.navigate(['/recipes']);
  }

  onEdit() {
    //redirekcija na edit page
    this.router.navigate(['/recipes', this.recipeIndex, 'edit']);
  }

}
