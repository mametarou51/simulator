export class Game {
    constructor({
        economicEngine,
        uiController,
        mapHandler,
        chartHandler,
        eventManager
    }) {
        this.economicEngine = economicEngine;
        this.uiController = uiController;
        this.mapHandler = mapHandler;
        this.chartHandler = chartHandler;
        this.eventManager = eventManager;

        this.isPaused = true;
        this.gameSpeed = 1; // 1-5の範囲で設定可能
        this.selectedCountry = null;

        this.initializeGame();
    }

    initializeGame() {
        // 各モジュールの初期化
        this.uiController.initialize(this);
        this.mapHandler.initialize();
        this.chartHandler.initialize();
        this.eventManager.initialize(this);

        // ポーズボタンのイベントリスナー設定
        document.getElementById('pause-button').addEventListener('click', () => {
            this.togglePause();
        });

        // フルスクリーンボタンのイベントリスナー設定
        document.getElementById('fullscreen-button').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    start() {
        if (this.selectedCountry) {
            this.isPaused = false;
            this.gameLoop();
        }
    }

    pause() {
        this.isPaused = true;
    }

    togglePause() {
        if (this.isPaused) {
            this.start();
        } else {
            this.pause();
        }
        this.uiController.updatePauseButton(this.isPaused);
    }

    toggleFullscreen() {
        this.uiController.toggleFullscreen();
    }

    setSelectedCountry(country) {
        this.selectedCountry = country;
        this.economicEngine.initializeCountry(country);
        this.uiController.updateCountryDisplay(country);
        this.start();
    }

    gameLoop() {
        if (this.isPaused) return;

        // 経済シミュレーションの更新
        this.economicEngine.update(this.gameSpeed);

        // UI更新
        this.uiController.updateEconomicIndicators(this.economicEngine.getIndicators());
        this.chartHandler.updateCharts(this.economicEngine.getHistoricalData());

        // イベントの処理
        this.eventManager.processEvents();

        // 次のフレームをスケジュール
        requestAnimationFrame(() => this.gameLoop());
    }

    applyPolicy(policyType, value) {
        this.economicEngine.applyPolicy(policyType, value);
        this.uiController.updatePolicyEffects();
    }

    setGameSpeed(speed) {
        this.gameSpeed = Math.max(1, Math.min(5, speed));
        this.uiController.updateSpeedDisplay(this.gameSpeed);
    }
} 