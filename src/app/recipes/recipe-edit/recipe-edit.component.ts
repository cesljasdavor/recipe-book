import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RecipeService} from "../recipe.service";
import {Subscription} from "rxjs";
import {Recipe} from "../recipe";
import {FormArray, FormGroup, FormControl, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'rb-recipe-edit',
  templateUrl: './recipe-edit.component.html'
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  private subs: Subscription;
  private recipe: Recipe;
  private isNew = true;
  private recipeIndex: number;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService
             ,private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    //nezz zakaj ovo ostaje očuvano
    this.subs = this.route.params.subscribe( (param: any) => {
      if(param.hasOwnProperty('id')) {
        this.isNew = false;
        this.recipeIndex = +param['id'];
        this.recipe = this.recipeService.getRecipe(this.recipeIndex);
      } else {
        this.isNew = true;
        this.recipe = null;
      }
      this.initForm()
    });
  }

  initForm() {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeContent = '';
    let recipeIngredients: FormArray = new FormArray([]);

    //namještanje početnih vrijednosti prije stvaranja forme

    if(!this.isNew) {
      if(this.recipe.hasOwnProperty('ingredients')) {
        for(let i=0, l = this.recipe.ingredients.length; i<l ; i++) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(this.recipe.ingredients[i].name, Validators.required),
              amount: new FormControl(this.recipe.ingredients[i].amount, [
                Validators.required,
                Validators.pattern("\\d+")
              ])
            })
          )
        }
      }
      recipeName = this.recipe.name;
      recipeImageUrl = this.recipe.imagePath;
      recipeContent = this.recipe.description;
    }

    this.recipeForm = this.formBuilder.group({
      name: [recipeName, Validators.required],
      imagePath: [recipeImageUrl, Validators.required],
      description: [recipeContent, Validators.required],
      ingredients: recipeIngredients
    })

  }

  private navigateBack() {
    //uvijek se vratiš nazad
    //iz edit na detail
    //iz new na sve recepte
    this.router.navigate(['../']);
  }

  onSubmit() {
    //navodno oo njemu paše za recept
    const newRecipe = this.recipeForm.value;

    if(this.isNew) {
      this.recipeService.addRecipe(newRecipe);
    } else {
      this.recipeService.editRecipe(this.recipe, newRecipe);
    }
    this.navigateBack();
  }

  onCancel() {
    this.navigateBack();
  }


  //pazi ti ćeš na save submitati cijelu formu tako na ne moraš ovdje eksplicitno pristupati samom receptu
  //to će se napraviti za tebe kada se submita i unutra će se spremiti sve vrijednosti ingredienta koje postoje
  onAddItem(name: string, amount: string) {
    (<FormArray>this.recipeForm.controls['ingredients']).push(
      new FormGroup({
        name: new FormControl(name, Validators.required),
        amount: new FormControl(amount, [
          Validators.required,
          Validators.pattern("\\d+")
        ])
      })
    );
  }

  onRemoveItem(itemIndex: number) {
    (<FormArray>this.recipeForm.controls['ingredients']).removeAt(itemIndex);
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
