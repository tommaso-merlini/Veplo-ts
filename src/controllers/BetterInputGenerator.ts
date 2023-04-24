import { distance, closest } from "fastest-levenshtein";
import {
  macroCategories,
  allFiltersRaw,
  allFilters,
} from "../../constants/filters.js";
import lodash from "lodash";
import { dictionary } from "../../dictionary.js";

export const BetterInputGenerator = (input: any) => {
  if (input.query == null) return input; //if the query is null return the original input
  const filters: any = {
    keywords: [],
  };
  const query = input.query;

  const queryWords = query.split(/\s+/);

  //get closest filter for each word
  for (let word of queryWords) {
    //get the best word from the dictionary
    for (let terms of dictionary) {
      if (terms.includes(word)) {
        word = terms[0];
      }
    }

    //remove artticles
    if (word === "il" || word === "la" || word === "lo") {
      continue;
    }

    //remove articolo partitivi
    if (
      word === "del" ||
      word === "dei" ||
      word === "dello" ||
      word === "degli" ||
      word === "della" ||
      word === "delle"
    ) {
      continue;
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

  return mergedFilters;
};
