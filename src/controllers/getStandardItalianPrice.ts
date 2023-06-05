export const getStandardItalianPrice = (number: number): string => {
    if (Number.isInteger(number)) {
        return number.toString(); // Restituisce il numero senza decimali
    } else {
        return number.toFixed(2).replace(".", ","); // Sostituisce il punto con la virgola
    }
};