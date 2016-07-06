export const getSelectedDrinks = (drinks) => drinks.filter(d => d.selected);

export const getVisibleDrinks = (drinks) => drinks.filter(d => d.visible);
