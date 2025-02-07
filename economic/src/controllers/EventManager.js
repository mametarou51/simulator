export class EventManager {
    constructor() {
        this.game = null;
        this.activeEvents = [];
        this.eventHistory = [];
        this.eventQueue = [];
    }

    initialize(game) {
        this.game = game;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // ウィンドウリサイズイベントの処理
        window.addEventListener('resize', () => {
            this.game.chartHandler.resize();
        });

        // キーボードショートカットの設定
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleKeyboardShortcuts(e) {
        switch (e.key) {
            case ' ': // スペースキー
                e.preventDefault();
                this.game.togglePause();
                break;
            case 'f': // フルスクリーン
                e.preventDefault();
                this.game.toggleFullscreen();
                break;
            // 他のショートカットも必要に応じて追加
        }
    }

    processEvents() {
        // 経済状態に基づいてイベントを生成
        this.generateEvents();

        // イベントキューの処理
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.triggerEvent(event);
        }

        // アクティブなイベントの更新
        this.updateActiveEvents();
    }

    generateEvents() {
        const indicators = this.game.economicEngine.getIndicators();

        // 高インフレイベント
        if (indicators.inflation > 10 && Math.random() < 0.1) {
            this.queueEvent({
                type: 'economic_crisis',
                title: 'ハイパーインフレの危機',
                description: 'インフレ率が危険な水準に達しています。早急な対策が必要です。',
                effects: {
                    gdpGrowth: -2.0,
                    socialStability: -20
                },
                duration: 5
            });
        }

        // 好景気イベント
        if (indicators.gdpGrowth > 4 && indicators.unemployment < 4) {
            this.queueEvent({
                type: 'economic_boom',
                title: '経済好況',
                description: '経済が活況を呈しています。この機会を活かした政策を検討しましょう。',
                effects: {
                    taxRevenue: 1.2,
                    consumerConfidence: 20
                },
                duration: 3
            });
        }

        // 不況イベント
        if (indicators.gdpGrowth < -2 && indicators.unemployment > 8) {
            this.queueEvent({
                type: 'recession',
                title: '景気後退',
                description: '経済が深刻な不況に陥っています。景気対策が必要です。',
                effects: {
                    gdpGrowth: -1.0,
                    unemployment: 2.0
                },
                duration: 4
            });
        }
    }

    queueEvent(event) {
        // 同様のイベントが既にキューにないか確認
        const isDuplicate = this.eventQueue.some(e => e.type === event.type);
        if (!isDuplicate) {
            this.eventQueue.push({
                ...event,
                id: this.generateEventId(),
                timestamp: Date.now()
            });
        }
    }

    triggerEvent(event) {
        // イベントの効果を適用
        this.applyEventEffects(event);

        // アクティブイベントリストに追加
        this.activeEvents.push(event);

        // イベント履歴に追加
        this.eventHistory.push({
            ...event,
            triggeredAt: Date.now()
        });

        // UIに通知
        this.notifyUI(event);
    }

    applyEventEffects(event) {
        const economicEngine = this.game.economicEngine;
        
        if (event.effects) {
            // 経済指標への影響を適用
            if (event.effects.gdpGrowth) {
                economicEngine.indicators.gdpGrowth += event.effects.gdpGrowth;
            }
            if (event.effects.inflation) {
                economicEngine.indicators.inflation += event.effects.inflation;
            }
            if (event.effects.unemployment) {
                economicEngine.indicators.unemployment += event.effects.unemployment;
            }
            // 他の効果も同様に適用
        }
    }

    updateActiveEvents() {
        // アクティブなイベントの持続時間を更新
        this.activeEvents = this.activeEvents.filter(event => {
            if (event.duration > 0) {
                event.duration--;
                return true;
            }
            // イベントが終了した場合、終了処理を実行
            this.handleEventEnd(event);
            return false;
        });
    }

    handleEventEnd(event) {
        // イベントの効果を元に戻す処理
        if (event.effects) {
            const economicEngine = this.game.economicEngine;
            
            if (event.effects.gdpGrowth) {
                economicEngine.indicators.gdpGrowth -= event.effects.gdpGrowth;
            }
            if (event.effects.inflation) {
                economicEngine.indicators.inflation -= event.effects.inflation;
            }
            if (event.effects.unemployment) {
                economicEngine.indicators.unemployment -= event.effects.unemployment;
            }
            // 他の効果も同様に処理
        }

        // UIに通知
        this.notifyUI({
            ...event,
            type: 'event_end',
            description: `${event.title}の影響が収まりました。`
        });
    }

    notifyUI(event) {
        // イベント通知用のモーダルまたはトースト表示
        const notification = document.createElement('div');
        notification.className = 'event-notification';
        notification.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            ${this.generateEffectsHTML(event.effects)}
        `;

        document.body.appendChild(notification);

        // 5秒後に通知を消去
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    generateEffectsHTML(effects) {
        if (!effects) return '';

        return Object.entries(effects).map(([key, value]) => {
            const sign = value >= 0 ? '+' : '';
            return `<div class="effect-item ${value >= 0 ? 'positive' : 'negative'}">
                ${this.formatEffectKey(key)}: ${sign}${value}
            </div>`;
        }).join('');
    }

    formatEffectKey(key) {
        // キーをユーザーフレンドリーな表示に変換
        const displayNames = {
            gdpGrowth: 'GDP成長率',
            inflation: 'インフレ率',
            unemployment: '失業率',
            taxRevenue: '税収',
            consumerConfidence: '消費者信頼感',
            socialStability: '社会安定性'
        };
        return displayNames[key] || key;
    }

    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getActiveEvents() {
        return this.activeEvents;
    }

    getEventHistory() {
        return this.eventHistory;
    }
} 