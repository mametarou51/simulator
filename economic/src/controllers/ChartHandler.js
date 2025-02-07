import Chart from 'chart.js/auto';

export class ChartHandler {
    constructor() {
        this.charts = {
            gdp: null,
            inflation: null,
            unemployment: null
        };
    }

    initialize() {
        this.initializeGDPChart();
        this.initializeInflationChart();
        this.initializeUnemploymentChart();
    }

    initializeGDPChart() {
        const ctx = document.createElement('canvas');
        document.getElementById('charts-container').appendChild(ctx);

        this.charts.gdp = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'GDP成長率 (%)',
                    data: [],
                    borderColor: '#1A75BB',
                    backgroundColor: 'rgba(26, 117, 187, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getChartOptions('GDP成長率の推移')
        });
    }

    initializeInflationChart() {
        const ctx = document.createElement('canvas');
        document.getElementById('charts-container').appendChild(ctx);

        this.charts.inflation = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'インフレ率 (%)',
                    data: [],
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getChartOptions('インフレ率の推移')
        });
    }

    initializeUnemploymentChart() {
        const ctx = document.createElement('canvas');
        document.getElementById('charts-container').appendChild(ctx);

        this.charts.unemployment = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '失業率 (%)',
                    data: [],
                    borderColor: '#DC3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getChartOptions('失業率の推移')
        });
    }

    getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#e0e0e0',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                }
            },
            animation: {
                duration: 300
            }
        };
    }

    updateCharts(historicalData) {
        const maxDataPoints = 50; // グラフに表示するデータポイントの最大数

        // GDP成長率チャートの更新
        if (this.charts.gdp) {
            const gdpData = historicalData.gdp.slice(-maxDataPoints);
            this.charts.gdp.data.labels = gdpData.map(d => d.time);
            this.charts.gdp.data.datasets[0].data = gdpData.map(d => d.value);
            this.charts.gdp.update('none'); // アニメーションなしで更新
        }

        // インフレ率チャートの更新
        if (this.charts.inflation) {
            const inflationData = historicalData.inflation.slice(-maxDataPoints);
            this.charts.inflation.data.labels = inflationData.map(d => d.time);
            this.charts.inflation.data.datasets[0].data = inflationData.map(d => d.value);
            this.charts.inflation.update('none');
        }

        // 失業率チャートの更新
        if (this.charts.unemployment) {
            const unemploymentData = historicalData.unemployment.slice(-maxDataPoints);
            this.charts.unemployment.data.labels = unemploymentData.map(d => d.time);
            this.charts.unemployment.data.datasets[0].data = unemploymentData.map(d => d.value);
            this.charts.unemployment.update('none');
        }
    }

    // ウィンドウサイズ変更時の処理
    resize() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    // チャートの破棄
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {
            gdp: null,
            inflation: null,
            unemployment: null
        };
    }
} 