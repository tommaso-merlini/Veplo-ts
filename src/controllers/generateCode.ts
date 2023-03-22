export const generateCode = () => {
  const numbers = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  // Genera due numeri casuali
  for (let i = 0; i < 2; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Genera quattro lettere casuali
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
};
