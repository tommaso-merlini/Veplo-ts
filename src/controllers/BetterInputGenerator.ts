import { distance, closest } from "fastest-levenshtein";
import {
  macroCategories,
  allFiltersRaw,
  allFilters,
  shoesSizes,
  clothesSizes,
} from "../../constants/filters.js";
import lodash from "lodash";
import { dictionary } from "../../dictionary.js";
import {
  articoliDeterminativi,
  articoliIndeterminativi,
  articoliPartitivi,
  nomiComuni,
  preposizioni,
  preposizioniArticolate,
} from "../../constants/italian.js";

export const BetterInputGenerator = (input: any) => {
  if (input?.query == null || input == null) return input; //if the query is null return the original input
  const filters: any = {
    keywords: [],
  };
  const query = input.query;

  const queryWords = query.split(/\s+/);

  //get closest filter for each word
  for (let word of queryWords) {
    //remove all italians trash words
    if (
      articoliDeterminativi.includes(word) ||
      articoliIndeterminativi.includes(word) ||
      articoliPartitivi.includes(word) ||
      preposizioni.includes(word) ||
      preposizioniArticolate.includes(word) ||
      nomiComuni.includes(word)
    ) {
      continue;
    }

    //remove sizes
    if (clothesSizes.includes(word) || shoesSizes.includes(word)) {
      continue;
    }

    //get the best word from the dictionary
    for (let terms of dictionary) {
      if (terms.includes(word)) {
        word = terms[0];
      }
    }

    const closestValue = closest(word, allFiltersRaw);

    //check closestValue diff
    const distanceValue = distance(word, closestValue);

    if (distanceValue > 3) {
      filters.keywords.push(word);
    } else {
      //get the closest filter
      const closestFilter = allFilters.filter((a) =>
        lodash.values(a).some((b) => b.includes(closestValue))
      );

      //push the filter into the filters array
      filters[Object.keys(closestFilter[0])[0]] = closestValue;
    }
  }

  //merge the hard-filters with the new filters
  const mergedFilters = lodash.merge(filters, input); //! si da piu importanza agli hard-filters, se si vuole cambiare: scambiare l'ordine degli argomenti

  console.log(mergedFilters);

  return mergedFilters;
};
