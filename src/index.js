import './styles/main.css';
import { Game } from './engine/Game';
import { UIController } from './controllers/UIController';
import { EconomicEngine } from './engine/EconomicEngine';
import { MapHandler } from './controllers/MapHandler';
import { ChartHandler } from './controllers/ChartHandler';
import { EventManager } from './controllers/EventManager';

// ゲームの初期化
document.addEventListener('DOMContentLoaded', () => {
    // 各モジュールのインスタンス化
    const economicEngine = new EconomicEngine();
    const uiController = new UIController();
    const mapHandler = new MapHandler();
    const chartHandler = new ChartHandler();
    const eventManager = new EventManager();

    // ゲームインスタンスの作成と初期化
    const game = new Game({
        economicEngine,
        uiController,
        mapHandler,
        chartHandler,
        eventManager
    });

    // 国選択画面の表示
    uiController.showCountrySelection();

    // グローバルオブジェクトとしてゲームインスタンスを保存（デバッグ用）
    window.game = game;
}); 