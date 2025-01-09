// 結果を保存する配列
const results = [];

// AIの手をランダムに生成
function randomMove() {
    const moves = ["グー", "チョキ", "パー"];
    return moves[Math.floor(Math.random() * moves.length)];
}

function buildTransitionMatrix(moves, order) {
    const transitionMatrix = {};
    for (let i = 0; i < moves.length - order; i++) {
        const state = moves.slice(i, i + order).join(",");
        const nextMove = moves[i + order];
        if (!transitionMatrix[state]) {
            transitionMatrix[state] = { "グー": 0, "チョキ": 0, "パー": 0 };
        }
        transitionMatrix[state][nextMove]++;
    }
    return transitionMatrix;
}

function predictNextMove(moves, order) {
    const state = moves.slice(-order).join(",");
    const transitionMatrix = buildTransitionMatrix(moves, order);

    if (transitionMatrix[state]) {
        const nextMoves = transitionMatrix[state];
        let maxMove = null;
        let maxCount = -1;
        for (const move in nextMoves) {
            if (nextMoves[move] > maxCount) {
                maxMove = move;
                maxCount = nextMoves[move];
            }
        }
        return maxMove;
    } else {
        return randomMove(); // データがない場合はランダムに手を選択
    }
}

function predictMoveByFrequency(moves) {
    const moveCounts = { "グー": 0, "チョキ": 0, "パー": 0 };
    for (const move of moves) {
        moveCounts[move]++;
    }
    let maxMove = null;
    let maxCount = -1;
    for (const move in moveCounts) {
        if (moveCounts[move] > maxCount) {
            maxMove = move;
            maxCount = moveCounts[move];
        }
    }
    return maxMove || randomMove();
}

function decideComputerMove(moves, order = 5) {
    console.log("プレイヤーの過去の手:", moves);
    
    if (moves.length < order) {
        console.log("履歴が短すぎます。ランダムな手を出します。");
        return randomMove();
    }
    
    const predictedMoveByMarkov = predictNextMove(moves, order);
    const predictedMoveByFrequency = predictMoveByFrequency(moves);

    // マルコフ連鎖と頻度ベースの予測を併用
    const predictedMove = predictedMoveByMarkov || predictedMoveByFrequency;
    const counterMoves = { "グー": "パー", "チョキ": "グー", "パー": "チョキ" };
    const computerMove = counterMoves[predictedMove];

    console.log("予測された次の手:", predictedMove);
    console.log("コンピュータの手:", computerMove);
    
    return computerMove || randomMove();  // エラー時にランダムな手を返す
}

function judge(player, computer) {
    if (player === computer) {
        return "draw";
    } else if (
        (player === "グー" && computer === "チョキ") ||
        (player === "チョキ" && computer === "パー") ||
        (player === "パー" && computer === "グー")
    ) {
        return "win";
    } else {
        return "lose";
    }
}

// ゲームを実行
function playGame(playerHand) {
    const aiHand = getcomputer();
    const result = determineWinner(playerHand, aiHand);

    // 結果を画面に表示
    document.getElementById('result').textContent = `あなた: ${playerHand}, AI: ${aiHand}, 結果: ${result}`;

    // 結果を配列に保存
    results.push({ playerHand, aiHand, result });

    // 統計を更新
    updateStatistics();
}

// 統計の更新
function updateStatistics() {
    const totalGames = results.length;
    const wins = results.filter(result => result.result === '勝ち').length;
    const draws = results.filter(result => result.result === '引き分け').length;
    const losses = results.filter(result => result.result === '負け').length;

    // 統計をHTMLに反映
    document.getElementById('total-games').textContent = `総ゲーム数: ${totalGames}`;
    document.getElementById('win-count').textContent = `勝数: ${wins}`;
    document.getElementById('draw-count').textContent = `引き分け数: ${draws}`;
    document.getElementById('loss-count').textContent = `負け数: ${losses}`;
}

// 結果をExcelファイルで保存
function downloadResults() {
    if (results.length === 0) {
        alert('保存する結果がありません');
        return;
    }

    // 配列をワークシートに変換
    const worksheet = XLSX.utils.json_to_sheet(results);

    // ワークブックを作成
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'じゃんけん結果');

    // Excelファイルをダウンロード
    XLSX.writeFile(workbook, 'janken_results.xlsx');
}

// ゲームをリセット
function resetGame() {
    results.length = 0; // 配列を空にする
    document.getElementById('result').textContent = '';
    updateStatistics(); // 統計をリセット
}
