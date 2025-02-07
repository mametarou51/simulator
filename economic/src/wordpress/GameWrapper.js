export class GameWrapper {
    constructor() {
        this.game = null;
        this.container = null;
        this.initialized = false;
    }

    /**
     * WordPressページ内でゲームを初期化する
     * @param {string} containerId ゲームを配置するコンテナのID
     * @param {Object} options 初期化オプション
     */
    initialize(containerId, options = {}) {
        // コンテナの取得
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('ゲームコンテナが見つかりません:', containerId);
            return;
        }

        // WordPressのスタイルとの競合を防ぐためのラッパー要素を作成
        const wrapper = document.createElement('div');
        wrapper.className = 'hoi4-economic-simulator-wrapper';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 800px;
            margin: 0;
            padding: 0;
            overflow: hidden;
        `;

        // ゲームのHTMLを注入
        wrapper.innerHTML = this.getGameHTML();
        this.container.appendChild(wrapper);

        // 必要なスタイルシートとスクリプトを動的に読み込み
        this.loadDependencies()
            .then(() => {
                // ゲームの初期化
                import('../index').then(module => {
                    this.game = module.default;
                    this.initialized = true;
                    
                    // WordPressのイベントとの連携
                    this.setupWordPressIntegration();
                });
            })
            .catch(error => {
                console.error('ゲームの初期化に失敗しました:', error);
            });
    }

    /**
     * ゲームのメインHTMLを生成
     * @returns {string} ゲームのHTML
     */
    getGameHTML() {
        return `
            <div id="game-container" class="wordpress-integrated">
                <!-- 既存のindex.htmlの内容をここに配置 -->
            </div>
        `;
    }

    /**
     * 必要な依存関係を読み込む
     * @returns {Promise} 読み込み完了を示すPromise
     */
    loadDependencies() {
        return new Promise((resolve, reject) => {
            // スタイルシートの読み込み
            const styles = [
                '/wp-content/plugins/hoi4-economic-simulator/assets/css/main.css'
            ];

            // スクリプトの読み込み
            const scripts = [
                'https://cdn.jsdelivr.net/npm/chart.js',
                '/wp-content/plugins/hoi4-economic-simulator/assets/js/bundle.js'
            ];

            Promise.all([
                ...styles.map(this.loadStylesheet),
                ...scripts.map(this.loadScript)
            ])
            .then(resolve)
            .catch(reject);
        });
    }

    /**
     * スタイルシートを動的に読み込む
     * @param {string} url スタイルシートのURL
     * @returns {Promise} 読み込み完了を示すPromise
     */
    loadStylesheet(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * スクリプトを動的に読み込む
     * @param {string} url スクリプトのURL
     * @returns {Promise} 読み込み完了を示すPromise
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    /**
     * WordPressとの統合機能をセットアップ
     */
    setupWordPressIntegration() {
        // WordPressの管理画面との連携
        if (window.wp && window.wp.hooks) {
            // ゲームの状態が変更されたときのフック
            window.wp.hooks.addAction('hoi4_economic_simulator_state_change', 'hoi4-simulator', (state) => {
                this.handleStateChange(state);
            });

            // WordPressの設定が変更されたときのフック
            window.wp.hooks.addAction('hoi4_economic_simulator_settings_change', 'hoi4-simulator', (settings) => {
                this.handleSettingsChange(settings);
            });
        }

        // WordPressのレスポンシブ対応
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * ゲームの状態変更を処理
     * @param {Object} state 新しいゲームの状態
     */
    handleStateChange(state) {
        if (!this.initialized) return;

        // WordPressのデータベースに状態を保存
        if (window.wp && window.wp.ajax) {
            window.wp.ajax.post('save_game_state', {
                state: JSON.stringify(state),
                nonce: window.hoi4EconomicSimulator.nonce
            });
        }
    }

    /**
     * WordPressの設定変更を処理
     * @param {Object} settings 新しい設定
     */
    handleSettingsChange(settings) {
        if (!this.initialized) return;

        // ゲームの設定を更新
        if (this.game) {
            this.game.updateSettings(settings);
        }
    }

    /**
     * ウィンドウリサイズを処理
     */
    handleResize() {
        if (!this.initialized) return;

        // WordPressのレイアウトに合わせてゲームサイズを調整
        const container = document.getElementById('game-container');
        if (container) {
            const parentWidth = container.parentElement.clientWidth;
            container.style.width = `${parentWidth}px`;
            
            // ゲームの内部コンポーネントもリサイズ
            if (this.game && this.game.chartHandler) {
                this.game.chartHandler.resize();
            }
        }
    }

    /**
     * ゲームの状態をエクスポート
     * @returns {Object} ゲームの状態
     */
    exportState() {
        if (!this.initialized || !this.game) return null;

        return {
            economicData: this.game.economicEngine.getIndicators(),
            activeEvents: this.game.eventManager.getActiveEvents(),
            selectedCountry: this.game.selectedCountry,
            timestamp: Date.now()
        };
    }

    /**
     * ゲームの状態をインポート
     * @param {Object} state インポートする状態
     */
    importState(state) {
        if (!this.initialized || !this.game) return;

        if (state.selectedCountry) {
            this.game.setSelectedCountry(state.selectedCountry);
        }
        if (state.economicData) {
            this.game.economicEngine.setIndicators(state.economicData);
        }
        // 他の状態も同様に復元
    }

    /**
     * ゲームを破棄
     */
    destroy() {
        if (!this.initialized) return;

        // ゲームの状態を保存
        const finalState = this.exportState();
        this.handleStateChange(finalState);

        // イベントリスナーを削除
        window.removeEventListener('resize', this.handleResize);

        // WordPressのフックを削除
        if (window.wp && window.wp.hooks) {
            window.wp.hooks.removeAction('hoi4_economic_simulator_state_change', 'hoi4-simulator');
            window.wp.hooks.removeAction('hoi4_economic_simulator_settings_change', 'hoi4-simulator');
        }

        // ゲームインスタンスを破棄
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }

        // DOMから要素を削除
        if (this.container) {
            this.container.innerHTML = '';
        }

        this.initialized = false;
    }
}