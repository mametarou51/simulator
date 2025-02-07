<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php
    // 設定が保存された場合のメッセージを表示
    if (isset($_GET['settings-updated'])) {
        add_settings_error(
            'hoi4_economic_simulator_messages',
            'hoi4_economic_simulator_message',
            __('設定を保存しました。', 'hoi4-economic-simulator'),
            'updated'
        );
    }
    settings_errors('hoi4_economic_simulator_messages');
    ?>

    <form method="post" action="options.php">
        <?php
        settings_fields('hoi4_economic_simulator_options');
        do_settings_sections('hoi4_economic_simulator_settings');
        ?>

        <div class="card">
            <h2><?php _e('一般設定', 'hoi4-economic-simulator'); ?></h2>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="default_theme"><?php _e('デフォルトテーマ', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <select name="hoi4_economic_simulator_options[default_theme]" id="default_theme">
                            <option value="dark" <?php selected(get_option('hoi4_economic_simulator_options')['default_theme'], 'dark'); ?>>
                                <?php _e('ダーク', 'hoi4-economic-simulator'); ?>
                            </option>
                            <option value="light" <?php selected(get_option('hoi4_economic_simulator_options')['default_theme'], 'light'); ?>>
                                <?php _e('ライト', 'hoi4-economic-simulator'); ?>
                            </option>
                        </select>
                        <p class="description"><?php _e('ゲームのデフォルトテーマを選択します。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="default_width"><?php _e('デフォルト幅', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="hoi4_economic_simulator_options[default_width]" id="default_width"
                               value="<?php echo esc_attr(get_option('hoi4_economic_simulator_options')['default_width']); ?>"
                               class="regular-text">
                        <p class="description"><?php _e('ゲームのデフォルト幅を指定します（例: 100% または 1200px）。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="default_height"><?php _e('デフォルト高さ', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="hoi4_economic_simulator_options[default_height]" id="default_height"
                               value="<?php echo esc_attr(get_option('hoi4_economic_simulator_options')['default_height']); ?>"
                               class="regular-text">
                        <p class="description"><?php _e('ゲームのデフォルト高さを指定します（例: 800px）。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="card">
            <h2><?php _e('ゲーム設定', 'hoi4-economic-simulator'); ?></h2>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="game_speed"><?php _e('初期ゲームスピード', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <select name="hoi4_economic_simulator_options[game_speed]" id="game_speed">
                            <option value="1" <?php selected(get_option('hoi4_economic_simulator_options')['game_speed'], '1'); ?>>1x</option>
                            <option value="2" <?php selected(get_option('hoi4_economic_simulator_options')['game_speed'], '2'); ?>>2x</option>
                            <option value="3" <?php selected(get_option('hoi4_economic_simulator_options')['game_speed'], '3'); ?>>3x</option>
                            <option value="4" <?php selected(get_option('hoi4_economic_simulator_options')['game_speed'], '4'); ?>>4x</option>
                            <option value="5" <?php selected(get_option('hoi4_economic_simulator_options')['game_speed'], '5'); ?>>5x</option>
                        </select>
                        <p class="description"><?php _e('ゲーム開始時のシミュレーション速度を設定します。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="autosave_interval"><?php _e('自動保存間隔', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <input type="number" name="hoi4_economic_simulator_options[autosave_interval]" id="autosave_interval"
                               value="<?php echo esc_attr(get_option('hoi4_economic_simulator_options')['autosave_interval']); ?>"
                               min="1" max="60" step="1" class="small-text">
                        <span class="description"><?php _e('分', 'hoi4-economic-simulator'); ?></span>
                        <p class="description"><?php _e('ゲームの状態を自動保存する間隔を指定します。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="card">
            <h2><?php _e('経済シミュレーション設定', 'hoi4-economic-simulator'); ?></h2>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="simulation_difficulty"><?php _e('シミュレーション難易度', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <select name="hoi4_economic_simulator_options[simulation_difficulty]" id="simulation_difficulty">
                            <option value="easy" <?php selected(get_option('hoi4_economic_simulator_options')['simulation_difficulty'], 'easy'); ?>>
                                <?php _e('簡単', 'hoi4-economic-simulator'); ?>
                            </option>
                            <option value="normal" <?php selected(get_option('hoi4_economic_simulator_options')['simulation_difficulty'], 'normal'); ?>>
                                <?php _e('普通', 'hoi4-economic-simulator'); ?>
                            </option>
                            <option value="hard" <?php selected(get_option('hoi4_economic_simulator_options')['simulation_difficulty'], 'hard'); ?>>
                                <?php _e('難しい', 'hoi4-economic-simulator'); ?>
                            </option>
                        </select>
                        <p class="description"><?php _e('経済シミュレーションの難易度を設定します。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="random_events_frequency"><?php _e('ランダムイベントの頻度', 'hoi4-economic-simulator'); ?></label>
                    </th>
                    <td>
                        <input type="range" name="hoi4_economic_simulator_options[random_events_frequency]" id="random_events_frequency"
                               value="<?php echo esc_attr(get_option('hoi4_economic_simulator_options')['random_events_frequency']); ?>"
                               min="0" max="100" step="10">
                        <span class="value-display">0</span>%
                        <p class="description"><?php _e('ランダム経済イベントが発生する頻度を設定します。', 'hoi4-economic-simulator'); ?></p>
                    </td>
                </tr>
            </table>
        </div>

        <?php submit_button(); ?>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // レンジスライダーの値表示を更新
    const rangeInput = document.getElementById('random_events_frequency');
    const valueDisplay = rangeInput.nextElementSibling;

    function updateRangeValue() {
        valueDisplay.textContent = rangeInput.value;
    }

    rangeInput.addEventListener('input', updateRangeValue);
    updateRangeValue();
});
</script>

<style>
.card {
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
    margin-top: 20px;
    padding: 20px;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
}

.card h2 {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.form-table th {
    width: 200px;
}

.value-display {
    display: inline-block;
    min-width: 30px;
    text-align: right;
    margin: 0 5px;
}

input[type="range"] {
    vertical-align: middle;
    width: 200px;
}

.description {
    margin-top: 5px;
    color: #666;
}
</style> 