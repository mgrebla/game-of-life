window.onload = function () {
    const canvas = document.getElementById("gridCanvas");
    const startButton = document.getElementById("startButton");
    const exampleOneButton = document.getElementById("exampleOneButton");
    const ctx = canvas.getContext("2d");

    const resolution = 600; // Always rectangle
    const numSquares = 69;  // Number of rows/columns,
    const squareSize = resolution / numSquares;

    const state = {
        activeCells: new Set()
    }

    initGrid();

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const col = Math.floor(clickX / squareSize);
        const row = Math.floor(clickY / squareSize);

        const clickedCell = getCell(row, col);        
        console.log(`Clicked cell: Row ${clickedCell.x}, Column ${clickedCell.y}`);
        toggleCell(clickedCell);
    });

    startButton.addEventListener('click', function(event) {
        setInterval(heartBeat, 200);
    });

    exampleOneButton.addEventListener('click', function(event) {
        state.activeCells = exampleOne;
        state.activeCells.forEach((toActivateCell) => {
            const cell = recreateCellInstanceFromRepresentation(toActivateCell);
            fillCell(cell);
        });
    });

    function toggleCell(cell) {
        if (!cell.isActive) {
            fillCell(cell);
        } else {
            emptyCell(cell);
        }
    };

    function fillCell(cell) {
        ctx.fillRect(cell.y * squareSize, cell.x * squareSize, squareSize, squareSize);
        state.activeCells.add(cell.repr);
    };

    function emptyCell(cell) {
        ctx.clearRect(cell.y * squareSize, cell.x * squareSize, squareSize, squareSize);
        ctx.strokeRect(cell.y * squareSize, cell.x * squareSize, squareSize, squareSize);
        state.activeCells.delete(cell.repr);
    };

    function getCell(x, y) {
        const repr = JSON.stringify({x: x, y: y})
        const isActive = state.activeCells.has(repr);

        return {
            x: x,
            y: y,
            repr: repr,
            isActive: isActive
        }
    };

    function getCellNeighbors(cell) {
        const neighbors = new Array();

        for (let x = cell.x - 1; x <= cell.x + 1; x++) {
            for (let y = cell.y - 1; y <= cell.y + 1; y++) {
                if (x === cell.x && y === cell.y || x < 0 || y < 0 || x >= numSquares || y >= numSquares) {
                    continue;
                }
                const neighboringCell = getCell(x, y);
                neighbors.push(neighboringCell);
            }
        }

        return neighbors;
    }

    function initGrid() {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.1;
    
        for (let row = 0; row < numSquares; row++) {
            for (let col = 0; col < numSquares; col++) {
                ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
            }
        }
    };

    function heartBeat() {
        const toVisitCells = new Set();
        const nextGenerationActiveCells = new Set();
        
        state.activeCells.forEach((activeCell) => {
            const cell = recreateCellInstanceFromRepresentation(activeCell);

            toVisitCells.add(cell.repr);
            getCellNeighbors(cell).forEach((neighbor) => {
                toVisitCells.add(neighbor.repr);
            })
        })

        toVisitCells.forEach((toVisitCell) => {
            const cell = recreateCellInstanceFromRepresentation(toVisitCell);
            const neighbors = getCellNeighbors(cell);

            const numOfActiveNeighbors = neighbors.filter(n => n.isActive === true).length;

            if (cell.isActive) {
                if ([2, 3].includes(numOfActiveNeighbors)) {
                    nextGenerationActiveCells.add(cell.repr);
                }
            } else {
                if (numOfActiveNeighbors === 3) {
                    nextGenerationActiveCells.add(cell.repr);
                }
            }
        });

        nextGenerationActiveCells.difference(state.activeCells).forEach((toActivateCell) => {
            const cell = recreateCellInstanceFromRepresentation(toActivateCell);
            fillCell(cell);
        });
        state.activeCells.difference(nextGenerationActiveCells).forEach((toDeactivateCell) => {
            const cell = recreateCellInstanceFromRepresentation(toDeactivateCell);
            emptyCell(cell);
        });
    };

    function recreateCellInstanceFromRepresentation(cellRepresentation) {
        const parsed = JSON.parse(cellRepresentation);
        return getCell(parsed.x, parsed.y);
    };

    const exampleOne = new Set(
        [
            getCell(21, 20).repr,
            getCell(22, 20).repr,
            getCell(23, 20).repr,
            getCell(22, 19).repr,
            getCell(22, 21).repr,
            getCell(22, 23).repr,
            getCell(22, 24).repr,
            getCell(22, 27).repr,
            getCell(22, 28).repr,
            getCell(22, 29).repr,
            getCell(21, 28).repr,
            getCell(23, 28).repr,
            getCell(22, 25).repr,
            getCell(23, 24).repr,
            getCell(21, 24).repr,
        ]
    );
  };
  