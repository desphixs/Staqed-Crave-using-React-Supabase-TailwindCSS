// Export an interface named Recipe so it can be used in other files to define the structure of a recipe object
export interface Recipe {
  // A unique number to identify each recipe
  id: number;
  // A string representing the name or title of the recipe
  title: string;
  // A string representing the name of the chef who created the recipe
  chef: string;
  // A string representing the food category the recipe belongs to (e.g., Breakfast, Lunch)
  category: string;
  // A string representing the URL path to the recipe's main image
  imageUrl: string;
  // A number representing how many likes the recipe has received
  likes: number;
  // A string representing the total time taken to cook the recipe (e.g., "45 mins")
  cookTime: string;
  // A boolean value indicating if the user has saved this recipe for later (true or false)
  isSaved: boolean;
}

