// 結果を保存する配列
const results = [];

// AIの手をランダムに生成
function getAIHand() {
    const hands = ['グー', 'チョキ', 'パー'];
    return hands[Math.floor(Math.random() * hands.length)];
}

// 勝敗を判定
function determineWinner(playerHand, aiHand) {
    if (playerHand === aiHand) return '引き分け';
    if (
        (playerHand === 'グー' && aiHand === 'チョキ') ||
        (playerHand === 'チョキ' && aiHand === 'パー') ||
        (playerHand === 'パー' && aiHand === 'グー')
    ) {
        return '勝ち';
    }
    return '負け';
}

// ゲームを実行
function playGame(playerHand) {
    const aiHand = getAIHand();
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
