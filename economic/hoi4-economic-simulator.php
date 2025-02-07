<?php
/**
 * Plugin Name: HOI4 Economic Simulator
 * Plugin URI: https://example.com/hoi4-economic-simulator
 * Description: HOI4スタイルの経済国家運営シミュレーションゲーム
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * Text Domain: hoi4-economic-simulator
 * Domain Path: /languages
 */

// 直接アクセスを防止
if (!defined('ABSPATH')) {
    exit;
}

// プラグインのバージョン
define('HOI4_ECONOMIC_SIMULATOR_VERSION', '1.0.0');

// プラグインのパス
define('HOI4_ECONOMIC_SIMULATOR_PATH', plugin_dir_path(__FILE__));
define('HOI4_ECONOMIC_SIMULATOR_URL', plugin_dir_url(__FILE__));

// オートローダーの設定
spl_autoload_register(function ($class) {
    $prefix = 'HOI4EconomicSimulator\\';
    $base_dir = HOI4_ECONOMIC_SIMULATOR_PATH . 'includes/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// プラグインの初期化
class HOI4_Economic_Simulator {
    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // アクションとフィルターの追加
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_save_game_state', array($this, 'save_game_state'));
        add_action('wp_ajax_nopriv_save_game_state', array($this, 'save_game_state'));

        // ショートコードの登録
        add_shortcode('hoi4_economic_simulator', array($this, 'render_game'));
    }

    public function init() {
        // 言語ファイルの読み込み
        load_plugin_textdomain(
            'hoi4-economic-simulator',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages/'
        );

        // カスタム投稿タイプの登録（必要な場合）
        $this->register_post_types();
    }

    public function enqueue_scripts() {
        // スタイルの読み込み
        wp_enqueue_style(
            'hoi4-economic-simulator',
            HOI4_ECONOMIC_SIMULATOR_URL . 'assets/css/main.css',
            array(),
            HOI4_ECONOMIC_SIMULATOR_VERSION
        );

        // スクリプトの読み込み
        wp_enqueue_script(
            'chart-js',
            'https://cdn.jsdelivr.net/npm/chart.js',
            array(),
            '3.7.0',
            true
        );

        wp_enqueue_script(
            'hoi4-economic-simulator',
            HOI4_ECONOMIC_SIMULATOR_URL . 'assets/js/bundle.js',
            array('jquery', 'chart-js'),
            HOI4_ECONOMIC_SIMULATOR_VERSION,
            true
        );

        // ローカライゼーションデータの追加
        wp_localize_script(
            'hoi4-economic-simulator',
            'hoi4EconomicSimulator',
            array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('hoi4_economic_simulator_nonce'),
                'strings' => $this->get_localized_strings()
            )
        );
    }

    public function add_admin_menu() {
        add_menu_page(
            __('HOI4 Economic Simulator', 'hoi4-economic-simulator'),
            __('HOI4 Simulator', 'hoi4-economic-simulator'),
            'manage_options',
            'hoi4-economic-simulator',
            array($this, 'render_admin_page'),
            'dashicons-chart-area',
            30
        );

        add_submenu_page(
            'hoi4-economic-simulator',
            __('Settings', 'hoi4-economic-simulator'),
            __('Settings', 'hoi4-economic-simulator'),
            'manage_options',
            'hoi4-economic-simulator-settings',
            array($this, 'render_settings_page')
        );
    }

    public function render_admin_page() {
        // 管理画面のメインページを表示
        include HOI4_ECONOMIC_SIMULATOR_PATH . 'admin/templates/main.php';
    }

    public function render_settings_page() {
        // 設定ページを表示
        include HOI4_ECONOMIC_SIMULATOR_PATH . 'admin/templates/settings.php';
    }

    public function render_game($atts) {
        // ショートコードの属性を処理
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => '800px',
            'theme' => 'dark'
        ), $atts, 'hoi4_economic_simulator');

        // ゲームコンテナのHTMLを生成
        ob_start();
        ?>
        <div id="hoi4-economic-simulator-container" 
             class="hoi4-economic-simulator-container"
             style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;"
             data-theme="<?php echo esc_attr($atts['theme']); ?>">
        </div>
        <?php
        return ob_get_clean();
    }

    public function save_game_state() {
        // nonce検証
        check_ajax_referer('hoi4_economic_simulator_nonce', 'nonce');

        // データの取得と検証
        $state = isset($_POST['state']) ? sanitize_text_field($_POST['state']) : '';
        if (empty($state)) {
            wp_send_json_error('Invalid state data');
        }

        // ユーザーIDの取得（ログインしている場合）
        $user_id = get_current_user_id();

        // データベースに保存
        update_user_meta($user_id, 'hoi4_economic_simulator_state', $state);

        wp_send_json_success(array(
            'message' => 'Game state saved successfully'
        ));
    }

    private function register_post_types() {
        // カスタム投稿タイプの登録（必要な場合）
    }

    private function get_localized_strings() {
        return array(
            'saveError' => __('Failed to save game state', 'hoi4-economic-simulator'),
            'loadError' => __('Failed to load game state', 'hoi4-economic-simulator'),
            'confirm' => __('Are you sure?', 'hoi4-economic-simulator')
        );
    }

    public function activate() {
        // アクティベーション時の処理
        flush_rewrite_rules();
    }

    public function deactivate() {
        // 非アクティベーション時の処理
        flush_rewrite_rules();
    }

    public function uninstall() {
        // アンインストール時の処理
        // ユーザーメタデータの削除など
    }
}

// プラグインのインスタンス化
function hoi4_economic_simulator() {
    return HOI4_Economic_Simulator::get_instance();
}

// プラグインの初期化
add_action('plugins_loaded', 'hoi4_economic_simulator');

// アクティベーション時のフック
register_activation_hook(__FILE__, array(HOI4_Economic_Simulator::get_instance(), 'activate'));

// 非アクティベーション時のフック
register_deactivation_hook(__FILE__, array(HOI4_Economic_Simulator::get_instance(), 'deactivate'));

// アンインストール時のフック
register_uninstall_hook(__FILE__, array(HOI4_Economic_Simulator::get_instance(), 'uninstall')); 