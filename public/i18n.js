// i18n translations for frontend
const translations = {
  // Common
  'common.appName': {
    'en': 'Raffle',
    'zh-TW': '抽獎',
    'ja': '抽選'
  },
  'common.loading': {
    'en': 'Loading...',
    'zh-TW': '載入中...',
    'ja': '読み込み中...'
  },
  'common.error': {
    'en': 'Error',
    'zh-TW': '錯誤',
    'ja': 'エラー'
  },
  'common.cancel': {
    'en': 'Cancel',
    'zh-TW': '取消',
    'ja': 'キャンセル'
  },
  'common.confirm': {
    'en': 'Confirm',
    'zh-TW': '確認',
    'ja': '確認'
  },
  'common.back': {
    'en': 'Back',
    'zh-TW': '返回',
    'ja': '戻る'
  },

  // Session states
  'session.state.open': {
    'en': 'Open',
    'zh-TW': '開放中',
    'ja': '受付中'
  },
  'session.state.locked': {
    'en': 'Registration Closed',
    'zh-TW': '登記已截止',
    'ja': '受付終了'
  },
  'session.state.drawing': {
    'en': 'Drawing...',
    'zh-TW': '抽獎中...',
    'ja': '抽選中...'
  },
  'session.state.claiming': {
    'en': 'Claiming',
    'zh-TW': '兌獎中',
    'ja': '受取中'
  },
  'session.state.closed': {
    'en': 'Closed',
    'zh-TW': '已結束',
    'ja': '終了'
  },

  // Session creation
  'session.create.title': {
    'en': 'Create New Raffle',
    'zh-TW': '建立新抽獎',
    'ja': '新規抽選作成'
  },
  'session.create.eventName': {
    'en': 'Event Name',
    'zh-TW': '活動名稱',
    'ja': 'イベント名'
  },
  'session.create.eventNamePlaceholder': {
    'en': 'Spring Festival Raffle',
    'zh-TW': '春季祭典抽獎',
    'ja': '春祭り抽選'
  },
  'session.create.language': {
    'en': 'Language',
    'zh-TW': '語言',
    'ja': '言語'
  },
  'session.create.pin': {
    'en': 'Host PIN (6 digits)',
    'zh-TW': '主持人 PIN (6 位數字)',
    'ja': 'ホストPIN (6桁)'
  },
  'session.create.button': {
    'en': 'Create Raffle',
    'zh-TW': '建立抽獎',
    'ja': '抽選を作成'
  },

  // Handout page
  'handout.title': {
    'en': 'Hand Out Tickets',
    'zh-TW': '發放票券',
    'ja': 'チケット配布'
  },
  'handout.ticketCount': {
    'en': 'Number of Tickets',
    'zh-TW': '票數',
    'ja': 'チケット数'
  },
  'handout.label': {
    'en': 'Label (optional)',
    'zh-TW': '標籤 (選填)',
    'ja': 'ラベル (任意)'
  },
  'handout.labelPlaceholder': {
    'en': 'Family of 4',
    'zh-TW': '一家四口',
    'ja': '4人家族'
  },
  'handout.createBatch': {
    'en': 'Create Tickets',
    'zh-TW': '建立票券',
    'ja': 'チケット作成'
  },
  'handout.batchId': {
    'en': 'Batch ID',
    'zh-TW': '批次編號',
    'ja': 'バッチID'
  },
  'handout.tickets': {
    'en': 'Tickets',
    'zh-TW': '票數',
    'ja': 'チケット'
  },
  'handout.takePhoto': {
    'en': 'Take a photo of this QR code to keep your ticket.',
    'zh-TW': '請拍下此 QR Code 作為您的票券。',
    'ja': 'このQRコードを撮影してチケットとして保管してください。'
  },
  'handout.status.unclaimed': {
    'en': 'Waiting for claim...',
    'zh-TW': '等待領取中...',
    'ja': '受取待機中...'
  },
  'handout.status.claimed': {
    'en': 'Claimed!',
    'zh-TW': '已領取！',
    'ja': '受取済み！'
  },
  'handout.nextBatch': {
    'en': 'Next Batch',
    'zh-TW': '下一批',
    'ja': '次のバッチ'
  },
  'handout.totalIssued': {
    'en': 'Total Issued',
    'zh-TW': '已發放總數',
    'ja': '発行済み合計'
  },
  'handout.enterPin': {
    'en': 'Enter Session Code',
    'zh-TW': '請輸入活動代碼',
    'ja': 'セッションコードを入力'
  },

  // Draw page
  'draw.title': {
    'en': 'Raffle Draw',
    'zh-TW': '抽獎',
    'ja': '抽選'
  },
  'draw.ticketCount': {
    'en': 'Total Tickets',
    'zh-TW': '總票數',
    'ja': '総チケット数'
  },
  'draw.availableTickets': {
    'en': 'Available',
    'zh-TW': '可抽取',
    'ja': '残り'
  },
  'draw.lockRegistration': {
    'en': 'Lock Registration',
    'zh-TW': '截止登記',
    'ja': '受付終了'
  },
  'draw.startDraw': {
    'en': 'Draw Winner',
    'zh-TW': '開始抽獎',
    'ja': '抽選開始'
  },
  'draw.winner': {
    'en': 'WINNER',
    'zh-TW': '中獎者',
    'ja': '当選者'
  },
  'draw.batch': {
    'en': 'Batch',
    'zh-TW': '批次',
    'ja': 'バッチ'
  },
  'draw.ticket': {
    'en': 'Ticket',
    'zh-TW': '票券',
    'ja': 'チケット'
  },
  'draw.claimNow': {
    'en': 'Please come forward to claim your prize!',
    'zh-TW': '請上台領獎！',
    'ja': '景品をお受け取りください！'
  },
  'draw.timeRemaining': {
    'en': 'Time remaining',
    'zh-TW': '剩餘時間',
    'ja': '残り時間'
  },
  'draw.redraw': {
    'en': 'Redraw',
    'zh-TW': '重抽',
    'ja': '再抽選'
  },
  'draw.confirmClaim': {
    'en': 'Confirm Claim',
    'zh-TW': '確認兌獎',
    'ja': '受取確認'
  },
  'draw.nextPrize': {
    'en': 'Next Prize',
    'zh-TW': '下一個獎項',
    'ja': '次の景品'
  },
  'draw.closeSession': {
    'en': 'End Raffle',
    'zh-TW': '結束抽獎',
    'ja': '抽選終了'
  },
  'draw.reopen': {
    'en': 'Reopen Registration',
    'zh-TW': '重新開放登記',
    'ja': '受付を再開'
  },
  'draw.waitingToDraw': {
    'en': 'Ready to draw',
    'zh-TW': '準備抽獎',
    'ja': '抽選準備完了'
  },
  'draw.registrationOpen': {
    'en': 'Registration is open',
    'zh-TW': '登記開放中',
    'ja': '受付中'
  },
  'draw.noTickets': {
    'en': 'No tickets available',
    'zh-TW': '沒有可用票券',
    'ja': 'チケットがありません'
  },

  // Scan page
  'scan.title': {
    'en': 'Verify Ticket',
    'zh-TW': '驗證票券',
    'ja': 'チケット確認'
  },
  'scan.instruction': {
    'en': 'Scan the winning ticket QR code',
    'zh-TW': '掃描中獎票券的 QR Code',
    'ja': '当選チケットのQRコードを読み取り'
  },
  'scan.result.valid': {
    'en': 'Valid Winner!',
    'zh-TW': '中獎確認！',
    'ja': '当選確認！'
  },
  'scan.result.notWinner': {
    'en': 'Not a winning ticket',
    'zh-TW': '非中獎票券',
    'ja': '当選していません'
  },
  'scan.result.wrongEvent': {
    'en': 'Wrong event',
    'zh-TW': '活動不符',
    'ja': '別のイベントです'
  },
  'scan.result.alreadyClaimed': {
    'en': 'Already claimed',
    'zh-TW': '已兌獎',
    'ja': '受取済み'
  },
  'scan.result.expired': {
    'en': 'Claim window expired',
    'zh-TW': '兌獎時間已過',
    'ja': '受取期限切れ'
  },
  'scan.result.invalid': {
    'en': 'Invalid ticket',
    'zh-TW': '無效票券',
    'ja': '無効なチケット'
  },
  'scan.markClaimed': {
    'en': 'Mark as Claimed',
    'zh-TW': '標記為已兌獎',
    'ja': '受取済みにする'
  },
  'scan.scanAnother': {
    'en': 'Scan Another',
    'zh-TW': '掃描下一張',
    'ja': '次を読み取り'
  },

  // Thank you page
  'thanks.title': {
    'en': 'Thank You!',
    'zh-TW': '感謝參與！',
    'ja': 'ありがとうございました！'
  },
  'thanks.message': {
    'en': 'Thank you for participating in this raffle.',
    'zh-TW': '感謝您參與本次抽獎活動。',
    'ja': 'ご参加いただきありがとうございました。'
  },

  // Ticket page
  'ticket.winner': {
    'en': "You're a Winner!",
    'zh-TW': '恭喜中獎！',
    'ja': '当選しました！'
  },
  'ticket.winnerInstructions': {
    'en': 'Show this ticket to claim your prize',
    'zh-TW': '請出示此票券領取獎品',
    'ja': 'このチケットを提示して景品をお受け取りください'
  },
  'ticket.batch': {
    'en': 'Batch',
    'zh-TW': '批次',
    'ja': 'バッチ'
  },
  'ticket.tickets': {
    'en': 'Tickets',
    'zh-TW': '票數',
    'ja': 'チケット'
  },
  'ticket.status.valid': {
    'en': 'Valid',
    'zh-TW': '有效',
    'ja': '有効'
  },
  'ticket.status.winner': {
    'en': 'WINNER',
    'zh-TW': '中獎',
    'ja': '当選'
  },
  'ticket.status.claimed': {
    'en': 'Claimed',
    'zh-TW': '已兌獎',
    'ja': '受取済み'
  },
  'ticket.saveImage': {
    'en': 'Save to Photos',
    'zh-TW': '儲存到相簿',
    'ja': '写真に保存'
  },
  'ticket.share': {
    'en': 'Share',
    'zh-TW': '分享',
    'ja': '共有'
  },
  'ticket.howToUse': {
    'en': 'How to Use',
    'zh-TW': '使用方式',
    'ja': '使い方'
  },
  'ticket.instruction1': {
    'en': 'Save this ticket to your photos',
    'zh-TW': '將此票券儲存到相簿',
    'ja': 'このチケットを写真に保存'
  },
  'ticket.instruction2': {
    'en': 'Show the QR code when your number is called',
    'zh-TW': '中獎時出示 QR Code',
    'ja': '当選時にQRコードを提示'
  },
  'ticket.instruction3': {
    'en': 'The host will scan to verify your ticket',
    'zh-TW': '主持人將掃描驗證您的票券',
    'ja': 'ホストがチケットを確認します'
  },
  'ticket.longPressToSave': {
    'en': 'Long press the image above to save to your photos',
    'zh-TW': '長按上方圖片以儲存到相簿',
    'ja': '画像を長押しして写真に保存'
  },
  'ticket.addToHomeScreen': {
    'en': 'Add to Home Screen',
    'zh-TW': '加入主畫面',
    'ja': 'ホーム画面に追加'
  },
  'ticket.iosStep1': {
    'en': 'Tap the Share button at the bottom of Safari',
    'zh-TW': '點擊 Safari 底部的「分享」按鈕',
    'ja': 'Safari下部の共有ボタンをタップ'
  },
  'ticket.iosStep2': {
    'en': 'Scroll down and tap "Add to Home Screen"',
    'zh-TW': '向下滑動並點擊「加入主畫面」',
    'ja': '下にスクロールして「ホーム画面に追加」をタップ'
  },
  'ticket.iosStep3': {
    'en': 'Tap "Add" to confirm',
    'zh-TW': '點擊「加入」確認',
    'ja': '「追加」をタップして確認'
  },
  'ticket.androidStep1': {
    'en': 'Tap the menu (three dots) in your browser',
    'zh-TW': '點擊瀏覽器右上角的選單（三個點）',
    'ja': 'ブラウザのメニュー（3点）をタップ'
  },
  'ticket.androidStep2': {
    'en': 'Tap "Add to Home screen" or "Install app"',
    'zh-TW': '點擊「加入主畫面」或「安裝應用程式」',
    'ja': '「ホーム画面に追加」または「アプリをインストール」をタップ'
  },
  'ticket.androidStep3': {
    'en': 'Tap "Add" to confirm',
    'zh-TW': '點擊「加入」確認',
    'ja': '「追加」をタップして確認'
  },
  'ticket.installPrompt': {
    'en': 'Install this ticket to your home screen for easy access',
    'zh-TW': '將此票券安裝到主畫面以便快速存取',
    'ja': 'このチケットをホーム画面に追加して簡単にアクセス'
  },
  'ticket.install': {
    'en': 'Install',
    'zh-TW': '安裝',
    'ja': 'インストール'
  },
  'ticket.invalid': {
    'en': 'Invalid Ticket',
    'zh-TW': '無效票券',
    'ja': '無効なチケット'
  },

  // Dashboard page
  'dashboard.title': {
    'en': 'Event Dashboard',
    'zh-TW': '活動儀表板',
    'ja': 'イベントダッシュボード'
  },
  'dashboard.enterPin': {
    'en': 'Enter the session PIN to view dashboard',
    'zh-TW': '請輸入活動 PIN 碼以查看儀表板',
    'ja': 'ダッシュボードを表示するにはPINを入力'
  },
  'dashboard.autoRefresh': {
    'en': 'Auto-refreshing every 2 seconds',
    'zh-TW': '每 2 秒自動更新',
    'ja': '2秒ごとに自動更新'
  },
  'dashboard.stats.batches': {
    'en': 'Batches',
    'zh-TW': '批次',
    'ja': 'バッチ'
  },
  'dashboard.stats.tickets': {
    'en': 'Tickets',
    'zh-TW': '票券',
    'ja': 'チケット'
  },
  'dashboard.stats.winners': {
    'en': 'Winners',
    'zh-TW': '中獎',
    'ja': '当選'
  },
  'dashboard.stats.claimed': {
    'en': 'Claimed',
    'zh-TW': '已領獎',
    'ja': '受取済'
  },
  'dashboard.stats.registered': {
    'en': 'registered',
    'zh-TW': '已登記',
    'ja': '登録済'
  },
  'dashboard.stats.eligible': {
    'en': 'eligible',
    'zh-TW': '可抽',
    'ja': '対象'
  },
  'dashboard.batches.title': {
    'en': 'Ticket Batches',
    'zh-TW': '票券批次',
    'ja': 'チケットバッチ'
  },
  'dashboard.batches.id': {
    'en': 'ID',
    'zh-TW': '編號',
    'ja': 'ID'
  },
  'dashboard.batches.label': {
    'en': 'Label',
    'zh-TW': '標籤',
    'ja': 'ラベル'
  },
  'dashboard.batches.tickets': {
    'en': 'Tickets',
    'zh-TW': '票數',
    'ja': 'チケット'
  },
  'dashboard.batches.status': {
    'en': 'Status',
    'zh-TW': '狀態',
    'ja': '状態'
  },
  'dashboard.batches.status.claimed': {
    'en': 'Claimed',
    'zh-TW': '已登記',
    'ja': '登録済'
  },
  'dashboard.batches.status.unclaimed': {
    'en': 'Unclaimed',
    'zh-TW': '未登記',
    'ja': '未登録'
  },
  'dashboard.batches.time': {
    'en': 'Time',
    'zh-TW': '時間',
    'ja': '時間'
  },
  'dashboard.batches.empty': {
    'en': 'No batches created yet',
    'zh-TW': '尚未建立任何批次',
    'ja': 'バッチがまだありません'
  },
  'dashboard.winners.title': {
    'en': 'Winners',
    'zh-TW': '中獎名單',
    'ja': '当選者'
  },
  'dashboard.winners.ticket': {
    'en': 'Ticket',
    'zh-TW': '票券',
    'ja': 'チケット'
  },
  'dashboard.winners.batch': {
    'en': 'Batch',
    'zh-TW': '批次',
    'ja': 'バッチ'
  },
  'dashboard.winners.status': {
    'en': 'Status',
    'zh-TW': '狀態',
    'ja': '状態'
  },
  'dashboard.winners.status.claimed': {
    'en': 'Prize Claimed',
    'zh-TW': '已領獎',
    'ja': '受取済'
  },
  'dashboard.winners.status.pending': {
    'en': 'Pending',
    'zh-TW': '待領取',
    'ja': '未受取'
  },
  'dashboard.winners.empty': {
    'en': 'No winners drawn yet',
    'zh-TW': '尚未抽出任何中獎者',
    'ja': '当選者がまだいません'
  },
  'dashboard.links.handout': {
    'en': 'Hand Out Tickets',
    'zh-TW': '發放票券',
    'ja': 'チケット配布'
  },
  'dashboard.links.draw': {
    'en': 'Draw Screen',
    'zh-TW': '抽獎畫面',
    'ja': '抽選画面'
  },
  'dashboard.links.scan': {
    'en': 'Scan Tickets',
    'zh-TW': '掃描票券',
    'ja': 'チケット読取'
  },

  // Dashboard QR codes
  'dashboard.qr.title': {
    'en': 'Quick Access QR Codes',
    'zh-TW': '快速存取 QR Code',
    'ja': 'クイックアクセスQRコード'
  },
  'dashboard.qr.handout': {
    'en': 'Hand Out',
    'zh-TW': '發票',
    'ja': '配布'
  },
  'dashboard.qr.draw': {
    'en': 'Draw',
    'zh-TW': '抽獎',
    'ja': '抽選'
  },
  'dashboard.qr.scan': {
    'en': 'Scan',
    'zh-TW': '掃描',
    'ja': '読取'
  },
  'dashboard.qr.dashboard': {
    'en': 'Dashboard',
    'zh-TW': '儀表板',
    'ja': 'ダッシュボード'
  },
  'dashboard.qr.open': {
    'en': '🔗 Open Link',
    'zh-TW': '🔗 開啟連結',
    'ja': '🔗 リンクを開く'
  },
  'dashboard.qr.copy': {
    'en': '📋 Copy URL',
    'zh-TW': '📋 複製網址',
    'ja': '📋 URLをコピー'
  },
  'dashboard.qr.copied': {
    'en': 'Copied!',
    'zh-TW': '已複製！',
    'ja': 'コピーしました！'
  },

  // Session creation QR codes
  'session.qr.title': {
    'en': 'Scan to Open on Mobile',
    'zh-TW': '掃描以在手機上開啟',
    'ja': 'スキャンしてモバイルで開く'
  },
  'session.qr.handout': {
    'en': 'Hand Out',
    'zh-TW': '發票',
    'ja': '配布'
  },
  'session.qr.draw': {
    'en': 'Draw',
    'zh-TW': '抽獎',
    'ja': '抽選'
  },
  'session.qr.scan': {
    'en': 'Scan',
    'zh-TW': '掃描',
    'ja': '読取'
  },
  'session.qr.dashboard': {
    'en': 'Dashboard',
    'zh-TW': '儀表板',
    'ja': 'ダッシュボード'
  },
  'session.qr.open': {
    'en': '🔗 Open Link',
    'zh-TW': '🔗 開啟連結',
    'ja': '🔗 リンクを開く'
  },
  'session.qr.copy': {
    'en': '📋 Copy URL',
    'zh-TW': '📋 複製網址',
    'ja': '📋 URLをコピー'
  },
  'session.qr.copied': {
    'en': 'Copied!',
    'zh-TW': '已複製！',
    'ja': 'コピーしました！'
  },

  // State labels (short form for badges)
  'state.OPEN': {
    'en': 'Open',
    'zh-TW': '開放',
    'ja': '受付中'
  },
  'state.LOCKED': {
    'en': 'Locked',
    'zh-TW': '已鎖定',
    'ja': 'ロック'
  },
  'state.DRAWING': {
    'en': 'Drawing',
    'zh-TW': '抽獎中',
    'ja': '抽選中'
  },
  'state.CLAIMING': {
    'en': 'Claiming',
    'zh-TW': '兌獎中',
    'ja': '受取中'
  },
  'state.CLOSED': {
    'en': 'Closed',
    'zh-TW': '已結束',
    'ja': '終了'
  },

  // Common additions
  'common.continue': {
    'en': 'Continue',
    'zh-TW': '繼續',
    'ja': '続行'
  },
  'common.invalidPin': {
    'en': 'Invalid PIN',
    'zh-TW': 'PIN 碼錯誤',
    'ja': 'PINが正しくありません'
  },
  'common.tryAgain': {
    'en': 'Try Again',
    'zh-TW': '重試',
    'ja': '再試行'
  },

  // Errors
  'error.sessionNotFound': {
    'en': 'Session not found',
    'zh-TW': '找不到此活動',
    'ja': 'セッションが見つかりません'
  },
  'error.invalidPin': {
    'en': 'Invalid PIN',
    'zh-TW': 'PIN 碼錯誤',
    'ja': 'PINが正しくありません'
  },
  'error.sessionClosed': {
    'en': 'This raffle has ended',
    'zh-TW': '此抽獎已結束',
    'ja': 'この抽選は終了しました'
  },
  'error.registrationClosed': {
    'en': 'Registration is closed',
    'zh-TW': '登記已截止',
    'ja': '受付は終了しました'
  }
};

// Current language
let currentLang = 'en';

// Get translation
function t(key) {
  const entry = translations[key];
  if (!entry) {
    console.warn('Missing translation:', key);
    return key;
  }
  return entry[currentLang] || entry['en'] || key;
}

// Set language
function setLanguage(lang) {
  currentLang = lang;
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

// Get current language
function getLanguage() {
  return currentLang;
}
