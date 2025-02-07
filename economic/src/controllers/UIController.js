import { formatNumber } from '../utils/formatters';

export class UIController {
    constructor() {
        this.game = null;
        this.countrySelectionModal = document.getElementById('country-selection');
        this.policyModal = document.getElementById('policy-modal');
        this.indicators = {
            gdp: document.getElementById('gdp-indicator'),
            inflation: document.getElementById('inflation-indicator'),
            unemployment: document.getElementById('unemployment-indicator')
        };
    }

    initialize(game) {
        this.game = game;
        this.initializeCountrySelection();
        this.initializePolicyControls();
        this.initializeFullscreenButton();
    }

    initializeCountrySelection() {
        const countryGrid = document.getElementById('country-grid');
        const countries = [
            { code: 'USA', name: 'アメリカ合衆国', flag: 'usa.svg' },
            { code: 'JPN', name: '日本', flag: 'japan.svg' },
            // 他の国も同様に追加
        ];

        countries.forEach(country => {
            const card = this.createCountryCard(country);
            countryGrid.appendChild(card);
        });
    }

    createCountryCard(country) {
        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <img src="/assets/images/flags/${country.flag}" alt="${country.name}の国旗">
            <h3>${country.name}</h3>
            <div class="country-stats">
                <p>GDP: ${formatNumber(country.gdp)} B$</p>
                <p>成長率: ${country.gdpGrowth}%</p>
            </div>
        `;

        card.addEventListener('click', () => {
            this.selectCountry(country);
        });

        return card;
    }

    selectCountry(country) {
        const cards = document.querySelectorAll('.country-card');
        cards.forEach(card => card.classList.remove('selected'));
        event.currentTarget.classList.add('selected');

        setTimeout(() => {
            this.hideCountrySelection();
            this.game.setSelectedCountry(country);
        }, 500);
    }

    showCountrySelection() {
        this.countrySelectionModal.style.display = 'block';
    }

    hideCountrySelection() {
        this.countrySelectionModal.style.display = 'none';
    }

    initializePolicyControls() {
        const policyInputs = {
            interestRate: document.getElementById('interest-rate'),
            // 他の政策スライダーも同様に初期化
        };

        Object.entries(policyInputs).forEach(([type, input]) => {
            if (input) {
                input.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    this.updatePolicyValueDisplay(type, value);
                });

                input.addEventListener('change', (e) => {
                    const value = parseFloat(e.target.value);
                    this.game.applyPolicy(type, value);
                });
            }
        });

        // 政策モーダルの制御
        document.getElementById('apply-policy').addEventListener('click', () => {
            this.hidePolicyModal();
        });

        document.getElementById('cancel-policy').addEventListener('click', () => {
            this.hidePolicyModal();
        });
    }

    updatePolicyValueDisplay(type, value) {
        const displayElement = document.querySelector(`#${type}-value`);
        if (displayElement) {
            displayElement.textContent = `${value}%`;
        }
    }

    showPolicyModal() {
        this.policyModal.style.display = 'block';
    }

    hidePolicyModal() {
        this.policyModal.style.display = 'none';
    }

    updateEconomicIndicators(indicators) {
        // GDP表示の更新
        if (this.indicators.gdp) {
            this.indicators.gdp.innerHTML = `
                <h4>GDP</h4>
                <div class="value">${formatNumber(indicators.gdp)} B$</div>
                <div class="growth ${indicators.gdpGrowth >= 0 ? 'positive' : 'negative'}">
                    ${indicators.gdpGrowth >= 0 ? '↑' : '↓'} ${Math.abs(indicators.gdpGrowth).toFixed(1)}%
                </div>
            `;
        }

        // インフレ率表示の更新
        if (this.indicators.inflation) {
            this.indicators.inflation.innerHTML = `
                <h4>インフレ率</h4>
                <div class="value">${indicators.inflation.toFixed(1)}%</div>
            `;
        }

        // 失業率表示の更新
        if (this.indicators.unemployment) {
            this.indicators.unemployment.innerHTML = `
                <h4>失業率</h4>
                <div class="value">${indicators.unemployment.toFixed(1)}%</div>
            `;
        }
    }

    updatePauseButton(isPaused) {
        const button = document.getElementById('pause-button');
        const icon = button.querySelector('.pause-icon');
        
        if (isPaused) {
            icon.classList.remove('paused');
            button.title = 'ゲームを開始';
        } else {
            icon.classList.add('paused');
            button.title = 'ゲームを一時停止';
        }
    }

    initializeFullscreenButton() {
        const button = document.getElementById('fullscreen-button');
        button.addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    toggleFullscreen() {
        const gameContainer = document.getElementById('game-container');
        
        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen().catch(err => {
                console.error(`フルスクリーンモードのエラー: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    updateCountryDisplay(country) {
        document.querySelector('.header-left h1').textContent = 
            `HOI4 Economic Simulator - ${country.name}`;
    }

    updateSpeedDisplay(speed) {
        // ゲーム速度表示の更新（実装予定）
    }

    updatePolicyEffects() {
        // 政策効果の表示更新（実装予定）
    }
} 