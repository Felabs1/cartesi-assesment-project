# cartesi-assesment-project

## Installation

### Primary requirements for building cartesi

- cartesi CLI: a primary tool for developing and deploying your Dapps
- Docker Desktop
- Nodejs and npm

#### Docker Desktop

install the latest version [here](https://www.docker.com/products/docker-desktop/)

NB if your are using windows it is recommended you install wsl2

#### Node and npm

visit [here](https://nodejs.org/en/download/package-manager) to download the latest version of nodejs

#### Cartesi CLI

##### Mac os Users

` brew install cartesi/tap/cartesi`
or
`npm install -g @cartesi/cli`

##### Windows Users

1. install wsl2 and ubuntu from microsoft store
2. install Cartesi cli with npm

`npm install -g @cartesi/cli`

##### Linux Users

`npm install -g @cartesi/cli`

after everything is installed you can check your installation by running ` cartesi doctor` on your terminal

#### building our application

navigate to recipeApp and run `cartesi build`

#### running our application

inside the pwd of recipeApp type `cartesi run`

### Interacting with our app

##### syntax to run the create method using the command line

```
{"method":"createRecipe", "recipeName": "chipolatas", "ingredients": ["chips", "chickens"], "procedure": "just sit
 down and eat"}

 {"method":"createRecipe", "recipeName": "Ugali", "ingredients": ["water", "flour"], "procedure": "mix flour in boiling waater until it becomes solid"}


 {"method":"createRecipe", "recipeName": "Egg omelet", "ingredients": ["2 eggs", "salt", "sugar", "tomatoes", "garlic", "ginger", "oil"], "procedure": "chop every vegetable into small pieces and mix with eggs thoroughly, place oil in the pan and set up to medium heat, add the omelet mixture and fry in low heat... sounds terrible but i'm just here to learn cartesi haha"}


```

##### running the view method through the browser

##### updating the recipe

```
{"method":"updateRecipe", "recipeId": 1, "recipeName": "chipolatas", "ingredients": ["chips", "chickens"], "procedure": "just kidding really dont know how to make this one"}
```

##### Deleting a recipe

{"method": "deleteRecipe", "recipeId": 2}
