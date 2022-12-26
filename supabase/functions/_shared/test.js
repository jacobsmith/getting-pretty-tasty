import jsonic from 'jsonic';

const json = `{
  "meal_name": "Chicken Fettuccine Alfredo",
    "ingredients": [
      { name: "chicken breasts", amount: "5" },
      { name: "fettuccine", amount: "1 8oz package" },
      { name: "butter", amount: "2 tablespoons" },
      { name: "garlic cloves", amount: "3" },
      { name: "heavy cream", amount: "3 cups" },
      { name: "grated parmesan cheese", amount: "- Cup" },
      { name: "salt and pepper, to taste", amount: "" }

    ],
      "instructions": [
        "In a large sauté pan over medium heat, melt butter. Add the garlic and cook for about 2 minutes until fragrant.",
        "Add the chicken breasts to the pan and season with salt and pepper.",
        "Cook chicken for about 10 minutes until golden brown.",
        "Add cream to the pan and reduce heat to low.",
        "In a large pot of boiling salted water, cook pasta according to package instructions. Reserve 1 cup of the pasta water before draining.",
        "Add parmesan cheese into the sauté pan with the chicken mixture. Stir in drained pasta to coat in sauce.",
        "If the sauce is too thick, stir in some of the reserved pasta water until desired consistency is reached.",
        "Serve warm topped with additional parmesan cheese."]
}`

console.log(jsonic(json));