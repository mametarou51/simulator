export class EconomicEngine {
    constructor() {
        // 経済指標の初期化
        this.indicators = {
            gdp: 0,
            gdpGrowth: 0,
            inflation: 0,
            unemployment: 0,
            interestRate: 0,
            governmentDebt: 0,
            tradeBalance: 0
        };

        // 政策パラメータ
        this.policies = {
            monetaryPolicy: {
                interestRate: 2.0 // 基準金利（%）
            },
            fiscalPolicy: {
                governmentSpending: 20, // 対GDP比（%）
                taxRate: 30 // 平均税率（%）
            },
            tradePolicy: {
                openness: 0.5 // 貿易開放度（0-1）
            }
        };

        // 履歴データの初期化
        this.history = {
            gdp: [],
            inflation: [],
            unemployment: []
        };

        // シミュレーションパラメータ
        this.timeStep = 0;
        this.shocks = [];
    }

    initializeCountry(country) {
        // 国別の初期値設定
        const baseValues = {
            USA: {
                gdp: 21400,
                gdpGrowth: 2.0,
                inflation: 2.1,
                unemployment: 3.5
            },
            JPN: {
                gdp: 5080,
                gdpGrowth: 1.0,
                inflation: 0.5,
                unemployment: 2.8
            },
            // 他の国も同様に設定
        };

        const values = baseValues[country.code] || baseValues.USA;
        this.indicators = { ...this.indicators, ...values };
    }

    update(gameSpeed) {
        // 時間ステップの更新
        this.timeStep += gameSpeed;

        // DSGEモデルのエッセンスを使用した経済シミュレーション
        this.updateGDP();
        this.updateInflation();
        this.updateUnemployment();
        this.updateTradeBalance();

        // 履歴データの更新
        this.updateHistory();

        // ランダムショックの生成と適用
        this.generateShocks();
        this.applyShocks();
    }

    updateGDP() {
        // 簡略化したDSGEモデルによるGDP成長率の計算
        const baseGrowth = 2.0;
        const monetaryEffect = -0.5 * (this.policies.monetaryPolicy.interestRate - 2.0);
        const fiscalEffect = 0.3 * (this.policies.fiscalPolicy.governmentSpending - 20.0);
        const tradeEffect = 1.0 * (this.policies.tradePolicy.openness - 0.5);

        this.indicators.gdpGrowth = baseGrowth + monetaryEffect + fiscalEffect + tradeEffect;
        this.indicators.gdp *= (1 + this.indicators.gdpGrowth / 100);
    }

    updateInflation() {
        // フィリップス曲線を基にしたインフレ率の計算
        const naturalUnemployment = 4.5;
        const phillipsEffect = 0.5 * (naturalUnemployment - this.indicators.unemployment);
        const monetaryEffect = 0.3 * (this.policies.monetaryPolicy.interestRate - 2.0);

        this.indicators.inflation = 2.0 + phillipsEffect - monetaryEffect;
    }

    updateUnemployment() {
        // オーカンの法則を基にした失業率の計算
        const naturalGrowth = 2.0;
        const growthGap = this.indicators.gdpGrowth - naturalGrowth;
        const unemploymentChange = -0.5 * growthGap;

        this.indicators.unemployment = Math.max(2.0, 
            this.indicators.unemployment + unemploymentChange);
    }

    updateTradeBalance() {
        // 貿易収支の計算
        const openness = this.policies.tradePolicy.openness;
        const competitiveness = -0.1 * this.indicators.inflation;
        
        this.indicators.tradeBalance = 
            (openness * 10 - 5) + competitiveness;
    }

    updateHistory() {
        // 履歴データの更新
        this.history.gdp.push({
            time: this.timeStep,
            value: this.indicators.gdp
        });
        this.history.inflation.push({
            time: this.timeStep,
            value: this.indicators.inflation
        });
        this.history.unemployment.push({
            time: this.timeStep,
            value: this.indicators.unemployment
        });

        // 履歴データの制限（最新1000ポイントのみ保持）
        const maxHistoryPoints = 1000;
        if (this.history.gdp.length > maxHistoryPoints) {
            this.history.gdp.shift();
            this.history.inflation.shift();
            this.history.unemployment.shift();
        }
    }

    generateShocks() {
        // ランダムな経済ショックの生成
        if (Math.random() < 0.01) { // 1%の確率でショック発生
            this.shocks.push({
                type: Math.random() < 0.5 ? 'demand' : 'supply',
                magnitude: (Math.random() - 0.5) * 2,
                duration: Math.floor(Math.random() * 10) + 1
            });
        }
    }

    applyShocks() {
        // 経済ショックの適用
        this.shocks = this.shocks.filter(shock => {
            if (shock.duration > 0) {
                if (shock.type === 'demand') {
                    this.indicators.gdpGrowth += shock.magnitude;
                } else {
                    this.indicators.inflation += shock.magnitude;
                }
                shock.duration--;
                return true;
            }
            return false;
        });
    }

    applyPolicy(policyType, value) {
        switch (policyType) {
            case 'interestRate':
                this.policies.monetaryPolicy.interestRate = value;
                break;
            case 'governmentSpending':
                this.policies.fiscalPolicy.governmentSpending = value;
                break;
            case 'taxRate':
                this.policies.fiscalPolicy.taxRate = value;
                break;
            case 'tradeOpenness':
                this.policies.tradePolicy.openness = value;
                break;
        }
    }

    getIndicators() {
        return this.indicators;
    }

    getHistoricalData() {
        return this.history;
    }
} 