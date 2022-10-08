// Receive sudoku
const sudoku = process.argv.filter((a, i) => i > 1);

const solveSudoku = (sudoku) => {
  let arrayedSudoku = sudoku.map((row) =>
    row.split("").map((square) => (Number(square) ? Number(square) : null))
  );
  const groupedSudoku = () => {
    let total = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i < 3 && j < 3) {
          total[0].push(arrayedSudoku[i][j]);
        } else if (i < 3 && j >= 3 && j < 6) {
          total[1].push(arrayedSudoku[i][j]);
        } else if (i < 3 && j >= 6) {
          total[2].push(arrayedSudoku[i][j]);
        } else if (i >= 3 && i < 6 && j < 3) {
          total[3].push(arrayedSudoku[i][j]);
        } else if (i >= 3 && i < 6 && j >= 3 && j < 6) {
          total[4].push(arrayedSudoku[i][j]);
        } else if (i >= 3 && i < 6 && j >= 6) {
          total[5].push(arrayedSudoku[i][j]);
        } else if (i >= 6 && j < 3) {
          total[6].push(arrayedSudoku[i][j]);
        } else if (i >= 6 && j >= 3 && j < 6) {
          total[7].push(arrayedSudoku[i][j]);
        } else if (i >= 6 && j >= 6) {
          total[8].push(arrayedSudoku[i][j]);
        }
      }
    }
    return total;
  };
  const getGroupByLocation = (location) => {
    if (
      ["00", "01", "02", "10", "11", "12", "20", "21", "22"].includes(location)
    ) {
      return 0;
    } else if (
      ["03", "04", "05", "13", "14", "15", "23", "24", "25"].includes(location)
    ) {
      return 1;
    } else if (
      ["06", "07", "08", "16", "17", "18", "26", "27", "28"].includes(location)
    ) {
      return 2;
    } else if (
      ["30", "31", "32", "40", "41", "42", "50", "51", "52"].includes(location)
    ) {
      return 3;
    } else if (
      ["33", "34", "35", "43", "44", "45", "53", "54", "55"].includes(location)
    ) {
      return 4;
    } else if (
      ["36", "37", "38", "46", "47", "48", "56", "57", "58"].includes(location)
    ) {
      return 5;
    } else if (
      ["60", "61", "62", "70", "71", "72", "80", "81", "82"].includes(location)
    ) {
      return 6;
    } else if (
      ["63", "64", "65", "73", "74", "75", "83", "84", "85"].includes(location)
    ) {
      return 7;
    } else if (
      ["66", "67", "68", "76", "77", "78", "86", "87", "88"].includes(location)
    ) {
      return 8;
    }
  };

  const calcDirectPossibilities = (square) => {
    let possibleValues = [];
    outerLoop: for (let i = 1; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        // Check row
        if (arrayedSudoku[square[0]][j] === i) {
          continue outerLoop;
        }
        // Check column
        if (arrayedSudoku[j][square[1]] === i) {
          continue outerLoop;
        }
      }
      // Check 3x3
      if (
        groupedSudoku()[
          getGroupByLocation(`${square[0]}${square[1]}`)
        ].includes(i)
      ) {
        continue outerLoop;
      }
      possibleValues.push(i);
    }
    return possibleValues;
  };

  while (true) {
    // Generate array with location of empty squares and their direct possiblities
    const emptySquares = arrayedSudoku.reduce((t, row, i) => {
      const emptySquaresRow = row.reduce(
        (t, square, j) =>
          square === null ? [...t, [i, j, calcDirectPossibilities([i, j])]] : t,
        []
      );
      if (emptySquaresRow.length > 0) {
        return [...t, ...emptySquaresRow];
      }
      return t;
    }, []);

    // Break if sudoku is solved
    if (emptySquares.length === 0) {
      break;
    }

    // Returns null if no possibility
    const uniquePossibility = (emptySquare) => {
      if (emptySquare[2].length === 1) {
        return emptySquare[2][0];
      }
      // Iterate through possibilities
      for (let i = 0; i < emptySquare[2].length; i++) {
        // Check row
        if (
          emptySquares.filter(
            (es) =>
              es[0] === emptySquare[0] &&
              es[1] !== emptySquare[1] &&
              es[2].includes(emptySquare[2][i])
          ).length === 0
        ) {
          return emptySquare[2][i];
        }
        // Check column
        if (
          emptySquares.filter(
            (es) =>
              es[1] === emptySquare[1] &&
              es[0] !== emptySquare[0] &&
              es[2].includes(emptySquare[2][i])
          ).length === 0
        ) {
          return emptySquare[2][i];
        }
        // Check 3x3
        if (
          emptySquares.filter(
            (es) =>
              getGroupByLocation(`${es[0]}${es[1]}`) ===
                getGroupByLocation(`${emptySquare[0]}${emptySquare[1]}`) &&
              es[2].includes(emptySquare[2][i])
          ).length === 0
        ) {
          return emptySquare[2][i];
        }
      }
    };

    // Find unique possibility
    for (let i = 0; i < emptySquares.length; i++) {
      const solution = uniquePossibility(emptySquares[i]);
      if (solution) {
        // Substitute empty square with solved squared
        arrayedSudoku = arrayedSudoku.map((row, rowIndex) => {
          if (rowIndex === emptySquares[i][0]) {
            return row.map((square, columnIndex) => {
              if (columnIndex === emptySquares[i][1]) {
                return solution;
              }
              return square;
            });
          }
          return row;
        });

        break;
      }
    }
  }

  return arrayedSudoku.map((row) => row.join(""));
};

const solvedSudoku = solveSudoku(sudoku);

console.log(solvedSudoku);
